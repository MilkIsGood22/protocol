
/* ═══════════════ RIG VIEW ═══════════════ */
/* The picture (WebGL) plus the diagram marks on top (SVG), and the player that runs a move. */

const RIG_W = 340, RIG_H = 240;
const rigDpr = () => (typeof window === "undefined" ? 1 : Math.min(3, Math.max(1, (window.devicePixelRatio || 1) * 1.15)));

function rigScene(cm, fr, Jme, Jop, cam, o) {
  o = o || {};
  const hot = o.hot || { me: [], op: [] };
  const anyHot = o.dim !== false && (hot.me.length + hot.op.length > 0);
  const figs = [];
  if (Jop) figs.push({ parts: figureParts(Jop, "op", { gi: cm.gi, gray: fr.op && fr.op.gray, green: fr.op && fr.op.green }), hot: hot.op, dim: anyHot });
  figs.push({ parts: [...figureParts(Jme, "me", { gi: cm.gi, gray: fr.me.gray, green: fr.me.green }), ...propParts(fr.props, Jme)], hot: [...hot.me, "prop"], dim: anyHot });
  if (fr.ghost && o.ghost !== false) figs.push({ parts: figureParts(solveCanon(fr.ghost), "op", { gi: cm.gi }), ghost: true });
  return { W: cam.W, H: cam.H, dpr: o.dpr || rigDpr(), cam, mirror: !!o.mirror, figs, mat: o.mat, outline: o.outline };
}

const rigCurve = (a, b, bow) => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
  return `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${(mx - dy * bow).toFixed(1)},${(my + dx * bow).toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
};

function RigMarks({ marks, J, prevJ, cam, mirror, labels, uid }) {
  if (!marks || !marks.length) return null;
  const get = makeGetter(J), getPrev = prevJ ? makeGetter(prevJ) : null;
  const P = (ref, o) => { let p = get(ref); if (o) p = V3.add(p, o); return project(p, cam, mirror); };
  const txt = (x, y, s, fill, key) => {
    const end = x > cam.W - 78;
    const tx = Math.min(cam.W - 4, Math.max(4, end ? x - 9 : x + 9)), ty = Math.min(cam.H - 5, Math.max(11, y - 8));
    return (
      <text key={key} x={tx} y={ty} textAnchor={end ? "end" : "start"} fill={fill}
        stroke="#0b1220" strokeWidth="3" paintOrder="stroke" style={{ fontSize: 10.5, fontWeight: 700 }}>{s}</text>
    );
  };
  const out = [];
  marks.forEach((m, i) => {
    if (m.t === "grip" || m.t === "their") {
      const p = P(m.j, m.o), mine = m.t === "grip";
      out.push(<circle key={i} cx={p[0]} cy={p[1]} r={mine ? 9 : 8.5} fill="none" stroke={mine ? "#fbbf24" : "#cbd5e1"} strokeWidth={mine ? 2.4 : 1.8} strokeDasharray={mine ? undefined : "3.5 3"} />);
      if (labels && m.label) out.push(txt(p[0], p[1], m.label, mine ? "#fbbf24" : "#cbd5e1", "t" + i));
    } else if (m.t === "attack") {
      const p = P(m.j, m.o);
      out.push(<circle key={i} className="rig-pulse" cx={p[0]} cy={p[1]} r={m.r || 11} fill="none" stroke="#f43f5e" strokeWidth="3" />);
      if (labels && m.label) out.push(txt(p[0], p[1], m.label, "#fb7185", "t" + i));
    } else if (m.t === "weight") {
      const p = P(m.j, m.o);
      out.push(<polyline key={i} points={`${p[0] - 6},${p[1] - 9} ${p[0]},${p[1] - 2} ${p[0] + 6},${p[1] - 9}`} fill="none" stroke="#f8fafc" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />);
      out.push(<polyline key={"b" + i} points={`${p[0] - 6},${p[1] - 16} ${p[0]},${p[1] - 9} ${p[0] + 6},${p[1] - 16}`} fill="none" stroke="#f8fafc" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />);
    } else if (m.t === "mat") {
      const g = get(m.j), p = project([g[0] + (m.o ? m.o[0] : 0), 0, g[2] + (m.o ? m.o[2] : 0)], cam, mirror);
      out.push(<ellipse key={i} cx={p[0]} cy={p[1]} rx="5" ry={Math.max(2, 5 * Math.sin(cam.pitch * Math.PI / 180))} fill="#f8fafc" opacity="0.95" />);
    } else if (m.t === "balance" && m.from) {
      const a = P(m.from), b = P(m.to);
      out.push(<line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#f8fafc" strokeWidth="1.6" strokeDasharray="4 4" opacity="0.75" />);
    } else if (m.t === "balance") {
      const who = m.who || "op", j = J[who];
      if (!j) return;
      const a = project(V3.add(j.pelvis, V3.mul(j.up, -14)), cam, mirror), b = project(V3.add(j.neck, V3.mul(j.up, 34)), cam, mirror);
      out.push(<line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#f8fafc" strokeWidth="1.6" strokeDasharray="4 4" opacity="0.75" />);
    } else if (m.t === "push") {
      const p = P(m.j, m.o), q = project(V3.add(V3.add(get(m.j), m.o || [0, 0, 0]), m.d), cam, mirror);
      out.push(<line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="#34d399" strokeWidth="3.2" strokeLinecap="round" markerEnd={`url(#ah${uid})`} />);
      if (labels && m.label) out.push(txt(q[0], q[1], m.label, "#34d399", "t" + i));
    } else if (m.t === "arrow") {
      let a, b;
      if (m.j) { if (!getPrev) return; a = project(V3.add(getPrev(m.j), m.o || [0, 0, 0]), cam, mirror); b = P(m.j, m.o); }
      else { a = P(m.from); b = P(m.to); }
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 9) return;
      const bow = (m.bow == null ? 0.22 : m.bow) * (mirror ? -1 : 1);
      out.push(<path key={i} d={rigCurve(a, b, bow)} fill="none" stroke="#34d399" strokeWidth={m.thin ? 2.2 : 4} strokeLinecap="round" markerEnd={`url(#ah${uid})`} opacity="0.96" />);
      if (labels && m.label) out.push(txt(b[0], b[1], m.label, "#34d399", "t" + i));
    } else if (m.t === "label") {
      const p = P(m.j, m.o);
      out.push(txt(p[0] - 9, p[1] + 8, m.label, m.col || "#e2e8f0", "t" + i));
    }
  });
  return <g>{out}</g>;
}

let rigUid = 0;

/* One still picture of a frame. `still` = no marks. */
function RigStill({ cm, fr, yaw, pitch, mirror, labels = true, marks = true, W = RIG_W, H = RIG_H, dim = true, who, mat, maxScale, className, style }) {
  const cv = useRef(null);
  const uid = useMemo(() => ++rigUid, []);
  const y = yaw == null ? fr.yaw : yaw, p = pitch == null ? fr.pitch : pitch;
  const cam = useMemo(() => fitCamera(cm, y, p, W, H, maxScale), [cm, y, p, W, H, maxScale]);
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const sc = rigScene(cm, fr, fr.J.me, fr.J.op, cam, { mirror, hot: dim ? fr.hot : null, mat });
    setOk(RigGL.render(cv.current, sc));
  }, [cm, fr, cam, mirror, dim, mat]);
  return (
    <div className={className} style={{ position: "relative", background: "#0b1220", ...style }}>
      <canvas ref={cv} width={W} height={H} style={{ width: "100%", display: "block", aspectRatio: `${W} / ${H}` }} />
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <marker id={`ah${uid}`} viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse">
            <path d="M0,0.8 L9.5,5 L0,9.2 z" fill="#34d399" />
          </marker>
        </defs>
        {marks && <RigMarks marks={fr.marks} J={fr.J} prevJ={fr.prevJ} cam={cam} mirror={mirror} labels={labels} uid={uid} />}
        {who && [["me", "YOU", "#93c5fd"], ["op", "THEM", "#cbd5e1"]].map(([k, l, c]) => {
          if (!fr.J[k]) return null;
          const q = project(V3.add(fr.J[k].head, [0, 15, 0]), cam, mirror);
          return <text key={k} x={q[0]} y={Math.max(10, q[1])} textAnchor="middle" fill={c} stroke="#0b1220" strokeWidth="3" paintOrder="stroke" style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em" }}>{l}</text>;
        })}
        {!ok && <text x={W / 2} y={H / 2} textAnchor="middle" fill="#64748b" style={{ fontSize: 11 }}>3D view is not available in this browser</text>}
      </svg>
    </div>
  );
}

const RIG_HOLD = 1500, RIG_GLIDE = 700, RIG_LAST = 3000;
const easeIO = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function AnimPlayer({ id, cue, edits, compact, auto = true }) {
  const base = compileMove(id);
  const cm = useMemo(() => withEdits(base, edits), [base, edits]);
  const N = cm.frames.length;
  const uid = useMemo(() => ++rigUid, []);
  const cv = useRef(null), box = useRef(null);
  const [frame, setFrame] = useState(0);
  const [gliding, setGliding] = useState(false);
  const [playing, setPlaying] = useState(auto);
  const [half, setHalf] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [labels, setLabels] = useState(true);
  const [mode, setMode] = useState("play");          // play | mistake | quiz | reveal
  const [view, setView] = useState("angle");         // angle | side | top | free
  const [camTick, setCamTick] = useState(0);
  const [seen, setSeen] = useState(true);
  const [ok, setOk] = useState(true);
  const free = useRef({ yaw: 0, pitch: 0 });
  const st = useRef({ t0: 0, raf: 0, timer: 0, drag: null });

  const lastStep = cm.steps[cm.steps.length - 1];
  const quizStop = cm.steps.length > 1 ? cm.steps[cm.steps.length - 2] : lastStep;
  const stepNo = cm.steps.filter(s => s <= frame).length;
  const fr = cm.frames[Math.min(frame, N - 1)];

  const camFor = useCallback((yaw, pitch) => {
    if (view === "side") return fitCamera(cm, VIEWS.side.yaw + (yaw > 90 || yaw < -90 ? 180 : 0), VIEWS.side.pitch, RIG_W, RIG_H);
    if (view === "top") return fitCamera(cm, 0, VIEWS.top.pitch, RIG_W, RIG_H);
    if (view === "free") return fitCamera(cm, free.current.yaw, free.current.pitch, RIG_W, RIG_H);
    return fitCamera(cm, yaw, pitch, RIG_W, RIG_H);
  }, [cm, view]);

  const draw = useCallback((i, t) => {
    const a = cm.frames[i], b = cm.frames[Math.min(i + 1, N - 1)];
    const wrap = i === N - 1 && cm.loop ? cm.frames[0] : null;
    const nx = wrap || b;
    let Jme, Jop, yaw = a.yaw, pitch = a.pitch, src = a, hot = a.hot;
    if (t > 0 && nx !== a) {
      const e = easeIO(t);
      Jme = solveCanon(lerpCanon(a.me, nx.me, e));
      Jop = a.op ? solveCanon(lerpCanon(a.op, nx.op, e)) : null;
      yaw = a.yaw + (nx.yaw - a.yaw) * e; pitch = a.pitch + (nx.pitch - a.pitch) * e;
      src = e < 0.5 ? a : nx; hot = nx.hot;
    } else { Jme = a.J.me; Jop = a.J.op; }
    const cam = camFor(yaw, pitch);
    const sc = rigScene(cm, { ...src, ghost: t > 0 ? null : a.ghost }, Jme, Jop, cam, { mirror, hot });
    return RigGL.render(cv.current, sc);
  }, [cm, N, camFor, mirror]);

  /* pause when scrolled off screen */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !box.current) return;
    const io = new IntersectionObserver(es => setSeen(es[0].isIntersecting), { threshold: 0.15 });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  /* the loop: hold, glide to the next frame, repeat */
  useEffect(() => {
    const S = st.current;
    setOk(draw(frame, 0));
    if (!playing || !seen || mode === "mistake") return;
    const sp = half ? 2 : 1;
    const isLast = frame === lastStep;
    if (mode === "quiz" && frame === quizStop) return;
    if (mode === "reveal" && isLast) return;
    if (isLast && !cm.loop && N === 1) return;
    const hold = fr.via ? 0 : (isLast && !cm.loop ? RIG_LAST : RIG_HOLD) * sp;
    const next = frame === N - 1 ? 0 : frame + 1;
    const cut = (frame === N - 1 && !cm.loop) || cm.frames[next].cut;
    S.timer = setTimeout(() => {
      if (cut) { setFrame(next); return; }
      setGliding(true);
      S.t0 = performance.now();
      const dur = RIG_GLIDE * sp * (fr.via || cm.frames[next].via ? 0.75 : 1);
      const step = now => {
        const t = (now - S.t0) / dur;
        if (t >= 1) { setGliding(false); setFrame(next); return; }
        draw(frame, t);
        S.raf = requestAnimationFrame(step);
      };
      S.raf = requestAnimationFrame(step);
    }, hold);
    return () => { clearTimeout(S.timer); cancelAnimationFrame(S.raf); setGliding(false); };
  }, [frame, playing, seen, half, mode, draw, camTick]);

  const stepBy = n => {
    setPlaying(false);
    const i = cm.steps.indexOf(cm.steps.filter(s => s <= frame).pop());
    const k = Math.max(0, Math.min(cm.steps.length - 1, i + n));
    setFrame(cm.steps[k]);
  };

  /* drag to turn the camera, tap to pause */
  const down = e => {
    const cur = camFor(fr.yaw, fr.pitch);
    st.current.drag = { x: e.clientX, y: e.clientY, yaw: cur.yaw, pitch: cur.pitch, moved: false, id: e.pointerId };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  };
  const move = e => {
    const d = st.current.drag;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 7) return;
    if (!d.moved) { d.moved = true; setPlaying(false); if (view !== "free") { free.current = { yaw: d.yaw, pitch: d.pitch }; setView("free"); } }
    free.current = { yaw: d.yaw - dx * 0.55 * (mirror ? -1 : 1), pitch: Math.max(4, Math.min(88, d.pitch + dy * 0.45)) };
    const cam = fitCamera(cm, free.current.yaw, free.current.pitch, RIG_W, RIG_H);
    RigGL.render(cv.current, rigScene(cm, fr, fr.J.me, fr.J.op, cam, { mirror, hot: fr.hot }));
  };
  const up = () => {
    const d = st.current.drag;
    st.current.drag = null;
    if (!d) return;
    if (d.moved) setCamTick(t => t + 1); else setPlaying(p => !p);
  };

  const chip = (on, label, fn, key) => (
    <button key={key || label} onClick={fn} className="rounded-lg border px-2.5 py-1.5"
      style={{ ...T.meta, borderColor: on ? "#60a5fa" : "#1e293b", color: on ? "#93c5fd" : "#94a3b8", background: on ? "#60a5fa14" : "transparent" }}>
      {label}
    </button>
  );

  if (mode === "mistake" && cm.mistake) {
    const right = cm.frames[cm.mistake.from];
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#9f1239" }}>
            <RigStill cm={cm} fr={cm.mistake} mirror={mirror} labels={labels} W={200} H={190} dim={false} />
            <div className="px-2.5 py-1.5 flex items-center gap-1.5" style={{ background: "#4c0519" }}>
              <span style={{ color: "#fda4af", fontSize: 13, fontWeight: 800 }}>✗</span>
              <span style={{ color: "#fda4af", fontSize: 11, fontWeight: 600 }}>wrong</span>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#047857" }}>
            <RigStill cm={cm} fr={right} yaw={cm.mistake.yaw} pitch={cm.mistake.pitch} mirror={mirror} labels={false} marks={false} W={200} H={190} dim={false} />
            <div className="px-2.5 py-1.5 flex items-center gap-1.5" style={{ background: "#022c22" }}>
              <span style={{ color: "#6ee7b7", fontSize: 13, fontWeight: 800 }}>✓</span>
              <span style={{ color: "#6ee7b7", fontSize: 11, fontWeight: 600 }}>right</span>
            </div>
          </div>
        </div>
        <p className="text-rose-300" style={T.small}>{cm.mistake.cap}</p>
        <div className="flex gap-1.5 flex-wrap">
          {chip(true, "Back to the move", () => setMode("play"))}
          {chip(mirror, "Mirror", () => setMirror(m => !m))}
        </div>
      </div>
    );
  }

  const cam = camFor(fr.yaw, fr.pitch);
  const showCue = cue && frame === lastStep && !gliding && mode !== "quiz";
  const quizAsk = mode === "quiz" && frame === quizStop && !gliding;

  return (
    <div className="space-y-2" ref={box}>
      <div className="rounded-xl overflow-hidden border border-slate-800 relative select-none"
        style={{ touchAction: "pan-y", background: "#0b1220", cursor: "grab" }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { st.current.drag = null; }}>
        <canvas ref={cv} width={RIG_W} height={RIG_H} style={{ width: "100%", display: "block", aspectRatio: `${RIG_W} / ${RIG_H}` }} />
        <svg viewBox={`0 0 ${RIG_W} ${RIG_H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <defs>
            <marker id={`ah${uid}`} viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse">
              <path d="M0,0.8 L9.5,5 L0,9.2 z" fill="#34d399" />
            </marker>
          </defs>
          {!gliding && !st.current.drag && <RigMarks marks={fr.marks} J={fr.J} prevJ={fr.prevJ} cam={cam} mirror={mirror} labels={labels} uid={uid} />}
          {frame === 0 && !gliding && labels && [["me", "YOU", "#93c5fd"], ["op", "THEM", "#cbd5e1"]].map(([k, l, c]) => {
            if (!fr.J[k] || cm.single) return null;
            const q = project(V3.add(fr.J[k].head, [0, 15, 0]), cam, mirror);
            return <text key={k} x={q[0]} y={Math.max(10, q[1])} textAnchor="middle" fill={c} stroke="#0b1220" strokeWidth="3" paintOrder="stroke" style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em" }}>{l}</text>;
          })}
          {!ok && <text x={RIG_W / 2} y={RIG_H / 2} textAnchor="middle" fill="#64748b" style={{ fontSize: 11 }}>3D view is not available in this browser</text>}
        </svg>
        {showCue && (
          <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-7 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(11,18,32,.96), rgba(11,18,32,0))" }}>
            <div className="text-blue-200" style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.015em" }}>{cue}</div>
          </div>
        )}
        {fr.tag && !gliding && (
          <div className="absolute top-2 left-2 rounded-md px-2 py-0.5" style={{ background: "rgba(2,6,23,.8)", color: "#fcd34d", fontSize: 10.5, fontWeight: 700 }}>{fr.tag}</div>
        )}
        {!playing && (
          <div className="absolute top-2 right-2 rounded-md px-2 py-0.5" style={{ background: "rgba(2,6,23,.75)", color: "#94a3b8", fontSize: 10, fontWeight: 700 }}>paused</div>
        )}
      </div>

      <div className="flex gap-1">
        {cm.steps.map((s, k) => (
          <button key={s} onClick={() => { setPlaying(false); setFrame(s); }} className="flex-1 rounded-full" aria-label={`Frame ${k + 1}`}
            style={{ height: 5, background: k + 1 === stepNo ? "#60a5fa" : k + 1 < stepNo ? "#334155" : "#1e293b" }} />
        ))}
      </div>

      {quizAsk ? (
        <div className="flex items-center justify-between gap-2" style={{ minHeight: 40 }}>
          <span className="text-amber-300" style={T.small}>What comes next?</span>
          <button onClick={() => { setMode("reveal"); setPlaying(true); }} className="rounded-lg px-3 py-1.5" style={{ ...T.meta, background: "#f59e0b", color: "#1c1917" }}>Show me</button>
        </div>
      ) : (
        <p className="text-slate-300" style={{ ...T.small, minHeight: compact ? 0 : 40 }}>
          <span className="text-slate-600" style={T.meta}>{stepNo}/{cm.steps.length} </span>
          {mode === "quiz" ? <span className="text-slate-600">captions hidden</span> : fr.cap}
        </p>
      )}

      <div className="flex gap-1.5 flex-wrap">
        {chip(false, "‹", () => stepBy(-1), "prev")}
        {chip(false, playing ? "❙❙" : "▶", () => setPlaying(p => !p), "pp")}
        {chip(false, "›", () => stepBy(1), "next")}
        {!compact && chip(half, "½ speed", () => setHalf(h => !h))}
        {chip(mirror, "Mirror", () => setMirror(m => !m))}
        {!compact && chip(labels, "Labels", () => setLabels(l => !l))}
        {cm.mistake && chip(false, "Mistake", () => setMode("mistake"))}
        {!cm.single && !compact && chip(mode === "quiz" || mode === "reveal", "Quiz", () => { setMode(m => (m === "play" ? "quiz" : "play")); setFrame(0); setPlaying(true); })}
      </div>
      {!compact && <div className="flex gap-1.5 items-center flex-wrap">
        <span className="text-slate-600" style={T.meta}>View</span>
        {chip(view === "angle", "Angle", () => { setView("angle"); setCamTick(t => t + 1); })}
        {chip(view === "side", "Side", () => { setView("side"); setCamTick(t => t + 1); })}
        {chip(view === "top", "Top", () => { setView("top"); setCamTick(t => t + 1); })}
        <span className="text-slate-600" style={{ fontSize: 11 }}>or drag the picture to turn it</span>
      </div>}
    </div>
  );
}
