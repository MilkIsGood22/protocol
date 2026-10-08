
/* ═══════════════ POSES ═══════════════ */
/* x runs along the mat, y is up, z comes toward you. Centimetres.
   Each frame only lists what changes from the frame before it.
   h = hand, f = foot. e / k = a point the elbow / knee bends toward (hand / foot lands exactly).
   E / K = put the elbow / knee exactly here (planted or pinned limbs).
   "op.haR" means "wherever their right hand is", so a grip really is a grip. */

/* you, on your back in closed guard, head toward −x. Your left is −z, your right is +z. */
const meGuard = {
  pelvis: [2, 15, 0], up: [-1, 0.06, 0], front: [0, 1, 0], hf: null, curl: 0.3, head: [-1, 0.55, 0], look: [0.6, 1, 0],
  kL: at("op.waist", [-8, 2, -30]), kR: at("op.waist", [-8, 2, 30]), KL: null, KR: null,
  fL: at("op.lowback", [5, -2, 4]), fR: at("op.lowback", [4, 4, -4]), toeL: null, toeR: null,
  hL: [-30, 5, -34], hR: [-30, 5, 34], eL: [-52, 4, -44], eR: [-52, 4, 44], EL: null, ER: null,
};
/* them, kneeling in your guard, sitting back on their heels. Their left is +z, their right is −z. */
const opKneel = {
  pelvis: [32, 24, 0], up: [-0.3, 1, 0], front: [-1, -0.3, 0], hf: null, curl: 0, head: null, look: [-1, -0.5, 0],
  KL: [-5, 5, 21], KR: [-5, 5, -21], kL: null, kR: null, fL: [36, 4, 14], fR: [36, 4, -14], toeL: null, toeR: null,
  hL: at("me.pelvis", [-6, 11, 9]), hR: at("me.pelvis", [-6, 11, -9]), eL: [10, 40, 50], eR: [10, 40, -50], EL: null, ER: null,
};
