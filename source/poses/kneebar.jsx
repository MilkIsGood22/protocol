
Object.assign(anims, {

  /* 11 ─ Knee bar (their left leg, nearest you). They lie head toward +x. You end on your side at +z, facing −z. */
  kneebar: {
    yaw: 150, pitch: 36,
    frames: [
      {
        cap: "Hips above the knee. Your hips sit on their thigh, higher than the kneecap.",
        me: { pelvis: [24, 27, 10], up: [-0.45, 1, 0], front: [-1, 0, 0], hf: null, curl: 0.3, head: null, look: [-1, -0.5, 0],
          KL: [-8, 5, 28], KR: [-8, 5, -8], fL: [30, 4, 30], fR: [30, 4, -10], toeL: null, toeR: null,
          hL: at("op.knL", [0, 8, 5]), eL: [0, 40, 40], hR: at("op.knL", [-2, 8, -5]), eR: [0, 40, -20], EL: null, ER: null },
        op: { pelvis: [46, 10, 0], up: [1, 0, 0], front: [0, 1, 0], hf: null, curl: 0.15, head: [1, 0.3, 0], look: [-0.6, 1, 0],
          KL: null, KR: null, fL: [-40, 8, 10], kL: [2, 40, 10], fR: [8, 4, -42], kR: [30, 50, -36], toeL: null, toeR: null,
          hL: [62, 3, 30], eL: [80, 6, 36], hR: [62, 3, -30], eR: [80, 6, -36], EL: null, ER: null },
        marks: [{ t: "weight", j: "me.pelvis" }, { t: "label", j: "op.knL", o: [0, 0, 8], label: "their knee" }],
      },
      {
        cap: "Wrap the thigh. You fall to your side with their leg between yours. Your knees pinch their thigh and your feet lock behind it.",
        me: { pelvis: [18, 16, 29], up: [-1, 0.16, -0.1], front: [0, 0.1, -1], curl: 0.35, head: [-1, 0.35, -0.2], look: [0.3, 0.6, -1],
          kL: null, kR: null, KR: [16, 38, -13], fR: [50, 10, -10], KL: [16, 7, -14], fL: [56, 6, -17],
          hR: mix("op.knL", "op.foL", 0.6, [3, 4, 4]), eR: [-20, 50, 30], hL: mix("op.knL", "op.foL", 0.5, [3, -4, 4]), eL: [-10, 4, 0] },
        op: { pelvis: [46, 12, 0], front: [0, 1, 0.5], curl: 0.2, look: [-0.4, 1, 0.5],
          kL: null, KL: [6, 22, 14], fL: [-34, 35, 14] },
        marks: [{ t: "grip", j: "me.foL", label: "feet locked" }, { t: "push", j: "me.knR", d: [0, -9, 0], label: "knees pinch" }, { t: "push", j: "me.knL", d: [0, 9, 0] }],
      },
      {
        cap: "Hug the shin. Their lower leg is hugged to your chest with their heel beside your head.",
        me: { up: [-1, 0.06, -0.12], curl: 0.2, head: [-1, 0.3, -0.4], look: [-0.2, 0.3, -1],
          hR: at("op.foL", [9, 3, -6]), eR: [-30, 46, 10], hL: at("op.foL", [9, -3, -6]), eL: [-30, 4, 6] },
        op: { KL: [6, 21, 14], fL: [-36, 26, 16] },
        marks: [{ t: "grip", j: "me.haR" }, { t: "label", j: "op.foL", o: [-6, 14, 0], label: "heel by your head" }],
      },
      {
        cap: "Finish slowly. Your hips press forward a little at a time.",
        me: { pelvis: [18, 16, 25], up: [-1, 0.06, 0.04], curl: -0.2, hR: at("op.foL", [9, 3, -4]), hL: at("op.foL", [9, -3, -4]) },
        op: { KL: [7, 21, 10], fL: [-36, 26, 19] },
        marks: [{ t: "attack", j: "op.knL" }, { t: "push", j: "me.pelvis", d: [0, 0, -12], label: "hips forward, slowly" }],
      },
    ],
    mistake: {
      from: 2, cap: "Your hips have slid below their knee and the leg bends free.",
      me: { pelvis: [-8, 16, 29], KR: [-10, 38, -13], fR: [24, 10, -10], KL: [-10, 7, -14], fL: [30, 6, -17],
        hR: mix("op.knL", "op.foL", 0.7, [3, 4, 4]), hL: mix("op.knL", "op.foL", 0.6, [3, -4, 4]) },
      op: { KL: [6, 22, 14], fL: [-24, 8, 22] },
      marks: [{ t: "label", j: "me.pelvis", label: "hips below the knee" }, { t: "arrow", from: [-36, 26, 16], to: "op.foL", thin: true }],
    },
  },
});
