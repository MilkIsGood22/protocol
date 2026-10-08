
/* ═══════════════ SETTINGS ═══════════════ */

function Settings({ st, onClose, patch }) {
  const s = st.settings;
  const set = (k, v) => patch({ settings: { ...s, [k]: v } });
  return (
    <Modal title="Settings" onClose={onClose}>
      <Field label="Bar weight (lb)" hint="Set once. The plate helper builds every load from this.">
        <input type="number" value={s.bar} onChange={e => set("bar", Number(e.target.value) || 0)} className={inputCls} style={T.small} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Calories target"><input type="number" value={s.cal} onChange={e => set("cal", Number(e.target.value) || 0)} className={inputCls} style={T.small} /></Field>
        <Field label="Protein target (g)"><input type="number" value={s.protein} onChange={e => set("protein", Number(e.target.value) || 0)} className={inputCls} style={T.small} /></Field>
      </div>
      <Field label="Water target (16.9 oz bottles)">
        <input type="number" value={s.water} onChange={e => set("water", Number(e.target.value) || 0)} className={inputCls} style={T.small} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Weight class (lb)" hint="Drawn as a dashed line on the weight graph.">
          <input type="number" inputMode="decimal" value={s.weightClass ?? ""} onChange={e => set("weightClass", e.target.value === "" ? null : Number(e.target.value))} className={inputCls} style={T.small} />
        </Field>
        <Field label="Weight note"><input value={s.weightNote || ""} onChange={e => set("weightNote", e.target.value)} placeholder="e.g. not cutting" className={inputCls} style={T.small} /></Field>
      </div>
      <div className="border-t border-slate-800 pt-4 space-y-2">
        <Toggle on={s.wrestling} onChange={v => set("wrestling", v)} label="Wrestling season (practice Monday to Thursday)" />
        {s.wrestling && (
          <Field label="Season starts">
            <input type="date" value={s.wrestlingStart || ""} onChange={e => set("wrestlingStart", e.target.value || null)} className={inputCls} style={T.small} />
          </Field>
        )}
        <Toggle on={s.pullupBar} onChange={v => set("pullupBar", v)} label="Pull-up bar has arrived" />
      </div>
      <div className="border-t border-slate-800 pt-4">
        <div className="text-slate-400 mb-2" style={T.meta}>Injury mode</div>
        <div className="space-y-2">
          {Object.entries(injuryPresets).map(([k, v]) => (
            <Toggle key={k} on={!!s.injuries?.[k]} onChange={b => {
              const t = iso(new Date());
              const log = [...(st.injuryLog || [])];
              if (b) log.push({ k, start: t, cleared: null });
              else { const o = [...log].reverse().find(x => x.k === k && !x.cleared); if (o) o.cleared = t; }
              patch({ injuryLog: log.map(x => ({ ...x })), settings: { ...s, injuries: { ...(s.injuries || {}), [k]: b } } });
            }} label={v.n} />
          ))}
        </div>
      </div>
      <div className="border-t border-slate-800 pt-4">
        <Btn tone="slate" full onClick={() => { if (confirm("Put the week back to the default schedule?")) patch({ week: null }); }}>Reset the week to default</Btn>
      </div>
    </Modal>
  );
}

/* ═══════════════ EVENT EDITOR ═══════════════ */

function EventEditor({ ev, onClose, onSave, onDelete, onMakeCard }) {
  const [f, setF] = useState(ev || { id: Date.now(), name: "", date: "", loc: "", wc: "", allowance: "", format: "", deadline: "", division: "", prep: false, matches: [] });
  const up = (k, v) => setF(x => ({ ...x, [k]: v }));
  const today = iso(new Date());
  const past = f.date && f.date < today;
  const away = f.date ? daysBetween(today, f.date) : null;
  return (
    <Modal title={ev ? "Event" : "New event"} onClose={onClose}>
      <Field label="Name"><input value={f.name} onChange={e => up("name", e.target.value)} className={inputCls} style={T.small} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date"><input type="date" value={f.date} onChange={e => up("date", e.target.value)} className={inputCls} style={T.small} /></Field>
        <Field label="Location"><input value={f.loc} onChange={e => up("loc", e.target.value)} className={inputCls} style={T.small} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Weight class"><input value={f.wc} onChange={e => up("wc", e.target.value)} className={inputCls} style={T.small} /></Field>
        <Field label="Allowance"><input value={f.allowance} onChange={e => up("allowance", e.target.value)} placeholder="e.g. 0.9 lb over" className={inputCls} style={T.small} /></Field>
      </div>
      <Field label="Format"><input value={f.format} onChange={e => up("format", e.target.value)} placeholder="e.g. double elimination, 2 matches guaranteed" className={inputCls} style={T.small} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Registration deadline"><input type="date" value={f.deadline} onChange={e => up("deadline", e.target.value)} className={inputCls} style={T.small} /></Field>
        <Field label="Division"><input value={f.division} onChange={e => up("division", e.target.value)} className={inputCls} style={T.small} /></Field>
      </div>
      {!past && (
        <div className="rounded-xl border border-slate-800 p-3">
          <Toggle on={!!f.prep} onChange={v => up("prep", v)} label="Use the prep plan for this event" />
          <div className="text-slate-500 mt-1" style={T.small}>
            Build week from 13 to 7 days out (hard rounds from the positions you will see), taper in the last 6 days (half the strength sets, light rounds, no new moves), rest and pack the kit the day before.
            {away != null && away >= 0 && ` This event is ${away} day${away === 1 ? "" : "s"} away.`}
          </div>
        </div>
      )}
      {past ? <MatchLog ev={f} onChange={setF} onMakeCard={onMakeCard} /> : <Note title="Before you pay" tone="amber"><Bullets items={beforeYouPay} tone="amber" /></Note>}
      <div className="flex gap-2">
        <Btn tone="blue" full onClick={() => { onSave(f); onClose(); }}>Save</Btn>
        {ev && <Btn tone="rose" onClick={() => { onDelete(ev.id); onClose(); }}>Delete</Btn>}
      </div>
    </Modal>
  );
}

/* ═══════════════ MAIN ═══════════════ */

const TABS = [
  { k: "today", l: "Today" }, { k: "train", l: "Train" }, { k: "library", l: "Library" },
  { k: "body", l: "Body" }, { k: "review", l: "Review" },
];

export default function Protocol() {
  const [st, setSt] = useState(load);
  const [tab, setTab] = useState("today");
  const [modal, setModal] = useState(null);
  const [cardOpen, setCardOpen] = useState(null);
  const [viewDay, setViewDay] = useState(0);
  const [libView, setLibView] = useState("cards");
  const [filter, setFilter] = useState("all");
  const [treeKey, setTreeKey] = useState(null);
  const [poseFor, setPoseFor] = useState(null);
  const [answer, setAnswer] = useState({});
  const [drillAnim, setDrillAnim] = useState(null);
  const blockPress = useRef(null);

  const now = new Date();
  const today = iso(now);
  const d = st.days[today] || {};

  const patch = useCallback(p => setSt(s => { const n = { ...s, ...p }; save(n); return n; }), []);
  const patchDay = useCallback((key, p) => setSt(s => {
    const n = { ...s, days: { ...s.days, [key]: { ...(s.days[key] || {}), ...p } } };
    save(n); return n;
  }), []);
  const patchCard = useCallback((id, p) => setSt(s => {
    const n = { ...s, cards: { ...s.cards, [id]: { ...(s.cards[id] || {}), ...p } } };
    save(n); return n;
  }), []);

  const mod = pickMoveOfDay(st, today);
  const movId = st.mow || mod;
  const ev = nextEvent(st, today);
  const evDays = ev ? daysBetween(today, ev.date) : null;
  const injuries = Object.entries(st.settings.injuries || {}).filter(([, v]) => v);
  const blocks = blocksFor(st, now);
  const todaySessions = (st.sessions || []).filter(x => x.date === today);

  const toggleBlock = id => patchDay(today, { blocks: { ...(d.blocks || {}), [id]: !(d.blocks || {})[id] } });

  const addQuestion = (q, cardId) => patch({ questions: [...(st.questions || []), { id: Date.now(), q, cardId, done: false, answer: "" }] });

  const newCardFromName = (name, extra) => {
    const id = "x" + Date.now() + Math.floor(Math.random() * 1000);
    patchCard(id, { custom: true, n: name, status: "learning", pos: "Other", group: "Other", steps: [], cue: "", mistake: "", ...(extra || {}) });
    return id;
  };
  const cardFromTree = n => newCardFromName(n.name, {
    status: "next", pos: TREE_POS(n), group: TREE_KINDS[n.kind]?.label || "Other", start: "", steps: n.text ? [n.text] : [],
    link: ytSearch(n), linkName: `YouTube: ${n.name}`, treeKey: n.key, legal: !!(n.r || n.x), anim: n.anim || null,
  });
  const cards = allCards(st);
  const hasClass = blocks.some(b => CLASS_KINDS.includes(b.k) && !b.skipped);
  const openQs = (st.questions || []).filter(q => !q.done);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(st, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `protocol-${today}.json`;
    a.click();
    patch({ lastExport: today });
  };
  const importData = e => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { const p = JSON.parse(r.result); setSt({ ...BLANK, ...p }); save({ ...BLANK, ...p }); } catch (err) { alert("That file could not be read."); } };
    r.readAsText(f);
  };

  /* ── TODAY ── */
  const Today = () => {
    const todayBlocks = blocks;
    const label = todayBlocks.filter(b => ["gi", "nogi", "open", "wrestling"].includes(b.k)).map(b => `${BLOCKMETA[b.k].label} ${fmtTime(b.t)}`).join(", ");
    const r = d.readiness || {};
    const rAvg = [r.sleep, r.sore, r.energy].filter(Boolean).length === 3 ? (r.sleep + r.sore + r.energy) / 3 : null;
    const low = rAvg !== null && rAvg <= 2.4;
    const card = cardState(st, movId);
    const tomorrow = nextClassLine(st, now);

    return (
      <>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-slate-100" style={T.h1}>{DAYFULL[dayKey(now)]}</h1>
            <p className="text-slate-500 mt-0.5" style={T.small}>{fmtShort(now)}{label ? ` · ${label}` : " · no class"}</p>
          </div>
          <button onClick={() => setModal("settings")} className="shrink-0 h-10 w-10 rounded-full border border-slate-700 text-slate-400" aria-label="Settings">⚙</button>
        </div>

        {ev && (
          <button onClick={() => { setTab("review"); }} className="w-full rounded-2xl border px-4 py-3 flex items-center gap-3 text-left"
            style={{ borderColor: "#a78bfa66", background: "#a78bfa14" }}>
            <span className="text-violet-300 shrink-0" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{evDays}</span>
            <span className="min-w-0">
              <span className="block text-violet-200" style={T.h3}>{evDays === 0 ? "Today" : evDays === 1 ? "day to" : "days to"} {ev.name}</span>
              <span className="block text-slate-500 truncate" style={T.meta}>{ev.loc}{ev.division ? ` · ${ev.division}` : ""}</span>
            </span>
          </button>
        )}

        {ev && !ev.prep && evDays <= 14 && evDays >= 1 && (
          <div className="rounded-2xl border border-slate-800 px-4 py-3 flex items-center gap-3">
            <span className="text-slate-400 flex-1" style={T.small}>Want the prep plan? {evDays <= 6 ? "Taper now" : "Build week, then taper"}, rest the day before.</span>
            <Btn size="sm" tone="slate" onClick={() => patch({ events: st.events.map(e => e.id === ev.id ? { ...e, prep: true } : e) })}>Use it</Btn>
          </div>
        )}

        {injuries.length > 0 && (
          <Note title={`Injury mode: ${injuries.map(([k]) => injuryPresets[k].n).join(", ")}`} tone="rose">
            <Bullets items={injuries.flatMap(([k]) => injuryPresets[k].rules)} tone="rose" />
          </Note>
        )}

        <Head sub="Before school.">Morning</Head>
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Weight (lb)" hint={(() => { const y = st.days[iso(addDays(now, -1))]?.weight; return y ? `yesterday ${y}` : null; })()}>
              <input type="number" inputMode="decimal" step="0.1" value={d.weight ?? ""} onChange={e => patchDay(today, { weight: e.target.value === "" ? null : Number(e.target.value) })} className={inputCls} style={T.small} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Bed"><input type="time" value={d.sleepIn || ""} onChange={e => patchDay(today, { sleepIn: e.target.value })} className={inputCls} style={T.small} /></Field>
              <Field label="Wake"><input type="time" value={d.sleepOut || ""} onChange={e => patchDay(today, { sleepOut: e.target.value })} className={inputCls} style={T.small} /></Field>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[["sleep", "Sleep quality"], ["sore", "Soreness (5 = fresh)"], ["energy", "Energy"]].map(([k, l]) => (
              <Field key={k} label={l}>
                <Scale value={r[k] || null} onChange={v => patchDay(today, { readiness: { ...r, [k]: v } })} />
              </Field>
            ))}
          </div>
          {low && <div className="mt-3 rounded-lg px-3 py-2" style={{ background: "#78350f44" }}>
            <span className="text-amber-300" style={T.meta}>Readiness is low — the hard block is tagged "go light". Nothing is cancelled for you.</span>
          </div>}
        </Card>

        <Head>Today</Head>
        <div className="space-y-2">
          {todayBlocks.length === 0 && <Card><span className="text-slate-500" style={T.small}>Nothing scheduled. Rest day.</span></Card>}
          {todayBlocks.map(b => {
            const m = BLOCKMETA[b.k] || BLOCKMETA.rest;
            const on = !!(d.blocks || {})[b.id];
            const hard = ["gi", "nogi", "wrestling", "strength"].includes(b.k);
            if (b.skipped) {
              return (
                <Card key={b.id} className="flex items-center gap-3" style={{ opacity: 0.55 }}>
                  <span className="text-slate-500 line-through flex-1" style={T.h3}>{b.n}</span>
                  <button onClick={() => { const s = { ...(st.skipped || {}) }; delete s[b.id]; patch({ skipped: s }); }} className="text-slate-400 underline shrink-0" style={T.meta}>skipped · undo</button>
                </Card>
              );
            }
            return (
              <Card key={b.id} accent={m.c} className="flex items-center gap-3">
                <button onClick={() => toggleBlock(b.id)} className="shrink-0 rounded-lg border flex items-center justify-center"
                  style={{ width: 30, height: 30, borderColor: on ? m.c : "#334155", background: on ? m.c : "transparent", color: "#020617", fontWeight: 800 }}>
                  {on ? "✓" : ""}
                </button>
                <div className="min-w-0 flex-1" onClick={() => b.k === "strength" ? setModal("strength:" + b.plan) : b.k === "drill" ? setModal("drill") : null}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ ...T.meta, color: m.c }}>{m.label}</span>
                    {b.t !== "—" && <span className="text-slate-500" style={T.meta}>{fmtTime(b.t)}</span>}
                    {b.optional && <span className="text-slate-600" style={T.meta}>optional</span>}
                    {b.movedIn && <span className="text-slate-600" style={T.meta}>moved here</span>}
                    {low && hard && <span className="rounded px-1.5" style={{ ...T.meta, background: "#78350f66", color: "#fcd34d" }}>go light</span>}
                  </div>
                  <div className="text-slate-100 mt-0.5" style={T.h3}>{b.n}</div>
                  {b.warn && <div className="mt-0.5" style={{ fontSize: 11.5, color: "#fdba74" }}>{b.warn}</div>}
                  {b.note && <div className="text-slate-500 mt-0.5" style={{ fontSize: 11.5 }}>{b.note}</div>}
                </div>
                {(b.k === "strength" || b.k === "drill") && <span className="text-slate-600 shrink-0">›</span>}
              </Card>
            );
          })}
        </div>

        {hasClass && openQs.length > 0 && (
          <>
            <Head sub="Class today. Tick one when you have the answer.">Ask your professor</Head>
            <Card className="space-y-2">
              {openQs.map(q => (
                <div key={q.id}>
                  <div className="flex items-start gap-2.5">
                    <button onClick={() => setAnswer(a => ({ ...a, [q.id]: a[q.id] == null ? "" : null }))}
                      className="shrink-0 rounded border mt-0.5" style={{ width: 18, height: 18, borderColor: answer[q.id] != null ? "#34d399" : "#334155" }} />
                    <span className="text-slate-300 flex-1" style={T.small}>{q.q}</span>
                  </div>
                  {answer[q.id] != null && (
                    <div className="flex gap-2 mt-1.5 ml-7">
                      <input autoFocus value={answer[q.id]} onChange={e => setAnswer(a => ({ ...a, [q.id]: e.target.value }))} placeholder="What did they say?" className={inputCls} style={T.small} />
                      <Btn tone="blue" size="sm" onClick={() => {
                        const txt = (answer[q.id] || "").trim();
                        const qs = st.questions.map(x => x.id === q.id ? { ...x, done: true, answer: txt, answered: today } : x);
                        const p = { questions: qs };
                        if (q.cardId && txt) { const c0 = st.cards[q.cardId] || {}; p.cards = { ...st.cards, [q.cardId]: { ...c0, answers: [...(c0.answers || []), { q: q.q, a: txt, date: today }] } }; }
                        patch(p); setAnswer(a => { const n = { ...a }; delete n[q.id]; return n; });
                      }}>Save</Btn>
                    </div>
                  )}
                </div>
              ))}
            </Card>
          </>
        )}

        <Head sub="Pulled from your review schedule.">Move of the day</Head>
        <Card onClick={() => setCardOpen(movId)}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-slate-100" style={T.h2}>{card.n}</span>
            <span className="shrink-0" style={{ ...T.meta, color: STATUSMETA[card.status].c }}>{STATUSMETA[card.status].label}</span>
          </div>
          <p className="text-slate-500 mt-0.5" style={T.meta}>{card.pos} · tap for the full card</p>
          {cardAnim(st, movId) ? (
            <div className="mt-3" onClick={e => e.stopPropagation()}>
              <AnimPlayer key={cardAnim(st, movId)} id={cardAnim(st, movId)} cue={card.cue} edits={st.poseEdits?.[cardAnim(st, movId)]} compact />
            </div>
          ) : (
            <div className="rounded-xl mt-3 px-3.5 py-3" style={{ background: "#1e3a8a22", border: "1px solid #3b82f655" }}>
              <div className="text-blue-400" style={T.meta}>The one cue</div>
              <div className="text-blue-200 mt-0.5" style={{ fontSize: 17, fontWeight: 680 }}>{card.cue}</div>
            </div>
          )}
        </Card>
        <div className="grid grid-cols-3 gap-2">
          {[["got", "Got it", "#34d399"], ["fuzzy", "Fuzzy", "#fbbf24"], ["forgot", "Forgot", "#fb7185"]].map(([g, l, c]) => (
            <button key={g} onClick={() => { patch({ cards: gradeCard(st, movId, g, today), mow: null }); }}
              className="rounded-xl border py-3" style={{ borderColor: c + "77", color: c, ...T.h3 }}>{l}</button>
          ))}
        </div>

        <Head sub="After training.">Evening</Head>
        <Card className="space-y-4">
          <Btn tone="blue" full onClick={() => setModal("session")}>
            Log session{todaySessions.length ? ` (${todaySessions.length} logged)` : ""}
          </Btn>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Calories (target ${st.settings.cal})`}>
              <input type="number" inputMode="numeric" value={d.cal ?? ""} onChange={e => patchDay(today, { cal: e.target.value === "" ? null : Number(e.target.value) })} className={inputCls} style={T.small} />
            </Field>
            <Field label={`Protein g (target ${st.settings.protein})`}>
              <input type="number" inputMode="numeric" value={d.protein ?? ""} onChange={e => patchDay(today, { protein: e.target.value === "" ? null : Number(e.target.value) })} className={inputCls} style={T.small} />
            </Field>
          </div>
          <Field label="Meals">
            <div className="grid grid-cols-3 gap-1.5">
              {[["b", "Breakfast"], ["l", "Lunch"], ["d", "Dinner"]].map(([k, l]) => {
                const on = !!(d.meals || {})[k];
                return <button key={k} onClick={() => patchDay(today, { meals: { ...(d.meals || {}), [k]: !on } })} className="rounded-lg border py-2.5"
                  style={{ ...T.meta, borderColor: on ? "#34d399" : "#1e293b", background: on ? "#34d39922" : "transparent", color: on ? "#6ee7b7" : "#64748b" }}>{on ? "✓ " : ""}{l}</button>;
              })}
            </div>
          </Field>
          <Field label={`Water — ${d.water || 0} of ${st.settings.water} bottles`}>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: st.settings.water }).map((_, i) => (
                <button key={i} onClick={() => patchDay(today, { water: (d.water || 0) > i ? i : i + 1 })}
                  className="rounded-lg border flex-1" style={{ height: 36, minWidth: 30, borderColor: (d.water || 0) > i ? "#60a5fa" : "#1e293b", background: (d.water || 0) > i ? "#60a5fa33" : "transparent" }} />
              ))}
            </div>
          </Field>
        </Card>
        {tomorrow && <p className="text-slate-500 text-center pt-1" style={T.small}>{tomorrow}</p>}
      </>
    );
  };

  /* ── TRAIN ── */
  const Train = () => {
    const wk = st.week || defaultWeek;
    const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const recent = [...(st.sessions || [])].reverse().slice(0, 12);
    return (
      <>
        <Head sub="Tap a day to change its blocks. Press and hold a block to skip it once, move it or swap it.">Your week</Head>
        <div className="space-y-2">
          {order.map(k => {
            let nd = now; for (let i = 0; i < 7; i++) { const x = addDays(now, i); if (dayKey(x) === k) { nd = x; break; } }
            const tmpl = (wk[k] || []).map((b, i) => [b, i]).filter(([b]) => !b.seasonOnly);
            const live = blocksFor(st, nd);
            const wr = wrestlingOn(st, nd) && WRESTLING_DAYS.includes(k);
            const moved = live.filter(b => b.movedIn);
            const hard = live.filter(b => ["gi", "nogi", "wrestling", "strength"].includes(b.k) && !b.skipped).length;
            const isToday = dayKey(now) === k;
            return (
              <Card key={k} className={isToday ? "border-blue-500" : ""}>
                <button onClick={() => setModal("day:" + k)} className="flex items-baseline justify-between gap-2 w-full text-left">
                  <span className="text-slate-100" style={T.h3}>{DAYFULL[k]} <span className="text-slate-600" style={T.meta}>{fmtShort(nd)}</span></span>
                  <span className="flex items-center gap-2 shrink-0">
                    {hard >= 2 && <span className="rounded px-1.5" style={{ ...T.meta, background: "#7c2d1244", color: "#fdba74" }}>two-a-day</span>}
                    <span className="text-slate-600">›</span>
                  </span>
                </button>
                <div className="mt-2 space-y-1.5">
                  {tmpl.length === 0 && !wr && moved.length === 0 && <span className="text-slate-600" style={T.small}>Rest</span>}
                  {wr && (
                    <div className="flex items-center gap-2.5">
                      <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: BLOCKMETA.wrestling.c }} />
                      <span className="text-slate-300" style={T.small}>Wrestling practice</span>
                      <span className="text-slate-600" style={T.meta}>4pm · season</span>
                    </div>
                  )}
                  {tmpl.map(([b, i]) => {
                    const lv = live.find(x => x.n === b.n && x.k === b.k && !x.movedIn);
                    const lp = {
                      onPointerDown: () => { clearTimeout(blockPress.current); blockPress.current = setTimeout(() => { blockPress.current = "fired"; setModal(`block:${k}:${i}`); }, 520); },
                      onPointerUp: () => { if (blockPress.current !== "fired") clearTimeout(blockPress.current); },
                      onPointerLeave: () => { if (blockPress.current !== "fired") clearTimeout(blockPress.current); },
                      onContextMenu: e => { e.preventDefault(); setModal(`block:${k}:${i}`); },
                    };
                    return (
                      <button key={i} {...lp} onClick={() => { if (blockPress.current === "fired") { blockPress.current = null; return; } b.k === "strength" ? setModal("strength:" + b.plan) : setModal(`block:${k}:${i}`); }}
                        className="flex items-center gap-2.5 w-full text-left select-none" style={{ WebkitTouchCallout: "none" }}>
                        <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: (BLOCKMETA[b.k] || BLOCKMETA.rest).c }} />
                        <span className={lv?.skipped ? "text-slate-600 line-through" : "text-slate-300"} style={T.small}>{b.n}</span>
                        {b.t !== "—" && <span className="text-slate-600" style={T.meta}>{fmtTime(b.t)}</span>}
                        {lv?.skipped && <span className="text-slate-600" style={T.meta}>skipped once</span>}
                        {b.k === "strength" && <span className="text-slate-600 ml-auto">›</span>}
                      </button>
                    );
                  })}
                  {moved.map(b => (
                    <div key={b.id} className="flex items-center gap-2.5">
                      <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: (BLOCKMETA[b.k] || BLOCKMETA.rest).c }} />
                      <span className="text-slate-300" style={T.small}>{b.n}</span>
                      <span className="text-slate-600" style={T.meta}>moved here once</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        <Head>Tools</Head>
        <div className="grid grid-cols-2 gap-2">
          <Btn tone="slate" onClick={() => setModal("timer")}>Round timer</Btn>
          <Btn tone="slate" onClick={() => setModal("drill")}>Solo drill block</Btn>
        </div>

        <Head sub="Ladders you write yourself.">Skills</Head>
        <div className="space-y-2">
          {(st.skills || []).map(sk => {
            const done = sk.steps.filter(s => s.done).length;
            return (
              <Card key={sk.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-slate-100" style={T.h3}>{sk.n}</span>
                  <span className="text-slate-500 shrink-0" style={T.meta}>{done}/{sk.steps.length}</span>
                </div>
                <div className="mt-2.5 space-y-1.5">
                  {sk.steps.map((s, i) => (
                    <button key={i} onClick={() => patch({
                      skills: st.skills.map(x => x.id !== sk.id ? x : { ...x, steps: x.steps.map((y, j) => j !== i ? y : { ...y, done: !y.done, date: !y.done ? today : null }) })
                    })} className="flex items-start gap-2.5 w-full text-left">
                      <span className="shrink-0 rounded border flex items-center justify-center mt-0.5" style={{ width: 18, height: 18, borderColor: s.done ? "#34d399" : "#334155", background: s.done ? "#34d399" : "transparent", color: "#022c22", fontSize: 12, fontWeight: 800 }}>{s.done ? "✓" : ""}</span>
                      <span className={s.done ? "text-slate-500 line-through" : "text-slate-300"} style={T.small}>{s.t}</span>
                      {s.date && <span className="text-slate-600 ml-auto shrink-0" style={{ fontSize: 10 }}>{s.date.slice(5)}</span>}
                    </button>
                  ))}
                </div>
                <input placeholder="Add a step, then Enter" className={inputCls + " mt-2.5"} style={{ ...T.small, paddingTop: 7, paddingBottom: 7 }}
                  onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) { const t = e.target.value.trim(); e.target.value = ""; patch({ skills: st.skills.map(x => x.id !== sk.id ? x : { ...x, steps: [...x.steps, { t, done: false, date: null }] }) }); } }} />
                <textarea defaultValue={sk.note || ""} placeholder="Notes" className={inputCls + " mt-2"} style={{ ...T.small, minHeight: 44 }}
                  onBlur={e => patch({ skills: st.skills.map(x => x.id !== sk.id ? x : { ...x, note: e.target.value }) })} />
              </Card>
            );
          })}
          <input placeholder="New ladder (e.g. Handstand), then Enter" className={inputCls} style={T.small}
            onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) { const n = e.target.value.trim(); e.target.value = ""; patch({ skills: [...(st.skills || []), { id: "s" + Date.now(), n, steps: [] }] }); } }} />
        </div>

        <Head sub="Last twelve.">Session log</Head>
        <div className="space-y-2">
          {recent.length === 0 && <Card><span className="text-slate-500" style={T.small}>Nothing logged yet.</span></Card>}
          {recent.map(s => (
            <Card key={s.id}>
              <div className="flex items-baseline justify-between gap-2">
                <span style={{ ...T.meta, color: BLOCKMETA[s.type]?.c || "#94a3b8" }}>{BLOCKMETA[s.type]?.label || s.type}</span>
                <span className="text-slate-600 shrink-0" style={T.meta}>{s.date.slice(5)}{s.rounds ? ` · ${s.rounds} rounds` : ""}</span>
              </div>
              {s.techLabel && <div className="text-slate-200 mt-1" style={T.h3}>{s.techLabel}</div>}
              {s.worked && <div className="text-emerald-300 mt-1.5" style={T.small}>✓ {s.worked}</div>}
              {s.caught && <div className="text-rose-300 mt-0.5" style={T.small}>✗ {s.caught}{s.caughtPos ? ` (${s.caughtPos})` : ""}</div>}
            </Card>
          ))}
        </div>
      </>
    );
  };

  /* ── LIBRARY ── */
  const Library = () => {
    const caughtCount = {};
    (st.sessions || []).forEach(s => { if (s.caughtPos) caughtCount[s.caughtPos] = (caughtCount[s.caughtPos] || 0) + 1; });
    const posFilter = filter.startsWith("pos:") ? filter.slice(4) : null;
    const list = cards.filter(l => filter === "all" || (posFilter ? l.pos === posFilter : cardState(st, l.id).status === filter));
    const counts = { know: 0, learning: 0, next: 0 };
    cards.forEach(l => { const s = cardState(st, l.id).status; if (counts[s] != null) counts[s]++; });

    return (
      <>
        <Head sub="Your game written down, and the map of everything else.">Library</Head>
        <Seg value={libView} onChange={setLibView} options={[["cards", "Your cards"], ["tree", "Move tree"], ["map", "Map & plan"]]} />

        {libView === "tree" && <TreeView st={st} patch={patch} onOpenCard={setCardOpen} onAddCard={cardFromTree} openKey={treeKey} setOpenKey={setTreeKey} />}

        {libView === "cards" && (<>
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setFilter("all")} className="rounded-full border px-3 py-1.5"
            style={{ ...T.meta, borderColor: filter === "all" ? "#cbd5e1" : "#1e293b", color: filter === "all" ? "#f1f5f9" : "#64748b" }}>All {cards.length}</button>
          {Object.entries(STATUSMETA).map(([k, v]) => (
            <button key={k} onClick={() => setFilter(k)} className="rounded-full border px-3 py-1.5"
              style={{ ...T.meta, borderColor: filter === k ? v.c : "#1e293b", color: filter === k ? v.c : "#64748b" }}>{v.label} {counts[k]}</button>
          ))}
          {posFilter && <button onClick={() => setFilter("all")} className="rounded-full border px-3 py-1.5" style={{ ...T.meta, borderColor: "#60a5fa", color: "#93c5fd" }}>{posFilter} ×</button>}
        </div>
        <div className="space-y-2">
          {list.length === 0 && <Card><span className="text-slate-500" style={T.small}>No cards here yet. Add moves from the move tree.</span></Card>}
          {list.map(l => {
            const c = cardState(st, l.id);
            const dd = dueDate(st, l.id, today);
            const over = daysBetween(dd, today);
            return (
              <Card key={l.id} onClick={() => setCardOpen(l.id)} accent={(STATUSMETA[c.status] || STATUSMETA.next).c}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-slate-100" style={T.h3}>{c.n}</span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    {cardAnim(st, l.id) && <span className="rounded px-1.5" style={{ ...T.meta, background: "#0f172a", color: "#93c5fd", border: "1px solid #1e3a8a" }}>▶ animated</span>}
                    {over >= 0 && <span className="rounded px-1.5" style={{ ...T.meta, background: "#1e3a8a55", color: "#93c5fd" }}>due</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-slate-500" style={T.meta}>{c.pos}</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-slate-500" style={T.meta}>{c.group}</span>
                  {l.focus && <span style={{ ...T.meta, color: FOCUS[l.focus].c }}>{FOCUS[l.focus].label}</span>}
                  {c.legal && <span style={{ ...T.meta, color: "#fdba74" }}>⚠ check legality</span>}
                </div>
              </Card>
            );
          })}
        </div>
        {!posFilter && filter === "all" && (() => {
          const extra = TREE.moves.filter(n => n.anim && !n.lib && !TREE.moves.some(m => m !== n && m.anim === n.anim && m.key < n.key)
            && !Object.values(st.cards).some(c => c.custom && c.anim === n.anim));
          if (!extra.length) return null;
          return (
            <>
              <Head sub="Animated, but not in your cards yet. Tap one to watch it or add it.">More animated moves</Head>
              <div className="grid grid-cols-2 gap-2">
                {extra.map(n => (
                  <button key={n.key} onClick={() => setTreeKey(n.key)} className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-left">
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: 9.5, color: "#93c5fd", fontWeight: 700 }}>▶</span>
                      <span className="text-slate-200 truncate" style={{ fontSize: 13, fontWeight: 650 }}>{n.name}</span>
                    </div>
                    <div className="mt-0.5" style={{ ...T.meta, color: TREE_KINDS[n.kind].c }}>{TREE_KINDS[n.kind].label}</div>
                  </button>
                ))}
              </div>
            </>
          );
        })()}
        </>)}

        {libView === "map" && (<>
        <Head sub="Tap a position to see every card that starts there. A red dot is where you get caught most.">Position map</Head>
        <div className="grid grid-cols-2 gap-2">
          {POSITIONS.map(p => {
            const n = cards.filter(l => l.pos === p).length;
            const warn = (caughtCount[p] || 0) >= 3;
            const still = POS_STILL[p];
            const scm = still && anims[still[0]] ? compileMove(still[0]) : null;
            return (
              <button key={p} onClick={() => { setFilter("pos:" + p); setLibView("cards"); }}
                className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden text-left">
                {scm && <RigStill cm={scm} fr={scm.frames[still[1]]} marks={false} W={200} H={124} dim={false} />}
                <div className="p-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-100" style={T.h3}>{p}</span>
                    {warn && <span className="rounded-full shrink-0" style={{ width: 7, height: 7, background: "#fb7185" }} />}
                  </div>
                  <div className="text-slate-500 mt-0.5" style={T.meta}>{n} card{n === 1 ? "" : "s"}{caughtCount[p] ? ` · caught ${caughtCount[p]}×` : ""}</div>
                </div>
              </button>
            );
          })}
        </div>

        <Head sub="Reach the back from standing, attack from closed guard on the bottom.">Game plan</Head>
        <Card>
          <div className="text-slate-500 mb-2" style={T.meta}>{gamePlan.top.label}</div>
          {gamePlan.top.rows.map((row, ri) => (
            <div key={ri} className="flex items-center gap-1.5 mb-1.5 overflow-x-auto">
              {row.map((b, bi) => b ? (
                <button key={bi} onClick={() => setCardOpen(b.id)}
                  className="shrink-0 rounded-lg border px-2.5 py-2 text-left"
                  style={{ borderColor: b.hi ? "#60a5fa" : "#334155", background: b.hi ? "#60a5fa1e" : "transparent", minWidth: 92 }}>
                  <span className="block text-slate-200" style={{ fontSize: 12, fontWeight: 620 }}>{b.n}</span>
                  {b.note && <span className="block text-slate-600" style={{ fontSize: 10 }}>{b.note}</span>}
                </button>
              ) : <span key={bi} className="shrink-0" style={{ minWidth: 92 }} />)}
            </div>
          ))}
          <div className="text-slate-500 mt-4 mb-2" style={T.meta}>{gamePlan.bottom.label}</div>
          <button onClick={() => setCardOpen(gamePlan.bottom.root.id)} className="rounded-lg border border-slate-600 px-2.5 py-2 mb-2">
            <span className="text-slate-200" style={{ fontSize: 12, fontWeight: 620 }}>{gamePlan.bottom.root.n}</span>
          </button>
          <div className="space-y-1.5">
            {gamePlan.bottom.branches.map((br, i) => (
              <div key={i} className="rounded-lg border px-3 py-2.5" style={{ borderColor: br.hi ? "#60a5fa" : "#1e293b", background: br.hi ? "#60a5fa14" : "transparent" }}>
                <div className="text-slate-200" style={T.h3}>{br.h}</div>
                <div className="text-slate-500 mt-0.5" style={T.small}>{br.b}</div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {br.ids.map(x => <button key={x} onClick={() => setCardOpen(x)} className="rounded-full border border-slate-700 px-2.5 py-1 text-slate-300" style={{ fontSize: 11 }}>{library.find(l => l.id === x)?.n}</button>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
        </>)}

        {libView === "cards" && (<>
        <Head sub="Shown on Today on class days.">Questions for your professor</Head>
        <Card>
          <div className="flex gap-2 mb-3">
            <input id="qnew" placeholder="What do you want to ask?" className={inputCls} style={T.small}
              onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) { addQuestion(e.target.value.trim(), null); e.target.value = ""; } }} />
          </div>
          <div className="space-y-1.5">
            {(st.questions || []).length === 0 && <span className="text-slate-500" style={T.small}>Nothing on the list.</span>}
            {(st.questions || []).map(q => (
              <div key={q.id} className="flex items-start gap-2.5">
                <button onClick={() => patch({ questions: st.questions.map(x => x.id === q.id ? { ...x, done: !x.done } : x) })}
                  className="shrink-0 rounded border flex items-center justify-center mt-0.5" style={{ width: 18, height: 18, borderColor: q.done ? "#34d399" : "#334155", background: q.done ? "#34d399" : "transparent", color: "#022c22", fontSize: 12, fontWeight: 800 }}>{q.done ? "✓" : ""}</button>
                <span className={q.done ? "text-slate-600 flex-1" : "text-slate-300 flex-1"} style={T.small}>{q.q}{q.answer ? <span className="block text-emerald-400/80" style={{ fontSize: 12 }}>→ {q.answer}</span> : null}</span>
                <button onClick={() => patch({ questions: st.questions.filter(x => x.id !== q.id) })} className="text-slate-700 shrink-0">×</button>
              </div>
            ))}
          </div>
        </Card>
        </>)}
      </>
    );
  };

  /* ── BODY ── */
  const Body = () => {
    const dates = Object.keys(st.days).sort();
    const ws = dates.filter(k => st.days[k].weight).map(k => ({ k, v: st.days[k].weight }));
    const last30 = ws.slice(-30);
    const avg7 = last30.length >= 2 ? last30.slice(-7).reduce((a, b) => a + b.v, 0) / Math.min(7, last30.slice(-7).length) : null;
    const wcl = st.settings.weightClass ? Number(st.settings.weightClass) : null;
    const min = last30.length ? Math.min(...last30.map(x => x.v), ...(wcl ? [wcl] : [])) - 1 : 0;
    const max = last30.length ? Math.max(...last30.map(x => x.v), ...(wcl ? [wcl] : [])) + 1 : 1;
    const sleeps = dates.slice(-14).map(k => {
      const x = st.days[k];
      if (!x.sleepIn || !x.sleepOut) return { k, h: null };
      const [bh, bm] = x.sleepIn.split(":").map(Number), [wh, wm] = x.sleepOut.split(":").map(Number);
      let h = (wh * 60 + wm) - (bh * 60 + bm); if (h < 0) h += 1440;
      return { k, h: h / 60 };
    });

    return (
      <>
        <Head sub="Daily dots, seven-day average as the line.">Weight</Head>
        <Card>
          {last30.length < 2 ? <span className="text-slate-500" style={T.small}>Log a few mornings and the graph appears.</span> : (
            <>
              <svg viewBox="0 0 320 110" style={{ width: "100%", height: 110 }}>
                {(() => {
                  const pts = last30.map((p, i) => [12 + (i / Math.max(1, last30.length - 1)) * 296, 100 - ((p.v - min) / (max - min)) * 88]);
                  const avg = last30.map((p, i) => {
                    const w = last30.slice(Math.max(0, i - 6), i + 1);
                    const a = w.reduce((s, x) => s + x.v, 0) / w.length;
                    return [12 + (i / Math.max(1, last30.length - 1)) * 296, 100 - ((a - min) / (max - min)) * 88];
                  });
                  return (<>
                    {wcl && <line x1="12" x2="308" y1={100 - ((wcl - min) / (max - min)) * 88} y2={100 - ((wcl - min) / (max - min)) * 88} stroke="#f472b6" strokeWidth="1.3" strokeDasharray="5 4" />}
                    <polyline points={avg.map(p => p.join(",")).join(" ")} fill="none" stroke="#60a5fa" strokeWidth="2" />
                    {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#475569" />)}
                  </>);
                })()}
              </svg>
              <div className="flex justify-between text-slate-600" style={{ fontSize: 10 }}>
                <span>{last30[0].k.slice(5)}</span><span>{last30[last30.length - 1].k.slice(5)}</span>
              </div>
              <div className="flex gap-5 mt-2">
                <div><div className="text-slate-500" style={T.meta}>Latest</div><div className="text-slate-100" style={T.h2}>{last30[last30.length - 1].v}</div></div>
                <div><div className="text-slate-500" style={T.meta}>7-day avg</div><div className="text-blue-300" style={T.h2}>{avg7?.toFixed(1)}</div></div>
                {wcl && <div><div className="text-slate-500" style={T.meta}>Weight class</div><div style={{ ...T.h2, color: "#f9a8d4" }}>{wcl}</div></div>}
              </div>
            </>
          )}
          {st.settings.weightNote && <div className="text-slate-400 mt-2" style={T.small}>{st.settings.weightNote}</div>}
          {!wcl && <div className="text-slate-600 mt-2" style={{ fontSize: 11 }}>Set a weight class in settings to draw it as a dashed line.</div>}
        </Card>

        <Head sub="MyFitnessPal stays your food logger. This just sits the totals next to your training.">Fuel</Head>
        <Card>
          {(() => {
            const cal = d.cal, pro = d.protein;
            const trained = blocks.some(b => ["gi", "nogi", "wrestling", "strength"].includes(b.k));
            const short = trained && ((pro && pro < st.settings.protein * 0.8) || (cal && cal < st.settings.cal * 0.8));
            return (
              <div className="rounded-xl p-3.5" style={{ background: short ? "#78350f33" : "#0f172a", border: `1px solid ${short ? "#b45309" : "#1e293b"}` }}>
                <div className="flex gap-6">
                  <div><div className="text-slate-500" style={T.meta}>Calories</div><div className="text-slate-100" style={T.h2}>{cal ?? "—"}<span className="text-slate-600" style={T.meta}> / {st.settings.cal}</span></div></div>
                  <div><div className="text-slate-500" style={T.meta}>Protein</div><div className="text-slate-100" style={T.h2}>{pro ?? "—"}<span className="text-slate-600" style={T.meta}> / {st.settings.protein}g</span></div></div>
                </div>
                {short && <div className="text-amber-300 mt-2" style={T.meta}>Training day ending short. Eat before bed.</div>}
              </div>
            );
          })()}
          <div className="text-slate-500 mt-3 mb-2" style={T.small}>Entered on Today, in the evening strip. Last seven days of meals:</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const dd = addDays(now, i - 6), k = iso(dd), m = st.days[k]?.meals || {};
              const trained = blocksFor(st, dd).some(b => ["gi", "nogi", "wrestling", "strength", "open"].includes(b.k) && !b.skipped);
              return (
                <div key={k} className="flex flex-col items-center gap-1">
                  <span className="text-slate-600" style={{ fontSize: 9.5 }}>{dayKey(dd)[0]}</span>
                  {["b", "l", "d"].map(x => {
                    const gap = x === "d" && trained && !m.d && k < today && !!st.days[k]?.meals;
                    return <span key={x} className="rounded-full" style={{ width: 8, height: 8, background: m[x] ? "#34d399" : gap ? "transparent" : "#1e293b", border: gap ? "1.5px solid #fb7185" : "none" }} />;
                  })}
                </div>
              );
            })}
          </div>
          <div className="text-slate-600 mt-1.5" style={{ fontSize: 11 }}>Breakfast, lunch, dinner. A red ring is a skipped dinner on a training day.</div>
        </Card>

        <Head sub="Last fourteen nights. The line is eight hours.">Sleep</Head>
        <Card>
          <div className="flex items-end gap-1" style={{ height: 90 }}>
            {sleeps.map((s, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: s.h ? `${Math.min(100, (s.h / 11) * 100)}%` : 2, background: s.h ? (s.h >= 8 ? "#34d399" : "#fbbf24") : "#1e293b", minHeight: 2 }} />
            ))}
          </div>
          <div className="text-slate-500 mt-2" style={T.meta}>
            {(() => { const v = sleeps.filter(s => s.h); return v.length ? `${(v.reduce((a, b) => a + b.h, 0) / v.length).toFixed(1)} h average` : "No sleep logged yet"; })()}
          </div>
        </Card>

        <Head sub="Pulled in through a Shortcut, once that is set up.">Steps</Head>
        <Card>
          <div className="flex items-baseline gap-3">
            <span className="text-slate-100" style={T.h1}>{d.steps ?? "—"}</span>
            <span className="text-slate-600" style={T.meta}>/ 10,000</span>
          </div>
          <input type="number" inputMode="numeric" value={d.steps ?? ""} onChange={e => patchDay(today, { steps: e.target.value === "" ? null : Number(e.target.value) })}
            placeholder="Type today's count" className={inputCls + " mt-3"} style={T.small} />
          <div className="text-slate-600 mt-2" style={{ fontSize: 11 }}>Shortcuts: Get Health Sample (Steps, today, sum) → Open URL <span className="text-slate-400">your-app-link?steps=</span> with the steps number. The app fills today in when it opens.</div>
        </Card>

        <Head>Injury mode</Head>
        <Card>
          {injuries.length === 0 ? <span className="text-slate-500" style={T.small}>Nothing switched on. Turn one on in settings when you need it.</span> : (
            <div className="space-y-3">
              {injuries.map(([k]) => {
                const since = [...(st.injuryLog || [])].reverse().find(x => x.k === k && !x.cleared);
                return (
                  <div key={k}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-rose-300" style={T.h3}>{injuryPresets[k].n}</span>
                      {since && <span className="text-slate-500" style={T.meta}>since {fmtShort(parseISO(since.start))}</span>}
                    </div>
                    <div className="mt-1.5"><Bullets items={injuryPresets[k].rules} tone="rose" /></div>
                    <div className="flex gap-2 mt-2.5 items-center">
                      <input type="date" id={"clr-" + k} defaultValue={today} className={inputCls} style={{ ...T.small, maxWidth: 170 }} />
                      <Btn size="sm" tone="emerald" onClick={() => {
                        const dt = document.getElementById("clr-" + k)?.value || today;
                        const log = [...(st.injuryLog || [])];
                        const open = [...log].reverse().find(x => x.k === k && !x.cleared);
                        if (open) open.cleared = dt; else log.push({ k, start: dt, cleared: dt });
                        patch({ injuryLog: log.map(x => ({ ...x })), settings: { ...st.settings, injuries: { ...st.settings.injuries, [k]: false } } });
                      }}>Cleared on this date</Btn>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-slate-800 pt-3">
                <div className="text-slate-400 mb-1.5" style={T.meta}>After training</div>
                <Bullets items={["Ice, 15 minutes, first 48 hours only", "Tape before you go, not at the venue", "Elevate while you do homework", "No hot soaks on a fresh injury", "No menthol under tape — it burns once you sweat"]} />
                <button onClick={() => setModal("taping")} className="text-blue-300 underline mt-2" style={T.meta}>Open the taping guide</button>
              </div>
              <Field label="Pain today (1–5)">
                <Scale value={d.pain || null} onChange={v => patchDay(today, { pain: v })} />
              </Field>
            </div>
          )}
          {(() => {
            const vals = Array.from({ length: 30 }).map((_, i) => st.days[iso(addDays(now, i - 29))]?.pain ?? null);
            if (vals.filter(v => v != null).length < 2) return null;
            return (
              <div className="mt-3">
                <div className="text-slate-500" style={T.meta}>Pain, last 30 days</div>
                <Spark values={vals} min={1} max={5} color="#fb7185" />
              </div>
            );
          })()}
          {(st.injuryLog || []).length > 0 && (
            <div className="mt-3 border-t border-slate-800 pt-3">
              <div className="text-slate-500 mb-1" style={T.meta}>History</div>
              {(st.injuryLog || []).map((x, i) => (
                <div key={i} className="text-slate-400" style={T.small}>{injuryPresets[x.k]?.n || x.k}: {fmtShort(parseISO(x.start))} → {x.cleared ? fmtShort(parseISO(x.cleared)) : "now"}</div>
              ))}
            </div>
          )}
        </Card>
      </>
    );
  };

  /* ── REVIEW ── */
  const Review = () => {
    const mStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const pad = mStart.getDay();
    const wkStart = iso(addDays(now, -6));
    const wkSessions = (st.sessions || []).filter(s => s.date >= wkStart);
    const wkLifts = (st.liftLog || []).filter(l => l.date >= wkStart);
    const wkDays = Object.entries(st.days).filter(([k]) => k >= wkStart);
    const rounds = wkSessions.reduce((a, b) => a + (b.rounds || 0), 0);
    const caughtTags = {};
    wkSessions.forEach(s => { if (s.caughtPos) caughtTags[s.caughtPos] = (caughtTags[s.caughtPos] || 0) + 1; });
    const topCaught = Object.entries(caughtTags).sort((a, b) => b[1] - a[1])[0];
    const sleepsH = wkDays.map(([, v]) => {
      if (!v.sleepIn || !v.sleepOut) return null;
      const [bh, bm] = v.sleepIn.split(":").map(Number), [wh, wm] = v.sleepOut.split(":").map(Number);
      let h = (wh * 60 + wm) - (bh * 60 + bm); if (h < 0) h += 1440; return h / 60;
    }).filter(Boolean);
    const weights = wkDays.map(([, v]) => v.weight).filter(Boolean);
    const hitProtein = wkDays.filter(([, v]) => v.protein >= st.settings.protein).length;
    const hitWater = wkDays.filter(([, v]) => (v.water || 0) >= st.settings.water).length;
    const staleExport = !st.lastExport || daysBetween(st.lastExport, today) >= 14;

    return (
      <>
        <Head sub="Two minutes, every Sunday.">Weekly review</Head>
        <Card>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              ["Classes", wkSessions.length], ["Strength sessions", wkLifts.length],
              ["Rounds rolled", rounds], ["Avg sleep", sleepsH.length ? (sleepsH.reduce((a, b) => a + b, 0) / sleepsH.length).toFixed(1) + " h" : "—"],
              ["7-day weight", weights.length ? (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1) : "—"],
              ["Hit protein", `${hitProtein} days`], ["Hit water", `${hitWater} days`],
            ].map(([l, v]) => (
              <div key={l}><div className="text-slate-500" style={T.meta}>{l}</div><div className="text-slate-100" style={T.h2}>{v}</div></div>
            ))}
          </div>
        </Card>
        {topCaught && (
          <Note title={`Most common this week: caught in ${topCaught[0]} (${topCaught[1]}×)`} tone="rose">
            <button onClick={() => { const c = library.find(l => l.pos === topCaught[0] && l.group === "Escape") || library.find(l => l.pos === topCaught[0]); if (c) setCardOpen(c.id); }}
              className="underline text-rose-300" style={T.small}>Open the escape card for that position</button>
          </Note>
        )}
        <Card>
          <div className="text-slate-400 mb-2.5" style={T.meta}>Three questions</div>
          <div className="space-y-3">
            {Object.entries(FOCUS).map(([k, v]) => (
              <Field key={k} label={`What got better in ${v.label.toLowerCase()}?`}>
                <input value={(st.days[today]?.review || {})[k] || ""} onChange={e => patchDay(today, { review: { ...(st.days[today]?.review || {}), [k]: e.target.value } })}
                  className={inputCls} style={T.small} placeholder="One line" />
              </Field>
            ))}
          </div>
          <div className="mt-4">
            <Field label="Next week's move" hint="It becomes the move of the week and drives the solo drill block.">
              <select value={st.mow || ""} onChange={e => patch({ mow: e.target.value || null })} className={inputCls} style={T.small}>
                <option value="">— pick one —</option>
                {cards.map(l => <option key={l.id} value={l.id}>{cardState(st, l.id).n}</option>)}
              </select>
            </Field>
          </div>
        </Card>

        <Head sub="Class, strength, log filled. Blank days stay blank.">Consistency</Head>
        <Card>
          <div className="grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((x, i) => <div key={i} className="text-center text-slate-600" style={{ fontSize: 10 }}>{x}</div>)}
            {Array.from({ length: pad }).map((_, i) => <div key={"p" + i} />)}
            {Array.from({ length: dim }).map((_, i) => {
              const dd = new Date(now.getFullYear(), now.getMonth(), i + 1);
              const k = iso(dd);
              const hasClass = (st.sessions || []).some(s => s.date === k);
              const hasLift = (st.liftLog || []).some(l => l.date === k);
              const hasLog = !!st.days[k] && (st.days[k].weight || st.days[k].cal || st.days[k].readiness);
              const isToday = k === today;
              return (
                <button key={k} onClick={() => setModal("daylog:" + k)} className="rounded aspect-square flex flex-col items-center justify-center gap-0.5"
                  style={{ background: isToday ? "#1e293b" : "transparent", border: isToday ? "1px solid #475569" : "1px solid transparent" }}>
                  <span className="text-slate-600" style={{ fontSize: 9 }}>{i + 1}</span>
                  <span className="flex gap-0.5">
                    {hasClass && <span className="rounded-full" style={{ width: 4, height: 4, background: C.nogi }} />}
                    {hasLift && <span className="rounded-full" style={{ width: 4, height: 4, background: C.strength }} />}
                    {hasLog && <span className="rounded-full" style={{ width: 4, height: 4, background: "#34d399" }} />}
                  </span>
                </button>
              );
            })}
          </div>
          {(() => {
            const pre = iso(mStart).slice(0, 7);
            const cls = (st.sessions || []).filter(s => s.date.startsWith(pre)).length;
            const lf = (st.liftLog || []).filter(l => l.date.startsWith(pre)).length;
            const lg = Object.entries(st.days).filter(([k, v]) => k.startsWith(pre) && (v.weight || v.cal || v.readiness)).length;
            return <div className="text-slate-400 mt-3" style={T.small}>{now.toLocaleDateString("en-US", { month: "long" })}: {cls} class{cls === 1 ? "" : "es"} · {lf} strength · {lg} days logged</div>;
          })()}
          <div className="flex gap-4 mt-3 flex-wrap">
            {[["Class", C.nogi], ["Strength", C.strength], ["Logged", "#34d399"]].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1.5 text-slate-500" style={T.meta}>
                <span className="rounded-full" style={{ width: 6, height: 6, background: c }} />{l}
              </span>
            ))}
          </div>
        </Card>

        <Head sub="Notes with a timestamp, a position tag and good or bad. Video stays on this phone.">Film room</Head>
        <FilmRoom st={st} patch={patch} cards={cards} onOpenCard={setCardOpen} />

        <Head right={<Btn size="sm" tone="slate" onClick={() => setModal("event:new")}>Add</Btn>}>Events</Head>
        <div className="space-y-2">
          {(st.events || []).length === 0 && <Card><span className="text-slate-500" style={T.small}>No events set. Adding one turns on the Today badge.</span></Card>}
          {(st.events || []).sort((a, b) => (a.date || "").localeCompare(b.date || "")).map(e => (
            <Card key={e.id} onClick={() => setModal("event:" + e.id)} accent={e.date >= today ? "#a78bfa" : "#334155"}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-slate-100" style={T.h3}>{e.name}</span>
                <span className="text-slate-500 shrink-0" style={T.meta}>{e.date ? fmtShort(parseISO(e.date)) : "no date"}</span>
              </div>
              <div className="text-slate-500 mt-0.5" style={T.meta}>{[e.loc, e.division, e.wc].filter(Boolean).join(" · ") || "—"}</div>
              {e.format && <div className="text-slate-400 mt-1.5" style={T.small}>{e.format}</div>}
              {e.prep && e.date >= today && <div className="mt-1.5" style={{ ...T.meta, color: "#c4b5fd" }}>Prep plan on</div>}
              {e.date && e.date < today && <div className="mt-1.5" style={{ ...T.meta, color: "#94a3b8" }}>{(e.matches || []).length ? `${e.matches.filter(m => m.result === "win").length}–${e.matches.filter(m => m.result === "loss").length} · tap for the match log` : "Tap to fill in the match log"}</div>}
            </Card>
          ))}
        </div>

        <Head sub="Taping, warm-up and kit — carried over, ready for the next one.">Comp day pack</Head>
        <Card>
          <div className="text-slate-400 mb-2" style={T.meta}>Warm-up, 15 minutes</div>
          <div className="space-y-1.5 mb-4">
            {warmup.map(w => (
              <div key={w.t} className="flex gap-3"><span className="text-blue-300 shrink-0" style={{ ...T.meta, width: 36 }}>{w.t}</span><span className="text-slate-300" style={T.small}>{w.d}</span></div>
            ))}
          </div>
          <div className="text-slate-400 mb-2" style={T.meta}>Day timeline</div>
          <div className="space-y-1.5 mb-4">
            {compDay.map(w => (
              <div key={w.t} className="flex gap-3"><span className="text-slate-500 shrink-0" style={{ ...T.meta, width: 70 }}>{w.t}</span><span className="text-slate-300" style={T.small}>{w.d}</span></div>
            ))}
          </div>
          <div className="text-slate-400 mb-2" style={T.meta}>Taping</div>
          <div className="space-y-2 mb-4">
            {taping.map(t => <div key={t.n}><span className="text-slate-200" style={T.h3}>{t.n}. </span><span className="text-slate-400" style={T.small}>{t.b}</span></div>)}
          </div>
          <div className="text-slate-400 mb-2" style={T.meta}>Kit</div>
          <div className="space-y-1">
            {kit.map((k, i) => {
              const on = !!(st.days[today]?.kit || {})[i];
              return (
                <button key={i} onClick={() => patchDay(today, { kit: { ...(st.days[today]?.kit || {}), [i]: !on } })} className="flex items-center gap-2.5 w-full text-left">
                  <span className="shrink-0 rounded border flex items-center justify-center" style={{ width: 17, height: 17, borderColor: on ? "#34d399" : "#334155", background: on ? "#34d399" : "transparent", color: "#022c22", fontSize: 11, fontWeight: 800 }}>{on ? "✓" : ""}</span>
                  <span className={on ? "text-slate-600 line-through" : "text-slate-300"} style={T.small}>{k}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Head>Backup</Head>
        {staleExport && <Note tone="amber">You have not exported in a while. One file holds every log, card, note and setting.</Note>}
        <div className="grid grid-cols-2 gap-2">
          <Btn tone="blue" onClick={exportData}>Export</Btn>
          <label className="rounded-xl border border-slate-700 px-4 py-2.5 text-center text-slate-300 cursor-pointer" style={T.h3}>
            Import
            <input type="file" accept="application/json" onChange={importData} style={{ display: "none" }} />
          </label>
        </div>
        {st.lastExport && <p className="text-slate-600 text-center" style={T.meta}>Last export {st.lastExport}</p>}
      </>
    );
  };

  /* ── SOLO DRILL ── */
  const DrillModal = () => {
    const mw = cardState(st, movId);
    const inj = Object.keys(st.settings.injuries || {}).filter(k => st.settings.injuries[k]);
    const menu = soloDrills.filter(x => !(x.restricted || []).some(r => inj.includes(r)));
    const reps = d.drill || {};
    const doneAll = menu.every(x => (reps[x.id] || 0) >= x.goal);
    return (
      <Modal title="Solo drill — 10 minutes" onClose={() => setModal(null)}>
        <Note title={`Built around: ${mw.n}`} tone="blue">
          {mw.cue}
          {(mw.steps || []).length > 0 && <div className="text-slate-400 mt-1.5" style={T.small}>Shadow the entry and the hip movement: {(mw.steps[0] || "").split(".")[0]}.</div>}
        </Note>
        {inj.length > 0 && <Note tone="rose">Injury mode removed anything on the restricted list.</Note>}
        {doneAll && <Note tone="emerald">Every target hit today.</Note>}
        <div className="space-y-2">
          {menu.map(x => (
            <div key={x.id} className="rounded-2xl border border-slate-800 p-3.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-slate-100" style={T.h3}>{x.n}</span>
                <span className="shrink-0" style={{ ...T.h2, color: (reps[x.id] || 0) >= x.goal ? "#34d399" : "#f1f5f9" }}>{reps[x.id] || 0}<span className="text-slate-600" style={T.meta}> / {x.goal}</span></span>
              </div>
              <div className="rounded-full mt-1.5 overflow-hidden" style={{ height: 4, background: "#1e293b" }}>
                <div style={{ width: `${Math.min(100, ((reps[x.id] || 0) / x.goal) * 100)}%`, height: "100%", background: (reps[x.id] || 0) >= x.goal ? "#34d399" : "#fbbf24" }} />
              </div>
              <div className="flex items-baseline justify-between gap-2 mt-1">
                <span className="text-slate-500" style={T.small}>{x.t}</span>
                {anims["drill_" + x.id] && <button onClick={() => setDrillAnim(drillAnim === x.id ? null : x.id)} className="shrink-0 text-blue-300" style={T.meta}>{drillAnim === x.id ? "Hide form" : "▶ Form"}</button>}
              </div>
              {drillAnim === x.id && <div className="mt-2"><AnimPlayer id={"drill_" + x.id} compact /></div>}
              <div className="flex gap-2 mt-2.5">
                <Btn tone="slate" size="sm" onClick={() => patchDay(today, { drill: { ...reps, [x.id]: Math.max(0, (reps[x.id] || 0) - 5) } })}>−5</Btn>
                <Btn tone="blue" size="sm" onClick={() => patchDay(today, { drill: { ...reps, [x.id]: (reps[x.id] || 0) + 5 } })}>+5</Btn>
                <Btn tone="slate" size="sm" onClick={() => patchDay(today, { drill: { ...reps, [x.id]: (reps[x.id] || 0) + 1 } })}>+1</Btn>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    );
  };

  /* screens are called as plain functions (no hooks inside), so inputs keep focus while you type */
  const screens = { today: Today, train: Train, library: Library, body: Body, review: Review };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100" style={{ fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <main className="px-4 space-y-3 max-w-2xl mx-auto" style={{ paddingTop: "calc(20px + env(safe-area-inset-top,0px))", paddingBottom: "calc(90px + env(safe-area-inset-bottom,0px))" }}>
        {screens[tab]()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900 flex"
        style={{ paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
        {TABS.map(t => (
          <button key={t.k} onClick={() => { setTab(t.k); window.scrollTo(0, 0); }} className="flex-1 py-3.5"
            style={{ ...T.meta, color: tab === t.k ? "#f1f5f9" : "#64748b", borderTop: `2px solid ${tab === t.k ? "#3b82f6" : "transparent"}`, marginTop: -1 }}>
            {t.l}
          </button>
        ))}
      </nav>

      {modal === "settings" && <Settings st={st} onClose={() => setModal(null)} patch={patch} />}
      {modal === "session" && <SessionLog st={st} today={today} onClose={() => setModal(null)} onNewCard={newCardFromName}
        onSave={s => patch({ sessions: [...(st.sessions || []), s] })} />}
      {modal === "timer" && <RoundTimer onClose={() => setModal(null)} />}
      {modal === "drill" && DrillModal()}
      {modal?.startsWith("day:") && <DayEditor st={st} patch={patch} dayK={modal.slice(4)} onClose={() => setModal(null)} />}
      {modal?.startsWith("block:") && (() => { const [, k, i] = modal.split(":"); return <BlockMenu st={st} patch={patch} dayK={k} index={Number(i)} onClose={() => setModal(null)} />; })()}
      {modal?.startsWith("daylog:") && <DayLog st={st} k={modal.slice(7)} onClose={() => setModal(null)} />}
      {modal === "taping" && (
        <Modal title="Taping guide" onClose={() => setModal(null)}>
          {taping.map(t => <div key={t.n}><span className="text-slate-200" style={T.h3}>{t.n}. </span><span className="text-slate-400" style={T.small}>{t.b}</span></div>)}
        </Modal>
      )}
      {treeKey && TREE.byKey[treeKey] && <TreeSheet key={treeKey} st={st} node={TREE.byKey[treeKey]} patch={patch} onClose={() => setTreeKey(null)} onNav={setTreeKey}
        onOpenCard={id => { setCardOpen(id); }} onAddCard={cardFromTree} />}
      {modal?.startsWith("strength:") && <StrengthSession st={st} plan={modal.split(":")[1]} today={today}
        onClose={() => setModal(null)} onSave={l => patch({ liftLog: [...(st.liftLog || []), l] })} />}
      {modal?.startsWith("event:") && (() => {
        const id = modal.split(":")[1];
        const e = id === "new" ? null : (st.events || []).find(x => String(x.id) === id);
        return <EventEditor ev={e} onClose={() => setModal(null)} onMakeCard={name => newCardFromName(name, { status: "next", group: "From a match" })}
          onSave={f => patch({ events: e ? st.events.map(x => x.id === f.id ? f : x) : [...(st.events || []), f] })}
          onDelete={eid => patch({ events: st.events.filter(x => x.id !== eid) })} />;
      })()}
      {cardOpen && <CardDetail key={cardOpen} st={st} id={cardOpen} today={today} onClose={() => setCardOpen(null)}
        onPatch={patchCard} onAddQuestion={addQuestion} onOpen={setCardOpen} onEditPose={id => setPoseFor(id)} />}
      {poseFor && <PoseEditor st={st} id={poseFor} onClose={() => setPoseFor(null)}
        onSave={ed => { const pe = { ...(st.poseEdits || {}) }; if (ed) pe[poseFor] = ed; else delete pe[poseFor]; patch({ poseEdits: pe }); }} />}
    </div>
  );
}
