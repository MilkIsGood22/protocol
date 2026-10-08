
/* ═══════════════ SWEEPS FROM CLOSED GUARD ═══════════════
   Same set-up as the other closed-guard moves: you on your back, head toward −x; they kneel facing −x.
   Their right is −z. Both sweeps end in mount, built from the bottom-of-mount pose with the roles swapped. */
const MOUNT_TOP = { me: swapWho(opMount), op: swapWho(meMountBot) };
const mountAt = (deg, move, extra = {}) => ({
  me: { ...turnPose(MOUNT_TOP.me, deg, [0, 0, 0], move), ...(extra.me || {}) },
  op: { ...turnPose(MOUNT_TOP.op, deg, [0, 0, 0], move), ...(extra.op || {}) },
});

const SCISSOR_END = mountAt(-90, [14, 0, -16]);
const HIPBUMP_END = mountAt(-150, [24, 0, -14]);

Object.assign(anims, {

  /* Scissor sweep */
  scissor: {
    yaw: 40, pitch: 30, gi: false,
    frames: [
      {
        cap: "Grips and angle. One hand on the collar or behind the neck, the other on the sleeve or wrist. Open your guard and hip out onto your side.",
        me: { ...meGuard, pelvis: [2, 12, 8], up: [-1, 0.12, -0.15], front: [0, 0.7, -0.7], curl: 0.35, head: [-1, 0.6, -0.2], look: [1, 0.5, -0.3],
          hR: at("op.neck", [-3, -5, 7]), eR: [-24, 30, 40], hL: mix("op.elR", "op.haR", 0.85, [-1, 3, -2]), eL: [-30, 6, -40],
          fL: at("op.knR", [14, 2, -14]), kL: [20, 30, -10], fR: at("op.hiL", [-4, 0, 8]), kR: [10, 50, 30] },
        op: { ...opKneel, up: [-0.4, 1, 0], hR: at("me.belly", [0, 4, -8]), eR: [20, 40, -46], hL: at("me.belly", [0, 4, 8]), eL: [20, 40, 46] },
        marks: [{ t: "grip", j: "me.haR", label: "collar" }, { t: "grip", j: "me.haL", label: "sleeve" }],
      },
      {
        cap: "Shin across, bottom leg behind the knee. Your top shin goes across their belly. Your bottom leg lies on the mat behind their knee on the sleeve side.",
        me: { KR: at("op.hiR", [-10, 8, -12]), kR: null, fR: at("op.hiL", [-8, 4, 6]), fL: at("op.knR", [14, 2, -12]), kL: [20, 30, -10] },
        op: { up: [-0.6, 1, 0] },
        marks: [{ t: "label", j: "me.knR", label: "shin across" }, { t: "grip", j: "me.foL", label: "behind the knee" }],
      },
      {
        cap: "Scissor. Pull both grips toward your head, kick your top leg over and chop the bottom leg back. They fall toward the sleeve side.",
        me: { pelvis: [4, 12, -2], up: [-1, 0.2, -0.3], KR: at("op.hiR", [-6, 14, -6]), fL: [44, 6, -24], kL: [24, 30, -6] },
        op: { pelvis: [24, 22, -22], up: [-0.5, 0.55, -0.75], front: [-0.6, -0.4, 0.5], KL: [0, 14, 2], KR: [12, 8, -30], fL: [36, 20, 8], fR: [40, 4, -20] },
        marks: [{ t: "arrow", j: "op.neck", bow: 0.3 }, { t: "push", j: "me.foL", d: [12, 0, 0], label: "chop" }],
      },
      {
        cap: "Follow them over and land in mount.",
        me: { ...SCISSOR_END.me }, op: { ...SCISSOR_END.op },
        marks: [{ t: "label", j: "me.neck", o: [0, 10, 0], label: "mount" }],
      },
    ],
    mistake: {
      from: 2, cap: "You let go of the sleeve. Their free hand posts on the mat and the sweep stops.",
      me: { hL: [-20, 6, -30], eL: [-30, 20, -40] },
      op: { pelvis: [26, 26, -10], up: [-0.45, 1, -0.35], hR: [-6, 3, -40], eR: [10, 30, -50] },
      marks: [{ t: "label", j: "op.haR", label: "they post" }, { t: "mat", j: "op.haR" }],
    },
  },

  /* Hip bump sweep */
  hipbump: {
    yaw: 48, pitch: 26,
    frames: [
      {
        cap: "They posture up. The moment they sit tall, open your guard and sit up fast.",
        me: { ...meGuard, curl: 0.4, head: [-1, 0.7, 0], look: [1, 0.6, 0], hL: at("op.elR", [-2, 3, -3]), hR: at("op.elL", [-2, 3, 3]) },
        op: { ...opKneel, up: [-0.15, 1, 0], hR: at("me.belly", [0, 4, -8]), eR: [20, 40, -46], hL: at("me.belly", [0, 4, 8]), eL: [20, 40, 46] },
        marks: [{ t: "balance" }],
      },
      {
        cap: "Post and reach. Post one hand behind you. Your other arm reaches over their shoulder and wraps their arm.",
        me: { pelvis: [2, 13, 4], up: [-0.25, 1, 0.22], front: [1, 0.25, 0], curl: 0.3, head: [0.1, 1, 0], look: [1, 0, -0.2],
          hR: [-28, 3, 28], eR: [-20, 30, 40], hL: at("op.shR", [6, 4, -8]), eL: at("op.shR", [-10, 12, 8]),
          fL: [30, 4, -30], kL: [20, 44, -40], fR: [30, 4, 26], kR: [22, 44, 36] },
        op: { up: [-0.2, 1, 0] },
        marks: [{ t: "mat", j: "me.haR" }, { t: "grip", j: "me.haL", label: "over the shoulder" }],
      },
      {
        cap: "Bump. Drive your hips up into their chest and roll them over the side where you wrapped the arm.",
        me: { pelvis: [10, 30, 0], up: [0.35, 1, 0.05], front: [1, -0.35, -0.2], curl: 0.2, KR: [0, 8, 22], kR: null, fR: [-26, 4, 30], fL: [34, 30, -30], kL: [24, 44, -36], hR: [-4, 3, 30] },
        op: { pelvis: [36, 24, -8], up: [0.25, 1, -0.6], front: [-0.8, 0.2, -0.3], KL: [8, 14, 18], KR: [16, 5, -24], fL: [44, 14, 20], fR: [50, 4, -22] },
        marks: [{ t: "push", j: "me.pelvis", d: [12, 8, -6], label: "hips into them" }],
      },
      {
        cap: "Come up on top: mount.",
        me: { ...HIPBUMP_END.me }, op: { ...HIPBUMP_END.op },
        marks: [{ t: "label", j: "me.neck", o: [0, 10, 0], label: "mount" }],
      },
    ],
    mistake: {
      from: 2, cap: "Your hips stay on the mat. You are just leaning on them, and they push you flat.",
      me: { pelvis: [2, 12, 4], up: [-0.1, 1, 0.3], front: [1, 0.1, 0], KR: null, kR: [22, 44, 36], fR: [30, 4, 26] },
      op: { pelvis: [32, 24, 0], up: [-0.3, 1, 0], front: [-1, -0.3, 0] },
      marks: [{ t: "label", j: "me.pelvis", label: "hips down" }],
    },
  },
});
