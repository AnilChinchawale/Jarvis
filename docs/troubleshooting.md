# Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### npm install fails

**Symptoms:**
```
npm ERR! code EACCES
npm ERR! syscall mkdir
```

**Solutions:**
1. Use npx without global install:
   ```bash
   npx tsx src/index.ts
   ```

2. Fix permissions:
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

3. Use npm's cache clean:
   ```bash
   npm cache clean --force
   npm install
   ```

### SQLite build errors

**Symptoms:**
```
gyp ERR! build error
```

**Solutions:**
1. Install build tools:
   ```bash
   # macOS
   xcode-select --install
   
   # Ubuntu/Debian
   sudo apt-get install build-essential python3
   
   # Windows
   npm install --global windows-build-tools
   ```

2. Use prebuilt binaries:
   ```bash
   npm install better-sqlite3 --build-from-source=false
   ```

## Database Issues

### Database is locked

**Symptoms:**
```
SQLITE_BUSY: database is locked
```

**Solutions:**
1. Check for hanging processes:
   ```bash
   lsof data/mission-control.db
   ```

2. Restart notification daemon:
   ```bash
   pkill -f notification-daemon
   npm run daemon
   ```

3. Reset database (WARNING: data loss):
   ```bash
   rm data/mission-control.db
   npm run db:init
   ```

### Corrupted database

**Symptoms:**
```
SQLITE_CORRUPT: database disk image is malformed
```

**Solutions:**
1. Restore from backup:
   ```bash
   cp data/mission-control.db.backup data/mission-control.db
   ```

2. Or recreate:
   ```bash
   rm data/mission-control.db*
   npm run db:init
   ```

## CLI Issues

### Command not found: mc

**Solutions:**
1. Use npx:
   ```bash
   npx tsx src/index.ts [command]
   ```

2. Or use full path:
   ```bash
   node dist/index.js [command]
   ```

3. Create alias:
   ```bash
   echo 'alias mc="cd /path/to/mission-control && npx tsx src/index.ts"' >> ~/.bashrc
   ```

### Agent not found

**Symptoms:**
```
Error: Agent "jarvis" not found
```

**Solutions:**
1. Check agent exists:
   ```bash
   mc dashboard
   ```

2. Reinitialize database:
   ```bash
   npm run db:init
   ```

3. Check database directly:
   ```bash
   sqlite3 data/mission-control.db "SELECT * FROM agents;"
   ```

## Notification Issues

### @mentions not working

**Symptoms:**
- Agent sends @mention
- No notification created
- Target agent doesn't see it

**Diagnosis:**
```bash
# Check daemon is running
pgrep -f notification-daemon

# Check message directory
ls -la messages/

# Check agent inbox
ls -la agents/jarvis/
```

**Solutions:**
1. Restart daemon:
   ```bash
   pkill -f notification-daemon
   npm run daemon
   ```

2. Check permissions:
   ```bash
   chmod 755 messages/
   chmod 755 agents/
   ```

3. Manual test:
   ```bash
   echo '{"from":"jarvis","content":"@fury test"}' > messages/test.json
   ```

### Notifications not clearing

**Symptoms:**
- Unread count stays high
- Mark as read doesn't work

**Solutions:**
```bash
# Clear manually
mc notify clear --agent jarvis

# Or reset state
rm memory/heartbeat-state.json
```

## Heartbeat Issues

### Cron jobs not running

**Diagnosis:**
```bash
# Check crontab
crontab -l

# Check cron logs
tail -f /var/log/cron

# Test manually
./scripts/heartbeat.sh jarvis
```

**Solutions:**
1. Reinstall crontab:
   ```bash
   crontab scripts/crontab.txt
   ```

2. Fix script permissions:
   ```bash
   chmod +x scripts/heartbeat.sh
   ```

3. Check paths in crontab:
   ```bash
   # Edit scripts/crontab.txt to use absolute paths
   WORKSPACE=/full/path/to/multi-agent-system
   ```

### Heartbeat state not updating

**Symptoms:**
- Agent shows as "away" despite heartbeats
- State file not updating

**Solutions:**
1. Check jq is installed:
   ```bash
   jq --version
   ```

2. Fix state file permissions:
   ```bash
   chmod 644 memory/heartbeat-state.json
   ```

3. Reset state:
   ```bash
   rm memory/heartbeat-state.json
   ```

## Performance Issues

### Slow task list

**Symptoms:**
- mc task list takes >5 seconds

**Solutions:**
1. Add index:
   ```bash
   sqlite3 data/mission-control.db <<EOF
   CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
   CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
   EOF
   ```

2. Limit results:
   ```bash
   mc task list --limit 50
   ```

### High memory usage

**Symptoms:**
- Notification daemon using >500MB RAM

**Solutions:**
1. Restart daemon periodically:
   ```bash
   # Add to crontab
   0 */6 * * * pkill -f notification-daemon; sleep 5; cd /path/to/mc && npm run daemon
   ```

2. Reduce watch scope:
   ```bash
   # Edit daemon to watch fewer files
   ```

## Data Recovery

### Accidentally deleted task

**Recovery:**
```bash
# Check activity log for task details
sqlite3 data/mission-control.db "SELECT * FROM activities WHERE task_id='TASK-XXX';"

# Recreate manually with same ID
# Or restore from backup
```

### Lost all data

**Prevention:**
```bash
# Set up automated backups
0 0 * * * cp data/mission-control.db data/backups/mc-$(date +%Y%m%d).db
```

**Recovery:**
```bash
# Restore from latest backup
ls -t data/backups/ | head -1 | xargs -I {} cp data/backups/{} data/mission-control.db
```

## Getting Help

### Debug mode

```bash
# Enable debug logging
MC_LOG_LEVEL=debug mc task list
```

### Check system health

```bash
mc dashboard
```

### Generate diagnostic report

```bash
#!/bin/bash
echo "=== System Diagnostics ==="
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo "Database: $(sqlite3 data/mission-control.db 'SELECT COUNT(*) FROM tasks;') tasks"
echo "Agents: $(sqlite3 data/mission-control.db 'SELECT COUNT(*) FROM agents;') agents"
echo "Notifications: $(sqlite3 data/mission-control.db 'SELECT COUNT(*) FROM notifications;') pending"
echo "Daemon: $(pgrep -f notification-daemon || echo 'Not running')"
echo "Cron: $(crontab -l 2>/devnull | grep -c heartbeat || echo 'Not installed')"
```

### Report an issue

Include:
1. Error message (full output)
2. Command that triggered it
3. Output of `mc dashboard`
4. Relevant log files from `logs/`
