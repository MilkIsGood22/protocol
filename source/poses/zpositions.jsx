
/* ═══════════════ POSITION STILLS (position map tiles) ═══════════════
   File name starts with z so it loads after the files that define meStand / opStand / opSupine. */
Object.assign(anims, {

  pos_standing: {
    yaw: -16, pitch: 10, frames: [{
      me: { ...meStand, hR: at("op.nape", [-2, 0, 8]), hL: at("op.elR", [-4, 3, 5]), eL: [-10, 78, -30], eR: [-10, 84, 34] },
      op: { ...opStand, hL: at("me.nape", [2, 0, 8]), hR: at("me.elR", [4, 3, -5]), eL: [24, 84, 34], eR: [20, 78, -30] },
    }],
  },

  pos_open: {
    yaw: -32, pitch: 24, frames: [{
      me: { ...meGuard, pelvis: [-2, 13, 0], up: [-1, 0.3, 0], curl: 0.5, head: [-1, 0.8, 0], look: [1, 0.5, 0],
        fL: at("op.hiR", [-5, 0, -4]), fR: at("op.hiL", [-5, 0, 4]), kL: at("op.waist", [-30, 20, -40]), kR: at("op.waist", [-30, 20, 40]), toeL: null, toeR: null,
        hL: at("op.haR", [-2, -2, -1]), hR: at("op.haL", [-2, -2, 1]), eL: [-30, 10, -40], eR: [-30, 10, 40] },
      op: { ...opKneel, pelvis: [40, 26, 0], up: [-0.2, 1, 0], KL: [8, 5, 21], KR: [8, 5, -21], fL: [46, 4, 14], fR: [46, 4, -14],
        hL: at("me.knR", [3, 2, 0]), hR: at("me.knL", [3, 2, 0]), eL: [30, 50, 40], eR: [30, 50, -40] },
    }],
  },

  pos_half: {
    yaw: -38, pitch: 30, frames: [{
      me: { pelvis: [0, 12, 0], up: [-1, 0.1, 0], front: [0, 1, 0], hf: null, curl: 0.3, head: [-1, 0.4, -0.3], look: [0.2, 1, 0.4],
        KL: null, KR: null, kL: [14, 44, -24], kR: [16, 44, 24], fL: at("op.knL", [12, 8, -7]), fR: at("op.knL", [16, 2, 8]), toeL: null, toeR: null,
        hL: at("op.ribR", [2, 6, -4]), eL: [-20, 10, -40], hR: at("op.hiL", [-2, -2, 6]), eR: [-10, 10, 40], EL: null, ER: null },
      op: { pelvis: [14, 31, 6], up: [-1, -0.12, 0], front: [0, -1, 0], hf: null, curl: 0.25, head: [-1, -0.05, -0.15], look: [-0.3, -1, 0],
        KL: [34, 5, 6], KR: [34, 5, -30], kL: null, kR: null, fL: [74, 4, 6], fR: [74, 4, -30], toeL: null, toeR: null,
        hL: [-8, 4, 34], eL: [10, 30, 40], hR: at("me.head", [2, -7, -10]), eR: [-20, 30, -40], EL: null, ER: null },
    }],
  },

  pos_side: {
    yaw: 24, pitch: 40, frames: [{
      me: { pelvis: [-4, 34, -38], up: [-0.09, -0.045, 1], front: [0, -1, -0.045], hf: null, curl: 0.3, head: [0, 0.2, 1], look: [0.2, -1, 0.3],
        KL: [10, 8, -10], KR: [-20, 8, -12], kL: null, kR: null, fL: [12, 4, -52], fR: [-22, 4, -54], toeL: null, toeR: null,
        hR: at("op.shR", [-2, -5, 7]), eR: [-40, 10, -10], hL: at("op.hiR", [4, -3, 8]), eL: [20, 30, 0], EL: null, ER: null },
      op: { ...opSupine, hL: at("me.shR", [0, 4, 0]), eL: [-40, 4, -30], hR: [-6, 4, 40], eR: [-24, 4, 46] },
    }],
  },

  pos_mount: {
    yaw: 60, pitch: 34, frames: [{
      me: { pelvis: [0, 38, 0], up: [-0.15, 1, 0], front: [-1, -0.1, 0], hf: null, curl: 0.25, head: null, look: [-1, -0.7, 0],
        KL: [-16, 7, 29], KR: [-16, 7, -29], kL: null, kR: null, fL: [27, 4, 24], fR: [27, 4, -24], toeL: null, toeR: null,
        hL: at("op.sternum", [-4, 8, 8]), hR: at("op.sternum", [-4, 8, -8]), eL: [0, 60, 40], eR: [0, 60, -40], EL: null, ER: null },
      op: { ...opSupine, hL: at("me.hiR", [2, 0, -6]), hR: at("me.hiL", [2, 0, 6]), eL: [-10, 6, -40], eR: [-10, 6, 40] },
    }],
  },
});

/* which still each position-map tile shows: [move id, frame index] */
const POS_STILL = {
  "Standing": ["pos_standing", 0], "Closed guard": ["posture", 0], "Open guard": ["pos_open", 0], "Half guard": ["pos_half", 0],
  "Side control": ["pos_side", 0], "Mount": ["pos_mount", 0], "Back": ["back", 1], "Legs": ["kneebar", 2],
};
