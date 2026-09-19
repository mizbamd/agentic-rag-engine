#!/bin/bash
# Keep a Cloudflare quick tunnel pointed at local Vite. Writes the public URL
# to /tmp/campus-public-url.txt and updates README if the hostname changes.
set -u
cd /workspace/learning-campus
URL_FILE=/tmp/campus-public-url.txt
LOG=/tmp/campus-tunnel.log
while true; do
  echo "[tunnel-watch] starting cloudflared $(date -Is)"
  : > "$LOG"
  npx --yes cloudflared tunnel --url http://127.0.0.1:5173 2>&1 | tee "$LOG" | while IFS= read -r line; do
    echo "$line"
    host=$(printf '%s\n' "$line" | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' | head -n 1)
    if [ -n "$host" ]; then
      echo "$host" > "$URL_FILE"
      if grep -q 'Public HTTPS' README.md 2>/dev/null; then
        if ! grep -q "$host" README.md; then
          sed -i "s|Public HTTPS (no localhost, live tunnel): \*\*https://[^*]*\*\*|Public HTTPS (no localhost, live tunnel): **${host}/**|" README.md || true
        fi
      fi
    fi
  done
  echo "[tunnel-watch] tunnel exited $?; restarting in 2s"
  sleep 2
done
