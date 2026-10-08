
/* them, posture broken: bent over you, hands posted on the mat by your shoulders */
const opBroken = {
  ...opKneel, pelvis: [22, 25, 0], up: [-1, 0.42, 0], look: [-0.6, -1, 0],
  KL: [-14, 5, 22], KR: [-14, 5, -22], fL: [27, 4, 15], fR: [27, 4, -15],
  hL: [-52, 3, 36], eL: [-30, 34, 62], hR: [-52, 3, -36], eR: [-30, 34, -62],
};

Object.assign(anims, {

  /* 2 ─ Armbar from closed guard (attacking their right arm, which is on your left, −z) */
  armbar: {
    yaw: 58, pitch: 36,
    frames: [
      {
        cap: "Trap the arm. Both hands hold it, one at the wrist and one above the elbow, pinned to your chest.",
        me: { ...meGuard, up: [-1, 0.08, 0], curl: 0.3, head: [-1, 0.4, 0],
          hR: at("op.haR", [-2, 3, 3]), eR: [-30, 0, 46], hL: at("op.elR", [1, -4, -5]), eL: [-34, 0, -44] },
        op: { ...opBroken, hR: at("me.sternum", [0, 6, 10]), ER: at("me.sternum", [3, 13, -15]) },
        marks: [{ t: "grip", j: "me.haR", label: "wrist" }, { t: "grip", j: "me.haL", label: "elbow" }],
      },
      {
        cap: "Foot on the hip. Your guard opens. Your other leg climbs high across their back and pulls them down.",
        me: { fL: at("op.hiR", [-5, 2, -9]), kL: [-22, 60, -42], toeL: [0.2, 1, -0.2],
          kR: at("op.ribL", [-6, -2, 12]), fR: at("op.back", [8, 9, -8]) },
        op: { up: [-1, 0.3, 0] },
        marks: [{ t: "push", j: "me.foL", d: [12, -2, 2], label: "push" }, { t: "arrow", j: "me.knR" }, { t: "grip", j: "me.haR" }],
      },
      {
        cap: "Pivot. Push off the hip foot. Your head swings toward their far knee until you lie across them.",
        me: { pelvis: [-12, 15, -12], up: [-0.3, -0.06, 1], curl: 0.15, head: [-0.2, 0.3, 1], look: [-0.5, 1, 0.2],
          kR: [-2, 22, 26], fR: at("op.back", [10, 12, -6]) },
        op: { hR: at("me.sternum", [0, 5, 2]), ER: mix("op.shR", "me.sternum", 0.52, [0, 4, 0]), hL: at("me.ribR", [2, 5, 0]), eL: [-30, 60, 50] },
        marks: [{ t: "arrow", j: "me.head", bow: -0.35 }, { t: "arrow", j: "me.pelvis", thin: true }],
      },
      {
        via: true,
        me: { pelvis: [-16, 16, -15], kL: [-56, 60, -34], fL: [-60, 58, -4], toeL: null },
        op: {},
      },
      {
        cap: "Leg over the head. It lands across the side of their neck. Their arm is now between your thighs.",
        me: { pelvis: [-19, 17, -17], up: [-0.12, -0.12, 1], kL: [-37, 24, 20], fL: at("op.nape", [-3, 13, -10]), kR: [-3, 23, 24], fR: at("op.back", [12, 13, -8]) },
        op: { up: [-1, 0.22, -0.04], head: [-1, -0.3, 0.1], hR: at("me.sternum", [0, 4, 4]) },
        marks: [{ t: "arrow", from: [-56, 56, -30], to: "me.foL", bow: 0.3 }],
      },
      {
        cap: "Finish. Knees pinch, heels pull down, their thumb points at the ceiling, your hips rise.",
        me: { pelvis: [-19, 22, -17], fL: at("op.nape", [-3, 9, -12]), fR: at("op.back", [12, 9, -10]), kL: [-34, 26, 20], kR: [-6, 25, 24] },
        op: {},
        marks: [{ t: "attack", j: "op.elR" }, { t: "push", j: "me.pelvis", d: [0, 14, 0], label: "hips up" }],
      },
    ],
    mistake: {
      from: 4, cap: "Your spine is still in line with theirs. The leg cannot clear their head and they pull the arm out.",
      me: { pelvis: [2, 15, 0], up: [-1, 0.08, 0], curl: 0.3, head: [-1, 0.4, 0], look: [0.6, 1, 0], gray: ["torso"],
        kL: [-30, 60, -50], fL: at("op.head", [-2, 4, -16]), kR: at("op.ribL", [-6, -2, 12]), fR: at("op.back", [8, 9, -8]),
        hR: at("op.haR", [-2, 3, 3]), hL: at("op.elR", [1, -4, -5]) },
      op: { up: [-1, 0.5, 0], head: null, hR: [-14, 34, -22], ER: null, eR: [0, 50, -50], hL: [-52, 3, 36], eL: [-30, 34, 62] },
      marks: [{ t: "arrow", from: [-34, 26, -8], to: "op.haR", thin: true }, { t: "label", j: "me.foL", label: "stuck" }],
    },
  },
});
