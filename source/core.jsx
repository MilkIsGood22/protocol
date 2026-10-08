
/* ═══════════════ STORAGE ═══════════════ */

const KEY = "protocol-v2";

const BLANK = {
  v: 2, days: {}, sessions: [], cards: {}, liftLog: [],
  events: [],
  skills: defaultSkills.map(s => ({ ...s, steps: s.steps.map(t => ({ t, done: false, date: null })) })),
  questions: [], mow: null, lastExport: null,
  tree: {}, poseEdits: {}, films: [], moved: {}, skipped: {}, injuryLog: [],
  settings: {
    bar: 5, cal: 2800, protein: 140, water: 6, wrestling: false, wrestlingStart: null, injuries: {}, pullupBar: false,
    weightClass: null, weightNote: "", hideRestricted: false,
  },
};

const load = () => {
  try {
    const q = typeof location !== "undefined" ? new URLSearchParams(location.search || "") : null;
    const raw = localStorage.getItem(KEY);
    let s = { ...BLANK };
    if (raw) {
      const p = JSON.parse(raw);
      s = { ...BLANK, ...p, settings: { ...BLANK.settings, ...(p.settings || {}) } };
      /* the spec takes the October 10 San Diego trip out; drop the copy an earlier build seeded */
      if (!s.sdRemoved) {
        s.events = (s.events || []).filter(e => !(e.id === 1 && /San Diego XIX/.test(e.name || "") && !(e.matches || []).length));
        s.sdRemoved = true;
      }
    }
    /* Shortcuts can open the app as protocol.html?steps=8432 (and optionally &date=2026-10-08) */
    if (q && q.get("steps") && !isNaN(Number(q.get("steps")))) {
      const k = q.get("date") || iso(new Date());
      s = { ...s, days: { ...s.days, [k]: { ...(s.days[k] || {}), steps: Number(q.get("steps")) } } };
      try { localStorage.setItem(KEY, JSON.stringify(s)); history.replaceState(null, "", location.pathname); } catch (e) {}
    }
    return s;
  } catch (e) { return { ...BLANK }; }
};
const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };

/* ═══════════════ UI PRIMITIVES ═══════════════ */

const Card = ({ children, className = "", style, onClick, accent }) => (
  <div onClick={onClick}
    className={`rounded-2xl border border-slate-800 bg-slate-900 p-4 ${onClick ? "cursor-pointer" : ""} ${className}`}
    style={{ ...(accent ? { borderLeftWidth: 3, borderLeftColor: accent } : {}), ...style }}>
    {children}
  </div>
);

const Head = ({ children, sub, right }) => (
  <div className="flex items-end justify-between gap-3 mt-7 mb-2.5 first:mt-0">
    <div className="min-w-0">
      <h2 className="text-slate-100" style={T.h2}>{children}</h2>
      {sub && <p className="text-slate-500 mt-1" style={T.small}>{sub}</p>}
    </div>
    {right}
  </div>
);

const Note = ({ children, title, tone = "slate" }) => {
  const c = { slate: "#94a3b8", blue: "#60a5fa", violet: "#a78bfa", emerald: "#34d399", amber: "#fbbf24", rose: "#fb7185" }[tone];
  return (
    <div className="rounded-2xl p-4" style={{ background: c + "14", border: `1px solid ${c}44` }}>
      {title && <div className="mb-1.5" style={{ ...T.h3, color: c }}>{title}</div>}
      <div className="text-slate-300" style={T.body}>{children}</div>
    </div>
  );
};

const Bullets = ({ items, tone = "slate" }) => {
  const c = { slate: "#94a3b8", blue: "#60a5fa", violet: "#a78bfa", emerald: "#34d399", amber: "#fbbf24", rose: "#fb7185" }[tone];
  return (
    <ul className="space-y-1.5">
      {items.map((x, i) => (
        <li key={i} className="flex gap-2.5 text-slate-300" style={T.small}>
          <span style={{ color: c, lineHeight: 1.5 }}>•</span><span>{x}</span>
        </li>
      ))}
    </ul>
  );
};

const Field = ({ label, children, hint }) => (
  <div>
    <div className="text-slate-400 mb-1.5" style={T.meta}>{label}</div>
    {children}
    {hint && <div className="text-slate-600 mt-1" style={{ fontSize: 11 }}>{hint}</div>}
  </div>
);

const inputCls = "w-full rounded-xl border border-slate-700 bg-slate-950 text-slate-100 px-3 py-2.5";

const Scale = ({ value, onChange, labels }) => (
  <div className="flex gap-1.5">
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} onClick={() => onChange(value === n ? null : n)}
        className="flex-1 rounded-lg border py-2.5"
        style={{
          borderColor: value === n ? "#60a5fa" : "#1e293b",
          background: value === n ? "#60a5fa22" : "transparent",
          color: value === n ? "#93c5fd" : "#64748b", ...T.h3,
        }}>{n}</button>
    ))}
  </div>
);

const Toggle = ({ on, onChange, label }) => (
  <button onClick={() => onChange(!on)} className="flex items-center justify-between w-full gap-3 py-1">
    <span className="text-slate-300 text-left" style={T.small}>{label}</span>
    <span className="shrink-0 rounded-full transition-colors" style={{ width: 44, height: 26, background: on ? "#34d399" : "#334155", padding: 3 }}>
      <span className="block rounded-full bg-white transition-transform" style={{ width: 20, height: 20, transform: on ? "translateX(18px)" : "none" }} />
    </span>
  </button>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center" style={{ background: "rgba(2,6,23,.75)" }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()}
      className="w-full bg-slate-900 border-t sm:border border-slate-700 sm:rounded-2xl rounded-t-3xl overflow-y-auto"
      style={{ maxHeight: "88vh", maxWidth: wide ? 760 : 560, paddingBottom: "calc(20px + env(safe-area-inset-bottom,0px))" }}>
      <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between gap-3 z-10">
        <span className="text-slate-100" style={T.h2}>{title}</span>
        <button onClick={onClose} className="shrink-0 h-9 w-9 rounded-full border border-slate-700 text-slate-300" aria-label="Close">×</button>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </div>
  </div>
);

const Btn = ({ children, onClick, tone = "slate", full, size = "md" }) => {
  const map = {
    blue: { bg: "#3b82f6", fg: "#fff", bd: "#3b82f6" },
    slate: { bg: "transparent", fg: "#cbd5e1", bd: "#334155" },
    emerald: { bg: "#10b981", fg: "#022c22", bd: "#10b981" },
    rose: { bg: "transparent", fg: "#fb7185", bd: "#9f1239" },
  }[tone];
  const pad = size === "sm" ? "px-3 py-1.5" : "px-4 py-2.5";
  return (
    <button onClick={onClick} className={`rounded-xl border ${pad} ${full ? "w-full" : ""}`}
      style={{ background: map.bg, color: map.fg, borderColor: map.bd, ...(size === "sm" ? T.meta : T.h3) }}>
      {children}
    </button>
  );
};

/* ═══════════════ REVIEW SCHEDULE ═══════════════ */

/* every card: the starting library plus the ones you added (from the session log, the tree or a match log) */
const allCards = st => [
  ...library,
  ...Object.entries(st.cards || {}).filter(([, v]) => v.custom).map(([id, v]) => ({
    id, n: v.n, pos: v.pos || "Other", group: v.group || "Other", status: v.status || "next",
    steps: v.steps || [], cue: v.cue || "", mistake: v.mistake || "", start: v.start || "", link: v.link || "", linkName: v.linkName || "", custom: true,
  })),
];

const cardState = (st, id) => {
  const lib = library.find(c => c.id === id) || { id, n: "Card", pos: "Other", group: "Other", status: "next", steps: [], cue: "", mistake: "", start: "" };
  const saved = st.cards[id] || {};
  return {
    ...lib, ...saved, status: saved.status || lib.status, step: saved.step ?? 0, due: saved.due || null,
    drilled: saved.drilled || 0, hit: saved.hit || 0, counters: saved.counters || [], clips: saved.clips || [], answers: saved.answers || [],
  };
};

/* a card with no due date yet is due today; the scheduler then spreads them out */
const dueDate = (st, id, today) => cardState(st, id).due || today;

const pickMoveOfDay = (st, today) => {
  const scored = allCards(st).map(l => {
    const c = cardState(st, l.id);
    const over = daysBetween(dueDate(st, l.id, today), today);
    return { id: l.id, over, seen: c.lastSeen || "", next: c.status === "next" ? 1 : 0, prio: l.priority ? 1 : 0 };
  });
  const due = scored.filter(x => x.over >= 0);
  const pool = due.length ? due : scored;
  pool.sort((a, b) => a.seen.localeCompare(b.seen) || (b.prio - a.prio) || (b.next - a.next) || (b.over - a.over));
  return pool[0]?.id || library[0].id;
};

const gradeCard = (st, id, grade, today) => {
  const c = cardState(st, id);
  let step = c.step, due;
  if (grade === "got") {
    step = Math.min(step + 1, INTERVALS.length - 1);
    due = iso(addDays(parseISO(today), INTERVALS[step]));
  } else if (grade === "fuzzy") {
    due = iso(addDays(parseISO(today), INTERVALS[step]));
  } else {
    step = 0;
    due = iso(addDays(parseISO(today), 1));
  }
  if (c.status === "next" && grade !== "forgot") due = iso(addDays(parseISO(today), 2));
  return { ...st.cards, [id]: { ...(st.cards[id] || {}), step, due, lastSeen: today } };
};

/* ═══════════════ BLOCKS FOR A DAY ═══════════════ */

const CLASS_KINDS = ["gi", "nogi", "open", "wrestling"];

/* wrestling season: four practice days a week from the start date */
const wrestlingOn = (st, d) => !!st.settings.wrestling && (!st.settings.wrestlingStart || iso(d) >= st.settings.wrestlingStart);
const WRESTLING_DAYS = ["Mon", "Tue", "Wed", "Thu"];

/* event prep: build week from 13 to 7 days out, taper in the last 6, rest the day before */
const prepPhase = (st, d) => {
  const ev = (st.events || []).filter(e => e.prep && e.date && e.date >= iso(d)).sort((a, b) => a.date.localeCompare(b.date))[0];
  if (!ev) return null;
  const n = daysBetween(iso(d), ev.date);
  if (n === 0) return { k: "event", ev, n };
  if (n === 1) return { k: "rest", ev, n };
  if (n <= 6) return { k: "taper", ev, n };
  if (n <= 13) return { k: "build", ev, n };
  return null;
};

const blocksFor = (st, d) => {
  const k = dayKey(d), key = iso(d);
  let src = [...((st.week || defaultWeek)[k] || [])].filter(b => !b.seasonOnly);
  if (wrestlingOn(st, d) && WRESTLING_DAYS.includes(k)) src.unshift({ k: "wrestling", t: "16:00", n: "Wrestling practice", dur: 90 });
  const inj = Object.entries(st.settings.injuries || {}).filter(([, v]) => v).map(([n]) => n);
  const ph = prepPhase(st, d);
  let out = src.map((b, i) => ({ ...b, id: `${key}:${k}:${i}` }));
  (st.moved?.[key] || []).forEach((b, i) => out.push({ ...b, id: `${key}:moved:${i}`, movedIn: true }));
  if (ph?.k === "event") out = [{ k: "event", t: "—", n: ph.ev.name, id: `${key}:event`, note: "Competition day. Warm up 15 minutes before your bracket." }];
  if (ph?.k === "rest") out = [{ k: "rest", t: "—", n: "Rest, pack the kit, early night", id: `${key}:prep`, note: `${ph.ev.name} is tomorrow.` }];
  return out.map(b => {
    let x = b;
    if (b.k === "strength" && inj.length) x = { ...x, warn: "Swaps applied for injury mode" };
    if (CLASS_KINDS.includes(b.k) && inj.length) x = { ...x, warn: "Tell your coach about the injury before you start" };
    if (ph?.k === "taper" && b.k === "strength") x = { ...x, warn: `Taper: half the sets, no new maxes (${ph.n} days out)` };
    if (ph?.k === "taper" && CLASS_KINDS.includes(b.k)) x = { ...x, warn: `Taper: drill your A-game, light rounds (${ph.n} days out)` };
    if (ph?.k === "build" && CLASS_KINDS.includes(b.k)) x = { ...x, warn: `Build week: hard rounds from the positions you will see (${ph.n} days out)` };
    if (st.skipped?.[b.id]) x = { ...x, skipped: true };
    return x;
  });
};

const nextClassLine = (st, today) => {
  for (let i = 1; i <= 7; i++) {
    const d = addDays(today, i);
    const bl = blocksFor(st, d).filter(b => CLASS_KINDS.includes(b.k));
    if (bl.length) {
      const b = bl[0];
      return `${i === 1 ? "Tomorrow" : DAYFULL[dayKey(d)]}: ${BLOCKMETA[b.k].label}${b.t !== "—" ? " " + fmtTime(b.t) : ""}`;
    }
  }
  return null;
};

const fmtTime = t => {
  if (!t || t === "—") return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "pm" : "am";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}${m ? ":" + String(m).padStart(2, "0") : ""}${ap}`;
};

/* ═══════════════ NEXT EVENT ═══════════════ */

const nextEvent = (st, today) => {
  const up = (st.events || []).filter(e => e.date && e.date >= today && !e.done).sort((a, b) => a.date.localeCompare(b.date));
  return up[0] || null;
};
