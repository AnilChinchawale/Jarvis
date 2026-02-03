#!/bin/bash
# setup.sh - Multi-Agent System Setup Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 Multi-Agent System Setup"
echo "=========================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version $NODE_VERSION found. Please upgrade to Node.js 20+."
    exit 1
fi
echo "✅ Node.js $(node -v)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found."
    exit 1
fi
echo "✅ npm $(npm -v)"

if command -v jq &> /dev/null; then
    echo "✅ jq $(jq --version)"
else
    echo "⚠️  jq not found. Some features may be limited."
fi

echo ""

# Install dependencies
echo "📦 Installing Mission Control dependencies..."
cd "$WORKSPACE_DIR/mission-control"
npm install

echo ""

# Build TypeScript
echo "🔨 Building Mission Control..."
npm run build

echo ""

# Initialize database
echo "🗄️  Initializing database..."
mkdir -p "$WORKSPACE_DIR/data"
# Database initializes automatically on first run

echo ""

# Set up directories
echo "📁 Setting up directory structure..."
mkdir -p "$WORKSPACE_DIR/memory/standups"
mkdir -p "$WORKSPACE_DIR/messages"
mkdir -p "$WORKSPACE_DIR/logs"

echo ""

# Make scripts executable
echo "🔧 Setting up scripts..."
chmod +x "$WORKSPACE_DIR/scripts/heartbeat.sh"

echo ""

# Test CLI
echo "🧪 Testing Mission Control CLI..."
if node "$WORKSPACE_DIR/mission-control/dist/index.js" --version >/devdev/null 2>&1; then
    echo "✅ CLI is working"
else
    echo "⚠️  CLI test failed, but setup continued"
fi

echo ""

# Install cron jobs (optional)
echo "⏰ Cron Jobs Setup"
echo "-------------------"
read -p "Install cron jobs for agent heartbeats? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v crontab &> /dev/null; then
        # Backup existing crontab
        crontab -l > "$WORKSPACE_DIR/logs/crontab-backup-$(date +%Y%m%d).txt" 2>/devnull || true
        
        # Install new crontab
        cat "$WORKSPACE_DIR/scripts/crontab.txt" | crontab -
        echo "✅ Cron jobs installed"
        echo ""
        echo "Current crontab:"
        crontab -l
    else
        echo "❌ crontab command not found"
    fi
else
    echo "⏭️  Skipping cron setup"
    echo "   To manually install later, run:"
    echo "   crontab scripts/crontab.txt"
fi

echo ""

# Start notification daemon (optional)
echo "🔔 Notification Daemon"
echo "----------------------"
read -p "Start the notification daemon now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$WORKSPACE_DIR/mission-control"
    nohup npm run daemon > "$WORKSPACE_DIR/logs/daemon.log" 2>&1 &
    echo "✅ Notification daemon started (PID: $!)"
    echo "   Logs: tail -f $WORKSPACE_DIR/logs/daemon.log"
else
    echo "⏭️  Skipping daemon startup"
    echo "   To start later, run:"
    echo "   cd mission-control && npm run daemon"
fi

echo ""

# Create initial test data
echo "🧪 Creating sample data..."
cd "$WORKSPACE_DIR/mission-control"

# Create welcome task
node dist/index.js task create \
    --title "Welcome to Mission Control" \
    --description "This is your first task! Use 'mc task list' to see all tasks." \
    --assignee jarvis \
    --priority normal 2>/devnull || echo "   (Task creation requires full build)"

echo ""

# Summary
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "Quick Start:"
echo "------------"
echo "1. Test the CLI:"
echo "   cd mission-control"
echo "   npm run dev -- task list"
echo ""
echo "2. Start notification daemon:"
echo "   npm run daemon"
echo ""
echo "3. View dashboard:"
echo "   npm run dev -- dashboard"
echo ""
echo "4. Check agent heartbeats:"
echo "   tail -f memory/heartbeat.log"
echo ""
echo "Documentation:"
echo "--------------"
echo "- README.md - System overview"
echo "- AGENTS.md - Operating manual"
echo "- examples/ - Sample workflows"
echo ""
echo "Need help? Check the docs or ask @Jarvis!"
