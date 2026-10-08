
Object.assign(anims, {

  /* 3 ─ Triangle from closed guard. Their left arm is the "out" arm, their right arm stays "in".
         Your right leg (out-arm side) goes across the back of the neck. */
  triangle: {
    yaw: 62, pitch: 34,
    frames: [
      {
        cap: "One in, one out. Push one wrist back into their belly. Pull the other toward you.",
        me: { ...meGuard, up: [-1, 0.2, 0], curl: 0.45, head: [-1, 0.7, 0],
          hR: at("op.haL", [-2, 2, 3]), eR: [-30, 6, 50], hL: at("op.haR", [-2, 3, -3]), eL: [-34, 0, -44] },
        op: { ...opKneel, up: [-0.5, 1, 0], hL: at("op.belly", [-5, -2, 8]), eL: [20, 40, 60], hR: at("me.sternum", [16, 8, -8]), eR: [0, 40, -50] },
        marks: [{ t: "push", j: "me.haR", d: [10, 3, 0], label: "out" }, { t: "push", j: "me.haL", d: [-12, -2, 0], label: "in" }, { t: "grip", j: "me.haR" }, { t: "grip", j: "me.haL" }],
      },
      {
        cap: "Shoot the hips. Your leg on the out-arm side swings over that shoulder and lands across the back of their neck.",
        me: { pelvis: [2, 23, 0], up: [-1, -0.13, 0], curl: 0.1, head: [-1, 0.3, 0],
          kR: at("op.shL", [-6, 9, 8]), fR: at("op.nape", [4, 6, -17]), toeR: [0.2, -0.3, -1],
          hL: at("op.haR", [-2, 3, -3]) },
        op: { pelvis: [28, 24, 0], up: [-1, 0.72, 0], hR: at("me.sternum", [8, 8, -6]) },
        marks: [{ t: "arrow", j: "me.foR", bow: -0.3 }, { t: "push", j: "me.pelvis", d: [0, 13, 0], label: "hips up" }],
      },
      {
        cap: "Hold them there. Pull the in arm across your body and cross your ankles behind their back for a moment.",
        me: { kL: at("op.shR", [0, 5, -14]), fL: at("me.foR", [4, 4, -2]), hL: at("op.haR", [-2, 2, -2]), hR: at("op.elR", [-2, 4, 4]), eR: [-40, 10, 50] },
        op: { up: [-1, 0.58, 0], hR: at("me.ribR", [0, 6, 4]), eR: null, ER: mix("op.shR", "op.haR", 0.5, [4, -12, 0]) },
        marks: [{ t: "arrow", j: "op.haR", thin: true }, { t: "grip", j: "me.foL", label: "ankles crossed" }],
      },
      {
        cap: "Cut the angle. Grab the shin of your neck leg, put the other foot on their hip, and turn until you can see their ear.",
        me: { pelvis: [-2, 21, -4], up: [-0.62, -0.1, 1], head: [-0.5, 0.35, 1], look: [0.4, 1, -0.4],
          kR: null, KR: at("op.shL", [6, 12, 6]), fR: at("op.nape", [0, 9, -26]), toeR: [0, 0.3, -1],
          fL: at("op.hiR", [-4, 3, -8]), kL: [-30, 56, -50], hL: mix("me.knR", "me.foR", 0.35, [-2, 3, 0]), eL: [-60, 30, -20],
          hR: at("op.head", [-4, 4, 9]), eR: [-50, 30, 50] },
        op: { pelvis: [32, 26, 0], up: [-1, 0.66, 0.05], hL: [6, 3, 36], eL: [10, 40, 60], hR: [-4, 24, 28], ER: mix("op.shR", "op.haR", 0.5, [4, -10, 0]) },
        marks: [{ t: "grip", j: "me.haL", label: "own shin" }, { t: "arrow", j: "me.head", bow: -0.3 }, { t: "push", j: "me.foL", d: [10, -1, 2] }],
      },
      {
        cap: "Lock and finish. The ankle of your neck leg sits in the pit of your other knee. Knees squeeze, hands pull the head down.",
        me: { pelvis: [-6, 22, -6], KR: at("op.shL", [6, 10, 4]), fR: at("op.nape", [0, 8, -28]),
          kL: null, KL: at("me.foR", [3, 7, -2]), fL: [16, 44, -16],
          hL: at("op.head", [4, 9, -5]), eL: [-60, 30, -10], hR: at("op.head", [4, 9, 6]), eR: [-40, 40, 50] },
        op: { up: [-1, 0.6, 0.05], head: [-1, -0.25, 0], look: [-0.3, -1, 0] },
        marks: [{ t: "attack", j: "op.neck", o: [-3, 3, 9], r: 8 }, { t: "attack", j: "op.neck", o: [-3, 3, -9], r: 8 }, { t: "grip", j: "me.knL", label: "ankle in the knee pit" }],
      },
    ],
    mistake: {
      from: 4, cap: "You are square to them and the lock is over your toes, not your ankle. A gap shows beside their neck.",
      me: { pelvis: [2, 22, 0], up: [-1, -0.1, 0], head: [-1, 0.3, 0], look: [0.6, 1, 0], gray: ["torso"], KL: null, KR: null,
        kR: at("op.shL", [-6, 12, 14]), fR: at("op.nape", [3, 9, -14]), kL: at("me.toR", [2, 6, -4]), fL: at("op.lowback", [-4, 10, -20]),
        hL: at("op.head", [-6, 2, -9]), hR: at("op.head", [-6, 2, 9]) },
      op: { up: [-1, 0.7, 0], head: null, look: [-1, -0.5, 0] },
      marks: [{ t: "label", j: "op.shL", o: [0, 6, 8], label: "gap" }, { t: "label", j: "me.knL", label: "over the toes" }],
    },
  },
});
