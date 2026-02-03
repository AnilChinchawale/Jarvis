import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'data');
const DB_PATH = join(DATA_DIR, 'mission-control.db');

// Ensure data directory exists
mkdirSync(DATA_DIR, { recursive: true });

// Initialize database
export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
export function initializeDatabase(): void {
  // Agents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      session_key TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'away', 'offline')),
      last_seen DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      assignee_id TEXT REFERENCES agents(id),
      creator_id TEXT REFERENCES agents(id),
      status TEXT DEFAULT 'inbox' CHECK (status IN ('inbox', 'assigned', 'in_progress', 'blocked', 'review', 'done', 'cancelled')),
      priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
      due_date DATETIME,
      parent_id TEXT REFERENCES tasks(id),
      tags TEXT, -- JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    );
  `);

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      task_id TEXT REFERENCES tasks(id),
      from_agent_id TEXT REFERENCES agents(id),
      to_agent_id TEXT REFERENCES agents(id),
      content TEXT NOT NULL,
      type TEXT DEFAULT 'comment' CHECK (type IN ('comment', 'system', 'mention')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Activities table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      task_id TEXT REFERENCES tasks(id),
      agent_id TEXT REFERENCES agents(id),
      action TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Documents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      path TEXT NOT NULL,
      content_type TEXT DEFAULT 'markdown',
      created_by TEXT REFERENCES agents(id),
      task_id TEXT REFERENCES tasks(id),
      version INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Notifications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL REFERENCES agents(id),
      message_id TEXT REFERENCES messages(id),
      task_id TEXT REFERENCES tasks(id),
      content TEXT NOT NULL,
      type TEXT DEFAULT 'mention' CHECK (type IN ('mention', 'task_assigned', 'task_due', 'system')),
      read BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Thread subscriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id TEXT NOT NULL REFERENCES agents(id),
      task_id TEXT NOT NULL REFERENCES tasks(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(agent_id, task_id)
    );
  `);

  // Insert default agents
  const insertAgent = db.prepare(`
    INSERT OR IGNORE INTO agents (id, name, session_key, role, status) 
    VALUES (?, ?, ?, ?, ?)
  `);

  const agents = [
    ['jarvis', 'Jarvis', 'agent:main:main', 'Squad Lead', 'active'],
    ['shuri', 'Shuri', 'agent:product-analyst:main', 'Product Analyst', 'active'],
    ['fury', 'Fury', 'agent:customer-researcher:main', 'Customer Researcher', 'active'],
    ['vision', 'Vision', 'agent:seo-analyst:main', 'SEO Analyst', 'active'],
    ['loki', 'Loki', 'agent:content-writer:main', 'Content Writer', 'active'],
  ];

  for (const agent of agents) {
    insertAgent.run(...agent);
  }

  console.log('✅ Database initialized successfully');
}

// Initialize on import
initializeDatabase();
