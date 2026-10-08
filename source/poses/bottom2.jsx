
/* ═══════════════ BOTTOM OF SIDE CONTROL ═══════════════
   You on your back, head toward −x. They are across your chest from your left side (−z),
   their head past your right shoulder (+z). Their left is toward your legs (+x). */
const meSCBot = {
  pelvis: [14, 10, 0], up: [-1, 0, 0], front: [0, 1, 0], hf: null, curl: 0.05, head: [-1, 0.2, 0.1], look: [0, 1, -0.3],
  kL: [50, 60, -14], kR: [50, 60, 14], fL: [62, 4, -14], fR: [62, 4, 14], KL: null, KR: null, toeL: null, toeR: null,
  EL: [-6, 13, -15], hL: at("op.hiL", [0, 2, 10]), ER: [-22, 15, 18], hR: at("op.throat", [2, -3, 6]), eL: null, eR: null,
};
const opSCTop = {
  pelvis: [-12, 12, -48], up: [-0.1, 0.36, 1], front: [0, -1, 0.3], hf: null, curl: 0.1, head: [-0.5, 0.1, 1], look: [-1, -0.4, 0.3],
  kR: [-60, 2, -62], fR: [-46, 4, -98], kL: [36, 2, -62], fL: [22, 4, -98], KL: null, KR: null, toeL: null, toeR: null,
  ER: [-52, 9, -12], hR: [-56, 5, 16], hL: [8, 5, 20], eL: [6, 20, -10], EL: null, eR: null,
};
const SC_FRAMES_MARKS = [{ t: "grip", j: "me.haR", label: "forearm on the neck" }, { t: "grip", j: "me.haL", label: "forearm on the hip" }, { t: "weight", j: "op.back" }];
/* shrimp away: on your left side, facing them */
const SC_SHRIMP = {
  me: { pelvis: [26, 12, 22], up: [-1, 0.02, -0.4], front: [0, 0.45, -0.9], head: [-1, 0.2, -0.3], look: [0, 0.3, -1],
    kL: [40, 26, -10], fL: [62, 5, 4], kR: [52, 44, 30], fR: [72, 4, 34] },
  op: { pelvis: [-8, 13, -44], up: [-0.1, 0.42, 1] },
};

Object.assign(anims, {

  /* Recover half guard from the bottom of side control */
  schalf: {
    yaw: 24, pitch: 40,
    frames: [
      {
        cap: "Frames. One forearm across their neck, the other on their hip. Elbows stay bent and tight.",
        me: { ...meSCBot }, op: { ...opSCTop },
        marks: SC_FRAMES_MARKS,
      },
      {
        cap: "Shrimp away. Bridge a little, then slide your hips away so you end on your side, facing them.",
        me: { ...SC_SHRIMP.me }, op: { ...SC_SHRIMP.op },
        marks: [{ t: "arrow", j: "me.pelvis" }],
      },
      {
        cap: "Bottom knee in. Your bottom knee slides into the space between you, low across their hip.",
        me: { kL: [8, 8, -10], fL: [40, 5, -6] },
        op: { kL: [30, 6, -44], fL: [26, 4, -84] },
        marks: [{ t: "arrow", j: "me.knL" }, { t: "label", j: "me.knL", label: "knee in" }],
      },
      {
        cap: "Catch a leg. Their near leg comes in as they follow you. Wrap it with both legs: half guard, on your side.",
        me: { kL: [8, 6, -8], fL: at("op.knL", [-8, 4, -12]), kR: [14, 36, -6], fR: at("op.knL", [-10, 10, -14]),
          EL: null, eL: [-10, 6, -30], hL: at("op.back", [10, 6, -6]) },
        op: { pelvis: [-8, 20, -36], up: [-0.12, 0.55, 1], KL: [20, 6, -24], kL: null, fL: [30, 4, -62], kR: [-46, 2, -60], fR: [-30, 4, -92] },
        marks: [{ t: "grip", j: "me.foL", label: "leg trapped" }, { t: "label", j: "me.pelvis", o: [0, -6, 0], label: "on your side" }],
      },
    ],
    mistake: {
      from: 1, cap: "You shrimp but stay flat on your back. Your knee cannot get in front of you.",
      me: { up: [-1, 0, 0], front: [0, 1, 0], head: [-1, 0.2, 0.1], look: [0, 1, -0.3], gray: ["torso"] },
      op: {},
      marks: [{ t: "label", j: "me.pelvis", label: "flat" }],
    },
  },

  /* Underhook and come up to your knees */
  scunder: {
    yaw: 24, pitch: 40,
    frames: [
      {
        cap: "Frames. One forearm across their neck, the other on their hip.",
        me: { ...meSCBot }, op: { ...opSCTop },
        marks: SC_FRAMES_MARKS,
      },
      {
        cap: "Shrimp away and turn in. You end on your side, facing them.",
        me: { ...SC_SHRIMP.me }, op: { ...SC_SHRIMP.op },
        marks: [{ t: "arrow", j: "me.pelvis" }],
      },
      {
        cap: "Swim the underhook. Your bottom arm slides under their arm and your hand goes to their back.",
        me: { EL: null, eL: [10, 4, -30], hL: at("op.back", [10, 8, -8]), head: [-1, 0.3, -0.6] },
        op: { up: [-0.1, 0.5, 1] },
        marks: [{ t: "arrow", j: "me.haL" }, { t: "grip", j: "me.haL", label: "underhook" }],
      },
      {
        cap: "Up to your knees. Drive into them with the underhook and come up on your knees, head tight to their chest.",
        me: { pelvis: [8, 32, 12], up: [-0.1, 0.75, -0.65], front: [0, -0.65, -0.75], curl: 0.35, head: [-0.1, 0.4, -1], look: [0, -0.4, -1],
          KL: [-10, 5, -12], KR: [12, 5, -12], kL: null, kR: null, fL: [-10, 4, 30], fR: [12, 4, 30], toeL: null, toeR: null,
          hL: at("op.back", [12, 6, -4]), eL: [-10, 40, -30], ER: null, eR: [20, 20, -20], hR: at("op.knL", [0, 8, 6]) },
        op: { pelvis: [-12, 30, -46], up: [-0.05, 0.8, 0.6], front: [0, -0.6, 0.8], head: [0, 0.3, 1], look: [0, -0.6, 1],
          kL: null, kR: null, KL: [6, 5, -60], KR: [-28, 5, -62], fL: [6, 4, -96], fR: [-28, 4, -98],
          ER: null, eR: [-40, 30, 0], hR: [-30, 3, -10], hL: at("me.back", [-6, 4, 0]), eL: [10, 40, -10] },
        marks: [{ t: "grip", j: "me.haL", label: "underhook" }, { t: "label", j: "me.neck", o: [0, 12, 0], label: "on your knees" }],
      },
    ],
    mistake: {
      from: 2, cap: "You reach the underhook while you are still flat. They crossface you back down.",
      me: { pelvis: [14, 10, 0], up: [-1, 0, 0], front: [0, 1, 0], head: [-1, 0, 0.6], look: [0, 1, 0.6], gray: ["torso"] },
      op: { hR: at("me.head", [2, -2, 10]) },
      marks: [{ t: "their", j: "op.haR", label: "crossface" }],
    },
  },

  /* Block the mount from the bottom of side control */
  scmountblock: {
    yaw: 24, pitch: 40,
    frames: [
      {
        cap: "They start the mount. Their knee lifts to slide across your belly.",
        me: { ...meSCBot },
        op: { ...opSCTop, pelvis: [-8, 18, -42], kL: [8, 34, -14], fL: [28, 8, -60] },
        marks: [{ t: "arrow", from: [30, 20, -40], to: "op.knL", thin: true }],
      },
      {
        cap: "Knee meets elbow. Your near knee comes up and your near elbow drops to meet it. That wall is what they cannot slide over.",
        me: { KL: [16, 36, -16], kL: null, fL: [44, 4, -12], EL: at("me.knL", [-8, 2, 2]), hL: at("op.hiL", [2, 0, 6]) },
        op: { kL: [10, 44, -26], fL: [30, 8, -58] },
        marks: [{ t: "grip", j: "me.knL", label: "knee to elbow" }, { t: "push", j: "op.knL", d: [10, 0, -10], label: "blocked" }],
      },
      {
        cap: "Shrimp in behind it. Hips away, knee stays in front of you. Now you can recover guard.",
        me: { pelvis: [26, 12, 22], up: [-1, 0.02, -0.4], front: [0, 0.45, -0.9], head: [-1, 0.2, -0.3], KL: [8, 22, -10], fL: [36, 5, -4], kR: [52, 44, 30], fR: [72, 4, 34], EL: at("me.knL", [-8, 4, 2]) },
        op: { pelvis: [-8, 16, -44], kL: [24, 6, -50], fL: [30, 4, -86] },
        marks: [{ t: "arrow", j: "me.pelvis" }, { t: "label", j: "me.knL", label: "knee shield" }],
      },
    ],
    mistake: {
      from: 0, cap: "Your near leg is flat on the mat. Their knee slides straight across into mount.",
      me: { kL: [50, 20, -14], fL: [70, 4, -12] },
      op: { pelvis: [-4, 26, -20], kL: [4, 10, 24], fL: [36, 4, 30] },
      marks: [{ t: "label", j: "me.knL", label: "leg flat" }],
    },
  },
});
