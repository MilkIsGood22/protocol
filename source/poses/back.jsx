
/* both seated, facing +x. You are behind them. Right is +z (toward the viewer) for both of you. */
const opSeated = {
  pelvis: [12, 10, 0], up: [-0.22, 1, 0], front: [1, 0.2, 0], hf: null, curl: 0.25, head: null, look: [1, 0, 0],
  kL: [40, 60, -18], kR: [40, 60, 18], KL: null, KR: null, fL: [62, 4, -20], fR: [62, 4, 20], toeL: null, toeR: null,
  hL: at("op.sternum", [6, 2, -6]), eL: [10, 20, -40], hR: at("op.sternum", [6, 4, 6]), eR: [10, 20, 40], EL: null, ER: null,
};
const meBehind = {
  pelvis: [-18, 10, 0], up: [0.14, 1, 0], front: [1, 0, 0], hf: null, curl: 0.3, head: [0.3, 1, -0.8], look: [1, -0.1, 0.3],
  kL: [10, 40, -44], kR: [10, 40, 44], KL: null, KR: null, fL: [40, 5, -34], fR: [40, 5, 34], toeL: null, toeR: null,
  hL: [-20, 4, -30], eL: [-30, 30, -40], hR: [-20, 4, 30], eR: [-30, 30, 40], EL: null, ER: null,
};

Object.assign(anims, {

  /* 8 ─ Back control */
  back: {
    yaw: -34, pitch: 20,
    frames: [
      {
        cap: "Seatbelt. One arm over their shoulder, the other under the opposite armpit. Hands lock at their chest. Your chest is glued to their back.",
        me: { ...meBehind,
          hR: at("op.sternum", [3, -2, 1]), ER: at("op.shR", [6, 6, 3]), hL: at("op.sternum", [4, -4, -2]), EL: at("op.ribL", [4, 0, -6]) },
        op: { ...opSeated, hL: at("me.haL", [3, 2, -3]), hR: at("me.haR", [3, 3, 3]) },
        marks: [{ t: "grip", j: "me.haR", label: "hands locked" }, { t: "label", j: "me.elR", label: "over" }, { t: "label", j: "me.elL", label: "under" }],
      },
      {
        cap: "Hooks. Both your heels sit inside their thighs. Feet apart, never crossed.",
        me: { kL: [14, 34, -40], kR: [14, 34, 40], fL: at("op.hiL", [22, 10, 5]), fR: at("op.hiR", [22, 10, -5]), toeL: [0.3, -0.2, 1], toeR: [0.3, -0.2, -1] },
        op: {},
        marks: [{ t: "grip", j: "me.foR", label: "hook" }, { t: "grip", j: "me.foL", label: "hook" }],
      },
      {
        cap: "Follow. They lean and turn. Your chest stays glued and you move with them as one shape.",
        me: { pelvis: [-15, 10, 7], up: [0.22, 1, 0.38], head: [0.4, 1, -0.5] },
        op: { pelvis: [14, 10, 6], up: [-0.1, 1, 0.4], kR: [44, 50, 34], fR: [64, 4, 34] },
        marks: [{ t: "arrow", j: "op.neck" }, { t: "arrow", j: "me.neck", thin: true }, { t: "weight", j: "op.back", o: [-10, 0, 0] }],
      },
      {
        tag: "for bigger opponents",
        cap: "Body triangle option. One leg goes across their belly and your foot locks behind your other knee.",
        me: { pelvis: [-18, 10, 0], up: [0.14, 1, 0], head: [0.3, 1, -0.8],
          kR: [26, 30, 34], fR: at("op.belly", [4, -2, -14]), toeR: [0, 0.2, -1], kL: at("me.foR", [2, 8, -4]), fL: [34, 6, -40], toeL: null },
        op: { pelvis: [12, 10, 0], up: [-0.22, 1, 0], kR: [40, 60, 18], fR: [62, 4, 20] },
        marks: [{ t: "grip", j: "me.knL", label: "foot behind the knee" }, { t: "arrow", j: "me.foR" }],
      },
    ],
    mistake: {
      from: 1, cap: "Two errors. Your ankles are crossed between their legs, and both arms are hunting the neck with no seatbelt.",
      me: { fL: at("op.pelvis", [26, 8, 3]), fR: at("op.pelvis", [28, 12, -3]), ER: null, EL: null,
        hR: at("op.throat", [4, 2, 2]), eR: [-10, 80, 50], hL: at("op.throat", [5, -2, -3]), eL: [-10, 80, -50] },
      op: { hL: at("me.haL", [3, 0, -3]), hR: at("me.haR", [3, 0, 3]) },
      marks: [{ t: "attack", j: "me.foR", o: [0, 0, 3] }, { t: "label", j: "me.foR", label: "crossed" }, { t: "label", j: "me.elR", label: "no seatbelt" }],
    },
  },

  /* 9 ─ Rear naked choke */
  rnc: {
    yaw: -52, pitch: 16,
    fit: ["pelvis", "neck", "head", "shL", "shR", "elL", "elR", "haL", "haR", "hiL", "hiR", "knL", "knR"],
    frames: [
      {
        cap: "Slide under. Your top arm slides under their chin. Your elbow points straight down, lined up with the chin.",
        me: { ...meBehind, kL: [14, 34, -40], kR: [14, 34, 40], fL: at("op.hiL", [22, 10, 5]), fR: at("op.hiR", [22, 10, -5]), toeL: [0.3, -0.2, 1], toeR: [0.3, -0.2, -1],
          ER: at("op.throat", [6, -1, 0]), hR: at("op.shL", [2, 4, -2]), hL: at("op.sternum", [4, -6, -4]), EL: at("op.ribL", [4, 0, -6]) },
        op: { ...opSeated, head: [-0.1, 1, 0], hL: at("me.elR", [4, -2, -3]), hR: at("me.elR", [2, -6, 4]), eL: [20, 30, -40], eR: [20, 30, 40] },
        marks: [{ t: "label", j: "me.elR", label: "elbow under the chin" }, { t: "arrow", from: "op.shR", to: "me.haR", thin: true }],
      },
      {
        cap: "Reach and lock. That hand reaches to their far shoulder, then grabs your own other biceps.",
        me: { EL: at("op.shL", [-4, 7, -7]), hL: at("op.head", [-7, 8, -9]), hR: mix("me.shL", "me.elL", 0.75, [1, 2, 1]) },
        op: {},
        marks: [{ t: "grip", j: "me.haR", label: "own biceps" }],
      },
      {
        cap: "Second hand. Your other hand slides behind their head.",
        me: { hL: at("op.head", [-9, 1, 3]) },
        op: {},
        marks: [{ t: "arrow", j: "me.haL", thin: true }, { t: "grip", j: "me.haL", label: "behind the head" }],
      },
      {
        cap: "Finish. Your chest pushes out, both elbows draw back, your head presses against theirs.",
        me: { curl: -0.1, ER: at("op.throat", [3, -1, 0]), EL: at("op.shL", [-8, 7, -7]), head: [0.4, 1, -0.6] },
        op: { head: [-0.3, 1, 0.1] },
        marks: [{ t: "attack", j: "op.neck", o: [3, 6, 8], r: 8 }, { t: "attack", j: "op.neck", o: [3, 6, -8], r: 8 }, { t: "push", j: "me.elL", d: [-9, 0, 0], label: "elbows back" }],
      },
    ],
    mistake: {
      from: 3, cap: "Your forearm is across their jaw and your elbow is off to one side.",
      me: { ER: at("op.chin", [6, 4, 14]), hR: at("op.head", [0, -2, -12]), EL: at("op.shL", [-6, 9, -4]) },
      op: { head: [-0.1, 1, 0] },
      marks: [{ t: "attack", j: "op.chin" }, { t: "label", j: "me.elR", label: "elbow off to the side" }],
    },
  },
});
