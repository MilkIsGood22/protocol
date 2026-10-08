
/* ═══════════════ RIG CORE ═══════════════ */
/* Each figure is a real skeleton: fixed bone lengths, elbows and knees solved from
   where the hand or foot has to be. Poses are stored in 3D (x = along the mat,
   y = up, z = toward the default viewer, centimetres), so one set of frames can be
   looked at from any side. Nothing here draws; see riggl / rigview. */

const BODY = { torso: 50, neck: 8, headR: 10, sh: 16.5, hip: 9.5, ua: 29, fa: 26, th: 43, sn: 42, foot: 15 };

const V3 = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: a => Math.hypot(a[0], a[1], a[2]),
  dist: (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]),
  norm: a => { const l = Math.hypot(a[0], a[1], a[2]); return l < 1e-6 ? [0, 1, 0] : [a[0] / l, a[1] / l, a[2] / l]; },
  lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
  mid: (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2],
  /* the part of v that is square to the unit vector n */
  perp: (v, n) => { const d = v[0] * n[0] + v[1] * n[1] + v[2] * n[2]; return [v[0] - n[0] * d, v[1] - n[1] * d, v[2] - n[2] * d]; },
  comb: (a, sa, b, sb, c, sc) => [
    a[0] * sa + b[0] * sb + (c ? c[0] * sc : 0),
    a[1] * sa + b[1] * sb + (c ? c[1] * sc : 0),
    a[2] * sa + b[2] * sb + (c ? c[2] * sc : 0)],
};

/* two-bone IK: root S, target T, bone lengths a and b, the joint bends toward the point `pole` */
function ik2(S, T, a, b, pole) {
  let dir = V3.sub(T, S), d = V3.len(dir);
  if (d < 1e-5) { dir = [0, -1, 0]; d = 1e-5; }
  const u = V3.mul(dir, 1 / d);
  const dd = Math.min(a + b - 0.05, Math.max(Math.abs(a - b) + 0.05, d));
  const x = (a * a - b * b + dd * dd) / (2 * dd);
  const h = Math.sqrt(Math.max(0, a * a - x * x));
  let p = V3.perp(V3.sub(pole, S), u);
  if (V3.len(p) < 1e-4) p = V3.perp(Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], u);
  p = V3.norm(p);
  return [V3.add(V3.add(S, V3.mul(u, x)), V3.mul(p, h)), V3.add(S, V3.mul(u, dd))];
}
/* aim chain: the first bone points at J, the second at E. Bone lengths never change. */
function aim2(S, J, E, a, b) {
  const j = V3.add(S, V3.mul(V3.norm(V3.sub(J, S)), a));
  return [j, V3.add(j, V3.mul(V3.norm(V3.sub(E, j)), b))];
}

/* Solve one figure from its description. `get` resolves references to joints.
   Fields: pelvis, up, front, hf (hips face), curl (spine: + rounds the back, − arches), head, look,
     hL hR hand targets   eL eR elbow bends toward   EL ER elbow placed here
     fL fR foot targets   kL kR knee bends toward    KL KR knee placed here
     toeL toeR toe direction */
function solveFigure(s, get) {
  const R = p => (p == null ? null : get(p));
  const pelvis = R(s.pelvis) || [0, 10, 0];
  const up = V3.norm(s.up || [0, 1, 0]);
  let f0 = V3.perp(s.front || [1, 0, 0], up);
  if (V3.len(f0) < 1e-4) f0 = V3.perp(Math.abs(up[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], up);
  const front = V3.norm(f0);
  const left = V3.cross(up, front);
  const th = (s.curl || 0) * 0.6, ct = Math.cos(th), st = Math.sin(th), h = BODY.torso / 2;
  const waist = V3.add(pelvis, V3.comb(up, h * ct, front, -h * st));
  const neck = V3.add(pelvis, V3.mul(up, 2 * h * ct));
  const uL = V3.norm(V3.sub(waist, pelvis)), uU = V3.norm(V3.sub(neck, waist));
  const fLo = V3.norm(V3.comb(front, ct, up, st)), fUp = V3.norm(V3.comb(front, ct, up, -st));
  let hl = left, fH = fLo;
  if (s.hf) {
    const g = V3.perp(s.hf, uL);
    if (V3.len(g) > 1e-4) { fH = V3.norm(g); hl = V3.cross(uL, fH); }
  }
  const headDir = V3.norm(s.head ? s.head : V3.comb(uU, 1, fUp, 0.12));
  const head = V3.add(neck, V3.mul(headDir, BODY.neck + BODY.headR));
  let lk = V3.perp(s.look || fUp, headDir);
  if (V3.len(lk) < 0.15) lk = V3.perp(fUp, headDir);
  if (V3.len(lk) < 0.15) lk = V3.perp(uU, headDir);
  lk = V3.norm(lk);
  const j = { pelvis, waist, neck, head, headDir, look: lk, up, front, left, uL, uU, fLo, fUp, fH, hl };
  const P = (o, a, sa, b, sb, c, sc) => V3.add(o, V3.comb(a, sa, b, sb, c, sc));
  j.chest = P(waist, uU, 14, fUp, 10.5);
  j.sternum = P(neck, uU, -8, fUp, 9.5);
  j.belly = P(pelvis, uL, 13, fLo, 9.5);
  j.back = P(neck, uU, -12, fUp, -10);
  j.lowback = P(pelvis, uL, 12, fLo, -9.5);
  j.ribL = P(waist, uU, 9, left, 14.5); j.ribR = P(waist, uU, 9, left, -14.5);
  j.throat = P(neck, headDir, 5, lk, 5);
  j.nape = P(neck, headDir, 5, lk, -5.5);
  j.chin = P(head, headDir, -7, lk, 7.5);
  j.shL = P(neck, left, BODY.sh, uU, -3); j.shR = P(neck, left, -BODY.sh, uU, -3);
  j.hiL = V3.add(pelvis, V3.mul(hl, BODY.hip)); j.hiR = V3.add(pelvis, V3.mul(hl, -BODY.hip));
  j.short = [];
  [["L", 1], ["R", -1]].forEach(([S, sg]) => {
    const sh = j["sh" + S], hi = j["hi" + S];
    const hT = R(s["h" + S]) || P(sh, uU, -46, fUp, 12, left, sg * 5);
    const fT = R(s["f" + S]) || P(hi, uL, -80, hl, sg * 3);
    const E = R(s["E" + S]), K = R(s["K" + S]);
    const ePole = R(s["e" + S]) || P(sh, left, sg * 16, uU, -20, fUp, -14);
    const kPole = R(s["k" + S]) || P(hi, fH, 40, hl, sg * 5, uL, 4);
    const arm = E ? aim2(sh, E, hT, BODY.ua, BODY.fa) : ik2(sh, hT, BODY.ua, BODY.fa, ePole);
    const leg = K ? aim2(hi, K, fT, BODY.th, BODY.sn) : ik2(hi, fT, BODY.th, BODY.sn, kPole);
    j["el" + S] = arm[0]; j["ha" + S] = arm[1];
    j["kn" + S] = leg[0]; j["fo" + S] = leg[1];
    const ha = V3.dist(arm[1], hT), fo = V3.dist(leg[1], fT);
    if (ha > 1.5) j.short.push(["hand" + S, ha]);
    if (fo > 1.5) j.short.push(["foot" + S, fo]);
    /* toes: square to the shin on the kneecap side; laid back along the shin if that would dig into the mat */
    const t = V3.norm(V3.sub(leg[0], hi)), sd = V3.norm(V3.sub(leg[1], leg[0]));
    let toe;
    if (s["toe" + S]) toe = V3.norm(s["toe" + S]);
    else {
      let fw = V3.perp(t, sd);
      if (V3.len(fw) < 0.12) fw = V3.perp(fH, sd);
      fw = V3.norm(fw);
      toe = fw;
      if (leg[1][1] + fw[1] * BODY.foot < 2.4) {
        /* would dig into the mat: lay the foot flat, pointing the way it was heading (or back along the shin when kneeling) */
        const sy = Math.max(-0.9, Math.min(0.9, (2.4 - leg[1][1]) / BODY.foot));
        let hx = [fw[0], 0, fw[2]];
        if (Math.hypot(hx[0], hx[2]) < 0.45) hx = [sd[0], 0, sd[2]];
        if (Math.hypot(hx[0], hx[2]) < 0.1) hx = [fH[0], 0, fH[2]];
        const hl2 = Math.hypot(hx[0], hx[2]) || 1, k = Math.sqrt(1 - sy * sy);
        toe = [hx[0] / hl2 * k, sy, hx[2] / hl2 * k];
      }
    }
    j["toeDir" + S] = toe;
    j["to" + S] = V3.add(leg[1], V3.mul(toe, BODY.foot));
  });
  return j;
}

/* canonical frame: everything numeric, limbs stored as aim points, so two frames can be blended */
const CANON_KEYS = ["pelvis", "up", "front", "hf", "head", "look", "EL", "ER", "hL", "hR", "KL", "KR", "fL", "fR", "toeL", "toeR"];
const canonOf = (j, raw) => ({
  pelvis: j.pelvis, up: j.up, front: j.front, hf: j.fH, curl: raw.curl || 0, head: j.headDir, look: j.look,
  EL: j.elL, ER: j.elR, hL: j.haL, hR: j.haR, KL: j.knL, KR: j.knR, fL: j.foL, fR: j.foR,
  toeL: j.toeDirL, toeR: j.toeDirR,
  gray: raw.gray || null, green: raw.green || null,
});
const solveCanon = c => solveFigure(c, p => p);
const lerpCanon = (a, b, t) => {
  const o = {};
  CANON_KEYS.forEach(k => { o[k] = V3.lerp(a[k], b[k], t); });
  o.curl = a.curl + (b.curl - a.curl) * t;
  o.gray = t < 0.5 ? a.gray : b.gray; o.green = t < 0.5 ? a.green : b.green;
  return o;
};

/* references: [x,y,z] · "op.haR" · at("op.elR", [dx,dy,dz]) · mix("op.elR", "op.haR", 0.5, [dx,dy,dz]) */
const at = (j, d) => ({ j, d: d || [0, 0, 0] });
const mix = (a, b, t, d) => ({ mix: [a, b], t: t == null ? 0.5 : t, d: d || [0, 0, 0] });

function makeGetter(J) {
  const look = name => {
    const [who, k] = name.split(".");
    const src = J[who];
    return src && src[k] ? src[k] : [0, 20, 0];
  };
  return p => {
    if (Array.isArray(p)) return p;
    if (typeof p === "string") return look(p);
    if (p.mix) return V3.add(V3.lerp(look(p.mix[0]), look(p.mix[1]), p.t), p.d || [0, 0, 0]);
    return V3.add(look(p.j), p.d || [0, 0, 0]);
  };
}

function compileFrame(rawMe, rawOp, single) {
  let J = { me: null, op: null };
  for (let i = 0; i < 5; i++) {
    const g = makeGetter(J);
    J = { op: single ? null : solveFigure(rawOp, g), me: solveFigure(rawMe, g) };
  }
  return { J, me: canonOf(J.me, rawMe), op: single ? null : canonOf(J.op, rawOp) };
}

const LIMB_JOINTS = { armL: ["elL", "haL"], armR: ["elR", "haR"], legL: ["knL", "foL"], legR: ["knR", "foR"], torso: ["pelvis", "neck"], head: ["head"] };
const hotParts = (now, prev) => {
  if (!now || !prev) return [];
  const out = [];
  Object.keys(LIMB_JOINTS).forEach(l => {
    if (LIMB_JOINTS[l].some(k => V3.dist(now[k], prev[k]) > 7)) out.push(l);
  });
  return out;
};

const anims = {};
const compiledMoves = {};
let RIG_CHECK = false;

/* ── pose transforms: turn a pose about the vertical axis, or mirror it left↔right (z → −z) ── */
const RAW_POINTS = ["pelvis", "hL", "hR", "eL", "eR", "EL", "ER", "fL", "fR", "kL", "kR", "KL", "KR"];
const RAW_VECS = ["up", "front", "hf", "head", "look", "toeL", "toeR"];
const RAW_SIDES = [["hL", "hR"], ["eL", "eR"], ["EL", "ER"], ["fL", "fR"], ["kL", "kR"], ["KL", "KR"], ["toeL", "toeR"]];
const SIDE_JOINT = { shL: "shR", elL: "elR", haL: "haR", hiL: "hiR", knL: "knR", foL: "foR", toL: "toR", ribL: "ribR" };
Object.keys(SIDE_JOINT).forEach(k => { SIDE_JOINT[SIDE_JOINT[k]] = k; });
const swapRefName = s => { const [w, k] = s.split("."); return SIDE_JOINT[k] ? `${w}.${SIDE_JOINT[k]}` : s; };
const mapRef = (v, fp, fv, sw) => {
  if (v == null) return v;
  if (Array.isArray(v)) return fp(v);
  if (typeof v === "string") return sw ? swapRefName(v) : v;
  if (v.mix) return { ...v, mix: v.mix.map(s => (sw ? swapRefName(s) : s)), d: fv(v.d || [0, 0, 0]) };
  if (v.j) return { ...v, j: sw ? swapRefName(v.j) : v.j, d: fv(v.d || [0, 0, 0]) };
  return v;
};
const xformPose = (p, fp, fv, sw) => {
  if (!p) return p;
  const o = { ...p };
  RAW_POINTS.forEach(k => { if (k in p) o[k] = mapRef(p[k], fp, fv, sw); });
  RAW_VECS.forEach(k => { if (Array.isArray(p[k])) o[k] = fv(p[k]); });
  if (sw) {
    RAW_SIDES.forEach(([a, b]) => {
      const hasA = a in o, hasB = b in o, A = o[a], B = o[b];
      delete o[a]; delete o[b];
      if (hasA) o[b] = A;
      if (hasB) o[a] = B;
    });
    const sl = l => l && l.map(x => ({ armL: "armR", armR: "armL", legL: "legR", legR: "legL" })[x] || x);
    if (o.gray) o.gray = sl(o.gray);
    if (o.green) o.green = sl(o.green);
  }
  return o;
};
const rotY = deg => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return v => [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c]; };
const turnPose = (p, deg, about = [0, 0, 0], move = [0, 0, 0]) => {
  const rv = rotY(deg);
  return xformPose(p, v => V3.add(V3.add(about, rv(V3.sub(v, about))), move), rv, false);
};
const mirrorPose = p => { const f = v => [v[0], v[1], -v[2]]; return xformPose(p, f, f, true); };
const xformMark = (m, fp, fv, sw) => {
  const o = { ...m };
  if (m.j) o.j = sw ? swapRefName(m.j) : m.j;
  if (m.o) o.o = fv(m.o);
  if (m.d) o.d = fv(m.d);
  ["from", "to"].forEach(k => { if (m[k] != null) o[k] = mapRef(m[k], fp, fv, sw); });
  return o;
};
/* mirror or turn a whole frame (both figures, marks, ghost) */
const mirrorFrame = f => {
  const fl = v => [v[0], v[1], -v[2]];
  return { ...f, me: mirrorPose(f.me), op: mirrorPose(f.op), ghost: f.ghost && mirrorPose(f.ghost), marks: f.marks && f.marks.map(m => xformMark(m, fl, fl, true)) };
};
const turnFrame = (f, deg, about = [0, 0, 0], move = [0, 0, 0]) => {
  const rv = rotY(deg), fp = v => V3.add(V3.add(about, rv(V3.sub(v, about))), move);
  return { ...f, me: turnPose(f.me, deg, about, move), op: turnPose(f.op, deg, about, move), ghost: f.ghost && turnPose(f.ghost, deg, about, move),
    marks: f.marks && f.marks.map(m => xformMark(m, fp, rv, false)) };
};
/* swap who is who: their pose becomes yours (refs "me." ↔ "op." swap too) */
const swapWhoRef = v => {
  const s = x => x.startsWith("me.") ? "op." + x.slice(3) : x.startsWith("op.") ? "me." + x.slice(3) : x;
  if (v == null || Array.isArray(v)) return v;
  if (typeof v === "string") return s(v);
  if (v.mix) return { ...v, mix: v.mix.map(s) };
  if (v.j) return { ...v, j: s(v.j) };
  return v;
};
const swapWho = p => { if (!p) return p; const o = { ...p }; RAW_POINTS.forEach(k => { if (k in p) o[k] = swapWhoRef(p[k]); }); return o; };

function compileMove(id) {
  if (compiledMoves[id]) return compiledMoves[id];
  const m = anims[id];
  if (!m) return null;
  let me = {}, op = {};
  const raws = [];
  let yaw = m.yaw == null ? -30 : m.yaw, pitch = m.pitch == null ? 26 : m.pitch;
  const frames = m.frames.map((f, i) => {
    me = { ...me, ...(f.me || {}) }; op = { ...op, ...(f.op || {}) };
    delete me.gray; delete me.green; delete op.gray; delete op.green;
    if (f.me && f.me.gray) me.gray = f.me.gray;
    if (f.me && f.me.green) me.green = f.me.green;
    if (f.op && f.op.gray) op.gray = f.op.gray;
    if (f.op && f.op.green) op.green = f.op.green;
    raws.push({ me: { ...me }, op: { ...op } });
    const c = compileFrame(me, op, m.single);
    if (f.yaw != null) yaw = f.yaw;
    if (f.pitch != null) pitch = f.pitch;
    const out = {
      me: c.me, op: c.op, J: c.J, cap: f.cap || "", marks: f.marks || [], via: !!f.via, cut: !!f.cut, yaw, pitch,
      ghost: f.ghost ? compileFrame(me, { ...op, ...f.ghost }, false).op : null,
      props: f.props || m.props || null, tag: f.tag || null,
      checks: RIG_CHECK ? checkFrame(c.J, me, op, m.single) : null,
    };
    return out;
  });
  frames.forEach((f, i) => {
    const p = i > 0 ? frames[i - 1] : null;
    const q = f.cut ? null : p;
    f.hot = { me: q ? hotParts(f.J.me, q.J.me) : [], op: q && f.J.op ? hotParts(f.J.op, q.J.op) : [] };
    f.prevJ = p ? p.J : null;
  });
  let mistake = null;
  if (m.mistake) {
    const fromI = m.mistake.from == null ? raws.length - 1 : m.mistake.from;
    const base = raws[fromI];
    const mm = { ...base.me, ...(m.mistake.me || {}) }, mo = { ...base.op, ...(m.mistake.op || {}) };
    ["gray", "green"].forEach(k => { if (!(m.mistake.me && m.mistake.me[k])) delete mm[k]; if (!(m.mistake.op && m.mistake.op[k])) delete mo[k]; });
    const c = compileFrame(mm, mo, m.single);
    mistake = {
      me: c.me, op: c.op, J: c.J, cap: m.mistake.cap || "", marks: m.mistake.marks || [], from: fromI,
      yaw: m.mistake.yaw == null ? frames[fromI].yaw : m.mistake.yaw, pitch: m.mistake.pitch == null ? frames[fromI].pitch : m.mistake.pitch,
      ghost: m.mistake.ghost ? compileFrame(mm, { ...mo, ...m.mistake.ghost }, false).op : null,
      props: m.mistake.props || m.props || null, hot: { me: [], op: [] }, prevJ: null,
      checks: RIG_CHECK ? checkFrame(c.J, mm, mo, m.single) : null,
    };
  }
  const steps = [];
  frames.forEach((f, i) => { if (!f.via) steps.push(i); });
  compiledMoves[id] = {
    id, frames, mistake, steps, gi: !!m.gi, single: !!m.single, loop: !!m.loop,
    yaw: m.yaw == null ? -30 : m.yaw, pitch: m.pitch == null ? 26 : m.pitch, viewName: m.view || "angle",
    fitKeys: m.fit || null, zoom: m.zoom || null,
  };
  return compiledMoves[id];
}

/* per-frame edits from the pose editor: { [frameIndex]: { me: canon, op: canon } } */
const withEdits = (cm, edits) => {
  if (!cm || !edits) return cm;
  const fix = (f, e) => {
    if (!e) return f;
    const me = e.me || f.me, op = e.op || f.op;
    return { ...f, me, op, J: { me: solveCanon(me), op: op ? solveCanon(op) : null } };
  };
  return { ...cm, frames: cm.frames.map((f, i) => fix(f, edits[i])), mistake: cm.mistake ? fix(cm.mistake, edits.mistake) : null };
};

/* ── camera ── */
const VIEWS = { side: { yaw: 0, pitch: 7 }, top: { yaw: 0, pitch: 84 } };
function camAxes(yawDeg, pitchDeg) {
  const y = yawDeg * Math.PI / 180, p = pitchDeg * Math.PI / 180;
  const cy = Math.cos(y), sy = Math.sin(y), cp = Math.cos(p), sp = Math.sin(p);
  return {
    R: [cy, 0, sy],                 // screen right, in world
    U: [sy * sp, cp, -cy * sp],     // screen up
    D: [-sy * cp, sp, cy * cp],     // toward the camera
  };
}
const FIT_KEYS = ["pelvis", "neck", "head", "shL", "shR", "elL", "elR", "haL", "haR", "hiL", "hiR", "knL", "knR", "foL", "foR", "toL", "toR"];
const moveCloud = cm => {
  if (cm.cloud) return cm.cloud;
  const pts = [];
  const all = [...cm.frames, ...(cm.mistake ? [cm.mistake] : [])];
  all.forEach(f => {
    [f.J.me, f.J.op, f.ghost ? solveCanon(f.ghost) : null].forEach(j => {
      if (!j) return;
      (cm.fitKeys || FIT_KEYS).forEach(k => pts.push([j[k], k === "head" ? 11.5 : 7]));
    });
    (f.props || []).forEach(pr => {
      if (pr.t === "barbell" && f.J.me) {
        const a = f.J.me.haL, b = f.J.me.haR, d = V3.norm(V3.sub(a, b)), c = V3.mid(a, b);
        pts.push([V3.add(c, V3.mul(d, pr.half || 60)), 16], [V3.add(c, V3.mul(d, -(pr.half || 60))), 16]);
      }
      if (pr.t === "bar") pts.push([pr.a, 4], [pr.b, 4]);
    });
  });
  cm.cloud = pts;
  return pts;
};
function fitCamera(cm, yaw, pitch, W, H, maxScale) {
  const ax = camAxes(yaw, pitch);
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, d0 = 1e9, d1 = -1e9;
  moveCloud(cm).forEach(([p, pad]) => {
    const qx = V3.dot(p, ax.R), qy = V3.dot(p, ax.U), qd = V3.dot(p, ax.D);
    x0 = Math.min(x0, qx - pad); x1 = Math.max(x1, qx + pad);
    y0 = Math.min(y0, qy - pad); y1 = Math.max(y1, qy + pad);
    d0 = Math.min(d0, qd - pad); d1 = Math.max(d1, qd + pad);
  });
  const mg = 8;
  const s = Math.min((W - 2 * mg) / (x1 - x0), (H - 2 * mg) / (y1 - y0), maxScale || 2.6);
  return { ax, s, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, W, H, d0, d1, yaw, pitch };
}
const project = (p, cam, mirror) => {
  const x = cam.W / 2 + cam.s * (V3.dot(p, cam.ax.R) - cam.cx);
  return [mirror ? cam.W - x : x, cam.H / 2 - cam.s * (V3.dot(p, cam.ax.U) - cam.cy), V3.dot(p, cam.ax.D)];
};

/* ── automatic checks (used while authoring poses) ── */
function segDist(p1, q1, p2, q2) {
  const d1 = V3.sub(q1, p1), d2 = V3.sub(q2, p2), r = V3.sub(p1, p2);
  const a = V3.dot(d1, d1), e = V3.dot(d2, d2), f = V3.dot(d2, r);
  let s, t;
  if (a <= 1e-9 && e <= 1e-9) return V3.dist(p1, p2);
  if (a <= 1e-9) { s = 0; t = Math.min(1, Math.max(0, f / e)); }
  else {
    const c = V3.dot(d1, r);
    if (e <= 1e-9) { t = 0; s = Math.min(1, Math.max(0, -c / a)); }
    else {
      const b = V3.dot(d1, d2), den = a * e - b * b;
      s = den > 1e-9 ? Math.min(1, Math.max(0, (b * f - c * e) / den)) : 0;
      t = (b * s + f) / e;
      if (t < 0) { t = 0; s = Math.min(1, Math.max(0, -c / a)); }
      else if (t > 1) { t = 1; s = Math.min(1, Math.max(0, (b - c) / a)); }
    }
  }
  return V3.dist(V3.add(p1, V3.mul(d1, s)), V3.add(p2, V3.mul(d2, t)));
}
const capsulesOf = j => [
  { n: "hips", a: j.pelvis, b: j.waist, r: 10, g: "torso" },
  { n: "chest", a: j.waist, b: V3.add(j.neck, V3.mul(j.uU, -4)), r: 10.5, g: "torso" },
  { n: "head", a: j.head, b: j.head, r: 9, g: "head" },
  { n: "L upper arm", a: j.shL, b: j.elL, r: 4.4, g: "armL" }, { n: "L forearm", a: j.elL, b: j.haL, r: 3.5, g: "armL", fore: 1 },
  { n: "R upper arm", a: j.shR, b: j.elR, r: 4.4, g: "armR" }, { n: "R forearm", a: j.elR, b: j.haR, r: 3.5, g: "armR", fore: 1 },
  { n: "L thigh", a: j.hiL, b: j.knL, r: 6.6, g: "legL" }, { n: "L shin", a: j.knL, b: j.foL, r: 4.4, g: "legL", shin: 1 },
  { n: "R thigh", a: j.hiR, b: j.knR, r: 6.6, g: "legR" }, { n: "R shin", a: j.knR, b: j.foR, r: 4.4, g: "legR", shin: 1 },
];
function checkFigure(j, who, out) {
  j.short.forEach(([n, d]) => out.push(`${who} ${n}: cannot reach, ${d.toFixed(0)} cm short`));
  [["L", 1], ["R", -1]].forEach(([S, sg]) => {
    const hi = j["hi" + S], kn = j["kn" + S], fo = j["fo" + S], sh = j["sh" + S], el = j["el" + S], ha = j["ha" + S];
    const t = V3.norm(V3.sub(kn, hi)), sd = V3.norm(V3.sub(fo, kn));
    const sp = V3.perp(sd, t);
    const bend = Math.acos(Math.max(-1, Math.min(1, -V3.dot(t, sd)))) * 180 / Math.PI;      // interior angle at the knee
    if (V3.len(sp) > 0.3) {
      const d = V3.mul(j.uL, -1);
      const phi = Math.atan2(V3.dot(t, j.fH), V3.dot(t, d));
      const kc = V3.norm(V3.perp(V3.comb(j.fH, Math.cos(phi), d, -Math.sin(phi)), t));
      const side = V3.dot(V3.mul(V3.norm(sp), -1), kc);
      if (side < -0.25) out.push(`${who} ${S} knee bends backwards (${side.toFixed(2)})`);
      else if (side < 0.15) out.push(`${who} ${S} hip twisted hard (${side.toFixed(2)})`);
    }
    if (bend < 24) out.push(`${who} ${S} knee folded past its limit (${bend.toFixed(0)}°)`);
    const ua = V3.norm(V3.sub(el, sh)), fa = V3.norm(V3.sub(ha, el));
    const eb = Math.acos(Math.max(-1, Math.min(1, -V3.dot(ua, fa)))) * 180 / Math.PI;
    if (eb < 20) out.push(`${who} ${S} elbow folded past its limit (${eb.toFixed(0)}°)`);
  });
  [["pelvis", 8], ["waist", 8], ["neck", 5], ["head", 9], ["elL", 3.2], ["elR", 3.2], ["haL", 2.5], ["haR", 2.5], ["knL", 4], ["knR", 4], ["foL", 3], ["foR", 3], ["toL", 2.2], ["toR", 2.2], ["shL", 4.5], ["shR", 4.5], ["hiL", 6], ["hiR", 6]].forEach(([k, r]) => {
    if (j[k][1] - r < -1.5) out.push(`${who} ${k} is ${(r - j[k][1]).toFixed(0)} cm into the mat`);
  });
  const nb = Math.acos(Math.max(-1, Math.min(1, V3.dot(j.headDir, j.uU)))) * 180 / Math.PI;
  if (nb > 58) out.push(`${who} neck bent ${nb.toFixed(0)}°`);
  if (V3.dot(j.look, j.fUp) < -0.3) out.push(`${who} is looking behind themselves`);
}
function checkFrame(J, rawMe, rawOp, single) {
  const out = [];
  checkFigure(J.me, "me", out);
  if (!single && J.op) checkFigure(J.op, "op", out);
  const hits = [];
  const cm = capsulesOf(J.me), co = !single && J.op ? capsulesOf(J.op) : [];
  cm.forEach(a => co.forEach(b => {
    const dep = a.r + b.r - segDist(a.a, a.b, b.a, b.b);
    if (dep > 5) hits.push([dep, `me ${a.n} goes ${dep.toFixed(0)} cm into op ${b.n}`]);
  }));
  [["me", cm], ["op", co]].forEach(([who, cs]) => {
    for (let i = 0; i < cs.length; i++) for (let k = i + 1; k < cs.length; k++) {
      const a = cs[i], b = cs[k];
      if (a.g === b.g) continue;
      const tor = a.g === "torso" || b.g === "torso", limb = a.g === "torso" ? b : a;
      if (tor && !(limb.fore || limb.shin || limb.g === "head")) continue;     // upper arm / thigh are attached to the torso
      if ((a.g === "head" && b.g === "torso") || (b.g === "head" && a.g === "torso")) continue;
      if (a.g.startsWith("leg") && b.g.startsWith("leg") && !a.shin && !b.shin) continue;
      const dep = a.r + b.r - segDist(a.a, a.b, b.a, b.b);
      if (dep > 4.5) hits.push([dep, `${who} ${a.n} goes ${dep.toFixed(0)} cm into own ${b.n}`]);
    }
  });
  hits.sort((x, y) => y[0] - x[0]);
  hits.slice(0, 7).forEach(h => out.push(h[1]));
  return out;
}
