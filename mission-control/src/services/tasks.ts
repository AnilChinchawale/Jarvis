import { db } from '../db/index.js';
import { 
  Task, CreateTaskInput, UpdateTaskInput, Activity,
  CreateTaskSchema, UpdateTaskSchema, TaskStatus 
} from '../types.js';
import { generateId } from '../utils/id.js';
import { NotificationService } from './notifications.js';

export class TaskService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  create(input: CreateTaskInput): Task {
    const validated = CreateTaskSchema.parse(input);
    const id = generateId('TASK');
    
    const assigneeId = validated.assignee ? 
      this.getAgentIdByName(validated.assignee) : null;

    const task = db.prepare(`
      INSERT INTO tasks (id, title, description, assignee_id, status, priority, due_date, parent_id, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).get(
      id,
      validated.title,
      validated.description || null,
      assigneeId,
      assigneeId ? 'assigned' : 'inbox',
      validated.priority,
      validated.due_date || null,
      validated.parent_id || null,
      validated.tags ? JSON.stringify(validated.tags) : null
    ) as Task;

    // Log activity
    this.logActivity(id, null, 'task_created', `Task "${validated.title}" created`);

    // Notify assignee if assigned
    if (assigneeId) {
      this.notificationService.create({
        agent_id: assigneeId,
        task_id: id,
        content: `New task assigned: ${validated.title}`,
        type: 'task_assigned',
      });
    }

    return task;
  }

  getById(id: string): Task | null {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
    if (!task) return null;
    
    return this.parseTask(task);
  }

  list(options: {
    status?: string;
    assignee?: string;
    priority?: string;
    limit?: number;
    offset?: number;
  } = {}): Task[] {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params: (string | number)[] = [];

    if (options.status) {
      query += ' AND status = ?';
      params.push(options.status);
    }

    if (options.assignee) {
      const agentId = this.getAgentIdByName(options.assignee);
      query += ' AND assignee_id = ?';
      params.push(agentId);
    }

    if (options.priority) {
      query += ' AND priority = ?';
      params.push(options.priority);
    }

    query += " ORDER BY CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END, created_at DESC";

    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    if (options.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }

    const tasks = db.prepare(query).all(...params) as Task[];
    return tasks.map(t => this.parseTask(t));
  }

  update(id: string, input: UpdateTaskInput): Task {
    const validated = UpdateTaskSchema.parse(input);
    const existing = this.getById(id);
    if (!existing) {
      throw new Error(`Task ${id} not found`);
    }

    const updates: string[] = [];
    const params: (string | null)[] = [];

    if (validated.title !== undefined) {
      updates.push('title = ?');
      params.push(validated.title);
    }

    if (validated.description !== undefined) {
      updates.push('description = ?');
      params.push(validated.description);
    }

    if (validated.assignee !== undefined) {
      updates.push('assignee_id = ?');
      const assigneeId = validated.assignee ? 
        this.getAgentIdByName(validated.assignee) : null;
      params.push(assigneeId);
      
      // If assigning, update status
      if (assigneeId && existing.status === 'inbox') {
        updates.push('status = ?');
        params.push('assigned');
      }

      // Notify new assignee
      if (assigneeId) {
        this.notificationService.create({
          agent_id: assigneeId,
          task_id: id,
          content: `Task assigned to you: ${validated.title || existing.title}`,
          type: 'task_assigned',
        });
      }
    }

    if (validated.status !== undefined) {
      updates.push('status = ?');
      params.push(validated.status);

      // Set completed_at if done
      if (validated.status === 'done') {
        updates.push('completed_at = CURRENT_TIMESTAMP');
      }
    }

    if (validated.priority !== undefined) {
      updates.push('priority = ?');
      params.push(validated.priority);
    }

    if (validated.due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(validated.due_date);
    }

    if (validated.tags !== undefined) {
      updates.push('tags = ?');
      params.push(validated.tags ? JSON.stringify(validated.tags) : null);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? RETURNING *`;
    const task = db.prepare(query).get(...params) as Task;

    // Log activity
    this.logActivity(id, null, 'task_updated', `Task updated: ${updates.join(', ')}`);

    return this.parseTask(task);
  }

  delete(id: string): boolean {
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return result.changes > 0;
  }

  addComment(taskId: string, fromAgent: string, content: string): void {
    const agentId = this.getAgentIdByName(fromAgent);
    const messageId = generateId('MSG');

    db.prepare(`
      INSERT INTO messages (id, task_id, from_agent_id, content, type)
      VALUES (?, ?, ?, ?, ?)
    `).run(messageId, taskId, agentId, content, 'comment');

    this.logActivity(taskId, agentId, 'comment_added', content.substring(0, 100));

    // Check for @mentions and create notifications
    const mentionRegex = /@(\w+)/g;
    const mentions = content.match(mentionRegex);
    
    if (mentions) {
      for (const mention of mentions) {
        const agentName = mention.substring(1).toLowerCase();
        try {
          const mentionedAgentId = this.getAgentIdByName(agentName);
          this.notificationService.create({
            agent_id: mentionedAgentId,
            task_id: taskId,
            message_id: messageId,
            content: `${fromAgent} mentioned you in task ${taskId}`,
            type: 'mention',
          });
        } catch {
          // Agent not found, skip
        }
      }
    }

    // Notify subscribers
    this.notifySubscribers(taskId, agentId, `${fromAgent} commented on task ${taskId}`);
  }

  getComments(taskId: string): Array<{ id: string; from_agent: string; content: string; created_at: Date }> {
    return db.prepare(`
      SELECT m.id, a.name as from_agent, m.content, m.created_at
      FROM messages m
      JOIN agents a ON m.from_agent_id = a.id
      WHERE m.task_id = ? AND m.type = 'comment'
      ORDER BY m.created_at ASC
    `).all(taskId) as Array<{ id: string; from_agent: string; content: string; created_at: Date }>;
  }

  subscribe(agentName: string, taskId: string): void {
    const agentId = this.getAgentIdByName(agentName);
    db.prepare(`
      INSERT OR IGNORE INTO subscriptions (agent_id, task_id) VALUES (?, ?)
    `).run(agentId, taskId);
  }

  unsubscribe(agentName: string, taskId: string): void {
    const agentId = this.getAgentIdByName(agentName);
    db.prepare(`
      DELETE FROM subscriptions WHERE agent_id = ? AND task_id = ?
    `).run(agentId, taskId);
  }

  private getAgentIdByName(name: string): string {
    const agent = db.prepare('SELECT id FROM agents WHERE LOWER(name) = LOWER(?)').get(name) as { id: string } | undefined;
    if (!agent) {
      throw new Error(`Agent "${name}" not found`);
    }
    return agent.id;
  }

  private parseTask(task: Task): Task {
    return {
      ...task,
      tags: task.tags ? JSON.parse(task.tags as unknown as string) : undefined,
    };
  }

  private logActivity(taskId: string | null, agentId: string | null, action: string, details?: string): void {
    db.prepare(`
      INSERT INTO activities (id, task_id, agent_id, action, details)
      VALUES (?, ?, ?, ?, ?)
    `).run(generateId('ACT'), taskId, agentId, action, details || null);
  }

  private notifySubscribers(taskId: string, excludeAgentId: string, content: string): void {
    const subscribers = db.prepare(`
      SELECT agent_id FROM subscriptions 
      WHERE task_id = ? AND agent_id != ?
    `).all(taskId, excludeAgentId) as Array<{ agent_id: string }>;

    for (const sub of subscribers) {
      this.notificationService.create({
        agent_id: sub.agent_id,
        task_id: taskId,
        content,
        type: 'system',
      });
    }
  }
}
