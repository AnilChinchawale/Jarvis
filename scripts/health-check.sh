#!/bin/bash
# health-check.sh - System health check script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"

echo "🏥 Multi-Agent System Health Check"
echo "==================================="
echo ""

EXIT_CODE=0

# Check Node.js
echo "📦 Node.js"
if command -v node &> /dev/null; then
    echo "  ✅ $(node -v)"
else
    echo "  ❌ Node.js not found"
    EXIT_CODE=1
fi

# Check database
echo ""
echo "🗄️  Database"
DB_PATH="$WORKSPACE_DIR/data/mission-control.db"
if [ -f "$DB_PATH" ]; then
    SIZE=$(du -h "$DB_PATH" | cut -f1)
    echo "  ✅ Database exists ($SIZE)"
    
    # Check tables
    TABLE_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/devnull || echo "0")
    echo "  📊 $TABLE_COUNT tables"
else
    echo "  ⚠️  Database not initialized"
fi

# Check agents
echo ""
echo "🤖 Agents"
if [ -f "$DB_PATH" ]; then
    sqlite3 "$DB_PATH" "SELECT name, status FROM agents;" 2>/devnull | while read line; do
        echo "  • $line"
    done
else
    echo "  ⚠️  Run setup to initialize agents"
fi

# Check notification daemon
echo ""
echo "🔔 Notification Daemon"
if pgrep -f "notification-daemon" > /dev/null; then
    PID=$(pgrep -f "notification-daemon")
    echo "  ✅ Running (PID: $PID)"
else
    echo "  ⚠️  Not running"
    echo "     Start with: npm run --prefix mission-control daemon"
fi

# Check cron jobs
echo ""
echo "⏰ Cron Jobs"
if crontab -l 2>/dev/null | grep -q "heartbeat"; then
    COUNT=$(crontab -l 2>/devnull | grep -c "heartbeat")
    echo "  ✅ $COUNT heartbeat jobs installed"
else
    echo "  ⚠️  No heartbeat jobs found"
    echo "     Install with: crontab scripts/crontab.txt"
fi

# Check directories
echo ""
echo "📁 Directories"
for dir in memory messages logs; do
    if [ -d "$WORKSPACE_DIR/$dir" ]; then
        echo "  ✅ $dir/"
    else
        echo "  ⚠️  $dir/ missing"
    fi
done

# Check recent activity
echo ""
echo "📈 Recent Activity"
if [ -f "$DB_PATH" ]; then
    TASK_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM tasks WHERE DATE(created_at) = DATE('now');" 2>/devnull || echo "0")
    echo "  📝 $TASK_COUNT tasks created today"
    
    NOTIF_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM notifications WHERE read = 0;" 2>/devnull || echo "0")
    if [ "$NOTIF_COUNT" -gt 0 ]; then
        echo "  📬 $NOTIF_COUNT unread notifications"
    else
        echo "  📭 No unread notifications"
    fi
else
    echo "  ⚠️  Database unavailable"
fi

# Summary
echo ""
echo "==================================="
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ System health: GOOD"
else
    echo "⚠️  System health: ISSUES FOUND"
fi

exit $EXIT_CODE
