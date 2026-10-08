#!/bin/bash
# Render a contact sheet of poses and print the automatic checks.
#   mk.sh "move1,move2" "angle,top,side" 6 outname ["&f=1,2,m&w=300"]
# views: angle = the move's own camera · side · top · front · back · yNpM (e.g. y135p28) · none = checks only
set -e
SRC=/home/claude/src; B=/home/claude/build; W=/home/claude/work
mkdir -p $W
MOVES="$1"; VIEWS="${2:-angle}"; COLS="${3:-6}"; OUT="${4:-sheet}"; EXTRA="$5"
{
  echo 'import { useState, useEffect, useRef, useMemo, useCallback } from "react";'
  echo 'import { createRoot } from "react-dom/client";'
  echo 'const T = { meta: { fontSize: 11.5, fontWeight: 600 }, small: { fontSize: 13, lineHeight: 1.5 }, h3: { fontSize: 14.5, fontWeight: 650 } };'
  cat $SRC/rigcore.jsx $SRC/riggl.jsx $SRC/rigview.jsx
  for f in $SRC/poses/*.jsx; do cat "$f"; done
  cat $SRC/dev/sheet.jsx
} > $B/sheetsrc.jsx
cd $B
npx esbuild sheetsrc.jsx --bundle --format=iife --jsx=automatic --outfile=$W/sheet.js --loader:.jsx=jsx --log-level=error
cat > $W/sheet.html << 'EOF'
<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;background:#020617}.rig-pulse{opacity:.9}</style></head>
<body><div id="root"></div><script src="sheet.js"></script></body></html>
EOF
if [ "$VIEWS" = "none" ]; then
  node $SRC/dev/shot.js $W/sheet.html "moves=$MOVES&views=angle&cols=$COLS$EXTRA" none
else
  node $SRC/dev/shot.js $W/sheet.html "moves=$MOVES&views=$VIEWS&cols=$COLS$EXTRA" $W/$OUT.png
  echo "wrote $W/$OUT.png"
fi
