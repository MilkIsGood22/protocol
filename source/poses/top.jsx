
/* them, flat on their back, head toward −x. Their left is −z, their right is +z (toward you, the viewer). */
const opSupine = {
  pelvis: [20, 10, 0], up: [-1, 0, 0], front: [0, 1, 0], hf: null, curl: 0, head: [-1, 0.12, 0], look: [0, 1, 0.15],
  kL: [58, 60, -16], kR: [58, 60, 16], KL: null, KR: null, fL: [80, 4, -17], fR: [80, 4, 17], toeL: null, toeR: null,
  hL: [-2, 4, -42], eL: [-20, 4, -50], hR: [-2, 4, 42], eR: [-20, 4, 50], EL: null, ER: null,
};

Object.assign(anims, {

  /* 4 ─ Americana from mount (their right arm, the one nearest the viewer) */
  americana: {
    yaw: 68, pitch: 40,
    frames: [
      {
        cap: "Pin the wrist. Your hand nearest their head pins their wrist to the mat, all five fingers on top. Your elbow drops next to their ear.",
        me: { pelvis: [6, 30, 2], up: [-40, 1, 31.5], front: [0, -1, 0], hf: [-0.7, -0.7, 0], curl: 0.15, head: null, look: [-0.2, -1, 0.3],
          KL: [-22, 5, 29], KR: [-20, 5, -25], fL: [20, 4, 27], fR: [22, 4, -25],
          hR: at("op.haR", [1, 4, -1]), eR: [-56, 4, 14], hL: [-18, 3, 58], eL: [-10, 30, 70] },
        op: { ...opSupine, ER: [-38, 5, 42], hR: [-62, 4, 37], hL: at("me.hiR", [-4, 2, -8]), eL: [-10, 6, -46] },
        marks: [{ t: "grip", j: "me.haR", label: "wrist pinned" }, { t: "mat", j: "op.haR" }, { t: "label", j: "me.elR", label: "elbow by the ear" }],
      },
      {
        cap: "Thread under. Your other hand slides under their upper arm just above the elbow and grabs your own wrist.",
        me: { EL: at("op.elR", [7, -1, 6]), hL: mix("me.elR", "me.haR", 0.72, [0, 2, 3]) },
        op: {},
        marks: [{ t: "grip", j: "me.haL", label: "own wrist" }, { t: "arrow", j: "me.haL", thin: true }],
      },
      {
        cap: "Paint the mat. The back of their hand stays on the mat while you slide it toward their hip.",
        me: { up: [-36, 1, 34] },
        op: { ER: [-27, 5, 45], hR: [-48, 4, 58] },
        marks: [{ t: "arrow", j: "op.haR", o: [0, -3, 0] }, { t: "mat", j: "op.haR" }, { t: "grip", j: "me.haL" }],
      },
      {
        cap: "Lift the elbow. Their elbow rises a little while the hand stays down.",
        me: {},
        op: { ER: [-27, 15, 46] },
        marks: [{ t: "attack", j: "op.shR" }, { t: "push", j: "op.elR", d: [0, 12, 0], label: "elbow up" }, { t: "mat", j: "op.haR" }],
      },
    ],
    mistake: {
      from: 3, cap: "Their wrist has lifted off the mat and the arm is straightening out of the lock.",
      me: {},
      op: { ER: [-34, 16, 46], hR: [-54, 26, 60] },
      marks: [{ t: "arrow", from: [-48, 4, 58], to: "op.haR", thin: true }, { t: "label", j: "op.haR", label: "off the mat" }],
    },
  },

  /* 17 ─ Side control escape. They are across you from your left (the far side), chest on chest. */
  sidescape: {
    yaw: 28, pitch: 38,
    frames: [
      {
        cap: "Frames. Both forearms press against their near shoulder and neck. Elbows stay tight to your ribs.",
        me: { pelvis: [14, 10, 0], up: [-1, 0, 0], front: [0, 1, 0], hf: null, curl: 0.05, head: [-1, 0.2, 0.1], look: [0, 1, -0.3],
          kL: [50, 60, -14], kR: [50, 60, 14], fL: [62, 4, -14], fR: [62, 4, 14], KL: null, KR: null,
          EL: [-20, 14, -19], hL: at("op.shL", [-2, -7, 4]), ER: [-22, 15, 18], hR: at("op.throat", [2, -3, 6]) },
        op: { pelvis: [-12, 12, -48], up: [-0.1, 0.36, 1], front: [0, -1, 0.3], hf: null, curl: 0.1, head: [-0.5, 0.1, 1], look: [-1, -0.4, 0.3],
          kR: [-60, 2, -62], fR: [-46, 4, -98], kL: [36, 2, -62], fL: [22, 4, -98],
          ER: [-52, 9, -12], hR: [-56, 5, 16], hL: [8, 5, 20], eL: [6, 20, -10] },
        marks: [{ t: "grip", j: "me.haL", label: "frame" }, { t: "grip", j: "me.haR", label: "frame" }, { t: "weight", j: "op.back" }],
      },
      {
        cap: "Bridge. Your hips lift into them for a moment.",
        me: { pelvis: [14, 27, 0], up: [-1, -0.33, 0], fL: [50, 4, -15], fR: [50, 4, 15], kL: [50, 60, -15], kR: [50, 60, 15] },
        op: { up: [-0.1, 0.5, 1], pelvis: [-12, 13, -50] },
        marks: [{ t: "push", j: "me.pelvis", d: [0, 14, -4], label: "bridge" }],
      },
      {
        cap: "Shrimp. Your hips slide away and you end on your side facing them.",
        me: { pelvis: [26, 13, 24], up: [-1, 0.02, -0.5], front: [0, 0.35, -1], head: [-1, 0.2, -0.3], look: [0, 0.3, -1],
          fL: [58, 5, 6], kL: [44, 30, -16], fR: [70, 4, 34], kR: [56, 40, 30],
          EL: null, eL: [-10, 6, -8], ER: null, eR: [-20, 30, 30] },
        op: { up: [-0.1, 0.36, 1], pelvis: [-12, 12, -48] },
        marks: [{ t: "arrow", j: "me.pelvis" }],
      },
      {
        cap: "Knee in. Your near knee slides across their stomach.",
        me: { KL: at("op.belly", [4, -8, 10]), kL: null, fL: [30, 6, -26] },
        op: { up: [-0.14, 0.5, 1] },
        marks: [{ t: "arrow", j: "me.knL" }, { t: "label", j: "me.knL", label: "knee in" }],
      },
      {
        cap: "Recover any guard. Closed, half or open: any of them counts.",
        me: { pelvis: [18, 13, 4], up: [-1, 0.1, -0.12], front: [0, 1, -0.1], curl: 0.3, head: [-1, 0.5, 0], look: [0.5, 1, -0.2],
          KL: null, KR: null, kL: at("op.waist", [-8, 4, -28]), fL: at("op.lowback", [5, -2, 4]), kR: at("op.waist", [-8, 4, 28]), fR: at("op.lowback", [4, 4, -4]), toeL: null, toeR: null,
          hL: at("op.elR", [-2, 3, 2]), hR: at("op.elL", [-2, 3, -2]), eL: [-10, 6, -30], eR: [-10, 6, 34] },
        op: { pelvis: [44, 26, -8], up: [-0.6, 1, 0.1], front: [-1, -0.3, 0.2], curl: 0, head: null, look: [-1, -0.4, 0.2],
          kR: null, kL: null, KL: [12, 5, 16], KR: [8, 5, -26], fL: [52, 4, 8], fR: [50, 4, -24],
          ER: null, hR: at("me.belly", [2, 3, -9]), eR: [30, 40, -50], hL: at("me.belly", [2, 3, 9]), eL: [30, 40, 40] },
        marks: [{ t: "label", j: "me.foL", label: "guard is back" }],
      },
    ],
    mistake: {
      from: 0, cap: "Your arms are straight and pushing away from your ribs. That is the armbar you are offering.",
      me: { EL: null, eL: [-30, 60, -20], hL: at("op.shL", [0, 2, 0]), ER: null, eR: [-30, 60, 10], hR: at("op.shR", [0, 2, 0]) },
      op: { up: [-0.1, 0.62, 1] },
      marks: [{ t: "attack", j: "me.elR" }, { t: "label", j: "me.elR", label: "straight arm" }],
    },
  },
});
