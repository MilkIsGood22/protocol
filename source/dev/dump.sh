#!/bin/bash
# Print solved joint positions for one frame of a move.
#   dump.sh move frameIndex|m [joint,joint,...]
SRC=/home/claude/src; B=/home/claude/build
{
  cat $SRC/rigcore.jsx
  for f in $SRC/poses/*.jsx; do cat "$f"; done
  cat << 'EOF'
const [id, fi, list] = process.argv.slice(2);
const cm = compileMove(id);
const fr = fi === "m" ? cm.mistake : cm.frames[+fi];
const keys = list ? list.split(",") : ["pelvis","neck","head","shL","shR","elL","elR","haL","haR","hiL","hiR","knL","knR","foL","foR"];
const r = v => v.map(n => Math.round(n)).join(",");
for (const who of ["me", "op"]) {
  const J = fr.J[who]; if (!J) continue;
  console.log(who + ": " + keys.filter(k => J[k]).map(k => k + "[" + r(J[k]) + "]").join(" "));
}
(fr.checks || []).forEach(c => console.log("  ! " + (c.text || JSON.stringify(c))));
EOF
} > $B/dumpsrc.jsx
cd $B && npx esbuild dumpsrc.jsx --bundle --platform=node --outfile=$B/dump.js --log-level=error && node $B/dump.js "$@"
