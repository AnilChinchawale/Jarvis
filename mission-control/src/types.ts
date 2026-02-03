import { z } from 'zod';

// Enums
export const TaskStatus = z.enum(['inbox', 'assigned', 'in_progress', 'blocked', 'review', 'done', 'cancelled']);
export const Priority = z.enum(['urgent', 'high', 'normal', 'low']);
export const AgentStatus = z.enum(['active', 'away', 'offline']);
export const MessageType = z.enum(['comment', 'system', 'mention']);
export const NotificationType = z.enum(['mention', 'task_assigned', 'task_due', 'system']);

// Agent schemas
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  session_key: z.string(),
  role: z.string(),
  status: AgentStatus,
  last_seen: z.date().optional(),
  created_at: z.date(),
});

// Task schemas
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  assignee_id: z.string().optional(),
  creator_id: z.string().optional(),
  status: TaskStatus,
  priority: Priority,
  due_date: z.date().optional(),
  parent_id: z.string().optional(),
  tags: z.array(z.string()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
  completed_at: z.date().optional(),
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assignee: z.string().optional(),
  priority: Priority.default('normal'),
  due_date: z.string().optional(),
  parent_id: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  assignee: z.string().optional(),
  status: TaskStatus.optional(),
  priority: Priority.optional(),
  due_date: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Message schemas
export const MessageSchema = z.object({
  id: z.string(),
  task_id: z.string().optional(),
  from_agent_id: z.string(),
  to_agent_id: z.string().optional(),
  content: z.string(),
  type: MessageType,
  created_at: z.date(),
});

export const CreateMessageSchema = z.object({
  task_id: z.string().optional(),
  from_agent: z.string(),
  to_agent: z.string().optional(),
  content: z.string().min(1),
  type: MessageType.default('comment'),
});

// Notification schemas
export const NotificationSchema = z.object({
  id: z.string(),
  agent_id: z.string(),
  message_id: z.string().optional(),
  task_id: z.string().optional(),
  content: z.string(),
  type: NotificationType,
  read: z.boolean(),
  created_at: z.date(),
});

// Activity schemas
export const ActivitySchema = z.object({
  id: z.string(),
  task_id: z.string().optional(),
  agent_id: z.string(),
  action: z.string(),
  details: z.string().optional(),
  created_at: z.date(),
});

// Types
export type TaskStatus = z.infer<typeof TaskStatus>;
export type Priority = z.infer<typeof Priority>;
export type AgentStatus = z.infer<typeof AgentStatus>;
export type MessageType = z.infer<typeof MessageType>;
export type NotificationType = z.infer<typeof NotificationType>;

export type Agent = z.infer<typeof AgentSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type Activity = z.infer<typeof ActivitySchema>;

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
