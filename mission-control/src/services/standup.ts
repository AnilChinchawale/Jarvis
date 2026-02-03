import { db } from '../db/index.js';
import { Agent, Task, Activity } from '../types.js';

export class StandupService {
  generate(): string {
    const today = new Date().toISOString().split('T')[0];
    const startOfDay = `${today}T00:00:00`;
    const endOfDay = `${today}T23:59:59`;

    let report = `# Daily Standup - ${today}\n\n`;

    // Get all agents
    const agents = db.prepare('SELECT * FROM agents ORDER BY name').all() as Agent[];

    for (const agent of agents) {
      report += `## ${agent.name} (${agent.role})\n\n`;

      // Yesterday's completed tasks
      const yesterdayCompleted = db.prepare(`
        SELECT * FROM tasks 
        WHERE assignee_id = ? 
        AND status = 'done' 
        AND DATE(completed_at) = DATE('now', '-1 day')
      `).all(agent.id) as Task[];

      // Today's tasks
      const todayTasks = db.prepare(`
        SELECT * FROM tasks 
        WHERE assignee_id = ? 
        AND status IN ('assigned', 'in_progress', 'blocked')
        ORDER BY 
          CASE priority 
            WHEN 'urgent' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'normal' THEN 3 
            ELSE 4 
          END
      `).all(agent.id) as Task[];

      // Recent activity
      const recentActivity = db.prepare(`
        SELECT * FROM activities 
        WHERE agent_id = ? 
        AND DATE(created_at) = DATE('now')
        ORDER BY created_at DESC
        LIMIT 5
      `).all(agent.id) as Activity[];

      // Done
      if (yesterdayCompleted.length > 0) {
        report += `✅ **Done:**\n`;
        for (const task of yesterdayCompleted) {
          report += `- ${task.title}\n`;
        }
        report += '\n';
      } else {
        report += `✅ **Done:** (nothing completed yesterday)\n\n`;
      }

      // In Progress
      if (todayTasks.length > 0) {
        report += `🔄 **In Progress:**\n`;
        for (const task of todayTasks) {
          const emoji = task.status === 'blocked' ? '🔴' : 
                       task.priority === 'urgent' ? '🔴' :
                       task.priority === 'high' ? '🟡' : '🟢';
          report += `${emoji} [${task.id}] ${task.title} (${task.status})\n`;
        }
        report += '\n';
      } else {
        report += `🔄 **In Progress:** (no active tasks)\n\n`;
      }

      // Blockers
      const blockedTasks = todayTasks.filter(t => t.status === 'blocked');
      if (blockedTasks.length > 0) {
        report += `⚠️ **Blockers:**\n`;
        for (const task of blockedTasks) {
          report += `- [${task.id}] ${task.title}\n`;
        }
        report += '\n';
      }

      report += `---\n\n`;
    }

    // Summary
    const totalActive = db.prepare(`
      SELECT COUNT(*) as count FROM tasks WHERE status IN ('assigned', 'in_progress')
    `).get() as { count: number };

    const totalBlocked = db.prepare(`
      SELECT COUNT(*) as count FROM tasks WHERE status = 'blocked'
    `).get() as { count: number };

    const totalDone = db.prepare(`
      SELECT COUNT(*) as count FROM tasks WHERE status = 'done' AND DATE(completed_at) = DATE('now')
    `).get() as { count: number };

    report += `## 📊 Summary\n\n`;
    report += `- Active: ${totalActive.count}\n`;
    report += `- Blocked: ${totalBlocked.count}\n`;
    report += `- Completed today: ${totalDone.count}\n`;

    return report;
  }

  save(report: string): string {
    const fs = require('fs');
    const path = require('path');
    
    const today = new Date().toISOString().split('T')[0];
    const standupDir = path.join(process.cwd(), '..', '..', 'memory', 'standups');
    
    fs.mkdirSync(standupDir, { recursive: true });
    
    const filePath = path.join(standupDir, `${today}-standup.md`);
    fs.writeFileSync(filePath, report);
    
    return filePath;
  }
}
