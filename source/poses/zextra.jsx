
/* ═══════════════ STANDING EXTRAS: sitting to guard, double leg, ankle pick ═══════════════
   File name starts with z so it loads after standing1.jsx (meStand, opStand). */

/* both finishes land here: you past their legs, chest on chest, them on their back with head toward +x */
const TD_LAND = {
  me: { pelvis: [36, 13, 44], up: [0.5, 0.36, -1], front: [0.3, -1, -0.2], curl: 0.1, head: [0.8, 0.1, -1], look: [0.6, -0.5, -0.3],
    KL: null, KR: null, kL: [70, 2, 62], fL: [50, 4, 96], kR: [-4, 2, 58], fR: [14, 4, 94], toeL: null, toeR: null,
    ER: [86, 9, 12], hR: [96, 5, -14], EL: null, hL: [30, 5, -20], eL: [26, 20, 10] },
  op: { pelvis: [36, 10, -2], up: [1, 0, 0], front: [0, 1, 0], hf: null, curl: 0, head: [1, 0.15, 0], look: [0, 1, 0.3],
    KL: null, KR: null, kL: [0, 60, 18], fL: [-14, 4, 16], fR: [-16, 4, -18], kR: [0, 60, -20], toeL: null, toeR: null,
    hL: at("me.shR", [0, -6, 4]), eL: [70, 6, 36], hR: [50, 4, -40], eR: [70, 4, -46], EL: null, ER: null },
};
const wristGrip = (side, o) => mix(`op.el${side}`, `op.ha${side}`, 0.85, o);

Object.assign(anims, {

  /* Sit to guard instead of jumping */
  sitguard: {
    yaw: -20, pitch: 16,
    frames: [
      {
        cap: "Grips first. Take both wrists or a collar and sleeve before you go down.",
        me: { ...meStand, hR: wristGrip("L", [-1, 3, 2]), eR: [-22, 82, 34], hL: wristGrip("R", [-1, 3, -2]), eL: [-22, 80, -30] },
        op: { ...opStand, hL: [10, 92, 12], hR: [10, 92, -12] },
        marks: [{ t: "grip", j: "me.haR", label: "grips" }, { t: "grip", j: "me.haL" }],
      },
      {
        cap: "Step in and sit. One foot steps close to them and you sit down right next to your heel. You sit, you do not jump.",
        me: { pelvis: [-8, 26, 4], up: [0.35, 1, 0], curl: 0.35, head: [0.3, 1, 0], look: [1, 0.25, 0],
          fR: [14, 5, 16], kR: [24, 40, 22], fL: [-20, 5, -16], kL: [0, 36, -30] },
        op: { pelvis: [36, 80, 0], up: [-0.25, 1, 0], hL: [18, 66, 14], hR: [18, 66, -14] },
        marks: [{ t: "arrow", j: "me.pelvis" }, { t: "label", j: "me.pelvis", o: [0, -8, 0], label: "sit" }],
      },
      {
        cap: "Feet to the hips. As your butt lands, both feet go on their hips. Keep the grips.",
        me: { pelvis: [4, 10, 0], up: [-0.55, 1, 0], front: [1, 0.55, 0], curl: 0.45, head: [-0.1, 1, 0], look: [1, 0.5, 0],
          fL: at("op.hiR", [-6, 0, -2]), fR: at("op.hiL", [-6, 0, 2]), kL: [24, 60, -26], kR: [24, 60, 26], toeL: null, toeR: null },
        op: { pelvis: [36, 78, 0], up: [-0.35, 1, 0], kL: [14, 44, 18], kR: [14, 44, -18], hL: at("me.knR", [4, 3, 0]), hR: at("me.knL", [4, 3, 0]) },
        marks: [{ t: "grip", j: "me.foL", label: "feet on the hips" }, { t: "grip", j: "me.haR" }],
      },
      {
        cap: "Pull them down into closed guard, or play your open guard from here.",
        me: { ...meGuard, hR: wristGrip("L", [-1, 3, 2]), hL: wristGrip("R", [-1, 3, -2]) },
        op: { ...opKneel },
        marks: [{ t: "grip", j: "me.foL", label: "guard" }],
      },
    ],
    mistake: {
      from: 0, cap: "You jump and wrap your legs around them. They can drop you into a pass, or slam you. Jumping guard is banned in many teen divisions.",
      me: { pelvis: [8, 82, 0], up: [-0.15, 1, 0], front: [1, 0.15, 0], curl: 0.5, head: [0.2, 1, 0], look: [1, 0, 0],
        kL: at("op.waist", [-6, 0, -26]), kR: at("op.waist", [-6, 0, 26]), fL: at("op.lowback", [6, 0, 4]), fR: at("op.lowback", [4, 4, -4]),
        hR: at("op.nape", [2, 2, 5]), hL: at("op.nape", [2, 2, -5]), eR: [10, 120, 40], eL: [10, 120, -40], gray: ["legL", "legR"] },
      op: { pelvis: [40, 80, 0], up: [0.12, 1, 0], kL: [30, 44, 20], kR: [30, 44, -20], fL: [24, 5, 18], fR: [52, 5, -18],
        hL: at("me.back", [2, -14, 6]), hR: at("me.back", [2, -14, -6]), eL: [30, 90, 40], eR: [30, 90, -40] },
      marks: [{ t: "attack", j: "me.back", o: [0, -10, 0] }, { t: "label", j: "me.pelvis", label: "jumped" }],
    },
  },

  /* Double leg */
  doubleleg: {
    yaw: -18, pitch: 14,
    frames: [
      {
        cap: "Set up. Hand fight until their weight comes forward. Your feet are under you, knees bent.",
        me: { ...meStand }, op: { ...opStand },
        marks: [],
      },
      {
        cap: "Level change. Your knees bend and your hips drop. Back straight, head up.",
        me: { pelvis: [-28, 56, 0], up: [0.45, 1, 0], curl: 0, head: [0.25, 1, 0], look: [1, 0.3, 0],
          kL: [-20, 32, -24], fL: [-46, 5, -16], kR: [0, 32, 20], fR: [-14, 5, 16], hR: [0, 70, 16], eR: [-20, 60, 34], hL: [0, 70, -16], eL: [-20, 60, -34] },
        op: {},
        marks: [{ t: "arrow", j: "me.pelvis" }],
      },
      {
        cap: "Penetration step. Your lead foot steps deep between their feet and that knee drops toward the mat. Head tight to their side, hands behind both knees.",
        me: { pelvis: [-2, 42, 2], up: [0.65, 0.78, 0], curl: 0.1, head: [0.6, 0.8, 0.4], look: [0.4, 0.6, 0.6],
          KR: [24, 7, 6], kR: null, fR: [-6, 4, 6], fL: [-58, 5, -18], kL: [-30, 8, -22],
          hR: at("op.knL", [10, 0, 6]), eR: [10, 40, 40], hL: at("op.knR", [10, 0, -6]), eL: [10, 40, -40] },
        op: { up: [-0.1, 1, 0], hL: at("me.back", [0, 6, 4]), hR: at("me.shL", [2, 4, -2]) },
        marks: [{ t: "arrow", j: "me.knR" }, { t: "grip", j: "me.haR", label: "behind the knees" }, { t: "label", j: "me.head", o: [0, 14, 0], label: "head up" }],
      },
      {
        cap: "Drive and turn the corner. Push through them at an angle while your hands pull their knees to you.",
        me: { pelvis: [14, 44, 6], up: [0.75, 0.66, 0.1], KR: null, kR: [36, 30, 14], fR: [30, 5, 18], fL: [-30, 5, -14], kL: [-6, 28, -18] },
        op: { pelvis: [62, 42, 10], up: [0.75, 0.6, 0.25], front: [-0.6, 0.75, 0], kL: [42, 58, 22], fL: [30, 46, 18], kR: [56, 60, -10], fR: [44, 46, -14],
          hL: [80, 30, 40], eL: [70, 60, 50], hR: [84, 30, -34], eR: [70, 60, -40] },
        marks: [{ t: "push", j: "me.neck", d: [12, 0, 6], label: "drive" }],
      },
      {
        cap: "Land on top, past their legs, chest on chest.",
        me: { ...TD_LAND.me }, op: { ...TD_LAND.op },
        yaw: 12, pitch: 40,
        marks: [{ t: "weight", j: "me.back" }, { t: "label", j: "me.pelvis", label: "past their legs" }],
      },
    ],
    mistake: {
      from: 2, cap: "Your head is down, looking at the mat. You run into their sprawl and their guillotine.",
      me: { up: [0.9, 0.4, 0], head: [1, -0.6, 0], look: [0.2, -1, 0] },
      op: { pelvis: [40, 54, 0], up: [-0.85, 0.55, 0], front: [-0.55, -0.85, 0], kL: [56, 20, 16], fL: [80, 5, 16], kR: [64, 20, -16], fR: [88, 5, -16],
        ER: at("me.nape", [0, 6, 8]), hL: at("me.throat", [0, -6, -3]), hR: at("op.haL", [0, -2, -4]), eR: [50, 80, -30] },
      marks: [{ t: "attack", j: "me.neck" }, { t: "label", j: "me.head", o: [0, -14, 0], label: "head down" }],
    },
  },

  /* Ankle pick */
  anklepick: {
    yaw: -24, pitch: 14,
    frames: [
      {
        cap: "Collar tie. Your hand cups the back of their neck, elbow on their collarbone.",
        me: { ...meStand, hR: at("op.nape", [-2, 0, 7]), eR: [-12, 88, 34] },
        op: { ...opStand },
        marks: [{ t: "grip", j: "me.haR", label: "collar tie" }],
      },
      {
        cap: "Snap and drop. Snap their head down so they step forward, and drop low beside that front foot.",
        me: { pelvis: [-16, 52, -6], up: [0.5, 1, 0.05], curl: 0.1, head: [0.4, 1, 0.1], look: [1, -0.2, 0.2],
          kL: [0, 26, -10], fL: [-6, 5, -8], kR: [-20, 22, 22], fR: [-40, 5, 16], hR: at("op.nape", [-2, 0, 7]), hL: [8, 30, 4], eL: [-20, 40, -30] },
        op: { pelvis: [36, 80, 2], up: [-0.45, 1, 0], head: [-1, -0.1, 0], look: [-1, -0.6, 0], fL: [10, 5, 14], kL: [-4, 50, 18] },
        marks: [{ t: "push", j: "me.haR", d: [0, -12, 0], label: "snap" }, { t: "arrow", j: "op.foL", thin: true }],
      },
      {
        cap: "Pick the heel. Your free hand scoops the heel of that front foot while your other hand pushes their head back over it. They sit down.",
        me: { hL: at("op.foL", [-2, 2, 6]), eL: [0, 20, -10], hR: at("op.chin", [-4, -2, 0]) },
        op: { pelvis: [52, 44, 6], up: [0.4, 1, 0], head: [0.3, 1, 0], fL: [8, 22, 16], kL: [26, 46, 20], fR: [62, 5, -16], kR: [52, 30, -20],
          hL: [66, 14, 30], eL: [70, 40, 40], hR: [68, 14, -24], eR: [70, 40, -40] },
        marks: [{ t: "grip", j: "me.haL", label: "heel" }, { t: "push", j: "me.haR", d: [10, 4, 0], label: "head back" }],
      },
      {
        cap: "Land on top, past their legs.",
        me: { ...TD_LAND.me }, op: { ...TD_LAND.op },
        yaw: 12, pitch: 40,
        marks: [{ t: "label", j: "me.pelvis", label: "on top" }],
      },
    ],
    mistake: {
      from: 2, cap: "You pick the foot but leave the head alone. They hop on one leg and stay standing.",
      me: { hR: [10, 70, 20], eR: [-10, 70, 34] },
      op: { pelvis: [40, 80, 4], up: [-0.1, 1, 0], head: null, look: [-1, -0.3, 0], fR: [50, 5, -14], kR: [36, 50, -20],
        hL: [20, 92, 14], hR: [20, 92, -14], eL: [36, 80, 34], eR: [36, 80, -34] },
      marks: [{ t: "label", j: "op.head", o: [0, 12, 0], label: "head free" }],
    },
  },
});
