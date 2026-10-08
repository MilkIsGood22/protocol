
/* standing: you face +x, they face −x. Your right is +z (toward the viewer); their left is +z. */
const meStand = {
  pelvis: [-30, 80, 0], up: [0.16, 1, 0], front: [1, 0, 0], hf: null, curl: 0.15, head: null, look: [1, -0.05, 0],
  kL: [-24, 50, -22], kR: [8, 50, 18], KL: null, KR: null, fL: [-42, 5, -15], fR: [-14, 5, 15], toeL: null, toeR: null,
  hL: [-2, 96, -11], eL: [-26, 80, -32], hR: [2, 100, 12], eR: [-22, 82, 34], EL: null, ER: null,
};
const opStand = {
  pelvis: [38, 82, 0], up: [-0.16, 1, 0], front: [-1, 0, 0], hf: null, curl: 0.15, head: null, look: [-1, -0.05, 0],
  kL: [2, 50, 18], kR: [34, 50, -22], KL: null, KR: null, fL: [18, 5, 15], fR: [50, 5, -15], toeL: null, toeR: null,
  hL: [8, 100, 12], eL: [32, 82, 34], hR: [10, 96, -11], eR: [34, 80, -32], EL: null, ER: null,
};

Object.assign(anims, {

  /* 10 ─ Guillotine */
  guillotine: {
    yaw: -14, pitch: 14,
    frames: [
      {
        cap: "Wrap. Your arm goes over the back of their neck and under the chin. Their head ends up beside your ribs.",
        me: { ...meStand, pelvis: [-34, 78, 0], up: [0.9, 0.62, 0.1], curl: 0.25, head: [1, 0.3, 0], look: [0.6, -1, 0],
          fL: [-50, 5, -16], fR: [-28, 5, 16], kL: [-30, 44, -20], kR: [-6, 44, 18],
          ER: at("op.nape", [6, 3, 12]), hR: at("op.throat", [1, -8, -3]), hL: at("op.shR", [-2, 10, 2]), eL: [-20, 80, -40] },
        op: { ...opStand, pelvis: [34, 60, 0], up: [-1, 0.28, 0.25], front: [-0.3, -1, 0], curl: 0.1, head: [-1, 0.1, 0.25], look: [-0.7, -1, 0],
          fL: [34, 5, 18], fR: [70, 5, -12], kL: [10, 30, 22], kR: [56, 20, -14],
          hL: at("me.knR", [-6, 4, 5]), eL: [0, 50, 40], hR: at("me.knL", [-4, 6, -6]), eR: [0, 50, -30] },
        marks: [{ t: "grip", j: "me.haR", label: "wrist under the chin" }, { t: "arrow", from: "me.shR", to: "me.elR", thin: true }],
      },
      {
        cap: "Connect. Your other hand grabs the choking hand and pulls it up toward your chest.",
        me: { hL: at("me.haR", [-1, -3, -4]), eL: [10, 70, -40] },
        op: {},
        marks: [{ t: "grip", j: "me.haL", label: "hands connected" }, { t: "push", j: "me.haR", d: [0, 12, 0], label: "lift" }],
      },
      {
        cap: "Sit to guard. You sit back and lock your legs around their waist. You sit, you do not jump.",
        me: { pelvis: [-12, 13, 0], up: [-0.8, 0.6, 0.1], front: [0.6, 0.8, 0], curl: 0.35, head: [-0.5, 1, 0], look: [1, 0.2, 0.3],
          kL: at("op.waist", [-4, 0, -30]), kR: at("op.waist", [-4, 0, 30]), fL: at("op.lowback", [5, -2, 4]), fR: at("op.lowback", [4, 4, -4]) },
        op: { pelvis: [13, 31, 9], up: [-1, 0.2, 0.1], front: [-0.2, -1, 0], head: [-1, -0.1, 0.2],
          kL: null, kR: null, KL: [-22, 5, 28], KR: [-20, 5, -14], fL: [18, 4, 30], fR: [20, 4, -14],
          hL: [-44, 3, 44], eL: [-30, 30, 60], hR: [-50, 3, -28], eR: [-30, 30, -50] },
        marks: [{ t: "arrow", j: "me.pelvis" }, { t: "grip", j: "me.foL", label: "legs locked" }, { t: "label", j: "me.pelvis", label: "sit, do not jump" }],
      },
      {
        cap: "Finish. Your back arches, your forearm lifts toward your chest, and you crunch toward the choking-arm side.",
        me: { up: [-0.8, 0.5, 0.3], curl: -0.25, head: [-0.8, 0.6, 0.2] },
        op: { pelvis: [15, 31, 12], head: [-1, 0.1, 0.25] },
        marks: [{ t: "attack", j: "op.throat" }, { t: "push", j: "me.haR", d: [-4, 12, 0], label: "lift" }],
      },
    ],
    mistake: {
      from: 2, cap: "Your legs are open and they are walking around to the side away from their head.",
      me: { fL: [30, 4, -30], kL: [14, 40, -34], fR: [34, 4, 26], kR: [16, 40, 32], gray: ["legL", "legR"] },
      op: { pelvis: [-2, 31, -34], up: [-0.7, 0.2, 1], front: [0.2, -1, 0], KL: [-28, 5, -22], KR: [-20, 5, -66], fL: [10, 4, -42], fR: [18, 4, -82],
        hL: [-56, 3, 30], hR: [-60, 3, -10] },
      marks: [{ t: "arrow", from: [14, 30, 10], to: "op.pelvis" }, { t: "label", j: "me.knR", label: "legs open" }],
    },
  },

  /* 16 ─ Grip breaks and inside position */
  gripbreak: {
    yaw: -10, pitch: 10,
    fit: ["pelvis", "neck", "head", "shL", "shR", "elL", "elR", "haL", "haR", "hiL", "hiR"],
    frames: [
      {
        cap: "Their grip. Note where they hold you.",
        me: { ...meStand, hR: [6, 98, 12], hL: [-8, 94, -10] },
        op: { ...opStand, hL: mix("me.elR", "me.haR", 0.82, [1, 3, 2]), hR: [12, 96, -12] },
        marks: [{ t: "their", j: "op.haL", label: "their grip" }],
      },
      {
        cap: "Two on one. Your free hand takes their gripping wrist. Push it away while your held arm snaps back toward your hip, elbow leading.",
        me: { hL: mix("op.elL", "op.haL", 0.82, [-1, 3, -3]), eL: [-20, 76, -30], hR: [-22, 84, 19], ER: [-40, 96, 22] },
        op: { hL: [16, 88, 9], eL: [34, 84, 36] },
        marks: [{ t: "grip", j: "me.haL", label: "their wrist" }, { t: "arrow", j: "me.haR" }, { t: "push", j: "op.haL", d: [10, -6, 0], label: "push" }],
      },
      {
        cap: "Replace. Before they regrip, your hands take your own grips: collar and sleeve in the gi, inside ties in no-gi.",
        me: { ER: null, eR: [-10, 84, 34], hR: at("op.nape", [-2, 0, 8]), hL: at("op.elR", [-4, 3, 5]), eL: [-10, 78, -30] },
        op: { hL: [10, 94, 16], hR: [12, 92, -16] },
        marks: [{ t: "grip", j: "me.haR", label: "collar tie" }, { t: "grip", j: "me.haL", label: "inside tie" }],
      },
      {
        cap: "Inside position. Your arms are inside theirs.",
        me: { green: ["armL", "armR"], hR: at("op.shL", [-7, -6, -7]), hL: at("op.shR", [-7, -6, 7]), eR: [-6, 84, 24], eL: [-6, 84, -24] },
        op: { gray: ["armL", "armR"], hL: at("me.shR", [2, 0, 7]), eL: [20, 86, 44], hR: at("me.shL", [2, 0, -7]), eR: [20, 86, -44] },
        marks: [{ t: "label", j: "me.elR", label: "inside" }, { t: "label", j: "op.elL", label: "outside" }],
      },
    ],
    mistake: {
      from: 1, cap: "The grip is broken but your hands are empty and paused. They take a new grip first.",
      me: { hL: [-4, 90, -14], eL: null, hR: [-8, 88, 16], ER: null, gray: ["armL", "armR"] },
      op: { hL: at("me.nape", [2, 0, 6]), eL: [14, 90, 40], hR: mix("me.elL", "me.haL", 0.8, [1, 3, -2]) },
      marks: [{ t: "their", j: "op.haL", label: "they grip first" }, { t: "their", j: "op.haR" }],
    },
  },
});
