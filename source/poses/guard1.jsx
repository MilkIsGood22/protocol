
Object.assign(anims, {

  /* 1 ─ Closed guard posture break */
  posture: {
    yaw: -32, pitch: 24,
    frames: [
      {
        cap: "Grips. One hand high on the collar or behind the neck, the other on a wrist or sleeve.",
        me: { ...meGuard, up: [-1, 0.6, 0], curl: 0.8, head: [-1, 1, 0], look: [1, 0.6, 0],
          hR: at("op.neck", [-4, -6, 6]), eR: [-10, 14, 50], hL: mix("op.elR", "op.haR", 0.85, [-1, 3, -2]), eL: [-30, 4, -50] },
        op: { ...opKneel, up: [-0.62, 1, 0] },
        marks: [{ t: "grip", j: "me.haR", label: "collar" }, { t: "grip", j: "me.haL", label: "wrist" }, { t: "balance" }],
      },
      {
        cap: "Knees to chest. Your thighs pull them forward and your arms pull in the same beat.",
        me: { up: [-1, 0.15, 0], curl: 0.35, head: [-1, 0.5, 0], look: [0.6, 1, 0], kL: [-22, 70, -38], kR: [-22, 70, 38], eR: [-40, 0, 40] },
        op: { pelvis: [24, 25, 0], up: [-1, 0.62, 0], KL: [-12, 5, 21], KR: [-12, 5, -21], fL: [29, 4, 15], fR: [29, 4, -15], hR: [-26, 26, -14], hL: [-30, 22, 30] },
        marks: [{ t: "arrow", j: "me.knL" }, { t: "arrow", j: "me.knR" }, { t: "arrow", j: "op.neck", thin: true }, { t: "balance" }],
      },
      {
        cap: "Hands hit the mat. Their hands land past your shoulders and their head is over your chest.",
        me: { up: [-1, 0.08, 0], curl: 0.25, head: [-1, 0.3, 0] },
        op: { pelvis: [20, 25, 0], up: [-1, 0.3, 0], look: [-0.5, -1, 0], KL: [-16, 5, 21], KR: [-16, 5, -21], fL: [25, 4, 15], fR: [25, 4, -15],
          hL: [-60, 3, 34], hR: [-60, 3, -34], eL: [-30, 30, 60], eR: [-30, 30, -60] },
        marks: [{ t: "mat", j: "op.haL" }, { t: "mat", j: "op.haR" }, { t: "weight", j: "op.back" }, { t: "balance" }],
      },
      {
        cap: "Lock it down. One arm wraps over their back or behind their head. Ankles stay crossed.",
        me: { hR: at("op.neck", [8, 4, -13]), eR: at("op.neck", [-6, 22, 24]), hL: at("op.elR", [2, 5, 2]), eL: [-40, 30, -60] },
        op: {},
        marks: [{ t: "grip", j: "me.haR", label: "head stays down" }, { t: "grip", j: "me.foL", label: "ankles crossed" }],
      },
    ],
    mistake: {
      from: 0, cap: "Arms pulling alone. Your legs are doing nothing, so their spine stays upright.",
      me: { gray: ["legL", "legR"], eR: [-20, 0, 50], hR: at("op.sternum", [-4, 0, 5]) },
      op: { up: [-0.3, 1, 0] },
      marks: [{ t: "balance" }],
    },
  },
});
