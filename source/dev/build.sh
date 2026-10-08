#!/bin/bash
# Build the single-file app: /mnt/user-data/outputs/protocol.html
#   build.sh            (production)
#   build.sh dev        (also writes build/Protocol2.jsx with checks on, no minify)
set -e
SRC=/home/claude/src; B=/home/claude/build
[ -d $B/node_modules/react ] || $SRC/dev/setup.sh
cd $B
{
  cat $SRC/data.jsx $SRC/tree.jsx $SRC/core.jsx $SRC/rigcore.jsx $SRC/riggl.jsx $SRC/rigview.jsx
  for f in $SRC/poses/*.jsx; do cat "$f"; done
  cat $SRC/extras.jsx $SRC/modals.jsx $SRC/main.jsx
} > Protocol2.jsx
cat > entry2.jsx << 'EOF'
import { createRoot } from "react-dom/client";
import Protocol from "./Protocol2.jsx";
createRoot(document.getElementById("root")).render(<Protocol />);
EOF
printf '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' > in.css
cat > tw2.config.js << 'EOF'
module.exports = { content: ["./Protocol2.jsx", "./entry2.jsx"], theme: { extend: {} }, plugins: [] };
EOF
npx tailwindcss -c tw2.config.js -i in.css -o out2.css --minify 2>&1 | grep -v "Browserslist\|update-browserslist\|^$" || true
MIN="--minify"; [ "$1" = "dev" ] && MIN=""
npx esbuild entry2.jsx --bundle $MIN --format=iife --target=es2018 --jsx=automatic \
  --define:process.env.NODE_ENV='"production"' --outfile=bundle2.js --loader:.jsx=jsx --log-level=warning
python3 $SRC/dev/buildhtml.py $B/out2.css $B/bundle2.js /mnt/user-data/outputs/protocol.html
ls -la /mnt/user-data/outputs/protocol.html
