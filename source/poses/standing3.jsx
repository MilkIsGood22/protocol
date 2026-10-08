
/* single leg, leg already lifted: you hold their left leg (nearest the viewer) high and tight, head inside */
const meSingle = {
  ...meStand, pelvis: [-8, 74, 8], up: [0.42, 1, -0.06], curl: 0.1, head: null, look: [1, 0.4, 0],
  fR: [6, 5, 28], kR: [14, 44, 30], fL: [-24, 5, -10], kL: [-10, 44, -12],
  hR: at("op.knL", [6, -4, 4]), eR: [0, 70, 44], hL: at("op.knL", [8, -8, -2]), eL: [0, 66, -14],
};
const opSingle = {
  ...opStand, pelvis: [50, 84, -2], up: [-0.1, 1, 0], kL: null, KL: [18, 82, 12], fL: [-6, 56, 12], toeL: [-1, -0.4, 0], fR: [54, 5, -8], kR: [44, 50, -14],
  hL: at("me.head", [4, 8, 2]), eL: [40, 110, 30], hR: at("me.shL", [2, 4, -2]), eR: [50, 100, -30],
};

Object.assign(anims, {

  /* 15 ─ Single leg finishes */
  singleleg: {
    yaw: -16, pitch: 14,
    frames: [
      {
        tag: "Finish A",
        cap: "Finish A, run the pipe. Your outside foot steps back in a circle while your shoulder drives down into their thigh.",
        me: { ...meSingle, pelvis: [-12, 62, 22], up: [0.75, 0.62, -0.3], look: [1, -0.2, -0.2], fL: [-40, 5, 34], kL: [-30, 34, 30], fR: [0, 5, 34], kR: [10, 36, 38] },
        op: { ...opSingle, pelvis: [46, 70, -4], up: [0.1, 1, 0], KL: [14, 60, 14], fL: [-14, 40, 16], kR: [50, 40, -14] },
        marks: [{ t: "arrow", from: [-24, 5, -10], to: "me.foL", bow: 0.5 }, { t: "push", j: "me.shR", d: [8, -12, 0], label: "shoulder drives down" }],
      },
      {
        tag: "Finish A",
        cap: "They sit. Their hips drop to the mat.",
        me: { pelvis: [0, 50, 26], up: [0.9, 0.5, -0.3], fL: [-34, 5, 40], kL: [-20, 20, 40], fR: [16, 5, 44], kR: [26, 30, 46] },
        op: { pelvis: [56, 11, -4], up: [0.55, 1, 0], curl: 0.3, look: [-1, 0, 0], KL: [26, 26, 14], fL: [-8, 34, 18], toeL: null, fR: [22, 4, -22], kR: [40, 40, -26],
          hL: [84, 3, 22], eL: [80, 30, 40], hR: [86, 3, -24], eR: [84, 30, -40] },
        marks: [{ t: "mat", j: "op.pelvis" }, { t: "arrow", j: "op.pelvis" }],
      },
      {
        cut: true, tag: "Finish B",
        cap: "Finish B, switch to the double. They hop and balance instead. Drop their foot, reach for the far knee, and drive across.",
        me: { ...meSingle, pelvis: [10, 58, 4], up: [0.8, 0.62, -0.3], look: [1, -0.1, -0.4], fR: [20, 5, 26], kR: [32, 36, 26], fL: [-14, 5, -14], kL: [0, 30, -16],
          hL: at("op.knR", [7, 2, -3]), eL: [20, 50, -30], hR: at("op.knL", [8, 2, 3]), eR: [20, 56, 36] },
        op: { ...opSingle, pelvis: [52, 82, -4], up: [0.1, 1, 0], KL: null, kL: [24, 50, 16], fL: [26, 5, 14], toeL: null, fR: [56, 5, -12], kR: [46, 50, -16],
          hL: at("me.back", [0, 5, 4]), hR: at("me.shL", [2, 4, -2]) },
        marks: [{ t: "grip", j: "me.haL", label: "far knee" }, { t: "push", j: "me.neck", d: [12, -3, -8], label: "drive across" }],
      },
      {
        tag: "Both finishes",
        cap: "Land on top. Both finishes end with you past their legs, chest on chest.",
        yaw: 12, pitch: 40,
        me: { pelvis: [36, 13, 44], up: [0.5, 0.36, -1], front: [0.3, -1, -0.2], curl: 0.1, head: [0.8, 0.1, -1], look: [0.6, -0.5, -0.3],
          kL: [70, 2, 62], fL: [50, 4, 96], kR: [-4, 2, 58], fR: [14, 4, 94],
          ER: [86, 9, 12], hR: [96, 5, -14], hL: [30, 5, -20], eL: [26, 20, 10] },
        op: { pelvis: [36, 10, -2], up: [1, 0, 0], front: [0, 1, 0], curl: 0, head: [1, 0.15, 0], look: [0, 1, 0.3],
          KL: null, kL: [0, 60, 18], fL: [-14, 4, 16], fR: [-16, 4, -18], kR: [0, 60, -20], toeL: null,
          hL: at("me.shR", [0, -6, 4]), eL: [70, 6, 36], hR: [50, 4, -40], eR: [70, 4, -46] },
        marks: [{ t: "weight", j: "me.back" }, { t: "label", j: "me.pelvis", label: "past their legs" }],
      },
    ],
    mistake: {
      from: 0, cap: "You are standing upright holding the leg with no movement. They hop and push your head down.",
      me: { ...meSingle, up: [0.2, 1, 0], head: [1, 0.2, 0.2], look: [0.7, -1, 0], gray: ["legL", "legR"] },
      op: { ...opSingle, hL: at("me.head", [-2, 9, 0]), hR: at("me.nape", [-2, 6, -2]) },
      marks: [{ t: "push", j: "op.haL", d: [-4, -12, 0], label: "head pushed down" }, { t: "label", j: "me.pelvis", label: "no movement" }],
    },
  },

});
