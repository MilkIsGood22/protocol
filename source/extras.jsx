
/* ═══════════════ SMALL HELPERS ═══════════════ */

const fmtClock = s => {
  if (s == null || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60), x = Math.floor(s % 60);
  return `${m}:${String(x).padStart(2, "0")}`;
};

const Chip = ({ on, children, onClick, c = "#60a5fa" }) => (
  <button onClick={onClick} className="rounded-full border px-3 py-1.5 shrink-0"
    style={{ ...T.meta, borderColor: on ? c : "#1e293b", color: on ? c : "#64748b", background: on ? c + "14" : "transparent" }}>{children}</button>
);

const Seg = ({ value, options, onChange }) => (
  <div className="grid rounded-xl border border-slate-800 p-1 gap-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}>
    {options.map(([k, l]) => (
      <button key={k} onClick={() => onChange(k)} className="rounded-lg py-2"
        style={{ ...T.meta, background: value === k ? "#1e293b" : "transparent", color: value === k ? "#f1f5f9" : "#64748b" }}>{l}</button>
    ))}
  </div>
);

/* long press (or right click) opens a menu; a normal tap still works */
const useLongPress = (fn, ms = 520) => {
  const t = useRef(null), fired = useRef(false);
  return {
    onPointerDown: e => { fired.current = false; clearTimeout(t.current); t.current = setTimeout(() => { fired.current = true; fn(e); }, ms); },
    onPointerUp: () => clearTimeout(t.current),
    onPointerLeave: () => clearTimeout(t.current),
    onPointerCancel: () => clearTimeout(t.current),
    onContextMenu: e => { e.preventDefault(); clearTimeout(t.current); fired.current = true; fn(e); },
    wasLong: () => fired.current,
  };
};

/* tiny line graph: values may contain nulls */
function Spark({ values, min, max, h = 54, color = "#60a5fa", line }) {
  const v = values.map(x => (x == null ? null : x));
  const nums = v.filter(x => x != null);
  if (nums.length < 2) return null;
  const lo = min ?? Math.min(...nums), hi = max ?? Math.max(...nums);
  const Y = x => h - 4 - ((x - lo) / Math.max(0.001, hi - lo)) * (h - 8);
  const X = i => 6 + (i / Math.max(1, v.length - 1)) * 308;
  const pts = v.map((x, i) => (x == null ? null : [X(i), Y(x)])).filter(Boolean);
  return (
    <svg viewBox={`0 0 320 ${h}`} style={{ width: "100%", height: h }}>
      {line != null && line >= lo && line <= hi && <line x1="0" x2="320" y1={Y(line)} y2={Y(line)} stroke="#f472b6" strokeDasharray="4 4" strokeWidth="1.2" />}
      <polyline points={pts.map(p => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth="2" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.4" fill={color} />)}
    </svg>
  );
}

/* ═══════════════ MOVE TREE ═══════════════ */

const TREE_POS = n => {
  const path = [];
  for (let x = n; x && x.key !== "root"; x = x.parent) path.unshift(x.key);
  const top = path[0] || "", k = n.key;
  if (top === "standing") return "Standing";
  if (top.startsWith("guards")) return k.includes("half-guard") ? "Half guard" : k.includes("closed-guard") ? "Closed guard" : "Open guard";
  if (top.startsWith("passing")) return k.includes("half") ? "Half guard" : k.includes("closed") ? "Closed guard" : "Open guard";
  if (["side-control", "knee-on-belly", "north-south"].includes(top)) return "Side control";
  if (top === "mount") return "Mount";
  if (top === "back" || top === "turtle") return "Back";
  if (top === "leg-locks") return "Legs";
  return "Other";
};
const treePath = n => { const p = []; for (let x = n.parent; x && x.key !== "root"; x = x.parent) p.unshift(x); return p; };
const legalNote = n => n.x ? "Banned almost everywhere, and always in teen divisions." : n.r ? "Often illegal for teens and white belts. Your Grappling X rules banned it. Check the ruleset of every event." : null;

const nodeStatus = (st, n) => {
  if (n.lib) return cardState(st, n.lib).status;
  const t = (st.tree || {})[n.key] || {};
  if (t.card && st.cards[t.card]) return cardState(st, t.card).status;
  return t.s || "";
};

function TreeView({ st, patch, onOpenCard, onAddCard, openKey, setOpenKey }) {
  const [q, setQ] = useState("");
  const [sf, setSf] = useState("all");
  const [kf, setKf] = useState("all");
  const [open, setOpen] = useState(() => new Set(["foundations"]));
  const hide = !!st.settings.hideRestricted;
  const moves = TREE.moves;
  const counts = { know: 0, learning: 0, next: 0 };
  moves.forEach(n => { const s = nodeStatus(st, n); if (counts[s] != null) counts[s]++; });
  const total = moves.length;

  const match = n => {
    if (!n.kind) return false;
    if (hide && (n.r || n.x)) return false;
    if (kf !== "all" && n.kind !== kf) return false;
    const s = nodeStatus(st, n);
    if (sf === "none" ? s !== "" : sf !== "all" && s !== sf) return false;
    if (q.trim()) { const w = q.trim().toLowerCase(); return n.name.toLowerCase().includes(w) || n.text.toLowerCase().includes(w); }
    return true;
  };
  const flat = q.trim() || sf !== "all" || kf !== "all";
  const results = flat ? TREE.all.filter(match) : [];

  const toggle = k => setOpen(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const countIn = n => { let a = 0, b = 0; const walk = x => { x.kids.forEach(y => { if (y.kind && !(hide && (y.r || y.x))) { a++; if (nodeStatus(st, y) === "know") b++; } walk(y); }); }; walk(n); return [b, a]; };

  const row = (n, depth) => {
    const s = nodeStatus(st, n), km = TREE_KINDS[n.kind], has = n.kids.length > 0, isOpen = open.has(n.key);
    if (hide && (n.r || n.x)) return null;
    if (!n.kind) {
      const [k, a] = countIn(n);
      return (
        <div key={n.key}>
          <button onClick={() => toggle(n.key)} className="w-full flex items-center gap-2 text-left py-2 relative">
            {depth > 0 && <span style={{ position: "absolute", left: -9, top: "50%", width: 8, borderTop: "1.5px solid #334155" }} />}
            <span className="text-slate-500 shrink-0" style={{ width: 12, fontSize: 11 }}>{isOpen ? "▾" : "▸"}</span>
            <span className={depth === 0 ? "text-slate-100" : "text-slate-300"} style={depth === 0 ? T.h3 : { ...T.small, fontWeight: 650 }}>{n.name}</span>
            <span className="ml-auto text-slate-600 shrink-0" style={T.meta}>{k}/{a}</span>
          </button>
          {isOpen && branch(n.kids, depth + 1)}
        </div>
      );
    }
    return (
      <div key={n.key}>
        <div className="flex items-center gap-1.5 relative">
          {depth > 0 && <span style={{ position: "absolute", left: -9, top: 19, width: 8, borderTop: "1.5px solid #334155" }} />}
          <button onClick={() => has && toggle(n.key)} className="shrink-0 text-slate-500" style={{ width: 12, fontSize: 11, visibility: has ? "visible" : "hidden" }}>{isOpen ? "▾" : "▸"}</button>
          <button onClick={() => setOpenKey(n.key)} className="flex-1 min-w-0 flex items-center gap-2 text-left rounded-lg border px-2.5 py-2 my-0.5"
            style={{ borderColor: s ? STATUSMETA[s].c + "66" : "#1e293b", background: s ? STATUSMETA[s].c + "10" : "#0f172a" }}>
            <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: km.c }} />
            <span className="text-slate-200 truncate" style={{ fontSize: 13, fontWeight: 600 }}>{n.name}</span>
            <span className="ml-auto flex items-center gap-1 shrink-0">
              {nodeAnim(n) && <span style={{ fontSize: 9.5, color: "#93c5fd", fontWeight: 700 }}>▶</span>}
              {n.gi && <span style={{ fontSize: 9.5, color: "#93c5fd", fontWeight: 700 }}>GI</span>}
              {(n.r || n.x) && <span style={{ fontSize: 10, color: "#fb923c", fontWeight: 800 }}>⚠</span>}
              {s && <span style={{ fontSize: 9.5, color: STATUSMETA[s].c, fontWeight: 700 }}>{STATUSMETA[s].label}</span>}
            </span>
          </button>
        </div>
        {has && isOpen && branch(n.kids, depth + 1)}
      </div>
    );
  };
  const branch = (nodes, depth) => (
    <div style={depth > 0 ? { marginLeft: 6, paddingLeft: 9, borderLeft: "1.5px solid #1e293b" } : null}>
      {nodes.map(n => row(n, depth))}
    </div>
  );

  return (
    <>
      <Card className="space-y-3">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-slate-300" style={T.h3}>Every move in grappling</span>
            <span className="text-slate-500" style={T.meta}>{total} moves</span>
          </div>
          <div className="flex rounded-full overflow-hidden mt-2" style={{ height: 7, background: "#1e293b" }}>
            {["know", "learning", "next"].map(k => <div key={k} style={{ width: `${(counts[k] / total) * 100}%`, background: STATUSMETA[k].c }} />)}
          </div>
          <div className="flex gap-3 mt-1.5 flex-wrap">
            {["know", "learning", "next"].map(k => <span key={k} style={{ ...T.meta, color: STATUSMETA[k].c }}>{STATUSMETA[k].label} {counts[k]}</span>)}
            <span className="text-slate-600" style={T.meta}>Not yet {total - counts.know - counts.learning - counts.next}</span>
          </div>
        </div>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search: heel hook, sweep, d'arce…" className={inputCls} style={T.small} />
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {[["all", "All"], ["none", "Not yet"], ["next", "Next"], ["learning", "Learning"], ["know", "Know"]].map(([k, l]) => (
            <Chip key={k} on={sf === k} onClick={() => setSf(k)} c={STATUSMETA[k]?.c || "#cbd5e1"}>{l}</Chip>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          <Chip on={kf === "all"} onClick={() => setKf("all")} c="#cbd5e1">Every kind</Chip>
          {Object.entries(TREE_KINDS).map(([k, v]) => <Chip key={k} on={kf === k} onClick={() => setKf(kf === k ? "all" : k)} c={v.c}>{v.label}</Chip>)}
        </div>
        <Toggle on={hide} onChange={v => patch({ settings: { ...st.settings, hideRestricted: v } })} label="Hide moves that are banned for teens" />
      </Card>

      {flat ? (
        <div className="space-y-1.5">
          <div className="text-slate-500" style={T.meta}>{results.length} match{results.length === 1 ? "" : "es"}</div>
          {results.slice(0, 150).map(n => {
            const s = nodeStatus(st, n);
            return (
              <button key={n.key} onClick={() => setOpenKey(n.key)} className="w-full text-left rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: TREE_KINDS[n.kind].c }} />
                  <span className="text-slate-100" style={T.h3}>{n.name}</span>
                  {(n.r || n.x) && <span style={{ fontSize: 10, color: "#fb923c", fontWeight: 800 }}>⚠</span>}
                  {s && <span className="ml-auto" style={{ ...T.meta, color: STATUSMETA[s].c }}>{STATUSMETA[s].label}</span>}
                </div>
                <div className="text-slate-600 mt-0.5 truncate" style={{ fontSize: 11 }}>{treePath(n).map(x => x.name).join(" › ")}</div>
              </button>
            );
          })}
        </div>
      ) : (
        <Card>{branch(TREE.root.kids, 0)}</Card>
      )}
    </>
  );
}

function TreeSheet({ st, node, patch, onClose, onNav, onOpenCard, onAddCard }) {
  const n = node;
  const s = nodeStatus(st, n);
  const t = (st.tree || {})[n.key] || {};
  const cardId = n.lib || (t.card && st.cards[t.card] ? t.card : null);
  const [note, setNote] = useState(t.note || "");
  const km = n.kind ? TREE_KINDS[n.kind] : null;
  const setT = p => patch({ tree: { ...(st.tree || {}), [n.key]: { ...((st.tree || {})[n.key] || {}), ...p } } });
  const setStatus = k => {
    if (cardId) patch({ cards: { ...st.cards, [cardId]: { ...(st.cards[cardId] || {}), status: k || "next" } } });
    else setT({ s: k });
  };
  const legal = legalNote(n);
  const path = treePath(n);
  const sibs = (n.parent?.kids || []).filter(x => x !== n);

  return (
    <Modal title={n.name} onClose={onClose} wide>
      <div className="flex flex-wrap items-center gap-1.5 -mt-1">
        {path.map(p => (
          <button key={p.key} onClick={() => onNav(p.key)} className="text-slate-500 underline-offset-2 hover:underline" style={{ fontSize: 11.5 }}>{p.name} ›</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {km && <span className="rounded-full px-2.5 py-1" style={{ ...T.meta, background: km.c + "1f", color: km.c }}>{km.label}</span>}
        <span className="rounded-full px-2.5 py-1" style={{ ...T.meta, background: "#1e293b", color: "#94a3b8" }}>{TREE_POS(n)}</span>
        {n.gi && <span className="rounded-full px-2.5 py-1" style={{ ...T.meta, background: "#1e3a8a44", color: "#93c5fd" }}>gi only</span>}
        {n.ng && <span className="rounded-full px-2.5 py-1" style={{ ...T.meta, background: "#4c1d9544", color: "#c4b5fd" }}>no-gi</span>}
      </div>
      {legal && <Note tone="amber" title="Legal check">{legal}</Note>}

      {nodeAnim(n) && <AnimPlayer key={nodeAnim(n)} id={nodeAnim(n)} cue={n.lib ? cardState(st, n.lib).cue : null} edits={st.poseEdits?.[nodeAnim(n)]} compact />}

      {n.text && <p className="text-slate-200" style={T.body}>{n.text}</p>}

      {n.kind && (
        <div className="grid grid-cols-4 gap-1.5">
          {[["", "Not yet", "#64748b"], ["next", "Next", STATUSMETA.next.c], ["learning", "Learning", STATUSMETA.learning.c], ["know", "Know", STATUSMETA.know.c]].map(([k, l, c]) => (
            <button key={l} onClick={() => setStatus(k)} className="rounded-lg border py-2.5"
              style={{ ...T.meta, borderColor: s === k ? c : "#1e293b", color: s === k ? c : "#64748b", background: s === k ? c + "1a" : "transparent" }}>{l}</button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <a href={ytSearch(n)} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-700 px-3 py-2.5 text-center" style={{ ...T.h3, color: "#fb7185" }}>YouTube ↗</a>
        {cardId
          ? <Btn tone="blue" onClick={() => onOpenCard(cardId)}>Open the card</Btn>
          : n.kind ? <Btn tone="blue" onClick={() => { const id = onAddCard(n); setT({ card: id, s: undefined }); }}>Add to my library</Btn> : <span />}
      </div>

      {/* family tree: where it comes from, what branches off it */}
      <div className="rounded-2xl border border-slate-800 p-3">
        <div className="text-slate-500 mb-2" style={T.meta}>Family</div>
        <div className="flex flex-col items-center">
          {n.parent && n.parent.key !== "root" && (
            <>
              <button onClick={() => onNav(n.parent.key)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300" style={{ fontSize: 12, fontWeight: 600 }}>{n.parent.name}</button>
              <span style={{ width: 1.5, height: 12, background: "#334155" }} />
            </>
          )}
          <span className="rounded-lg px-3 py-1.5" style={{ fontSize: 12.5, fontWeight: 700, background: (km?.c || "#cbd5e1") + "22", color: km?.c || "#e2e8f0", border: `1px solid ${(km?.c || "#cbd5e1")}66` }}>{n.name}</span>
          {n.kids.length > 0 && (
            <>
              <span style={{ width: 1.5, height: 12, background: "#334155" }} />
              <div className="flex flex-wrap justify-center gap-1.5 pt-2 w-full" style={{ borderTop: "1.5px solid #334155" }}>
                {n.kids.map(k => (
                  <button key={k.key} onClick={() => onNav(k.key)} className="rounded-lg border px-2.5 py-1.5 text-left"
                    style={{ fontSize: 11.5, fontWeight: 600, borderColor: k.kind ? TREE_KINDS[k.kind].c + "55" : "#334155", color: "#cbd5e1" }}>{k.name}</button>
                ))}
              </div>
            </>
          )}
        </div>
        {sibs.length > 0 && (
          <div className="mt-3">
            <div className="text-slate-600 mb-1.5" style={{ fontSize: 11 }}>Same branch</div>
            <div className="flex flex-wrap gap-1.5">
              {sibs.slice(0, 18).map(k => (
                <button key={k.key} onClick={() => onNav(k.key)} className="rounded-full border border-slate-800 px-2.5 py-1 text-slate-400" style={{ fontSize: 11 }}>{k.name}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {n.kind && (
        <Field label="Your notes">
          <textarea value={note} onChange={e => setNote(e.target.value)} onBlur={() => setT({ note })}
            placeholder="Where you saw it, who does it, what to ask about…" className={inputCls} style={{ ...T.small, minHeight: 70 }} />
        </Field>
      )}
    </Modal>
  );
}

/* ═══════════════ POSE EDITOR ═══════════════ */

const EDIT_HANDLES = [
  ["pelvis", "pelvis"], ["haL", "hL"], ["haR", "hR"], ["elL", "EL"], ["elR", "ER"], ["foL", "fL"], ["foR", "fR"], ["knL", "KL"], ["knR", "KR"],
];
const POINT_KEYS = ["pelvis", "EL", "ER", "hL", "hR", "KL", "KR", "fL", "fR"];

function PoseEditor({ st, id, onClose, onSave }) {
  const base = compileMove(id);
  const [work, setWork] = useState(() => JSON.parse(JSON.stringify(st.poseEdits?.[id] || {})));
  const [fi, setFi] = useState(0);
  const [yaw, setYaw] = useState(base.frames[0].yaw);
  const [pitch, setPitch] = useState(base.frames[0].pitch);
  const [who, setWho] = useState("me");
  const [whole, setWhole] = useState(false);
  const [tick, setTick] = useState(0);
  const cv = useRef(null), svg = useRef(null), drag = useRef(null);
  const W = 340, H = 250;

  const cm = useMemo(() => { const c = withEdits(base, work); return { ...c, cloud: base.cloud || moveCloud(base) }; }, [base, work]);
  const fr = fi === "m" ? cm.mistake : cm.frames[fi];
  const cam = useMemo(() => fitCamera(cm, yaw, pitch, W, H), [cm, yaw, pitch]);

  useEffect(() => {
    if (!cv.current || !fr) return;
    RigGL.render(cv.current, rigScene(cm, fr, fr.J.me, fr.J.op, cam, {}));
  }, [cm, fr, cam, tick]);

  if (!fr) return null;
  const canon = w => (work[fi] && work[fi][w]) || fr[w];

  const onDown = (w, key) => e => {
    e.preventDefault();
    const r = svg.current.getBoundingClientRect();
    drag.current = { w, key, x: e.clientX, y: e.clientY, sx: W / r.width, c0: JSON.parse(JSON.stringify(canon(w))) };
    try { svg.current.setPointerCapture(e.pointerId); } catch (err) {}
  };
  const onMove = e => {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.x) * d.sx / cam.s, dy = (e.clientY - d.y) * d.sx / cam.s;
    const delta = V3.sub(V3.mul(cam.ax.R, dx), V3.mul(cam.ax.U, dy));
    const c = { ...d.c0 };
    const keys = whole && d.key === "pelvis" ? POINT_KEYS : [d.key];
    keys.forEach(k => { if (c[k]) c[k] = V3.add(d.c0[k], delta); });
    if (d.key === "pelvis" && c.pelvis && c.pelvis[1] < 4) c.pelvis = [c.pelvis[0], 4, c.pelvis[2]];
    const other = d.w === "me" ? "op" : "me";
    setWork(wk => ({ ...wk, [fi]: { ...(wk[fi] || {}), [d.w]: c, [other]: (wk[fi] && wk[fi][other]) || fr[other] } }));
  };
  const onUp = () => { drag.current = null; };

  const frames = [...cm.steps.map((s, i) => [s, `Frame ${i + 1}`]), ...(cm.mistake ? [["m", "Mistake"]] : [])];
  const handles = [];
  ["me", "op"].forEach(w => {
    const J = fr.J[w];
    if (!J || (who !== "both" && who !== w)) return;
    EDIT_HANDLES.forEach(([j, key]) => {
      const p = project(J[j], cam, false);
      handles.push(
        <circle key={w + j} cx={p[0]} cy={p[1]} r={j === "pelvis" ? 8 : 6.5} onPointerDown={onDown(w, key)}
          fill={w === "me" ? "#3b82f6" : "#e2e8f0"} fillOpacity="0.55" stroke={w === "me" ? "#bfdbfe" : "#0f172a"} strokeWidth="1.6" style={{ cursor: "grab", touchAction: "none" }} />
      );
    });
  });

  return (
    <Modal title="Pose editor" onClose={onClose} wide>
      <p className="text-slate-500 -mt-1" style={T.small}>Drag a dot to move a hand, elbow, foot, knee or the hips. Arms and legs keep their length. Turn the camera to move things in depth.</p>
      <div className="flex gap-1.5 flex-wrap">
        {frames.map(([k, l]) => <Chip key={k} on={fi === k} onClick={() => { setFi(k); const f = k === "m" ? cm.mistake : cm.frames[k]; setYaw(f.yaw); setPitch(f.pitch); }}>{l}</Chip>)}
      </div>
      <div className="rounded-xl overflow-hidden border border-slate-800 relative" style={{ background: "#0b1220" }}>
        <canvas ref={cv} width={W} height={H} style={{ width: "100%", display: "block", aspectRatio: `${W} / ${H}` }} />
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "none" }}>{handles}</svg>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label={`Turn ${Math.round(yaw)}°`}><input type="range" min="-180" max="180" value={yaw} onChange={e => setYaw(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Tilt ${Math.round(pitch)}°`}><input type="range" min="2" max="88" value={pitch} onChange={e => setPitch(Number(e.target.value))} className="w-full" /></Field>
      </div>
      <div className="flex gap-1.5 flex-wrap items-center">
        <span className="text-slate-500" style={T.meta}>Edit</span>
        {[["me", "You"], ["op", "Them"], ["both", "Both"]].map(([k, l]) => <Chip key={k} on={who === k} onClick={() => setWho(k)}>{l}</Chip>)}
        <Chip on={whole} onClick={() => setWhole(w => !w)} c="#fbbf24">Hips move the whole body</Chip>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Btn tone="slate" onClick={() => setWork(wk => { const n = { ...wk }; delete n[fi]; return n; })}>Reset frame</Btn>
        <Btn tone="rose" onClick={() => setWork({})}>Reset all</Btn>
        <Btn tone="blue" onClick={() => { onSave(Object.keys(work).length ? work : null); onClose(); }}>Save</Btn>
      </div>
    </Modal>
  );
}

/* ═══════════════ FILM STORAGE (IndexedDB, stays on this device) ═══════════════ */

const FilmMem = {};
const FilmDB = {
  db: null,
  open() {
    return new Promise((res, rej) => {
      if (this.db) return res(this.db);
      if (typeof indexedDB === "undefined") return rej(new Error("no storage"));
      const r = indexedDB.open("protocol-film", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("films");
      r.onsuccess = () => { this.db = r.result; res(this.db); };
      r.onerror = () => rej(r.error);
    });
  },
  async run(mode, fn) {
    const db = await this.open();
    return new Promise((res, rej) => {
      const tx = db.transaction("films", mode), os = tx.objectStore("films");
      const rq = fn(os);
      tx.oncomplete = () => res(rq && rq.result);
      tx.onerror = () => rej(tx.error);
    });
  },
  put(id, blob) { return this.run("readwrite", os => os.put(blob, id)); },
  get(id) { return this.run("readonly", os => os.get(id)); },
  del(id) { return this.run("readwrite", os => os.delete(id)); },
};
const filmURL = async id => {
  if (FilmMem[id]) return FilmMem[id];
  try { const b = await FilmDB.get(id); if (b) { FilmMem[id] = URL.createObjectURL(b); return FilmMem[id]; } } catch (e) {}
  return null;
};

const POS_COL = { "Standing": "#fbbf24", "Closed guard": "#60a5fa", "Open guard": "#38bdf8", "Half guard": "#22d3ee", "Side control": "#fb7185", "Mount": "#f472b6", "Back": "#a78bfa", "Legs": "#34d399", "Other": "#64748b" };

function ClipPlayer({ clip, film }) {
  const [url, setUrl] = useState(null);
  const [miss, setMiss] = useState(false);
  const v = useRef(null);
  useEffect(() => { let live = true; filmURL(clip.filmId).then(u => { if (!live) return; u ? setUrl(u) : setMiss(true); }); return () => { live = false; }; }, [clip.filmId]);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      {url ? (
        <video ref={v} src={url} playsInline muted controls style={{ width: "100%", display: "block", background: "#000" }}
          onLoadedMetadata={() => { v.current.currentTime = clip.start; }}
          onTimeUpdate={() => { if (v.current && v.current.currentTime >= clip.end) { v.current.currentTime = clip.start; } }} />
      ) : (
        <div className="px-3 py-3 text-slate-500" style={T.small}>{miss ? "The film is not saved on this device. Add it again in the film room to play this clip." : "Loading…"}</div>
      )}
      <div className="px-3 py-2 text-slate-400" style={T.meta}>{film ? film.name : "Film"} · {fmtClock(clip.start)}–{fmtClock(clip.end)}{clip.note ? ` · ${clip.note}` : ""}</div>
    </div>
  );
}

function FilmRoom({ st, patch, cards, onOpenCard }) {
  const [openId, setOpenId] = useState(null);
  const [url, setUrl] = useState(null);
  const [msg, setMsg] = useState("");
  const [draft, setDraft] = useState(null);
  const [clip, setClip] = useState({ start: null, end: null, card: "", note: "" });
  const v = useRef(null);
  const films = st.films || [];
  const film = films.find(f => f.id === openId);
  const setFilm = p => patch({ films: films.map(f => (f.id === openId ? { ...f, ...p } : f)) });

  useEffect(() => {
    if (!openId) { setUrl(null); return; }
    let live = true;
    filmURL(openId).then(u => { if (live) { setUrl(u); if (!u) setMsg("This film is not saved on this device. Pick the file again to watch it."); } });
    return () => { live = false; };
  }, [openId]);

  const add = async e => {
    const f = e.target.files?.[0]; if (!f) return;
    const id = "f" + Date.now();
    FilmMem[id] = URL.createObjectURL(f);
    let saved = true;
    try { await FilmDB.put(id, f); } catch (err) { saved = false; }
    patch({ films: [...films, { id, name: f.name.replace(/\.[^.]+$/, ""), added: iso(new Date()), notes: [], dur: null, saved }] });
    setMsg(saved ? "" : "Your browser would not store the video, so it plays until you close the app. Your notes are kept.");
    setOpenId(id);
    e.target.value = "";
  };
  const relink = async e => {
    const f = e.target.files?.[0]; if (!f || !film) return;
    FilmMem[film.id] = URL.createObjectURL(f);
    try { await FilmDB.put(film.id, f); setFilm({ saved: true }); } catch (err) {}
    setUrl(FilmMem[film.id]); setMsg("");
  };
  const now = () => (v.current ? v.current.currentTime : 0);
  const seek = t => { if (v.current) { v.current.currentTime = t; v.current.play?.().catch?.(() => {}); } };

  if (!film) {
    return (
      <div className="space-y-2">
        {films.length === 0 && <Card><span className="text-slate-500" style={T.small}>No film yet. Add a match video from your phone. It stays on this device, so the app file stays small.</span></Card>}
        {films.map(f => (
          <Card key={f.id} onClick={() => setOpenId(f.id)}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-slate-100" style={T.h3}>{f.name}</span>
              <span className="text-slate-500 shrink-0" style={T.meta}>{(f.notes || []).length} notes</span>
            </div>
            <FilmSummary film={f} small />
          </Card>
        ))}
        <label className="block rounded-xl border border-slate-700 px-4 py-2.5 text-center text-slate-300 cursor-pointer" style={T.h3}>
          Add a match video
          <input type="file" accept="video/*" onChange={add} style={{ display: "none" }} />
        </label>
        {msg && <p className="text-amber-300" style={T.small}>{msg}</p>}
      </div>
    );
  }

  const notes = [...(film.notes || [])].sort((a, b) => a.t - b.t);
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => { setOpenId(null); setMsg(""); }} className="text-slate-400" style={T.meta}>‹ All film</button>
        <span className="text-slate-100 truncate" style={T.h3}>{film.name}</span>
      </div>
      {url ? (
        <video ref={v} src={url} controls playsInline style={{ width: "100%", borderRadius: 12, background: "#000" }}
          onLoadedMetadata={() => { if (!film.dur && v.current) setFilm({ dur: v.current.duration }); }} />
      ) : (
        <label className="block rounded-xl border border-dashed border-slate-700 px-4 py-6 text-center text-slate-400 cursor-pointer" style={T.small}>
          Pick the video file again
          <input type="file" accept="video/*" onChange={relink} style={{ display: "none" }} />
        </label>
      )}
      {msg && <p className="text-amber-300" style={T.small}>{msg}</p>}
      <FilmSummary film={film} />

      {draft ? (
        <div className="rounded-xl border border-slate-700 p-3 space-y-2">
          <div className="text-slate-400" style={T.meta}>Note at {fmtClock(draft.t)}</div>
          <input autoFocus value={draft.text} onChange={e => setDraft({ ...draft, text: e.target.value })} placeholder="One line" className={inputCls} style={T.small} />
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {POSITIONS.map(p => <Chip key={p} on={draft.pos === p} onClick={() => setDraft({ ...draft, pos: draft.pos === p ? "" : p })} c={POS_COL[p] || "#cbd5e1"}>{p}</Chip>)}
          </div>
          <div className="flex gap-2">
            <Chip on={draft.good === true} onClick={() => setDraft({ ...draft, good: draft.good === true ? null : true })} c="#34d399">✓ good</Chip>
            <Chip on={draft.good === false} onClick={() => setDraft({ ...draft, good: draft.good === false ? null : false })} c="#fb7185">✗ bad</Chip>
            <span className="flex-1" />
            <Btn size="sm" tone="slate" onClick={() => setDraft(null)}>Cancel</Btn>
            <Btn size="sm" tone="blue" onClick={() => { setFilm({ notes: [...(film.notes || []), { ...draft, id: Date.now() }] }); setDraft(null); }}>Save</Btn>
          </div>
        </div>
      ) : (
        <Btn tone="blue" full onClick={() => { v.current?.pause?.(); setDraft({ t: now(), text: "", pos: "", good: null }); }}>Add a note here</Btn>
      )}

      <div className="space-y-1">
        {notes.length === 0 && <span className="text-slate-600" style={T.small}>Tap "Add a note" while the video plays. Tag the position so the summary bar fills in.</span>}
        {notes.map(nt => (
          <div key={nt.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: "#0f172a" }}>
            <button onClick={() => seek(nt.t)} className="text-blue-300 shrink-0" style={{ ...T.meta, width: 40 }}>{fmtClock(nt.t)}</button>
            <button onClick={() => seek(nt.t)} className="flex-1 min-w-0 text-left">
              <span className="text-slate-200" style={T.small}>{nt.text || "—"}</span>
              {nt.pos && <span className="ml-1.5" style={{ fontSize: 10.5, fontWeight: 700, color: POS_COL[nt.pos] }}>{nt.pos}</span>}
            </button>
            {nt.good === true && <span className="text-emerald-400 shrink-0">✓</span>}
            {nt.good === false && <span className="text-rose-400 shrink-0">✗</span>}
            <button onClick={() => setFilm({ notes: film.notes.filter(x => x.id !== nt.id) })} className="text-slate-700 shrink-0">×</button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 p-3 space-y-2">
        <div className="text-slate-400" style={T.meta}>Send to card</div>
        <div className="grid grid-cols-2 gap-2">
          <Btn size="sm" tone="slate" onClick={() => setClip(c => ({ ...c, start: now() }))}>Start {clip.start != null ? fmtClock(clip.start) : "—"}</Btn>
          <Btn size="sm" tone="slate" onClick={() => setClip(c => ({ ...c, end: now() }))}>End {clip.end != null ? fmtClock(clip.end) : "—"}</Btn>
        </div>
        <select value={clip.card} onChange={e => setClip(c => ({ ...c, card: e.target.value }))} className={inputCls} style={T.small}>
          <option value="">Which card?</option>
          {cards.map(c => <option key={c.id} value={c.id}>{c.n}</option>)}
        </select>
        <input value={clip.note} onChange={e => setClip(c => ({ ...c, note: e.target.value }))} placeholder="What the clip shows (optional)" className={inputCls} style={T.small} />
        <Btn tone="blue" full onClick={() => {
          if (clip.start == null || clip.end == null || clip.end <= clip.start || !clip.card) { setMsg("Mark a start, then a later end, and pick a card."); return; }
          const c = st.cards[clip.card] || {};
          patch({ cards: { ...st.cards, [clip.card]: { ...c, clips: [...(c.clips || []), { filmId: film.id, start: clip.start, end: clip.end, note: clip.note }] } } });
          setMsg(""); setClip({ start: null, end: null, card: "", note: "" }); onOpenCard(clip.card);
        }}>Attach as "your clip"</Btn>
      </div>
      <button onClick={() => { if (confirm("Delete this film and its notes?")) { FilmDB.del(film.id).catch(() => {}); patch({ films: films.filter(f => f.id !== film.id) }); setOpenId(null); } }}
        className="text-rose-400 w-full text-center" style={T.meta}>Delete film</button>
    </Card>
  );
}

/* how much of the match you spent in each position, from the position tags */
function FilmSummary({ film, small }) {
  const tagged = [...(film.notes || [])].filter(n => n.pos).sort((a, b) => a.t - b.t);
  if (!tagged.length) return small ? null : <div className="text-slate-600" style={{ fontSize: 11 }}>Match summary appears once notes have a position tag.</div>;
  const end = Math.max(film.dur || 0, tagged[tagged.length - 1].t + 10);
  const tot = {};
  tagged.forEach((n, i) => { const to = i + 1 < tagged.length ? tagged[i + 1].t : end; tot[n.pos] = (tot[n.pos] || 0) + Math.max(0, to - n.t); });
  const sum = Object.values(tot).reduce((a, b) => a + b, 0) || 1;
  const segs = Object.entries(tot).sort((a, b) => b[1] - a[1]);
  return (
    <div className={small ? "mt-2" : ""}>
      <div className="flex rounded-full overflow-hidden" style={{ height: small ? 6 : 10 }}>
        {segs.map(([p, s]) => <div key={p} title={p} style={{ width: `${(s / sum) * 100}%`, background: POS_COL[p] || "#64748b" }} />)}
      </div>
      {!small && (
        <div className="flex gap-x-3 gap-y-1 mt-1.5 flex-wrap">
          {segs.map(([p, s]) => <span key={p} style={{ fontSize: 11, fontWeight: 600, color: POS_COL[p] || "#94a3b8" }}>{p} {Math.round((s / sum) * 100)}%</span>)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════ WEEK EDITING ═══════════════ */

const KIND_OPTIONS = ["gi", "nogi", "open", "wrestling", "strength", "drill", "skills", "work", "rest"];

function DayEditor({ st, patch, dayK, onClose }) {
  const wk = st.week || defaultWeek;
  const list = wk[dayK] || [];
  const setList = l => patch({ week: { ...wk, [dayK]: l } });
  const up = (i, p) => setList(list.map((b, j) => (j === i ? { ...b, ...p } : b)));
  return (
    <Modal title={DAYFULL[dayK]} onClose={onClose}>
      <p className="text-slate-500 -mt-1" style={T.small}>Changes here repeat every week. To change just one day, long-press the block on the week instead.</p>
      {list.length === 0 && <span className="text-slate-500" style={T.small}>Rest day.</span>}
      {list.map((b, i) => (
        <div key={i} className="rounded-xl border border-slate-800 p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <select value={b.k} onChange={e => up(i, { k: e.target.value, plan: e.target.value === "strength" ? (b.plan || "A") : undefined })} className={inputCls} style={T.small}>
              {KIND_OPTIONS.map(k => <option key={k} value={k}>{BLOCKMETA[k].label}</option>)}
            </select>
            <input type="time" value={b.t === "—" ? "" : b.t} onChange={e => up(i, { t: e.target.value || "—" })} className={inputCls} style={T.small} />
          </div>
          <input value={b.n} onChange={e => up(i, { n: e.target.value })} className={inputCls} style={T.small} />
          <div className="flex items-center gap-2">
            {b.k === "strength" && ["A", "B"].map(p => <Chip key={p} on={b.plan === p} onClick={() => up(i, { plan: p })}>Strength {p}</Chip>)}
            {b.k === "wrestling" && <Chip on={!!b.seasonOnly} onClick={() => up(i, { seasonOnly: !b.seasonOnly })} c="#fb923c">season only</Chip>}
            <span className="flex-1" />
            <button onClick={() => setList(list.filter((_, j) => j !== i))} className="text-rose-400" style={T.meta}>Remove</button>
          </div>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-2">
        <Btn tone="slate" onClick={() => setList([...list, { k: "gi", t: "19:00", n: "New class", dur: 90 }])}>Add a block</Btn>
        <Btn tone="slate" onClick={() => patch({ week: { ...wk, [dayK]: defaultWeek[dayK] } })}>Reset this day</Btn>
      </div>
    </Modal>
  );
}

/* skip once, move once, or swap with another block */
function BlockMenu({ st, patch, dayK, index, onClose }) {
  const now = new Date();
  const wk = st.week || defaultWeek;
  const b = (wk[dayK] || [])[index];
  const [target, setTarget] = useState("");
  const [swap, setSwap] = useState("");
  if (!b) return null;
  let next = now; for (let i = 0; i < 7; i++) { const d = addDays(now, i); if (dayKey(d) === dayK) { next = d; break; } }
  const key = iso(next);
  const blocks = blocksFor(st, next);
  const live = blocks.find(x => x.n === b.n && x.k === b.k && !x.movedIn);
  const id = live?.id;
  const skipped = id && st.skipped?.[id];
  const others = [];
  Object.entries(wk).forEach(([dk, l]) => (l || []).forEach((x, i) => { if (!(dk === dayK && i === index)) others.push([dk, i, x]); }));
  return (
    <Modal title={b.n} onClose={onClose}>
      <p className="text-slate-500 -mt-1" style={T.small}>{DAYFULL[dayK]} {fmtTime(b.t)} · next one is {fmtShort(next)}</p>
      <Btn tone={skipped ? "emerald" : "slate"} full onClick={() => { if (!id) return; const s = { ...(st.skipped || {}) }; skipped ? delete s[id] : (s[id] = true); patch({ skipped: s }); onClose(); }}>
        {skipped ? "Un-skip" : `Skip it once (${fmtShort(next)})`}
      </Btn>
      <Field label="Move it once">
        <div className="flex gap-2">
          <select value={target} onChange={e => setTarget(e.target.value)} className={inputCls} style={T.small}>
            <option value="">Pick a day</option>
            {Array.from({ length: 8 }).map((_, i) => { const d = addDays(now, i); const k = iso(d); return k === key ? null : <option key={k} value={k}>{DAYFULL[dayKey(d)]} {fmtShort(d)}</option>; })}
          </select>
          <Btn tone="blue" onClick={() => {
            if (!target || !id) return;
            const { id: _x, warn, skipped: _s, ...plain } = live;
            patch({ moved: { ...(st.moved || {}), [target]: [...((st.moved || {})[target] || []), plain] }, skipped: { ...(st.skipped || {}), [id]: true } });
            onClose();
          }}>Move</Btn>
        </div>
      </Field>
      <Field label="Swap it with" hint="Swaps the two blocks in your week from now on.">
        <div className="flex gap-2">
          <select value={swap} onChange={e => setSwap(e.target.value)} className={inputCls} style={T.small}>
            <option value="">Pick a block</option>
            {others.map(([dk, i, x]) => <option key={dk + i} value={`${dk}:${i}`}>{DAYFULL[dk]} · {x.n}</option>)}
          </select>
          <Btn tone="blue" onClick={() => {
            if (!swap) return;
            const [dk, i] = swap.split(":"); const j = Number(i);
            const n = Object.fromEntries(Object.entries(wk).map(([k, l]) => [k, [...(l || [])]]));
            const a = n[dayK][index], c = n[dk][j];
            n[dayK][index] = c; n[dk][j] = a;
            patch({ week: n }); onClose();
          }}>Swap</Btn>
        </div>
      </Field>
    </Modal>
  );
}

/* one day's log, from the calendar */
function DayLog({ st, k, onClose }) {
  const d = st.days[k] || {};
  const ses = (st.sessions || []).filter(s => s.date === k);
  const lifts = (st.liftLog || []).filter(l => l.date === k);
  const rows = [
    ["Weight", d.weight], ["Bed / wake", d.sleepIn && d.sleepOut ? `${d.sleepIn} → ${d.sleepOut}` : null],
    ["Readiness", d.readiness ? [d.readiness.sleep, d.readiness.sore, d.readiness.energy].map(x => x || "–").join(" · ") : null],
    ["Calories", d.cal], ["Protein", d.protein], ["Water", d.water ? `${d.water} bottles` : null], ["Steps", d.steps], ["Pain", d.pain],
    ["Meals", d.meals ? ["b", "l", "d"].filter(x => d.meals[x]).map(x => ({ b: "breakfast", l: "lunch", d: "dinner" })[x]).join(", ") || "none" : null],
  ].filter(([, v]) => v != null && v !== "");
  return (
    <Modal title={fmtShort(parseISO(k))} onClose={onClose}>
      {rows.length === 0 && ses.length === 0 && lifts.length === 0 && <span className="text-slate-500" style={T.small}>Nothing logged that day.</span>}
      {rows.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {rows.map(([l, v]) => <div key={l}><div className="text-slate-500" style={T.meta}>{l}</div><div className="text-slate-200" style={T.small}>{v}</div></div>)}
        </div>
      )}
      {ses.map(s => (
        <div key={s.id} className="rounded-xl border border-slate-800 p-3">
          <div style={{ ...T.meta, color: BLOCKMETA[s.type]?.c || "#94a3b8" }}>{BLOCKMETA[s.type]?.label || s.type}{s.rounds ? ` · ${s.rounds} rounds` : ""}</div>
          {s.techLabel && <div className="text-slate-200 mt-1" style={T.h3}>{s.techLabel}</div>}
          {s.worked && <div className="text-emerald-300 mt-1" style={T.small}>✓ {s.worked}</div>}
          {s.caught && <div className="text-rose-300 mt-0.5" style={T.small}>✗ {s.caught}{s.caughtPos ? ` (${s.caughtPos})` : ""}</div>}
        </div>
      ))}
      {lifts.map((l, i) => (
        <div key={i} className="rounded-xl border border-slate-800 p-3">
          <div style={{ ...T.meta, color: C.strength }}>Strength {l.plan}</div>
          <div className="text-slate-400 mt-1" style={T.small}>{(l.sets || []).length ? `${l.sets.length} sets logged` : "Logged"}</div>
        </div>
      ))}
    </Modal>
  );
}

/* match log for a past event; each "drill next" line can become a card */
function MatchLog({ ev, onChange, onMakeCard }) {
  const ms = ev.matches || [];
  const up = (i, p) => onChange({ ...ev, matches: ms.map((m, j) => (j === i ? { ...m, ...p } : m)) });
  return (
    <div className="space-y-2">
      <div className="text-slate-400" style={T.meta}>Match log</div>
      {ms.map((m, i) => (
        <div key={i} className="rounded-xl border border-slate-800 p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input value={m.opp} onChange={e => up(i, { opp: e.target.value })} placeholder="Opponent" className={inputCls} style={T.small} />
            <select value={m.result} onChange={e => up(i, { result: e.target.value })} className={inputCls} style={T.small}>
              <option value="">Result</option><option value="win">Win</option><option value="loss">Loss</option>
            </select>
          </div>
          <input value={m.how} onChange={e => up(i, { how: e.target.value })} placeholder="How it ended (points 2–0, armbar…)" className={inputCls} style={T.small} />
          <div className="flex gap-2">
            <input value={m.drill} onChange={e => up(i, { drill: e.target.value })} placeholder="What to drill next" className={inputCls} style={T.small} />
            {m.drill?.trim() && !m.card && <Btn size="sm" tone="blue" onClick={() => up(i, { card: onMakeCard(m.drill.trim()) })}>Make card</Btn>}
            {m.card && <span className="text-emerald-400 shrink-0 self-center" style={T.meta}>card ✓</span>}
          </div>
        </div>
      ))}
      <Btn tone="slate" full onClick={() => onChange({ ...ev, matches: [...ms, { opp: "", result: "", how: "", drill: "" }] })}>Add a match</Btn>
    </div>
  );
}
