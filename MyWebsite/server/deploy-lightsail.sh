#!/usr/bin/env bash
# AWS Lightsail deployment script
# Run this on your Lightsail instance (Amazon Linux / Ubuntu)
set -euo pipefail

APP_DIR="/home/bitnami/portfolio"   # Bitnami user on Lightsail
# APP_DIR="/home/ubuntu/portfolio" # Ubuntu user
REPO_URL="https://github.com/Kirstenumali/officialwesbite.git"  # <-- CHANGE THIS

echo "=== Updating system ==="
sudo apt-get update -qq && sudo apt-get install -y -qq nodejs npm git nginx

echo "=== Cloning/updating project ==="
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR" && git pull
else
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

echo "=== Installing dependencies ==="
cd "$APP_DIR/server"
npm install

echo "=== Setting up environment ==="
if [ ! -f "$APP_DIR/server/.env" ]; then
  cat > "$APP_DIR/server/.env" <<-EOF
PORT=8000
BOT_TOKEN=8787860497:AAHG3BNGy8bvl8Br1gWAXJOD_Q6xWuS6KX4
CHAT_ID=6442368699
EOF
  echo ".env created — edit it to update your Telegram bot token"
fi

echo "=== Starting app with PM2 ==="
if ! command -v pm2 &> /dev/null; then
  sudo npm install -g pm2
fi
pm2 delete portfolio 2>/dev/null || true
pm2 start "$APP_DIR/server/server.js" --name portfolio
pm2 save
sudo env PATH="$PATH" pm2 startup systemd -u "$USER" --hp "$HOME" 2>/dev/null || true

echo ""
echo "=== Setup complete ==="
echo "App running at http://$(curl -s http://checkip.amazonaws.com):8000"
echo ""
echo "To use a custom domain with HTTPS, run:"
echo "  sudo nginx"
echo "  sudo certbot --nginx -d yourdomain.com"
