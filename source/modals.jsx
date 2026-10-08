
/* ═══════════════ SESSION LOG MODAL ═══════════════ */

function SessionLog({ st, today, onSave, onClose, onNewCard }) {
  const [type, setType] = useState("nogi");
  const [tech, setTech] = useState("");
  const [techNew, setTechNew] = useState("");
  const [rounds, setRounds] = useState("");
  const [worked, setWorked] = useState("");
  const [caught, setCaught] = useState("");
  const [cpos, setCpos] = useState("");
  const [energy, setEnergy] = useState(null);
  const [focus, setFocus] = useState({ grip: false, takedown: false, strength: false });

  const commit = () => {
    let techId = tech;
    if (tech === "__new" && techNew.trim()) techId = onNewCard(techNew.trim());
    onSave({
      id: Date.now(), date: today, type, tech: techId === "__new" ? null : techId,
      techLabel: tech === "__new" ? techNew.trim() : (library.find(l => l.id === tech)?.n || null),
      rounds: Number(rounds) || 0, worked: worked.trim(), caught: caught.trim(), caughtPos: cpos || null,
      energy, focus,
    });
    onClose();
  };

  return (
    <Modal title="Log session" onClose={onClose}>
      <Field label="Class type">
        <div className="grid grid-cols-4 gap-1.5">
          {["gi", "nogi", "open", "wrestling"].map(k => (
            <button key={k} onClick={() => setType(k)} className="rounded-lg border py-2.5"
              style={{ borderColor: type === k ? BLOCKMETA[k].c : "#1e293b", background: type === k ? BLOCKMETA[k].c + "22" : "transparent", color: type === k ? BLOCKMETA[k].c : "#64748b", ...T.meta }}>
              {BLOCKMETA[k].label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Technique taught">
        <select value={tech} onChange={e => setTech(e.target.value)} className={inputCls} style={T.small}>
          <option value="">—</option>
          {library.map(l => <option key={l.id} value={l.id}>{l.n}</option>)}
          <option value="__new">+ Something new…</option>
        </select>
        {tech === "__new" && (
          <input value={techNew} onChange={e => setTechNew(e.target.value)} placeholder="Name of the move"
            className={inputCls + " mt-2"} style={T.small} />
        )}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Rounds rolled">
          <input type="number" inputMode="numeric" value={rounds} onChange={e => setRounds(e.target.value)} className={inputCls} style={T.small} />
        </Field>
        <Field label="Position you got caught in">
          <select value={cpos} onChange={e => setCpos(e.target.value)} className={inputCls} style={T.small}>
            <option value="">—</option>
            {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
      </div>

      <Field label="What worked">
        <input value={worked} onChange={e => setWorked(e.target.value)} placeholder="One line" className={inputCls} style={T.small} />
      </Field>
      <Field label="What caught me">
        <input value={caught} onChange={e => setCaught(e.target.value)} placeholder="One line" className={inputCls} style={T.small} />
      </Field>

      <Field label="Energy">
        <Scale value={energy} onChange={setEnergy} />
      </Field>

      <Field label="Focus check">
        <div className="space-y-1">
          {Object.entries(FOCUS).map(([k, v]) => (
            <Toggle key={k} on={focus[k]} onChange={b => setFocus(f => ({ ...f, [k]: b }))} label={`Worked on ${v.label.toLowerCase()}`} />
          ))}
        </div>
      </Field>

      <Btn tone="blue" full onClick={commit}>Save session</Btn>
    </Modal>
  );
}

/* ═══════════════ ROUND TIMER ═══════════════ */

function RoundTimer({ onClose }) {
  const [roundLen, setRoundLen] = useState(300);
  const [restLen, setRestLen] = useState(60);
  const [total, setTotal] = useState(5);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("round");
  const [round, setRound] = useState(1);
  const [left, setLeft] = useState(300);
  const ac = useRef(null);

  const beep = useCallback((freq = 880, ms = 450) => {
    try {
      if (!ac.current) ac.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = ac.current;
      if (ctx.state === "suspended") ctx.resume();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq; o.type = "square";
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + ms / 1000 + 0.02);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!running) return;
    const h = setInterval(() => {
      setLeft(v => {
        if (v > 1) return v - 1;
        if (phase === "round") {
          beep(660, 700);
          if (round >= total) { setRunning(false); setPhase("done"); return 0; }
          setPhase("rest"); return restLen;
        }
        beep(990, 700); setPhase("round"); setRound(r => r + 1); return roundLen;
      });
    }, 1000);
    return () => clearInterval(h);
  }, [running, phase, round, total, restLen, roundLen, beep]);

  const reset = () => { setRunning(false); setPhase("round"); setRound(1); setLeft(roundLen); };
  const mm = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const bg = phase === "rest" ? "#065f46" : phase === "done" ? "#1e293b" : "#1e3a8a";

  return (
    <Modal title="Round timer" onClose={onClose}>
      <div className="rounded-2xl p-7 text-center" style={{ background: bg }}>
        <div className="text-white" style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>{mm(left)}</div>
        <div className="text-white mt-2 opacity-80" style={T.h3}>
          {phase === "done" ? "Done" : `${phase === "rest" ? "Rest" : "Round"} ${round} of ${total}`}
        </div>
      </div>
      <div className="flex gap-2">
        <Btn tone={running ? "slate" : "blue"} full onClick={() => { beep(880, 120); setRunning(r => !r); }}>{running ? "Pause" : "Start"}</Btn>
        <Btn tone="slate" full onClick={reset}>Reset</Btn>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Btn tone="slate" size="sm" onClick={() => { setRoundLen(300); setRestLen(60); setTotal(5); setLeft(300); setPhase("round"); setRound(1); setRunning(false); }}>5 min × 5, 1 min rest</Btn>
        <Btn tone="slate" size="sm" onClick={() => { setRoundLen(120); setRestLen(30); setTotal(3); setLeft(120); setPhase("round"); setRound(1); setRunning(false); }}>2 min wrestling × 3</Btn>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Round (sec)"><input type="number" value={roundLen} onChange={e => { const v = Number(e.target.value) || 0; setRoundLen(v); if (!running && phase === "round") setLeft(v); }} className={inputCls} style={T.small} /></Field>
        <Field label="Rest (sec)"><input type="number" value={restLen} onChange={e => setRestLen(Number(e.target.value) || 0)} className={inputCls} style={T.small} /></Field>
        <Field label="Rounds"><input type="number" value={total} onChange={e => setTotal(Number(e.target.value) || 1)} className={inputCls} style={T.small} /></Field>
      </div>
    </Modal>
  );
}

/* ═══════════════ CARD DETAIL ═══════════════ */

function CardDetail({ st, id, today, onClose, onPatch, onAddQuestion, onOpen, onEditPose }) {
  const c = cardState(st, id);
  const [note, setNote] = useState(c.note || "");
  const [counter, setCounter] = useState("");
  const [edit, setEdit] = useState(null);
  const d = dueDate(st, id, today);
  const over = daysBetween(d, today);

  const patch = p => onPatch(id, p);
  const startEdit = () => setEdit({ steps: (c.steps || []).join("\n"), cue: c.cue || "", mistake: c.mistake || "", start: c.start || "", link: c.link || "", linkName: c.linkName || "", n: c.n });
  const saveEdit = () => {
    patch({ n: edit.n.trim() || c.n, steps: edit.steps.split("\n").map(s => s.trim()).filter(Boolean), cue: edit.cue.trim(), mistake: edit.mistake.trim(), start: edit.start.trim(), link: edit.link.trim(), linkName: edit.linkName.trim() || (edit.link.trim() ? "Reference video" : "") });
    setEdit(null);
  };

  if (edit) {
    return (
      <Modal title="Edit card" onClose={() => setEdit(null)} wide>
        <Field label="Name"><input value={edit.n} onChange={e => setEdit({ ...edit, n: e.target.value })} className={inputCls} style={T.small} /></Field>
        <Field label="Start"><input value={edit.start} onChange={e => setEdit({ ...edit, start: e.target.value })} className={inputCls} style={T.small} /></Field>
        <Field label="Steps" hint="One step per line, three to six short lines.">
          <textarea value={edit.steps} onChange={e => setEdit({ ...edit, steps: e.target.value })} className={inputCls} style={{ ...T.small, minHeight: 150 }} />
        </Field>
        <Field label="The one cue"><input value={edit.cue} onChange={e => setEdit({ ...edit, cue: e.target.value })} className={inputCls} style={T.small} /></Field>
        <Field label="The common mistake"><textarea value={edit.mistake} onChange={e => setEdit({ ...edit, mistake: e.target.value })} className={inputCls} style={{ ...T.small, minHeight: 70 }} /></Field>
        <Field label="Reference video link" hint="Swap in the video your professor recommends.">
          <input value={edit.link} onChange={e => setEdit({ ...edit, link: e.target.value })} placeholder="https://…" className={inputCls} style={T.small} />
        </Field>
        <Field label="Video title"><input value={edit.linkName} onChange={e => setEdit({ ...edit, linkName: e.target.value })} className={inputCls} style={T.small} /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Btn tone="slate" onClick={() => setEdit(null)}>Cancel</Btn>
          <Btn tone="blue" onClick={saveEdit}>Save</Btn>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={c.n} onClose={onClose} wide>
      {cardAnim(st, id) && (
        <div className="space-y-1.5">
          <AnimPlayer id={cardAnim(st, id)} cue={c.cue} edits={st.poseEdits?.[cardAnim(st, id)]} />
          <div className="flex items-center justify-between gap-2">
            {st.poseEdits?.[cardAnim(st, id)] ? <span className="text-amber-300" style={T.meta}>Pose edited by you</span> : <span />}
            <button onClick={() => onEditPose(cardAnim(st, id))} className="text-slate-400 underline" style={T.meta}>Edit the pose</button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full px-2.5 py-1" style={{ ...T.meta, background: "#1e293b", color: "#cbd5e1" }}>{c.pos}</span>
        <span className="rounded-full px-2.5 py-1" style={{ ...T.meta, background: "#1e293b", color: "#94a3b8" }}>{c.group}</span>
        {c.gi && <span className="rounded-full px-2.5 py-1" style={{ ...T.meta, background: "#1e3a8a44", color: "#93c5fd" }}>gi only</span>}
        {c.legal && <span className="rounded-full px-2.5 py-1" style={{ ...T.meta, background: "#7c2d1244", color: "#fdba74" }}>check it is legal in your division</span>}
        {c.focus && <span className="rounded-full px-2.5 py-1" style={{ ...T.meta, background: FOCUS[c.focus].c + "22", color: FOCUS[c.focus].c }}>{FOCUS[c.focus].label}</span>}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {Object.entries(STATUSMETA).map(([k, v]) => (
          <button key={k} onClick={() => patch({ status: k })} className="rounded-lg border py-2.5"
            style={{ borderColor: c.status === k ? v.c : "#1e293b", background: c.status === k ? v.c + "1e" : "transparent", color: c.status === k ? v.c : "#64748b", ...T.meta }}>
            {v.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
        <div className="text-slate-500" style={T.meta}>Next review</div>
        <div className="text-slate-200 mt-0.5" style={T.h3}>
          {over > 0 ? `${over} day${over === 1 ? "" : "s"} overdue` : over === 0 ? "Today" : `In ${-over} day${over === -1 ? "" : "s"}`}
          <span className="text-slate-500" style={T.meta}> · gap {INTERVALS[c.step]}d</span>
        </div>
      </div>

      <div>
        <div className="text-slate-400 mb-1.5" style={T.meta}>Start</div>
        <p className="text-slate-300" style={T.small}>{c.start}</p>
      </div>

      <div>
        <div className="text-slate-400 mb-2" style={T.meta}>Steps</div>
        <ol className="space-y-2">
          {(c.steps || []).map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center" style={{ fontSize: 11.5, fontWeight: 700, color: "#60a5fa", border: "1.5px solid #60a5fa66" }}>{i + 1}</span>
              <span className="text-slate-200" style={T.small}>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl p-4" style={{ background: "#1e3a8a22", border: "1px solid #3b82f655" }}>
        <div className="text-blue-400" style={T.meta}>The one cue</div>
        <div className="text-blue-200 mt-1" style={{ fontSize: 19, fontWeight: 680, letterSpacing: "-0.015em" }}>{c.cue}</div>
      </div>

      <Note title="The common mistake" tone="rose">{c.mistake}</Note>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => patch({ drilled: (c.drilled || 0) + 1 })} className="rounded-xl border border-slate-700 px-3 py-3 text-left">
          <div className="text-slate-500" style={T.meta}>Times drilled</div>
          <div className="text-slate-100" style={T.h2}>{c.drilled || 0}</div>
        </button>
        <button onClick={() => patch({ hit: (c.hit || 0) + 1 })} className="rounded-xl border border-slate-700 px-3 py-3 text-left">
          <div className="text-slate-500" style={T.meta}>Times hit live</div>
          <div className="text-emerald-300" style={T.h2}>{c.hit || 0}</div>
        </button>
      </div>

      {c.connects?.length > 0 && (
        <Field label="Connects to">
          <div className="flex flex-wrap gap-1.5">
            {c.connects.map(x => {
              const l = library.find(y => y.id === x);
              if (!l) return null;
              return <button key={x} onClick={() => onOpen(x)} className="rounded-full border border-slate-700 px-3 py-1.5 text-slate-200" style={T.meta}>{l.n}</button>;
            })}
          </div>
        </Field>
      )}

      <Field label="Counters you've hit" hint="One line each time someone shuts it down, and what they did.">
        <div className="space-y-1.5 mb-2">
          {(c.counters || []).map((x, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-slate-800 px-3 py-2">
              <span className="text-slate-300 flex-1" style={T.small}>{x}</span>
              <button onClick={() => patch({ counters: c.counters.filter((_, j) => j !== i) })} className="text-slate-600 shrink-0">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={counter} onChange={e => setCounter(e.target.value)} placeholder="What stopped it" className={inputCls} style={T.small} />
          <Btn tone="slate" onClick={() => { if (counter.trim()) { patch({ counters: [...(c.counters || []), counter.trim()] }); setCounter(""); } }}>Add</Btn>
        </div>
      </Field>

      <Field label="Reference video">
        {c.link ? (
          <a href={c.link} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5">
            <span className="block text-slate-100" style={T.small}>{c.linkName || "Reference video"}</span>
            <span className="block text-rose-400" style={T.meta}>Open ↗</span>
          </a>
        ) : (
          <a href={yt(`bjj ${c.n} tutorial`)} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5">
            <span className="block text-slate-100" style={T.small}>Search YouTube for {c.n}</span>
            <span className="block text-rose-400" style={T.meta}>Open ↗</span>
          </a>
        )}
        <button onClick={startEdit} className="text-slate-500 underline mt-1.5" style={T.meta}>Swap link</button>
      </Field>

      <Field label="Your clip" hint={c.clips.length ? null : "Mark a start and end in the film room and send it here."}>
        <div className="space-y-2">
          {c.clips.map((cl, i) => (
            <div key={i}>
              <ClipPlayer clip={cl} film={(st.films || []).find(f => f.id === cl.filmId)} />
              <button onClick={() => patch({ clips: c.clips.filter((_, j) => j !== i) })} className="text-slate-600 mt-1" style={T.meta}>Remove clip</button>
            </div>
          ))}
        </div>
      </Field>

      {c.answers.length > 0 && (
        <Field label="Answers from your professor">
          <div className="space-y-1.5">
            {c.answers.map((a, i) => (
              <div key={i} className="rounded-lg border border-slate-800 px-3 py-2">
                <div className="text-slate-500" style={{ fontSize: 11 }}>{a.q}</div>
                <div className="text-slate-200" style={T.small}>{a.a}</div>
              </div>
            ))}
          </div>
        </Field>
      )}

      <Field label="Your notes">
        <textarea value={note} onChange={e => setNote(e.target.value)} onBlur={() => patch({ note })}
          placeholder="What your professor said, what worked, what to ask about…"
          className={inputCls} style={{ ...T.small, minHeight: 90, resize: "vertical" }} />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Btn tone="slate" onClick={startEdit}>Edit steps and cue</Btn>
        <Btn tone="slate" onClick={() => { const q = prompt("Your question", `${c.n}: `); if (q && q.trim()) onAddQuestion(q.trim(), id); }}>Ask your professor</Btn>
      </div>
    </Modal>
  );
}

/* ═══════════════ STRENGTH SESSION ═══════════════ */

function StrengthSession({ st, plan, today, onClose, onSave }) {
  const S = strength[plan];
  const bar = st.settings.bar || 5;
  const last = [...(st.liftLog || [])].reverse().find(l => l.plan === plan);
  const [data, setData] = useState(() => {
    const o = {};
    S.ex.forEach(e => { o[e.id] = [0, 1, 2].map(i => ({ w: last?.ex?.[e.id]?.[i]?.w ?? "", r: "" })); });
    return o;
  });
  const [rest, setRest] = useState(0);

  useEffect(() => {
    if (rest <= 0) return;
    const h = setTimeout(() => setRest(r => r - 1), 1000);
    return () => clearTimeout(h);
  }, [rest]);

  const loads = useMemo(() => {
    const out = new Set([bar]);
    PLATES.forEach(p => out.add(bar + p));
    return [...out].sort((a, b) => a - b);
  }, [bar]);

  const setCell = (ex, i, k, v) => setData(d => ({ ...d, [ex]: d[ex].map((s, j) => j === i ? { ...s, [k]: v } : s) }));

  const inj = Object.entries(st.settings.injuries || {}).filter(([, v]) => v).map(([n]) => n);
  const subbed = id => {
    if (!inj.length) return false;
    if (inj.includes("knee") && ["lunge", "rdl"].includes(id)) return true;
    return false;
  };

  return (
    <Modal title={S.name} onClose={onClose} wide>
      {inj.length > 0 && <Note title="Injury mode is on" tone="rose">Lower-body work is swapped for upper-body. Do not push through that joint.</Note>}
      {rest > 0 && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: "#1e3a8a" }}>
          <span className="text-white" style={{ fontSize: 24, fontWeight: 700 }}>{Math.floor(rest / 60)}:{String(rest % 60).padStart(2, "0")}</span>
          <span className="text-blue-200 flex-1" style={T.meta}>rest</span>
          <button onClick={() => setRest(0)} className="text-blue-200" style={T.meta}>skip</button>
        </div>
      )}
      {S.ex.map(e => {
        const lastEx = last?.ex?.[e.id];
        const allTen = data[e.id].every(s => Number(s.r) >= 10);
        const needsBar = e.needsBar && !st.settings.pullupBar;
        const sub = needsBar ? S.ex.find(x => x.id === e.sub) || strength.A.ex.find(x => x.id === e.sub) : null;
        return (
          <div key={e.id} className="rounded-2xl border border-slate-800 p-3.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-slate-100" style={T.h3}>{needsBar && sub ? sub.n : e.n}</span>
              <span className="text-slate-500 shrink-0" style={T.meta}>{e.sets} × {e.reps}</span>
            </div>
            {needsBar && <div className="text-amber-400 mt-1" style={{ fontSize: 11 }}>No pull-up bar yet — doing {sub?.n.toLowerCase()} instead</div>}
            {subbed(e.id) && <div className="text-rose-400 mt-1" style={{ fontSize: 11 }}>Swapped out for injury mode</div>}
            {lastEx && <div className="text-slate-600 mt-1" style={{ fontSize: 11 }}>Last time: {lastEx.map(s => `${s.w || "—"}×${s.r || "—"}`).join("  ")}</div>}
            <div className="mt-2.5 space-y-1.5">
              {data[e.id].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-slate-600 w-4 shrink-0" style={T.meta}>{i + 1}</span>
                  {e.bar ? (
                    <select value={s.w} onChange={ev => setCell(e.id, i, "w", ev.target.value)} className="flex-1 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 px-2 py-2" style={T.small}>
                      <option value="">lb</option>
                      {loads.map(l => <option key={l} value={l}>{l} lb</option>)}
                    </select>
                  ) : <div className="flex-1 text-slate-600 px-2" style={T.small}>bodyweight</div>}
                  <input type="number" inputMode="numeric" value={s.r} onChange={ev => setCell(e.id, i, "r", ev.target.value)}
                    placeholder={e.grip ? "sec" : "reps"} className="w-20 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 px-2 py-2" style={T.small} />
                  <button onClick={() => setRest(90)} className="shrink-0 h-9 w-9 rounded-lg border border-slate-700 text-slate-400" style={T.meta}>✓</button>
                </div>
              ))}
            </div>
            {allTen && e.bar && (
              <div className="mt-2 rounded-lg px-3 py-2" style={{ background: "#064e3b55" }}>
                <span className="text-emerald-300" style={T.meta}>All three sets at 10 — add the next plate next time.</span>
              </div>
            )}
            {allTen && !e.bar && harderVersions[e.id] && (
              <div className="mt-2 text-slate-400" style={{ fontSize: 11 }}>Harder versions: {harderVersions[e.id].join(" · ")}</div>
            )}
          </div>
        );
      })}
      <Btn tone="blue" full onClick={() => { onSave({ date: today, plan, ex: data }); onClose(); }}>Save session</Btn>
    </Modal>
  );
}
