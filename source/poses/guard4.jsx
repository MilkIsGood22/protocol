
Object.assign(anims, {

  /* 5 ─ Kimura from closed guard (their right hand is posted beside your left hip, −z) */
  kimura: {
    yaw: 128, pitch: 30,
    frames: [
      {
        cap: "Catch the wrist. Your hand on that side grabs their wrist and holds it to the mat.",
        me: { ...meGuard, up: [-1, 0.1, 0], curl: 0.35, head: [-1, 0.5, -0.2], look: [0.5, 0.8, -0.5],
          hL: at("op.haR", [-1, 5, -2]), eL: [-30, 10, -50], hR: [-30, 6, 30], eR: [-52, 4, 44] },
        op: { ...opKneel, up: [-0.6, 1, 0], hR: [-2, 3, -27], eR: [10, 34, -52], hL: at("me.belly", [2, 3, 7]), eL: [14, 44, 50] },
        marks: [{ t: "grip", j: "me.haL", label: "wrist" }, { t: "mat", j: "op.haR" }],
      },
      {
        cap: "Sit up into it. Your guard opens and you sit up toward that arm. Your other arm reaches over their shoulder.",
        me: { pelvis: [4, 12, 2], up: [-0.5, 1, -0.32], front: [1, 0.3, -0.5], curl: 0.35, head: null, look: [1, 0, -0.6],
          fL: [34, 4, -36], kL: [22, 50, -46], fR: [40, 4, 30], kR: [22, 50, 40],
          hR: at("op.shR", [6, 5, -7]), eR: at("op.shR", [-14, 16, 6]) },
        op: { up: [-0.5, 1, 0.05] },
        marks: [{ t: "arrow", j: "me.neck" }, { t: "arrow", j: "me.haR", thin: true }, { t: "grip", j: "me.haL" }],
      },
      {
        cap: "Figure-four. That arm threads down behind their upper arm and grabs your own wrist. Their elbow is bent at 90 degrees.",
        me: { hR: mix("me.elL", "me.haL", 0.8, [1, 3, 2]), eR: at("op.elR", [8, 12, 2]) },
        op: { ER: [4, 37, -26], hR: [-8, 15, -28] },
        marks: [{ t: "grip", j: "me.haR", label: "own wrist" }, { t: "grip", j: "me.haL" }],
      },
      {
        cap: "Fall back and angle. Scoot your hips out until you are on your side facing the trapped arm. One leg hooks over their lower back.",
        me: { pelvis: [4, 14, 14], up: [-1, 0.14, -0.42], front: [0.2, 0.55, -1], curl: 0.3, head: [-1, 0.4, -0.5], look: [0.6, 0.3, -1],
          kR: at("op.ribL", [2, 12, 12]), fR: at("op.lowback", [8, 8, -16]), fL: [34, 5, -8], kL: [14, 36, -26] },
        op: { pelvis: [22, 25, 2], up: [-1, 0.5, -0.22], ER: at("me.sternum", [4, 2, -8]), hR: at("me.sternum", [18, -8, -22]), hL: [-44, 3, 30], eL: [-20, 40, 56] },
        marks: [{ t: "arrow", j: "me.pelvis" }, { t: "grip", j: "me.foR", label: "leg over the back" }, { t: "grip", j: "me.haL" }],
      },
      {
        cap: "Finish. Their elbow stays glued to your chest while you turn their hand up behind their back.",
        me: {},
        op: { hR: at("op.lowback", [-4, 10, -6]) },
        marks: [{ t: "attack", j: "op.shR" }, { t: "arrow", j: "op.haR", bow: 0.4 }, { t: "label", j: "op.elR", label: "glued to your chest" }],
      },
    ],
    mistake: {
      from: 4, cap: "Their elbow has drifted away from your chest and no leg is across their back. They roll forward and out.",
      me: { fR: [44, 4, 34], kR: [24, 46, 44], gray: ["legR"] },
      op: { ER: at("me.sternum", [14, 10, -26]), hR: at("me.sternum", [24, -6, -44]) },
      ghost: { pelvis: [0, 22, -34], up: [-1, -0.15, -0.5], front: [0, 1, 0], hR: [-30, 20, -40], ER: null, eR: [-20, 30, -60] },
      marks: [{ t: "arrow", from: "op.neck", to: [-34, 26, -46], thin: true }, { t: "label", j: "op.elR", label: "gap" }],
    },
  },

  /* 7 ─ Cross-collar choke from closed guard (gi) */
  crosscollar: {
    yaw: 74, pitch: 22, gi: true,
    frames: [
      {
        cap: "First grip, deep. One hand opens their collar and the other slides in palm up until it is behind their neck.",
        me: { ...meGuard, up: [-1, 0.1, 0], curl: 0.4, head: [-1, 0.5, 0],
          hL: at("op.sternum", [-2, -3, 6]), eL: [-30, 8, -44], hR: at("op.nape", [-2, -5, -8]), eR: [-24, 10, 46] },
        op: { ...opBroken, up: [-1, 0.5, 0] },
        marks: [{ t: "grip", j: "me.haR", label: "deep, behind the neck" }, { t: "grip", j: "me.haL", label: "opens the collar" }],
      },
      {
        cap: "Second grip, under. Your second hand goes under the first arm, deep into the other collar. Forearms cross under their chin.",
        me: { hL: at("op.nape", [-2, -5, 8]), eL: [-20, 6, -40] },
        op: {},
        marks: [{ t: "grip", j: "me.haL", label: "under the first arm" }, { t: "grip", j: "me.haR" }],
      },
      {
        cap: "Bring the head down. Your legs pull so their head comes to your chest.",
        me: { kL: [-24, 66, -38], kR: [-24, 66, 38], up: [-1, 0.06, 0], curl: 0.3 },
        op: { pelvis: [18, 25, 0], up: [-1, 0.26, 0], KL: [-18, 5, 22], KR: [-18, 5, -22], fL: [23, 4, 15], fR: [23, 4, -15], hL: [-64, 3, 36], hR: [-64, 3, -36] },
        marks: [{ t: "arrow", j: "me.knL" }, { t: "arrow", j: "me.knR" }, { t: "arrow", j: "op.head", thin: true }],
      },
      {
        cap: "Finish. Both wrists turn toward your face and your elbows draw back to your ribs.",
        me: { eL: [-34, 2, -26], eR: [-34, 2, 26] },
        op: {},
        marks: [{ t: "attack", j: "op.neck", o: [-4, 0, 9], r: 8 }, { t: "attack", j: "op.neck", o: [-4, 0, -9], r: 8 },
          { t: "push", j: "me.elL", d: [-8, -4, 6], label: "elbows back" }, { t: "push", j: "me.elR", d: [-8, -4, -6] }],
      },
    ],
    mistake: {
      from: 3, cap: "Shallow grips near the chest and elbows flared wide. The collar sits loose around the neck.",
      me: { hL: at("op.sternum", [-3, -4, 6]), hR: at("op.sternum", [-3, -4, -6]), eL: [-20, 30, -70], eR: [-20, 30, 70] },
      op: {},
      marks: [{ t: "label", j: "me.haR", label: "too shallow" }],
    },
  },

  /* 12 ─ Spider guard (gi) */
  spider: {
    yaw: 40, pitch: 26, gi: true,
    frames: [
      {
        cap: "Cuffs. Both your hands hold their sleeve cuffs, four fingers inside.",
        me: { ...meGuard, pelvis: [0, 13, 0], up: [-1, 0.16, 0], curl: 0.4, head: [-1, 0.7, 0], look: [1, 0.5, 0],
          kL: [20, 50, -40], kR: [20, 50, 40], fL: [38, 16, -20], fR: [38, 16, 20],
          hL: at("op.haR", [-3, 1, -2]), eL: [-30, 6, -44], hR: at("op.haL", [-3, 1, 2]), eR: [-30, 6, 44] },
        op: { ...opKneel, pelvis: [54, 24, 0], up: [-0.4, 1, 0], KL: [18, 5, 20], KR: [18, 5, -20], fL: [60, 4, 14], fR: [60, 4, -14],
          hL: [6, 30, 13], hR: [6, 30, -13], eL: [30, 36, 40], eR: [30, 36, -40] },
        marks: [{ t: "grip", j: "me.haL", label: "cuff" }, { t: "grip", j: "me.haR", label: "cuff" }],
      },
      {
        cap: "Feet on the biceps. The balls of your feet sit in the bend of both their elbows.",
        me: { fL: at("op.elR", [-5, -2, 0]), fR: at("op.elL", [-5, -2, 0]), kL: [4, 60, -34], kR: [4, 60, 34], toeL: [0.3, 1, 0], toeR: [0.3, 1, 0] },
        op: { ER: [24, 46, -22], EL: [24, 46, 22], hL: [4, 32, 14], hR: [4, 32, -14] },
        marks: [{ t: "grip", j: "me.foL", label: "foot on the biceps" }, { t: "grip", j: "me.foR" }, { t: "balance" }],
      },
      {
        cap: "Long and short. One leg straightens and the other bends. Their shoulders tilt and their balance tips.",
        me: {},
        op: { up: [-0.42, 1, -0.24], front: [-1, -0.3, 0.3], ER: [14, 40, -20], EL: [36, 60, 28], hL: [10, 36, 20], hR: [0, 28, -12] },
        marks: [{ t: "push", j: "me.foR", d: [10, 8, 4], label: "long" }, { t: "push", j: "me.foL", d: [-8, -6, 0], label: "short" }, { t: "balance" }],
      },
      {
        cap: "Switch. The legs swap. Keep rocking them from side to side.",
        me: {},
        op: { up: [-0.42, 1, 0.24], front: [-1, -0.3, -0.3], EL: [14, 40, 20], ER: [36, 60, -28], hR: [10, 36, -20], hL: [0, 28, 12] },
        marks: [{ t: "push", j: "me.foL", d: [10, 8, -4], label: "long" }, { t: "push", j: "me.foR", d: [-8, -6, 0], label: "short" }, { t: "balance" }],
      },
      {
        cap: "Hips off-center. Your hips shift to one side, so you are never flat underneath them.",
        me: { pelvis: [0, 13, 14], up: [-1, 0.16, 0.2], front: [0, 1, -0.25] },
        op: {},
        marks: [{ t: "arrow", j: "me.pelvis" }, { t: "balance" }],
      },
    ],
    mistake: {
      from: 2, cap: "Both legs are straight. They circle their hands free and step around.",
      me: { gray: ["legL", "legR"], hL: [-6, 30, -30], hR: [-6, 30, 30], fL: at("op.elR", [-5, -2, 0]), fR: at("op.elL", [-5, -2, 0]) },
      op: { up: [-0.4, 1, 0], front: [-1, -0.3, 0], EL: [40, 60, 30], ER: [40, 60, -30], hL: [24, 70, 44], hR: [24, 70, -44] },
      marks: [{ t: "arrow", from: "me.haL", to: "op.haR", thin: true }, { t: "arrow", from: "me.haR", to: "op.haL", thin: true }, { t: "label", j: "op.haL", label: "hands free" }],
    },
  },
});
