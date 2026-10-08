#!/bin/bash
# Recreate the build folder after a container restart.
mkdir -p /home/claude/build /home/claude/work && cd /home/claude/build
[ -f package.json ] || echo '{"name":"build","private":true,"version":"1.0.0"}' > package.json
[ -d node_modules/react ] || npm install react@18 react-dom@18 tailwindcss@3 esbuild@0.21.5 jsdom playwright 2>&1 | tail -1
chmod +x /home/claude/src/dev/*.sh
echo "build folder ready"
