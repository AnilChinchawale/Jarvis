import chalk from 'chalk';
import { Task, Notification, Priority, TaskStatus } from '../types.js';

export function formatTask(task: Task, includeDetails = false): string {
  const priorityColors: Record<Priority, (s: string) => string> = {
    urgent: chalk.red.bold,
    high: chalk.yellow.bold,
    normal: chalk.white,
    low: chalk.gray,
  };

  const statusColors: Record<TaskStatus, (s: string) => string> = {
    inbox: chalk.gray,
    assigned: chalk.blue,
    in_progress: chalk.cyan,
    blocked: chalk.red,
    review: chalk.magenta,
    done: chalk.green,
    cancelled: chalk.gray.strikethrough,
  };

  const priorityEmoji: Record<Priority, string> = {
    urgent: '🔴',
    high: '🟡',
    normal: '🟢',
    low: '⚪',
  };

  let output = `${priorityEmoji[task.priority]} ${chalk.bold(task.id)} ${priorityColors[task.priority](task.priority.toUpperCase())} ${statusColors[task.status](task.status)}\n`;
  output += `   ${chalk.white(task.title)}\n`;

  if (includeDetails && task.description) {
    output += `   ${chalk.gray(task.description)}\n`;
  }

  if (task.due_date) {
    const dueDate = new Date(task.due_date);
    const isOverdue = dueDate < new Date() && task.status !== 'done';
    const dateStr = isOverdue ? chalk.red(`Due: ${dueDate.toDateString()}`) : chalk.gray(`Due: ${dueDate.toDateString()}`);
    output += `   ${dateStr}\n`;
  }

  return output;
}

export function formatNotification(notification: Notification): string {
  const typeColors: Record<string, (s: string) => string> = {
    mention: chalk.cyan,
    task_assigned: chalk.green,
    task_due: chalk.yellow,
    system: chalk.gray,
  };

  const typeEmoji: Record<string, string> = {
    mention: '💬',
    task_assigned: '📋',
    task_due: '⏰',
    system: 'ℹ️',
  };

  const readIndicator = notification.read ? chalk.gray('✓') : chalk.yellow('●');
  const typeStr = typeColors[notification.type](`[${notification.type}]`);
  
  return `${readIndicator} ${typeEmoji[notification.type]} ${typeStr} ${notification.content}`;
}

export function formatTaskList(tasks: Task[]): string {
  if (tasks.length === 0) {
    return chalk.gray('No tasks found.');
  }

  return tasks.map(t => formatTask(t)).join('\n');
}

export function formatNotificationList(notifications: Notification[]): string {
  if (notifications.length === 0) {
    return chalk.gray('No notifications found.');
  }

  return notifications.map(n => formatNotification(n)).join('\n');
}
