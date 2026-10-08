
/* ═══════════════ SOLO DRILL FORM LOOPS (one figure) ═══════════════
   Loads after strength.jsx (meSupine) and standing1.jsx (meStand). You face +x; your right is +z. */
const meTurtle = {
  pelvis: [0, 46, 0], up: [1, 0.12, 0], front: [0.12, -1, 0], hf: null, curl: 0.45, head: [1, -0.2, 0], look: [0.3, -1, 0],
  KL: [6, 5, -12], KR: [6, 5, 12], kL: null, kR: null, fL: [-34, 4, -12], fR: [-34, 4, 12], toeL: [-1, -0.1, 0], toeR: [-1, -0.1, 0],
  hL: [44, 3, -16], hR: [44, 3, 16], eL: [30, 20, -30], eR: [30, 20, 30], EL: null, ER: null,
};

Object.assign(anims, {

  drill_hipescape: {
    single: true, loop: true, yaw: 30, pitch: 50,
    frames: [
      {
        cap: "On your back, knees bent, feet flat, hands up in frames.",
        me: { ...meSupine, hL: [-34, 30, -12], hR: [-34, 30, 12], eL: [-20, 10, -30], eR: [-20, 10, 30] },
      },
      {
        cap: "Turn onto your side, push off your top foot and shoot your hips back. Your body makes a C.",
        me: { pelvis: [10, 17, 20], up: [-1, 0.04, -0.2], front: [0, 0.2, -1], curl: 0.6, head: [-1, 0.25, -0.2], look: [0, 0.2, -1],
          fR: [24, 4, -12], kR: [14, 40, -20], fL: [44, 4, 10], kL: [30, 14, -4] },
      },
      {
        cap: "Back flat. Reset.",
        me: { ...meSupine, hL: [-34, 30, -12], hR: [-34, 30, 12], eL: [-20, 10, -30], eR: [-20, 10, 30] },
      },
      {
        cap: "Now the other side.",
        me: { pelvis: [10, 17, -20], up: [-1, 0.04, 0.2], front: [0, 0.2, 1], curl: 0.6, head: [-1, 0.25, 0.2], look: [0, 0.2, 1],
          fL: [24, 4, 12], kL: [14, 40, 20], fR: [44, 4, -10], kR: [30, 14, 4] },
      },
    ],
  },

  drill_techstand: {
    single: true, loop: true, yaw: -30, pitch: 14,
    frames: [
      {
        cap: "Post. Sitting, one hand posted behind you and the opposite foot flat. Your free hand is up in front of your face.",
        me: { pelvis: [0, 12, 0], up: [-0.35, 1, -0.25], front: [1, 0.35, 0], hf: null, curl: 0.3, head: [0, 1, 0], look: [1, 0, 0],
          KL: null, KR: null, kL: [10, 12, -40], fL: [16, 4, -14], kR: [20, 46, 18], fR: [28, 4, 12], toeL: null, toeR: null,
          hL: [-28, 3, -24], eL: [-20, 20, -40], hR: [30, 44, 8], eR: [10, 30, 30], EL: null, ER: null },
      },
      {
        cap: "Base. Lift your hips off the mat on that hand and foot.",
        me: { pelvis: [-2, 34, -6], up: [-0.1, 1, -0.45], curl: 0.2, kL: [6, 30, -40], fL: [14, 6, -20] },
      },
      {
        cap: "Swing the free leg back under you, so you land in a lunge behind your posted foot.",
        me: { pelvis: [-6, 52, 0], up: [0.15, 1, -0.1], curl: 0.15, kL: [-20, 14, -14], fL: [-44, 5, -12], hL: [-4, 60, -18], eL: [-20, 50, -30] },
      },
      {
        cap: "Stand up facing forward, hands up.",
        me: { ...meStand, pelvis: [-10, 82, 0], kL: [-4, 50, -22], kR: [26, 50, 18], fL: [-24, 5, -15], fR: [6, 5, 15],
          hL: [18, 98, -11], eL: [-6, 82, -32], hR: [22, 100, 12], eR: [-2, 84, 34] },
      },
    ],
  },

  drill_situp: {
    single: true, loop: true, yaw: -40, pitch: 30,
    frames: [
      {
        cap: "Turtle. On your knees and hands, elbows in, chin down.",
        me: { ...meTurtle },
      },
      {
        cap: "Post one hand and thread the opposite leg under your body.",
        me: { pelvis: [2, 34, -6], up: [0.9, 0.35, -0.2], front: [0.3, -0.8, -0.5], curl: 0.3,
          KR: null, kR: [12, 24, -14], fR: [16, 6, -46], hR: [30, 30, 30], eR: [10, 40, 30] },
      },
      {
        cap: "Sit out. Your hips turn all the way through and clear the mat. You end facing the other way, on your hip and posted hand.",
        me: { pelvis: [8, 14, -18], up: [0.45, 1, -0.55], front: [-0.6, 0.1, -0.8], curl: 0.2, head: [0.2, 1, -0.6], look: [-0.5, 0, -1],
          KL: null, kL: [-10, 34, -20], fL: [-30, 4, -14], kR: [-14, 20, -50], fR: [-36, 4, -64], hL: [40, 3, -6], eL: [40, 30, -30] },
      },
    ],
  },

  drill_sprawl: {
    single: true, loop: true, yaw: -26, pitch: 18,
    frames: [
      {
        cap: "Stance. Knees bent, hands up.",
        me: { ...meStand, pelvis: [0, 78, 0], kL: [6, 48, -22], kR: [38, 48, 18], fL: [-12, 5, -15], fR: [16, 5, 15],
          hL: [28, 96, -11], eL: [4, 80, -32], hR: [32, 98, 12], eR: [8, 82, 34] },
      },
      {
        cap: "Sprawl. Throw both legs back, drop your hips to the mat and keep your chest heavy. Hands land in front of you.",
        me: { pelvis: [-34, 14, 0], up: [1, 0.42, 0], front: [0.42, -1, 0], curl: -0.2, head: [1, 0.6, 0], look: [1, -0.2, 0],
          kL: [-70, 24, -20], kR: [-70, 24, 20], fL: [-112, 12, -26], fR: [-112, 12, 26], toeL: [-0.4, -1, 0], toeR: [-0.4, -1, 0],
          hL: [24, 3, -22], eL: [10, 20, -40], hR: [24, 3, 22], eR: [10, 20, 40] },
      },
    ],
  },

  drill_penstep: {
    single: true, loop: true, yaw: -30, pitch: 12,
    frames: [
      {
        cap: "Stance, low. Knees bent, back straight.",
        me: { ...meStand, pelvis: [-30, 66, 0], up: [0.35, 1, 0], kL: [-22, 36, -24], fL: [-46, 5, -16], kR: [0, 36, 20], fR: [-14, 5, 16],
          hL: [0, 80, -14], hR: [0, 80, 14] },
      },
      {
        cap: "Step deep. Your lead foot steps far forward and that knee drops toward the mat. Back straight, head up.",
        me: { pelvis: [0, 42, 2], up: [0.55, 0.85, 0], curl: 0.05, head: [0.4, 1, 0], look: [1, 0.3, 0],
          KR: [26, 7, 6], kR: null, fR: [-4, 4, 6], fL: [-56, 5, -18], kL: [-30, 8, -22], hL: [34, 50, -16], hR: [34, 50, 16] },
      },
      {
        cap: "Come up. The back foot follows and you are back in your stance, further forward.",
        me: { pelvis: [10, 66, 0], up: [0.35, 1, 0], KR: null, kR: [40, 36, 20], fR: [26, 5, 16], kL: [18, 36, -24], fL: [-6, 5, -16],
          hL: [40, 80, -14], hR: [40, 80, 14] },
      },
    ],
  },
});
