
/* ═══════════════ BOTTOM OF MOUNT ═══════════════
   You on your back, head toward −x. Your left is −z, your right is +z (toward the viewer).
   They sit on your belly facing your head. Their left is +z. */
const meMountBot = {
  pelvis: [0, 11, 0], up: [-1, 0.03, 0], front: [0, 1, 0], hf: null, curl: 0.1, head: [-1, 0.3, 0], look: [0.3, 1, 0],
  kL: [26, 52, -20], kR: [26, 52, 20], KL: null, KR: null, fL: [30, 4, -16], fR: [30, 4, 16], toeL: null, toeR: null,
  hL: at("op.hiR", [2, -3, -5]), hR: at("op.hiL", [2, -3, 5]), eL: [-20, 4, -30], eR: [-20, 4, 30], EL: null, ER: null,
};
const opMount = {
  pelvis: [-18, 35, 0], up: [-0.12, 1, 0], front: [-1, -0.12, 0], hf: null, curl: 0.2, head: null, look: [-1, -0.7, 0],
  KL: [-36, 9, 30], KR: [-36, 9, -30], kL: null, kR: null, fL: [8, 4, 24], fR: [8, 4, -24], toeL: null, toeR: null,
  hL: at("me.sternum", [2, 7, 8]), hR: at("me.sternum", [2, 7, -8]), eL: [-10, 60, 40], eR: [-10, 60, -40], EL: null, ER: null,
};

/* shared ending of the trap-and-roll family: you bridge over your right shoulder (+z) and land in their guard */
const TR_TRAP_FOOT = { fR: at("op.foL", [2, 1, 9]), kR: [26, 46, 32], fL: [14, 4, -14], kL: [22, 50, -24] };
const TR_BRIDGE = {
  me: { pelvis: [-2, 30, 3], up: [-1, -0.5, 0.2], curl: -0.25, head: [-1, 0.45, 0.15] },
  op: { pelvis: [-24, 50, 10], up: [-0.35, 1, 0.55], KL: [-40, 20, 34], KR: [-40, 22, -22] },
};
const TR_VIA = {
  via: true,
  me: { pelvis: [-6, 22, 16], up: [-1, -0.2, 0.55], front: [0, 0.4, 1], curl: 0, head: [-1, 0.2, 0.4] },
  op: { pelvis: [-28, 34, 30], up: [-0.8, 0.45, 0.4], front: [-0.1, 0.5, -0.85], KL: [-34, 14, 46], KR: [-30, 44, 2], fR: [2, 24, -6] },
};
const TR_LAND = {
  me: { pelvis: [20, 24, 42], up: [-0.75, 1, 0], front: [-1, -0.75, 0], curl: 0.15, head: [-1, 0.8, 0], look: [-1, -0.5, 0],
    KL: [-16, 5, 52], KR: [-16, 5, 32], kL: null, kR: null, fL: [24, 4, 50], fR: [24, 4, 34], toeL: null, toeR: null,
    hL: at("op.belly", [-2, 8, 8]), hR: at("op.belly", [-2, 8, -8]), EL: null, ER: null, eL: [0, 30, 70], eR: [0, 30, 10] },
  op: { pelvis: [-28, 12, 42], up: [-1, 0.05, 0.04], front: [0, 1, 0], curl: 0.25, head: [-1, 0.4, 0], look: [0.6, 1, 0],
    KL: null, KR: null, kL: at("me.waist", [-6, 2, -30]), kR: at("me.waist", [-6, 2, 30]), fL: at("me.lowback", [5, -2, 4]), fR: at("me.lowback", [4, 4, -4]),
    toeL: null, toeR: null, hL: at("me.elR", [0, 3, 0]), hR: at("me.elL", [0, 3, 0]), EL: null, ER: null, eL: [-40, 10, 10], eR: [-40, 10, 70] },
};

Object.assign(anims, {

  /* Trap and roll (upa) */
  traproll: {
    yaw: 35, pitch: 56,
    frames: [
      {
        cap: "Trap the arm. Both your hands hold one of their arms tight to your chest: one on the wrist, one over the elbow.",
        me: { ...meMountBot, hR: at("op.haL", [2, 2, 1]), eR: [-30, 0, 40], hL: at("op.elL", [-1, 4, -3]), eL: [-30, 30, -20] },
        op: { ...opMount, hL: at("me.sternum", [3, 7, 9]), eL: [-6, 64, 40], hR: at("me.sternum", [2, 7, -9]), eR: [-10, 60, -40] },
        marks: [{ t: "grip", j: "me.haR", label: "wrist" }, { t: "grip", j: "me.haL", label: "over the elbow" }],
      },
      {
        cap: "Trap the foot. Your foot on the same side steps over their foot, so that side cannot post.",
        me: { ...TR_TRAP_FOOT },
        op: {},
        marks: [{ t: "grip", j: "me.foR", label: "foot trapped" }, { t: "arrow", j: "me.foR", thin: true }],
      },
      {
        yaw: 100, pitch: 28,
        cap: "Bridge. Drive your hips straight up, then over the shoulder on the trapped side.",
        me: { ...TR_BRIDGE.me },
        op: { ...TR_BRIDGE.op, hR: [-60, 20, -30], eR: [-30, 40, -50] },
        marks: [{ t: "push", j: "me.pelvis", d: [0, 16, 8], label: "hips up and over" }],
      },
      { ...TR_VIA, op: { ...TR_VIA.op, hR: [-70, 20, 20] } },
      {
        cap: "Land in their guard. You come up on top between their legs. Posture up straight away.",
        me: { ...TR_LAND.me }, op: { ...TR_LAND.op },
        marks: [{ t: "label", j: "me.neck", o: [0, 10, 0], label: "you are on top" }],
      },
    ],
    mistake: {
      from: 2, cap: "You bridge without trapping the arm and the foot. They post and stay on top.",
      me: { hL: at("op.sternum", [0, -6, -6]), hR: at("op.sternum", [0, -6, 6]), eL: [-10, 40, -40], eR: [-10, 40, 40], fR: [24, 4, 16], kR: [26, 50, 20] },
      op: { hL: [-44, 3, 48], eL: [-30, 30, 60], fL: [12, 4, 50], KL: [-30, 8, 44], pelvis: [-22, 44, 8], up: [-0.3, 1, 0.15] },
      marks: [{ t: "label", j: "op.haL", label: "they post" }, { t: "label", j: "me.foR", label: "foot free" }],
    },
  },

  /* Ezekiel defence from the bottom of mount */
  ezekieldef: {
    yaw: 35, pitch: 58,
    frames: [
      {
        cap: "The set-up. One of their arms slides behind your head. The other hand is heading for your throat.",
        me: { ...meMountBot },
        op: { ...opMount, pelvis: [-8, 31, 0], up: [-0.75, 0.66, 0], front: [-0.66, -0.75, 0], head: [-1, -0.45, 0.3], look: [-0.3, -1, 0],
          hR: at("me.nape", [0, -4, 10]), eR: [-60, 4, -34], hL: at("me.throat", [-2, 10, 7]), eL: [-24, 40, 40] },
        marks: [{ t: "their", j: "op.haR", label: "behind your head" }, { t: "their", j: "op.haL", label: "going for the throat" }],
      },
      {
        cap: "Chin down, hands up. Both your hands catch the forearm that is coming across your throat, before it lands.",
        me: { head: [-1, 0.8, 0], look: [0.6, 1, 0], hR: at("op.haL", [2, 1, 2]), hL: mix("op.elL", "op.haL", 0.55, [0, 2, -3]), eR: [-28, 4, 36], eL: [-28, 4, -30] },
        op: { hL: at("me.chin", [4, 14, 12]) },
        marks: [{ t: "grip", j: "me.haR", label: "two hands on that arm" }, { t: "label", j: "me.head", o: [0, 12, 0], label: "chin down" }],
      },
      {
        cap: "Trap that side. Pull the arm to your chest and step your foot over their foot. Both their arms are busy, so nothing can post.",
        me: { ...TR_TRAP_FOOT, hR: at("op.haL", [2, 1, 2]) },
        op: { hL: at("me.sternum", [2, 8, 10]) },
        marks: [{ t: "grip", j: "me.foR", label: "foot trapped" }, { t: "label", j: "op.haR", label: "no post" }],
      },
      {
        yaw: 100, pitch: 28,
        cap: "Bridge and roll toward the trapped side.",
        me: { ...TR_BRIDGE.me }, op: { ...TR_BRIDGE.op, up: [-0.6, 0.9, 0.3] },
        marks: [{ t: "push", j: "me.pelvis", d: [0, 16, 8], label: "bridge" }],
      },
      { ...TR_VIA },
      {
        cap: "Land in their guard and posture up. The choke is gone.",
        me: { ...TR_LAND.me }, op: { ...TR_LAND.op },
        marks: [{ t: "label", j: "me.neck", o: [0, 10, 0], label: "on top" }],
      },
    ],
    mistake: {
      from: 0, cap: "You push their chest with straight arms and your chin is up. The sleeve grip goes on and the forearm cuts across your throat.",
      me: { hL: at("op.sternum", [0, -6, -6]), hR: at("op.sternum", [0, -6, 6]), eL: [-10, 40, -40], eR: [-10, 40, 40], head: [-1, 0, 0], look: [0, 1, 0] },
      op: { hL: at("me.throat", [-2, 5, 2]) },
      marks: [{ t: "attack", j: "me.throat" }, { t: "label", j: "me.elR", label: "straight arms" }],
    },
  },

  /* Elbow-knee (shrimp) escape from mount to half guard */
  elbowknee: {
    yaw: -35, pitch: 55,
    frames: [
      {
        cap: "Turn and frame. Turn onto your side. Your bottom elbow goes inside their knee, your other hand frames on their hip.",
        me: { ...meMountBot, pelvis: [2, 13, 2], up: [-1, 0.05, 0.25], front: [0, 0.7, 0.7], head: [-1, 0.3, 0.25],
          ER: at("op.knL", [8, 2, -8]), hR: at("op.knL", [14, 8, -2]), hL: at("op.hiR", [2, -2, -6]), eL: [-20, 4, -34],
          kR: [24, 30, 32], fR: [30, 4, 18], kL: [24, 56, -14], fL: [24, 4, -18] },
        op: { ...opMount },
        marks: [{ t: "grip", j: "me.elR", label: "elbow inside the knee" }, { t: "grip", j: "me.haL", label: "frame" }],
      },
      {
        cap: "Push the knee and shrimp. Your elbow pushes their knee toward your feet while your hips slide away.",
        me: { pelvis: [8, 13, -16], up: [-1, 0.05, 0.35], front: [0, 0.55, 0.84], fL: [30, 4, -38], kL: [22, 50, -34], ER: at("op.knL", [6, 2, -8]) },
        op: { KL: [-24, 8, 28], fL: [16, 4, 22] },
        marks: [{ t: "push", j: "me.elR", d: [11, 0, 0], label: "knee down" }, { t: "arrow", j: "me.pelvis" }],
      },
      {
        cap: "Knee in. Your bottom knee slides into the space you made, under their thigh.",
        me: { kR: [-12, 14, 18], fR: [22, 5, 14] },
        op: {},
        marks: [{ t: "arrow", j: "me.knR" }, { t: "label", j: "me.knR", label: "knee in" }],
      },
      {
        cap: "Half guard. Your other leg hooks over theirs. Their leg is trapped between yours, and you stay on your side.",
        me: { pelvis: [6, 12, -10], up: [-1, 0.05, 0.3], front: [0, 0.65, 0.75], kR: [-6, 6, 10], fR: at("op.knL", [16, 2, 12]),
          kL: [-12, 40, 12], fL: at("op.knL", [18, 10, 14]), ER: null, eR: [-30, 0, 30], hR: at("op.hiL", [0, -2, 6]), hL: at("op.back", [-4, 6, -8]), eL: [-20, 30, -30] },
        op: { pelvis: [-20, 32, 4], up: [-0.45, 1, -0.05], front: [-1, -0.45, 0], KR: [-32, 8, -30] },
        marks: [{ t: "grip", j: "me.foR", label: "half guard" }, { t: "label", j: "me.pelvis", o: [0, -6, 0], label: "on your side" }],
      },
    ],
    mistake: {
      from: 0, cap: "Flat on your back with no elbow inside their knee. There is no space to bring a knee through.",
      me: { pelvis: [0, 11, 0], up: [-1, 0.03, 0], front: [0, 1, 0], head: [-1, 0.3, 0], ER: null, eR: [-20, 50, 30], hR: at("op.sternum", [0, -6, 6]), hL: at("op.sternum", [0, -6, -6]), eL: [-20, 50, -30], gray: ["torso"] },
      op: {},
      marks: [{ t: "label", j: "me.pelvis", label: "flat" }],
    },
  },

  /* Armbar defence from the bottom of mount */
  armbardef: {
    yaw: 60, pitch: 36,
    frames: [
      {
        cap: "Elbows in. When they climb toward your armpits, your elbows stay glued to your ribs and your hands stay by your chin.",
        me: { ...meMountBot, EL: [-32, 8, -16], ER: [-32, 8, 16], hL: at("me.chin", [8, 4, -7]), hR: at("me.chin", [8, 4, 7]) },
        op: { ...opMount, pelvis: [-34, 34, 0], KL: [-50, 9, 27], KR: [-50, 9, -27], fL: [-8, 4, 24], fR: [-8, 4, -24],
          hL: at("me.chin", [2, 16, 10]), hR: at("me.chin", [2, 16, -10]) },
        marks: [{ t: "label", j: "me.elR", label: "elbows tight" }, { t: "label", j: "op.pelvis", o: [0, 12, 0], label: "high mount" }],
      },
      {
        cap: "They isolate an arm. Clasp your hands together so that arm stays bent.",
        me: { EL: null, ER: null, hR: [-38, 34, 4], hL: at("me.haR", [1, -1, -6]), eR: [-24, 8, 30], eL: [-24, 8, -30] },
        op: { pelvis: [-36, 36, 4], up: [-0.2, 1, 0.1], KL: null, kL: [-46, 52, 32], fL: [-64, 4, 24], hL: at("me.haR", [2, 4, 2]), hR: at("me.elR", [0, 4, 2]) },
        marks: [{ t: "grip", j: "me.haL", label: "hands clasped" }, { t: "their", j: "op.haL" }],
      },
      {
        cap: "They fall back. Keep the clasp, turn onto your side toward their legs, and point your thumb at the mat.",
        me: { pelvis: [2, 13, 8], up: [-1, 0.1, 0.35], front: [0, 0.4, 0.92], curl: 0.3, head: [-1, 0.5, 0.35], look: [0, 0.4, 1],
          hR: at("op.sternum", [6, 4, -6]), eR: [-30, 6, 40], hL: at("me.haR", [2, -2, -6]), eL: [-20, 20, -10],
          kL: [20, 40, 20], fL: [28, 4, -4], kR: [24, 20, 40], fR: [30, 4, 24] },
        op: { pelvis: [-46, 12, 32], up: [0.1, 0.05, 1], front: [0, 1, 0], curl: 0.25, head: [0.1, 0.4, 1], look: [0, 1, 0],
          KL: null, KR: null, kL: [-70, 44, 6], fL: [-80, 8, -22], kR: [-26, 44, 14], fR: [-14, 8, -22],
          hL: at("me.haR", [-2, 3, -2]), hR: at("me.haR", [2, 3, 3]), eL: [-70, 30, 40], eR: [-30, 30, 40] },
        marks: [{ t: "grip", j: "me.haL", label: "keep the clasp" }, { t: "label", j: "me.elR", label: "thumb to the mat" }],
      },
      {
        cap: "Come up and pull the elbow out. Drive onto your knees into them and slide your elbow out toward your hip. You end on top.",
        me: { pelvis: [-10, 34, 2], up: [-0.55, 0.75, 0.4], front: [0, -0.5, 0.85], curl: 0.3, head: [-0.4, 0.4, 1], look: [0, -0.8, 0.6],
          KL: [10, 5, 18], KR: [12, 5, 0], kL: null, kR: null, fL: [44, 4, 10], fR: [46, 4, -10],
          hR: at("me.belly", [6, -4, 4]), eR: [-10, 10, 30], hL: at("op.belly", [0, 8, -6]), eL: [-30, 40, 10] },
        op: { pelvis: [-46, 16, 34], up: [0.05, 0.25, 1], kL: [-70, 48, 20], fL: [-74, 30, -6], kR: [-30, 50, 24], fR: [-20, 30, -4], hL: [-60, 4, 50], hR: [-36, 4, 54] },
        marks: [{ t: "arrow", j: "me.haR" }, { t: "label", j: "me.neck", o: [0, 8, 0], label: "on your knees, into them" }],
      },
    ],
    mistake: {
      from: 0, cap: "You push their chest with straight arms. That hands them the arm, and the armbar comes straight after.",
      me: { EL: null, ER: null, hL: at("op.sternum", [0, -6, -6]), hR: at("op.sternum", [0, -6, 6]), eL: [-14, 50, -30], eR: [-14, 50, 30] },
      op: {},
      marks: [{ t: "attack", j: "me.elR" }, { t: "label", j: "me.elR", label: "straight arm" }],
    },
  },
});
