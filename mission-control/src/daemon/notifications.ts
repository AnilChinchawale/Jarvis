#!/usr/bin/env node

/**
 * Notification Daemon
 * 
 * Watches for @mentions in messages and routes notifications to agents.
 * Also monitors file changes for inter-agent communication.
 */

import { watch } from 'chokidar';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { NotificationService } from '../services/notifications.js';
import { db } from '../db/index.js';

const MESSAGE_DIR = join(process.cwd(), '..', '..', 'messages');
const notificationService = new NotificationService();

// Ensure message directory exists
mkdirSync(MESSAGE_DIR, { recursive: true });

console.log('🔔 Notification Daemon Started');
console.log(`Watching: ${MESSAGE_DIR}`);

// Watch for new message files
const watcher = watch(`${MESSAGE_DIR}/*.json`, {
  persistent: true,
  ignoreInitial: false,
});

watcher.on('add', async (filepath) => {
  try {
    const content = readFileSync(filepath, 'utf-8');
    const message = JSON.parse(content);
    
    console.log(`📨 New message from ${message.from}: ${message.content.substring(0, 50)}...`);
    
    // Parse @mentions
    const mentionRegex = /@(\w+)/g;
    const mentions = message.content.match(mentionRegex);
    
    if (mentions) {
      for (const mention of mentions) {
        const agentName = mention.substring(1).toLowerCase();
        
        try {
          // Get agent ID
          const agent = db.prepare('SELECT id FROM agents WHERE LOWER(name) = LOWER(?)').get(agentName) as { id: string } | undefined;
          
          if (agent) {
            // Create notification
            notificationService.create({
              agent_id: agent.id,
              content: `${message.from} mentioned you: "${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}"`,
              type: 'mention',
            });
            
            console.log(`✅ Notification sent to ${agentName}`);
            
            // Also write to agent's inbox file for session pickup
            const inboxPath = join(MESSAGE_DIR, '..', 'agents', agentName, 'inbox.jsonl');
            mkdirSync(join(MESSAGE_DIR, '..', 'agents', agentName), { recursive: true });
            
            const inboxEntry = JSON.stringify({
              timestamp: new Date().toISOString(),
              from: message.from,
              content: message.content,
              type: 'mention',
            }) + '\n';
            
            const fs = await import('fs');
            fs.appendFileSync(inboxPath, inboxEntry);
          }
        } catch (error) {
          console.error(`❌ Failed to notify ${agentName}:`, error);
        }
      }
    }
    
    // Delete processed message
    const fs = await import('fs');
    fs.unlinkSync(filepath);
    
  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
});

// Periodic check for due tasks
setInterval(() => {
  const dueSoon = db.prepare(`
    SELECT t.id, t.title, t.assignee_id, a.name as assignee_name
    FROM tasks t
    JOIN agents a ON t.assignee_id = a.id
    WHERE t.status NOT IN ('done', 'cancelled')
    AND t.due_date IS NOT NULL
    AND datetime(t.due_date) <= datetime('now', '+2 hours')
    AND datetime(t.due_date) >= datetime('now')
  `).all() as Array<{ id: string; title: string; assignee_id: string; assignee_name: string }>;
  
  for (const task of dueSoon) {
    // Check if notification already sent
    const existing = db.prepare(`
      SELECT id FROM notifications 
      WHERE task_id = ? AND agent_id = ? AND type = 'task_due'
      AND datetime(created_at) > datetime('now', '-4 hours')
    `).get(task.id, task.assignee_id);
    
    if (!existing) {
      notificationService.create({
        agent_id: task.assignee_id,
        task_id: task.id,
        content: `Task due soon: ${task.title}`,
        type: 'task_due',
      });
      
      console.log(`⏰ Due soon notification: ${task.title} (${task.assignee_name})`);
    }
  }
}, 60000); // Check every minute

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down notification daemon...');
  watcher.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down notification daemon...');
  watcher.close();
  process.exit(0);
});
