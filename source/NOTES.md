# Protocol app — working notes (read this first after any restart)

**Only files written with the Write/Edit tools survive a container restart.** Anything
created by Bash (node_modules, bundles, protocol.html in outputs, python-patched files) is lost.
So: edit sources with Write/Edit only, rebuild with the commands below, and re-send protocol.html.

## Layout
- `/home/claude/src/` — sources. Concatenated in this order into one file (see dev/build.sh):
  `data.jsx tree.jsx core.jsx rigcore.jsx riggl.jsx rigview.jsx poses/*.jsx extras.jsx modals.jsx main.jsx`
  (poses load alphabetically; `zpositions.jsx` must stay last because it uses meStand/opStand/opSupine)
- Obsolete, not built: rig.jsx, poses.jsx, rig3d.jsx, poses3d.jsx
- `/home/claude/src/dev/`
  - `setup.sh` recreate /home/claude/build (node_modules)
  - `build.sh` build `/mnt/user-data/outputs/protocol.html` (uses buildhtml.py)
  - `e2e.js` end-to-end check in Chromium: `node e2e.js /mnt/user-data/outputs/protocol.html /home/claude/work/e2e`
  - `mk.sh` contact sheet of poses + anatomy checks: `mk.sh "kneebar,rnc" "angle,top" 5 out "&w=380"`
  - `dump.sh move frameIndex|m` print solved joint positions
- `/home/claude/spec/spec.txt` — the user's spec (pdftotext of Protocol_the_full_app_spec.pdf)

## State (localStorage key protocol-v2)
days, sessions, cards (incl. custom cards with custom:true, clips, answers), liftLog, events (prep, matches),
skills, questions, tree {key:{s,note,card}}, poseEdits {moveId:{frame:{me,op}}}, films (notes; video blobs in
IndexedDB "protocol-film"), moved {date:[blocks]}, skipped {blockId:true}, injuryLog, settings.

## History
- First 2D rig rejected ("very bad and wonky"). Rebuilt as a 3D skeleton + WebGL. Never go back to 2D points.
- Oct 7–8: rebuilt all 17 moves, 10 strength loops, 8 position stills; 419-node move tree; pose editor,
  film room, week editing, prep plan, match log and the rest of the spec gaps.
- GitHub: user is MilkIsGood22; repo `protocol` still did not exist on Oct 8 (add_repo fails until he creates it).
