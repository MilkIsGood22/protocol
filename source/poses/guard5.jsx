
Object.assign(anims, {

  /* 6 ─ Omoplata from closed guard (their right arm is on the mat beside you, −z) */
  omoplata: {
    yaw: 140, pitch: 32,
    frames: [
      {
        cap: "Control and open. Hold that wrist, open your guard, and put a foot on their hip.",
        me: { ...meGuard, up: [-1, 0.1, 0], curl: 0.35, head: [-1, 0.5, -0.2], look: [0.5, 0.8, -0.5],
          hL: at("op.haR", [-1, 5, -2]), eL: [-30, 10, -50], hR: [-28, 6, 30], eR: [-52, 4, 44],
          fR: at("op.hiL", [-5, 2, 9]), kR: [-14, 56, 44], toeR: [0.2, 1, 0.2],
          fL: at("op.lowback", [6, 4, -14]), kL: at("op.waist", [-8, 2, -30]) },
        op: { ...opKneel, up: [-0.7, 1, 0], hR: [-2, 3, -27], eR: [10, 34, -52], hL: at("me.belly", [2, 3, 7]), eL: [14, 44, 50] },
        marks: [{ t: "grip", j: "me.haL", label: "wrist" }, { t: "push", j: "me.foR", d: [12, -2, -2], label: "push" }],
      },
      {
        cap: "Pivot the other way. This is the opposite of the armbar. Your head swings toward their knee on the trapped side.",
        me: { pelvis: [-8, 14, 6], up: [-0.22, 0.02, -1], curl: 0.2, head: [-0.2, 0.35, -1], look: [0.6, 1, 0.2],
          fL: at("op.shR", [10, 16, -4]), kL: [-34, 60, -30], toeL: null,
          hR: [-34, 5, -20], eR: [-50, 4, 0] },
        op: { pelvis: [24, 25, 0], up: [-1, 0.6, -0.08], hR: [-12, 3, -30] },
        marks: [{ t: "arrow", j: "me.head", bow: 0.35 }],
      },
      {
        cap: "Leg over the shoulder. Your shin lies across their upper back and their arm bends around your hip.",
        me: { pelvis: [-20, 15, -2], up: [-0.05, 0.04, -1],
          kL: at("op.shR", [-2, 11, -8]), fL: at("op.back", [6, 9, 12]), fR: [-46, 4, 20], kR: [-56, 40, 2], toeR: null,
          hL: at("op.haR", [0, 4, 2]) },
        op: { up: [-1, 0.36, -0.1], ER: at("me.hiL", [6, 10, -8]), hR: at("me.hiL", [4, 6, 14]), hL: [-40, 3, 36], eL: [-20, 40, 56] },
        marks: [{ t: "arrow", j: "me.foL", bow: -0.3 }, { t: "label", j: "op.elR", label: "arm bends round your hip" }],
      },
      {
        cap: "Sit up. You sit up beside them, facing the same way they face. Your arm reaches across their back and holds the far hip.",
        me: { pelvis: [-22, 11, -28], up: [0.42, 0.8, 0.36], front: [-0.8, 0.3, 0.4], curl: 0.3, head: null, look: [0.2, -0.3, 1],
          KL: [-58, 22, -16], kL: null, fL: [-78, 5, -20], KR: [-56, 24, -42], kR: null, fR: [-74, 5, -48],
          hL: at("op.hiL", [0, 9, 3]), eL: at("op.lowback", [-10, 16, -8]), hR: [-6, 3, -50], eR: [0, 30, -64] },
        op: { pelvis: [24, 38, 5], up: [-52, -27, -4], front: [-0.4, -1, 0], curl: 0, head: [-1, 0.1, 0.5], look: [-0.5, -0.4, 1],
          KL: [0, 5, 22], KR: [0, 5, -10], fL: [42, 4, 22], fR: [42, 4, -10],
          ER: at("me.hiL", [2, 14, 3]), hR: at("me.lowback", [2, 4, -6]), hL: [-44, 3, 34], eL: [-26, 26, 50] },
        marks: [{ t: "grip", j: "me.haL", label: "far hip" }, { t: "arrow", j: "me.neck" }],
      },
      {
        cap: "Flatten them. Scoot your hips away and stretch your legs until their chest is on the mat.",
        me: { pelvis: [-24, 11, -32], up: [0.3, 0.9, 0.34], KL: [-64, 13, -18], fL: [-104, 6, -18], KR: [-64, 13, -42], fR: [-104, 6, -44] },
        op: { pelvis: [22, 11, 6], up: [-1, 0.0, -0.06], front: [0, -1, 0], head: [-1, 0.15, 0.5], look: [-0.3, -0.2, 1],
          KL: [64, 6, 18], KR: [64, 6, -4], fL: [104, 5, 20], fR: [104, 5, -2], hL: [-56, 3, 34], eL: [-36, 12, 50] },
        marks: [{ t: "weight", j: "op.back" }, { t: "mat", j: "op.chest" }, { t: "arrow", j: "me.pelvis", thin: true }, { t: "grip", j: "me.haL" }],
      },
      {
        cap: "Finish. Lean forward toward their far shoulder.",
        me: { up: [-0.5, 0.8, 0.5], front: [-0.7, -0.3, 0.5], curl: 0.4, look: [-0.5, -0.6, 0.6] },
        op: { hR: at("me.lowback", [-4, 12, -2]) },
        marks: [{ t: "attack", j: "op.shR" }, { t: "arrow", j: "me.neck" }, { t: "grip", j: "me.haL" }],
      },
    ],
    mistake: {
      from: 4, cap: "No hand on the far hip. They roll forward and out.",
      me: { hL: [-40, 6, -10], eL: [-30, 30, 0], gray: ["armL"], up: [0, 1, 0.1] },
      op: {},
      ghost: { pelvis: [-34, 34, 30], up: [-0.6, -0.7, 0.3], front: [0.6, 0.6, 0.3], KL: [-20, 60, 50], KR: [-18, 56, 22], fL: [-52, 66, 56], fR: [-50, 68, 24],
        hR: [-30, 20, -20], ER: null, eR: [-50, 30, -10], hL: [-70, 3, 44], eL: [-60, 30, 60], head: [-1, -0.4, 0], look: [0, 1, 0] },
      marks: [{ t: "arrow", from: "op.pelvis", to: [-30, 44, 30], thin: true }, { t: "label", j: "me.haL", label: "no grip" }],
    },
  },
});
