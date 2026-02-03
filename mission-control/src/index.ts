#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { TaskService } from './services/tasks.js';
import { NotificationService } from './services/notifications.js';
import { StandupService } from './services/standup.js';
import { formatTaskList, formatNotificationList, formatTask } from './utils/format.js';

const program = new Command();
const taskService = new TaskService();
const notificationService = new NotificationService();
const standupService = new StandupService();

program
  .name('mc')
  .description('Mission Control - Multi-agent task management CLI')
  .version('1.0.0');

// Task commands
const taskCmd = program
  .command('task')
  .description('Task management commands');

taskCmd
  .command('create')
  .description('Create a new task')
  .requiredOption('-t, --title <title>', 'Task title')
  .option('-d, --description <desc>', 'Task description')
  .option('-a, --assignee <agent>', 'Assign to agent')
  .option('-p, --priority <priority>', 'Priority (urgent|high|normal|low)', 'normal')
  .option('--due <date>', 'Due date (YYYY-MM-DD)')
  .option('--tags <tags...>', 'Tags')
  .action((options) => {
    try {
      const task = taskService.create({
        title: options.title,
        description: options.description,
        assignee: options.assignee,
        priority: options.priority,
        due_date: options.due,
        tags: options.tags,
      });
      console.log(chalk.green('✅ Task created:'));
      console.log(formatTask(task, true));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

taskCmd
  .command('list')
  .description('List tasks')
  .option('-s, --status <status>', 'Filter by status')
  .option('-a, --assignee <agent>', 'Filter by assignee')
  .option('-p, --priority <priority>', 'Filter by priority')
  .option('-l, --limit <num>', 'Limit results', '20')
  .action((options) => {
    try {
      const tasks = taskService.list({
        status: options.status,
        assignee: options.assignee,
        priority: options.priority,
        limit: parseInt(options.limit),
      });
      console.log(formatTaskList(tasks));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

taskCmd
  .command('get <id>')
  .description('Get task details')
  .action((id) => {
    try {
      const task = taskService.getById(id);
      if (!task) {
        console.error(chalk.red(`Task ${id} not found`));
        process.exit(1);
      }
      console.log(formatTask(task, true));
      
      // Show comments
      const comments = taskService.getComments(id);
      if (comments.length > 0) {
        console.log(chalk.bold('\n💬 Comments:'));
        for (const comment of comments) {
          console.log(`  ${chalk.cyan(comment.from_agent)}: ${comment.content}`);
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

taskCmd
  .command('update <id>')
  .description('Update a task')
  .option('-t, --title <title>', 'New title')
  .option('-d, --description <desc>', 'New description')
  .option('-a, --assignee <agent>', 'New assignee')
  .option('-s, --status <status>', 'New status')
  .option('-p, --priority <priority>', 'New priority')
  .option('--due <date>', 'New due date')
  .action((id, options) => {
    try {
      const task = taskService.update(id, {
        title: options.title,
        description: options.description,
        assignee: options.assignee,
        status: options.status,
        priority: options.priority,
        due_date: options.due,
      });
      console.log(chalk.green('✅ Task updated:'));
      console.log(formatTask(task, true));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

taskCmd
  .command('comment <id>')
  .description('Add a comment to a task')
  .requiredOption('-f, --from <agent>', 'Agent name')
  .requiredOption('-m, --message <text>', 'Comment text')
  .action((id, options) => {
    try {
      taskService.addComment(id, options.from, options.message);
      console.log(chalk.green('✅ Comment added'));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

taskCmd
  .command('complete <id>')
  .description('Mark a task as complete')
  .action((id) => {
    try {
      const task = taskService.update(id, { status: 'done' });
      console.log(chalk.green('✅ Task completed:'));
      console.log(formatTask(task));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

taskCmd
  .command('subscribe <id>')
  .description('Subscribe to task notifications')
  .requiredOption('-a, --agent <agent>', 'Agent name')
  .action((id, options) => {
    try {
      taskService.subscribe(options.agent, id);
      console.log(chalk.green(`✅ ${options.agent} subscribed to ${id}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

taskCmd
  .command('unsubscribe <id>')
  .description('Unsubscribe from task notifications')
  .requiredOption('-a, --agent <agent>', 'Agent name')
  .action((id, options) => {
    try {
      taskService.unsubscribe(options.agent, id);
      console.log(chalk.green(`✅ ${options.agent} unsubscribed from ${id}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// Notification commands
const notifyCmd = program
  .command('notify')
  .description('Notification commands');

notifyCmd
  .command('list')
  .description('List notifications')
  .option('-a, --agent <agent>', 'Filter by agent')
  .option('-u, --unread', 'Show only unread')
  .option('-l, --limit <num>', 'Limit results', '20')
  .action((options) => {
    try {
      const notifications = notificationService.list({
        agent: options.agent,
        unread: options.unread,
        limit: parseInt(options.limit),
      });
      console.log(formatNotificationList(notifications));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

notifyCmd
  .command('read <id>')
  .description('Mark notification as read')
  .action((id) => {
    try {
      notificationService.markAsRead(id);
      console.log(chalk.green('✅ Notification marked as read'));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

notifyCmd
  .command('read-all')
  .description('Mark all notifications as read for an agent')
  .requiredOption('-a, --agent <agent>', 'Agent name')
  .action((options) => {
    try {
      const count = notificationService.markAllAsRead(options.agent);
      console.log(chalk.green(`✅ ${count} notifications marked as read`));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

notifyCmd
  .command('clear')
  .description('Clear all notifications for an agent')
  .requiredOption('-a, --agent <agent>', 'Agent name')
  .action((options) => {
    try {
      const count = notificationService.clear(options.agent);
      console.log(chalk.green(`✅ ${count} notifications cleared`));
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

notifyCmd
  .command('count')
  .description('Count unread notifications')
  .requiredOption('-a, --agent <agent>', 'Agent name')
  .action((options) => {
    try {
      const count = notificationService.getUnreadCount(options.agent);
      console.log(`${options.agent} has ${count} unread notifications`);
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// Standup commands
const standupCmd = program
  .command('standup')
  .description('Daily standup commands');

standupCmd
  .command('generate')
  .description('Generate daily standup report')
  .option('-s, --save', 'Save to file')
  .action((options) => {
    try {
      const report = standupService.generate();
      console.log(report);
      
      if (options.save) {
        const path = standupService.save(report);
        console.log(chalk.green(`\n✅ Standup saved to: ${path}`));
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// Dashboard command
program
  .command('dashboard')
  .description('Show system dashboard')
  .action(() => {
    try {
      console.log(chalk.bold.blue('\n📊 Mission Control Dashboard\n'));
      
      // Task counts by status
      const { db } = await import('./db/index.js');
      const statusCounts = db.prepare(`
        SELECT status, COUNT(*) as count FROM tasks GROUP BY status
      `).all() as Array<{ status: string; count: number }>;
      
      console.log(chalk.bold('Tasks by Status:'));
      for (const { status, count } of statusCounts) {
        console.log(`  ${status}: ${count}`);
      }
      
      // Recent activity
      const recentActivity = db.prepare(`
        SELECT a.action, ag.name as agent, a.created_at
        FROM activities a
        JOIN agents ag ON a.agent_id = ag.id
        ORDER BY a.created_at DESC
        LIMIT 10
      `).all() as Array<{ action: string; agent: string; created_at: string }>;
      
      console.log(chalk.bold('\nRecent Activity:'));
      for (const act of recentActivity) {
        console.log(`  ${act.agent}: ${act.action}`);
      }
      
      // Unread notifications summary
      const notifyCounts = db.prepare(`
        SELECT a.name as agent, COUNT(*) as count
        FROM notifications n
        JOIN agents a ON n.agent_id = a.id
        WHERE n.read = FALSE
        GROUP BY a.name
      `).all() as Array<{ agent: string; count: number }>;
      
      if (notifyCounts.length > 0) {
        console.log(chalk.bold('\nUnread Notifications:'));
        for (const { agent, count } of notifyCounts) {
          console.log(`  ${agent}: ${count}`);
        }
      }
      
      console.log();
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// Parse arguments
program.parse();

// Show help if no command
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
