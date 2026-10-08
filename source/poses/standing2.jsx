
/* seated arm drag: you sit facing +x, they kneel in front of you facing −x */
const meSit = {
  pelvis: [-12, 10, 0], up: [0.3, 1, 0], front: [1, 0.1, 0], hf: null, curl: 0.3, head: null, look: [1, 0, 0],
  kL: [16, 60, -26], kR: [16, 60, 26], KL: null, KR: null, fL: [30, 4, -22], fR: [30, 4, 22], toeL: null, toeR: null,
  hL: [14, 40, -14], eL: [-10, 30, -34], hR: [16, 44, 12], eR: [-10, 30, 34], EL: null, ER: null,
};
const opKneelFar = {
  pelvis: [62, 27, 0], up: [-0.35, 1, 0], front: [-1, -0.2, 0], hf: null, curl: 0.1, head: null, look: [-1, -0.3, 0],
  KL: [26, 5, 16], KR: [26, 5, -16], kL: null, kR: null, fL: [68, 4, 14], fR: [68, 4, -14], toeL: null, toeR: null,
  hL: [26, 46, 14], eL: [50, 40, 44], hR: [20, 52, -8], eR: [44, 44, -40], EL: null, ER: null,
};

Object.assign(anims, {

  /* 13 ─ Arm drag to the back */
  dragback: {
    yaw: 24, pitch: 36,
    frames: [
      {
        cap: "Cross grip. Your hand takes their wrist on the diagonal, right hand to right wrist.",
        me: { ...meSit, hR: mix("op.elR", "op.haR", 0.86, [-1, 3, 2]) },
        op: { ...opKneelFar },
        marks: [{ t: "grip", j: "me.haR", label: "cross grip" }],
      },
      {
        cap: "Cup the arm. Your other hand cups behind their arm just above the elbow.",
        me: { hL: at("op.elR", [5, 1, -5]), eL: [0, 30, -40] },
        op: {},
        marks: [{ t: "grip", j: "me.haL", label: "behind the elbow" }, { t: "grip", j: "me.haR" }],
      },
      {
        cap: "Drag and go. Their arm is pulled across your body past your hip while your body moves the other way, toward their back.",
        me: { pelvis: [6, 10, -32], up: [0.25, 1, 0.2], front: [0.55, 0.1, 0.85], look: [0.6, 0, 0.8],
          fL: [36, 4, -56], kL: [30, 50, -40], fR: [30, 4, -6], kR: [24, 50, -10] },
        op: { pelvis: [50, 27, 4], up: [-0.95, 0.7, 0.3], look: [-1, -0.6, 0.3], hR: [-2, 26, 30], eR: [20, 30, 0],
          hL: [10, 3, 34], eL: [30, 30, 50], KL: [16, 5, 20], KR: [16, 5, -12], fL: [58, 4, 20], fR: [58, 4, -12] },
        marks: [{ t: "arrow", j: "op.haR" }, { t: "arrow", j: "me.pelvis", bow: -0.25 }],
      },
      {
        cap: "Land. Your chest lands on the back of their shoulder and your arm reaches around their waist.",
        me: { pelvis: [44, 48, -42], up: [-0.6, 0.35, 0.7], front: [0, -0.9, 0.45], curl: 0.2, look: [-0.5, -0.5, 0.7],
          kL: null, kR: null, KL: [54, 6, -30], KR: [38, 6, -42], fL: [56, 4, -72], fR: [40, 4, -84],
          hL: at("op.hiL", [-2, -2, 6]), EL: at("op.lowback", [-6, 14, 0]), hR: mix("op.elR", "op.haR", 0.7, [0, 3, -3]), eR: [0, 30, -40] },
        op: { pelvis: [44, 46, 6], up: [-1, 0, 0.05], front: [0, -1, 0], curl: 0.15, look: [-0.6, -1, 0],
          KL: [42, 5, 20], KR: [42, 5, -8], fL: [84, 4, 20], fR: [84, 4, -8], hR: [-8, 3, -10], eR: [0, 30, -30], hL: [-8, 3, 26], eL: [0, 30, 44] },
        marks: [{ t: "weight", j: "op.back", o: [0, 0, -12] }, { t: "grip", j: "me.haL", label: "round the waist" }],
      },
      {
        cap: "Climb. Seatbelt, then hooks. You are now in back control.",
        me: { pelvis: [52, 10, 0], up: [-0.14, 1, 0], front: [-1, 0, 0], curl: 0.3, head: [-0.3, 1, 0.8], look: [-1, -0.1, -0.3],
          KL: null, KR: null, kL: [20, 34, 40], kR: [20, 34, -40], fL: at("op.hiL", [-22, 10, -5]), fR: at("op.hiR", [-22, 10, 5]), toeL: [-0.3, -0.2, -1], toeR: [-0.3, -0.2, 1],
          EL: null, hL: at("op.sternum", [-3, -2, 1]), eL: at("op.shL", [-6, 6, 3]), hR: at("op.sternum", [-4, -4, -2]), eR: at("op.ribR", [-4, 0, -6]) },
        op: { pelvis: [22, 10, 0], up: [0.22, 1, 0], front: [-1, 0.2, 0], curl: 0.25, look: [-1, 0, 0],
          KL: null, KR: null, kL: [-6, 60, 18], kR: [-6, 60, -18], fL: [-28, 4, 20], fR: [-28, 4, -20],
          hL: at("me.haL", [-3, 3, 3]), eL: [20, 20, 40], hR: at("me.haR", [-3, 2, -3]), eR: [20, 20, -40] },
        marks: [{ t: "grip", j: "me.haL", label: "seatbelt" }, { t: "grip", j: "me.foL", label: "hooks" }],
      },
    ],
    mistake: {
      from: 2, cap: "You pulled the arm but stayed in front of them. They square up again.",
      me: { pelvis: [-12, 10, 0], up: [0.3, 1, 0], front: [1, 0.1, 0], look: [1, 0, 0], fL: [30, 4, -22], kL: [16, 60, -26], fR: [30, 4, 22], kR: [16, 60, 26], gray: ["torso", "legL", "legR"] },
      op: { pelvis: [58, 27, 0], up: [-0.5, 1, 0.1], look: [-1, -0.3, 0], hR: [8, 30, 24], hL: [22, 44, 14], eL: [50, 40, 44],
        KL: [22, 5, 16], KR: [22, 5, -16], fL: [64, 4, 14], fR: [64, 4, -14] },
      marks: [{ t: "label", j: "me.pelvis", label: "did not move" }],
    },
  },

  /* 14 ─ Arm drag to single leg (their lead leg is their left, nearest the viewer) */
  dragsingle: {
    yaw: -16, pitch: 13,
    frames: [
      {
        cap: "They pull back. Their weight shifts to their heels as they retract the arm.",
        me: { ...meStand, hR: [12, 96, -2], eR: [-14, 84, 30], hL: [4, 92, -14] },
        op: { ...opStand, pelvis: [42, 84, 0], up: [0.04, 1, 0], hR: [30, 100, -14], eR: [52, 84, -30], hL: [22, 98, 14] },
        marks: [{ t: "arrow", from: [14, 96, -4], to: "op.haR", thin: true }, { t: "weight", j: "op.foR", o: [8, 14, 0] }],
      },
      {
        cap: "Change level. Your knees bend and your back stays straight. Step in with the foot nearest their lead leg.",
        me: { pelvis: [-16, 60, 6], up: [0.5, 1, 0], curl: 0, look: [1, 0.2, 0], fR: [8, 5, 30], kR: [22, 44, 30], fL: [-36, 5, -8], kL: [-22, 34, -14],
          hR: [16, 70, 20], eR: [-8, 60, 34], hL: [14, 66, 2], eL: [-10, 56, -20] },
        op: {},
        marks: [{ t: "arrow", j: "me.pelvis" }, { t: "arrow", j: "me.foR", thin: true }],
      },
      {
        cap: "Catch the leg. Hands lock behind their knee, their leg is pinched between your thighs, and your head is inside against their ribs with your eyes up.",
        me: { pelvis: [-4, 54, 12], up: [28, 40, -6], head: [0.5, 1, -0.1], look: [1, 0.5, 0], fR: [14, 5, 34], kR: [26, 40, 32], fL: [-8, 5, -6], kL: [8, 30, 0],
          hR: at("op.knL", [7, 2, 3]), eR: [10, 60, 40], hL: at("op.knL", [8, -2, -3]), eL: [10, 56, -10] },
        op: { hL: at("me.back", [0, 4, 4]), eL: [30, 110, 30], hR: at("me.shL", [2, 4, -2]), eR: [50, 100, -30] },
        marks: [{ t: "grip", j: "me.haR", label: "hands locked" }, { t: "label", j: "me.head", o: [0, 14, 0], label: "head inside, eyes up" }],
      },
      {
        cap: "Hand off. Lift the leg high and tight. From here you finish the single leg.",
        me: { pelvis: [-8, 74, 8], up: [0.42, 1, -0.06], head: null, fR: [6, 5, 28], kR: [14, 44, 30], fL: [-24, 5, -10], kL: [-10, 44, -12],
          hR: at("op.knL", [6, -4, 4]), hL: at("op.knL", [8, -8, -2]) },
        op: { pelvis: [50, 84, -2], up: [-0.1, 1, 0], kL: null, KL: [18, 82, 12], fL: [-6, 56, 12], toeL: [-1, -0.4, 0], fR: [54, 5, -8], kR: [44, 50, -14],
          hL: at("me.head", [4, 8, 2]), hR: at("me.shL", [2, 4, -2]) },
        marks: [{ t: "arrow", j: "op.knL" }],
      },
    ],
    mistake: {
      from: 2, cap: "Your head is down and outside their body. That is the guillotine they are waiting for.",
      me: { head: [1, -0.5, 0.6], look: [0, -1, 0], up: [28, 34, 10] },
      op: { ER: at("me.nape", [0, 6, 8]), hL: at("me.throat", [0, -6, -3]), hR: at("op.haL", [0, -2, -4]), eR: [50, 80, -30] },
      marks: [{ t: "attack", j: "me.neck" }, { t: "label", j: "me.head", o: [0, -16, 0], label: "head outside" }],
    },
  },
});
