
/* ═══════════════ STRENGTH FORM LOOPS (one figure) ═══════════════
   You stand at the origin facing +x. Your left is −z, your right is +z (toward the viewer). */
const meTall = {
  pelvis: [0, 89, 0], up: [0.02, 1, 0], front: [1, 0, 0], hf: null, curl: 0, head: null, look: [1, -0.1, 0],
  kL: [30, 48, -11], kR: [30, 48, 11], KL: null, KR: null, fL: [0, 5, -12], fR: [0, 5, 12], toeL: [1, 0, -0.08], toeR: [1, 0, 0.08],
  hL: [4, 82, -20], hR: [4, 82, 20], eL: [-20, 112, -26], eR: [-20, 112, 26], EL: null, ER: null,
};
/* lying on your back, head toward −x, knees bent, feet flat */
const meSupine = {
  pelvis: [0, 11, 0], up: [-1, 0.03, 0], front: [0, 1, 0], hf: null, curl: 0.1, head: [-1, 0.15, 0], look: [0.2, 1, 0],
  kL: [24, 60, -16], kR: [24, 60, 16], KL: null, KR: null, fL: [34, 4, -15], fR: [34, 4, 15], toeL: [1, 0, 0], toeR: [1, 0, 0],
  hL: [-44, 64, -22], hR: [-44, 64, 22], eL: [-30, 30, -50], eR: [-30, 30, 50], EL: null, ER: null,
};

Object.assign(anims, {

  rdl: {
    single: true, loop: true, yaw: -24, pitch: 10, props: [{ t: "barbell", half: 64, plate: 16 }],
    frames: [
      {
        cap: "Stand tall. The bar rests against your thighs, knees soft.",
        me: { ...meTall, hL: [6, 82, -21], hR: [6, 82, 21] },
        marks: [{ t: "label", j: "me.pelvis", o: [-10, 0, 0], label: "soft knees" }],
      },
      {
        cap: "Push your hips back. Your back stays flat and the bar slides down your legs to just below the knee.",
        me: { pelvis: [-24, 82, 0], up: [0.88, 0.47, 0], front: [0.47, -0.88, 0], look: [0.6, -0.8, 0], head: [0.9, 0.42, 0],
          hL: [10, 53, -21], hR: [10, 53, 21], kL: [40, 46, -11], kR: [40, 46, 11] },
        marks: [{ t: "arrow", j: "me.pelvis" }, { t: "label", j: "me.back", o: [0, 10, 0], label: "flat back" }, { t: "label", j: "me.haR", o: [8, -6, 0], label: "bar close" }],
      },
    ],
    mistake: {
      from: 1, cap: "Your back rounds and the bar drifts away from your legs.",
      me: { curl: 0.55, hL: [24, 46, -21], hR: [24, 46, 21], head: [0.7, -0.4, 0] },
      marks: [{ t: "label", j: "me.back", o: [0, 12, 0], label: "rounded" }, { t: "label", j: "me.haR", o: [8, -6, 0], label: "bar away" }],
    },
  },

  row: {
    single: true, loop: true, yaw: -24, pitch: 10, props: [{ t: "barbell", half: 64, plate: 15 }],
    frames: [
      {
        cap: "Hinge and hold. Hips back, back flat, about 45 degrees. The bar hangs under your shoulders.",
        me: { ...meTall, pelvis: [-20, 82, 0], up: [0.75, 0.66, 0], front: [0.66, -0.75, 0], look: [0.6, -0.8, 0], head: [0.8, 0.6, 0],
          kL: [40, 46, -11], kR: [40, 46, 11], hL: [16, 62, -20], hR: [16, 62, 20], eL: [30, 80, -40], eR: [30, 80, 40] },
        marks: [{ t: "label", j: "me.back", o: [0, 10, 0], label: "flat back" }],
      },
      {
        cap: "Row. Pull the bar to your lower ribs, elbows back past your body. Lower it with control.",
        me: { hL: [4, 82, -19], hR: [4, 82, 19], eL: [-30, 112, -30], eR: [-30, 112, 30] },
        marks: [{ t: "arrow", j: "me.haR" }, { t: "label", j: "me.elR", label: "elbows back" }],
      },
    ],
    mistake: {
      from: 1, cap: "Your chest pops up and you heave the bar with your back instead of rowing it.",
      me: { up: [0.3, 1, 0], front: [1, -0.3, 0], head: [0.3, 1, 0], hL: [14, 74, -19], hR: [14, 74, 19] },
      marks: [{ t: "label", j: "me.neck", label: "standing up" }],
    },
  },

  floor: {
    single: true, loop: true, yaw: -30, pitch: 22, props: [{ t: "barbell", half: 64, plate: 15 }],
    frames: [
      {
        cap: "Lock out. Lying on the mat, knees bent, the bar is straight above your chest.",
        me: { ...meSupine, hL: [-40, 64, -24], hR: [-40, 64, 24], eL: [-40, 40, -60], eR: [-40, 40, 60] },
        marks: [],
      },
      {
        cap: "Lower until your upper arms touch the mat, elbows about 45 degrees from your sides. Pause, then press.",
        me: { EL: [-30, 5, -34], ER: [-30, 5, 34], hL: [-36, 31, -27], hR: [-36, 31, 27] },
        marks: [{ t: "mat", j: "me.elR" }, { t: "label", j: "me.elR", o: [0, 6, 6], label: "elbow touches, pause" }],
      },
    ],
    mistake: {
      from: 1, cap: "Your elbows flare straight out to the sides. That loads the shoulder.",
      me: { EL: [-46, 5, -44], ER: [-46, 5, 44], hL: [-46, 31, -32], hR: [-46, 31, 32] },
      marks: [{ t: "label", j: "me.elR", o: [0, 6, 6], label: "flared" }],
    },
  },

  abwheel: {
    single: true, loop: true, yaw: -22, pitch: 12, props: [{ t: "wheel" }],
    frames: [
      {
        cap: "Start on your knees. The wheel sits under your shoulders, arms straight.",
        me: { pelvis: [-4, 48, 0], up: [0.92, 0.38, 0], front: [0.38, -0.92, 0], hf: null, curl: 0.25, head: [0.9, 0.2, 0], look: [0.3, -1, 0],
          KL: [0, 6, -10], KR: [0, 6, 10], kL: null, kR: null, fL: [-40, 6, -10], fR: [-40, 6, 10], toeL: [-1, -0.1, 0], toeR: [-1, -0.1, 0],
          hL: [42, 12, -9], hR: [42, 12, 9], eL: [42, 40, -30], eR: [42, 40, 30], EL: null, ER: null },
        marks: [],
      },
      {
        cap: "Roll out only as far as your back stays flat. Abs tight, hips follow the wheel.",
        me: { pelvis: [36, 27, 0], up: [0.985, 0.16, 0], front: [0.16, -0.985, 0], curl: 0.1, head: [1, 0.1, 0],
          hL: [126, 12, -9], hR: [126, 12, 9], eL: [100, 50, -30], eR: [100, 50, 30] },
        marks: [{ t: "arrow", j: "me.haR" }, { t: "label", j: "me.back", o: [0, 10, 0], label: "flat back" }],
      },
    ],
    mistake: {
      from: 1, cap: "Your hips sag toward the mat and your lower back arches.",
      me: { pelvis: [36, 18, 0], curl: -0.5 },
      marks: [{ t: "label", j: "me.lowback", o: [0, -8, 0], label: "sagging" }],
    },
  },

  pinch: {
    single: true, yaw: -26, pitch: 10, props: [{ t: "plate", j: "haL", o: [0, -9, 0], n: [0, 0, 1], r: 15 }, { t: "plate", j: "haR", o: [0, -9, 0], n: [0, 0, 1], r: 15 }],
    frames: [
      {
        cap: "Pinch the plates smooth side out, fingers on one side and thumb on the other. Stand tall and hold.",
        me: { ...meTall, hL: [2, 80, -24], hR: [2, 80, 24], eL: [-10, 110, -30], eR: [-10, 110, 30] },
        marks: [{ t: "grip", j: "me.haR", label: "pinch" }, { t: "label", j: "me.neck", o: [-6, 6, 0], label: "shoulders back" }],
      },
    ],
  },

  lunge: {
    single: true, loop: true, yaw: -28, pitch: 10, props: [{ t: "barbell", half: 64, plate: 13 }],
    frames: [
      {
        cap: "Stand with the bar across your upper back, hands just outside your shoulders.",
        me: { ...meTall, hL: at("me.neck", [-7, -3, -40]), hR: at("me.neck", [-7, -3, 40]), eL: at("me.neck", [-18, -26, -36]), eR: at("me.neck", [-18, -26, 36]) },
        marks: [],
      },
      {
        cap: "Step back. Your back knee lowers to just above the mat, front shin stays upright, chest tall. Push through the front foot to stand.",
        me: { pelvis: [-42, 54, 0], up: [0.06, 1, 0], kL: null, KL: [0, 48, -12], fL: [0, 5, -12], KR: [-50, 12, 12], kR: null, fR: [-90, 12, 12], toeR: [0.6, -0.8, 0] },
        marks: [{ t: "arrow", j: "me.foR", thin: true }, { t: "label", j: "me.knL", o: [8, 0, 0], label: "shin upright" }],
      },
    ],
    mistake: {
      from: 1, cap: "Your chest folds forward and the front knee shoots past your toes.",
      me: { pelvis: [-30, 56, 0], up: [0.6, 1, 0], KL: [18, 40, -12] },
      marks: [{ t: "label", j: "me.knL", o: [8, 0, 0], label: "knee too far" }],
    },
  },

  ohp: {
    single: true, loop: true, yaw: -24, pitch: 8, props: [{ t: "barbell", half: 64, plate: 13 }],
    frames: [
      {
        cap: "Bar on the front of your shoulders. Squeeze your glutes and brace your abs.",
        me: { ...meTall, hL: [10, 136, -23], hR: [10, 136, 23], eL: [14, 110, -30], eR: [14, 110, 30] },
        marks: [{ t: "label", j: "me.pelvis", o: [-10, 0, 0], label: "glutes tight" }],
      },
      {
        cap: "Press straight up. Move your head back a little to let the bar pass, then push your head through at the top.",
        me: { hL: [0, 191, -23], hR: [0, 191, 23], eL: [0, 160, -40], eR: [0, 160, 40] },
        marks: [{ t: "arrow", j: "me.haR" }],
      },
    ],
    mistake: {
      from: 1, cap: "You lean back and your lower back arches to finish the press.",
      me: { up: [-0.3, 1, 0], curl: -0.4, hL: [-18, 186, -23], hR: [-18, 186, 23] },
      marks: [{ t: "label", j: "me.lowback", o: [-8, 0, 0], label: "arched" }],
    },
  },

  pullup: {
    single: true, loop: true, yaw: -26, pitch: 6, props: [{ t: "bar", a: [10, 206, -70], b: [10, 206, 70], r: 1.6 }],
    frames: [
      {
        cap: "Dead hang. Hands a little wider than your shoulders, arms straight.",
        me: { pelvis: [2, 101, 0], up: [0.06, 1, 0], front: [1, 0, 0], hf: null, curl: 0.05, head: null, look: [1, 0.2, 0],
          kL: at("me.pelvis", [20, -40, -10]), kR: at("me.pelvis", [20, -40, 10]), KL: null, KR: null,
          fL: at("me.pelvis", [-12, -80, 2]), fR: at("me.pelvis", [-14, -78, -2]), toeL: [0.4, -1, 0], toeR: [0.4, -1, 0],
          hL: [10, 205, -24], hR: [10, 205, 24], eL: [0, 180, -40], eR: [0, 180, 40], EL: null, ER: null },
        marks: [],
      },
      {
        cap: "Pull until your chin clears the bar. Elbows drive down to your ribs. Lower all the way.",
        me: { pelvis: [-16, 144, 0], up: [0.18, 1, 0], look: [1, 0.3, 0], head: [0.1, 1, 0], eL: [-12, 168, -40], eR: [-12, 168, 40] },
        marks: [{ t: "arrow", j: "me.neck" }, { t: "label", j: "me.elR", label: "elbows down" }],
      },
    ],
    mistake: {
      from: 1, cap: "Half reps. You stop short and kick your legs to get up.",
      me: { pelvis: [-8, 124, 0], kL: at("me.pelvis", [30, -10, -10]), kR: at("me.pelvis", [30, -10, 10]), fL: at("me.pelvis", [10, -60, -6]), fR: at("me.pelvis", [10, -60, 6]) },
      marks: [{ t: "label", j: "me.knR", label: "kicking" }],
    },
  },

  plank: {
    single: true, yaw: -24, pitch: 14,
    frames: [
      {
        cap: "Elbows under your shoulders, body in one straight line from head to heels. Squeeze glutes and abs, breathe.",
        me: { pelvis: [-49, 23, 0], up: [0.976, 0.214, 0], front: [0.214, -0.976, 0], hf: null, curl: 0, head: [1, 0.2, 0], look: [0.3, -1, 0],
          KL: null, KR: null, kL: [-90, -10, -10], kR: [-90, -10, 10], fL: [-130, 15, -10], fR: [-130, 15, 10], toeL: [0.35, -1, 0], toeR: [0.35, -1, 0],
          EL: [0, 5, -14], ER: [0, 5, 14], hL: [26, 4, -8], hR: [26, 4, 8], eL: null, eR: null },
        marks: [{ t: "balance", from: "me.neck", to: "me.foR" }, { t: "label", j: "me.pelvis", o: [0, 10, 0], label: "straight line" }],
      },
    ],
    mistake: {
      from: 0, cap: "Your hips sag and your lower back takes the load.",
      me: { pelvis: [-49, 15, 0], up: [0.96, 0.33, 0], front: [0.33, -0.96, 0], curl: -0.35 },
      marks: [{ t: "label", j: "me.pelvis", o: [0, -8, 0], label: "sagging" }],
    },
  },

  hang: {
    single: true, yaw: -26, pitch: 6,
    props: [{ t: "bar", a: [8, 215, -70], b: [8, 215, 70], r: 1.6 }, { t: "bar", a: [8, 215, -22], b: [8, 184, -22], r: 2.6, col: "cloth" }, { t: "bar", a: [8, 215, 22], b: [8, 184, 22], r: 2.6, col: "cloth" }],
    frames: [
      {
        cap: "Drape the gi or towel over the bar and hold one end in each fist. Hang with straight arms, shoulders active.",
        me: { pelvis: [4, 80, 0], up: [0.04, 1, 0], front: [1, 0, 0], hf: null, curl: 0.05, head: null, look: [1, 0.2, 0],
          kL: at("me.pelvis", [20, -40, -10]), kR: at("me.pelvis", [20, -40, 10]), KL: null, KR: null,
          fL: at("me.pelvis", [-24, -60, 2]), fR: at("me.pelvis", [-26, -58, -2]), toeL: [0.4, -1, 0], toeR: [0.4, -1, 0],
          hL: [8, 186, -22], hR: [8, 186, 22], eL: [0, 150, -40], eR: [0, 150, 40], EL: null, ER: null },
        marks: [{ t: "grip", j: "me.haR", label: "fists on the cloth" }],
      },
    ],
  },
});
