import { db } from '../db/index.js';
import { Notification, NotificationType } from '../types.js';
import { generateId } from '../utils/id.js';

interface CreateNotificationInput {
  agent_id: string;
  message_id?: string;
  task_id?: string;
  content: string;
  type: NotificationType;
}

export class NotificationService {
  create(input: CreateNotificationInput): Notification {
    const id = generateId('NOTIF');
    
    const notification = db.prepare(`
      INSERT INTO notifications (id, agent_id, message_id, task_id, content, type)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `).get(
      id,
      input.agent_id,
      input.message_id || null,
      input.task_id || null,
      input.content,
      input.type
    ) as Notification;

    return notification;
  }

  list(options: {
    agent?: string;
    unread?: boolean;
    limit?: number;
  } = {}): Notification[] {
    let query = 'SELECT * FROM notifications WHERE 1=1';
    const params: (string | number | boolean)[] = [];

    if (options.agent) {
      const agentId = this.getAgentIdByName(options.agent);
      query += ' AND agent_id = ?';
      params.push(agentId);
    }

    if (options.unread) {
      query += ' AND read = FALSE';
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    return db.prepare(query).all(...params) as Notification[];
  }

  markAsRead(id: string): boolean {
    const result = db.prepare(`
      UPDATE notifications SET read = TRUE WHERE id = ?
    `).run(id);
    return result.changes > 0;
  }

  markAllAsRead(agentName: string): number {
    const agentId = this.getAgentIdByName(agentName);
    const result = db.prepare(`
      UPDATE notifications SET read = TRUE WHERE agent_id = ? AND read = FALSE
    `).run(agentId);
    return result.changes;
  }

  clear(agentName: string): number {
    const agentId = this.getAgentIdByName(agentName);
    const result = db.prepare(`
      DELETE FROM notifications WHERE agent_id = ?
    `).run(agentId);
    return result.changes;
  }

  getUnreadCount(agentName: string): number {
    const agentId = this.getAgentIdByName(agentName);
    const result = db.prepare(`
      SELECT COUNT(*) as count FROM notifications WHERE agent_id = ? AND read = FALSE
    `).get(agentId) as { count: number };
    return result.count;
  }

  private getAgentIdByName(name: string): string {
    const agent = db.prepare('SELECT id FROM agents WHERE LOWER(name) = LOWER(?)').get(name) as { id: string } | undefined;
    if (!agent) {
      throw new Error(`Agent "${name}" not found`);
    }
    return agent.id;
  }
}
