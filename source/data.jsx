import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════ CONSTANTS ═══════════════ */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYFULL = { Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };

const T = {
  h1: { fontSize: 25, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.15 },
  h2: { fontSize: 18, fontWeight: 680, letterSpacing: "-0.015em", lineHeight: 1.25 },
  h3: { fontSize: 14.5, fontWeight: 650, lineHeight: 1.3 },
  body: { fontSize: 14.5, lineHeight: 1.55 },
  small: { fontSize: 13, lineHeight: 1.5 },
  meta: { fontSize: 11.5, fontWeight: 600, letterSpacing: "0.01em" },
};

const C = {
  gi: "#60a5fa", nogi: "#a78bfa", open: "#34d399", wrestling: "#fb923c",
  strength: "#f472b6", drill: "#fbbf24", skills: "#2dd4bf", work: "#94a3b8", rest: "#64748b",
};

const BLOCKMETA = {
  gi: { label: "Gi", c: C.gi }, nogi: { label: "No-Gi", c: C.nogi },
  open: { label: "Open mat", c: C.open }, wrestling: { label: "Wrestling", c: C.wrestling },
  strength: { label: "Strength", c: C.strength }, drill: { label: "Solo drill", c: C.drill },
  skills: { label: "Skills", c: C.skills }, work: { label: "Work", c: C.work }, rest: { label: "Rest", c: C.rest },
  event: { label: "Competition", c: "#c4b5fd" },
};

/* ═══════════════ DATE HELPERS ═══════════════ */

const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseISO = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const dayKey = d => DAYS[d.getDay()];
const fmtShort = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const daysBetween = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 86400000);

/* ═══════════════ WEEK SCHEDULE ═══════════════ */

const defaultWeek = {
  Mon: [
    { k: "gi", t: "19:00", n: "Teens/Adults Gi", dur: 90 },
    { k: "drill", t: "—", n: "10-minute solo drill", dur: 10 },
  ],
  Tue: [
    { k: "wrestling", t: "16:00", n: "Wrestling practice", dur: 90, seasonOnly: true },
    { k: "nogi", t: "19:00", n: "Adults No-Gi", dur: 90 },
  ],
  Wed: [
    { k: "open", t: "10:30", n: "Open mat (when free)", dur: 90, optional: true },
    { k: "gi", t: "19:00", n: "Teens/Adults Gi", dur: 90 },
    { k: "drill", t: "—", n: "10-minute solo drill", dur: 10 },
  ],
  Thu: [
    { k: "work", t: "—", n: "Coaching gymnastics", dur: 0 },
    { k: "skills", t: "—", n: "Skills block at the gym", dur: 20 },
    { k: "nogi", t: "19:00", n: "Adults No-Gi", dur: 90 },
  ],
  Fri: [
    { k: "open", t: "10:30", n: "Open mat", dur: 90 },
    { k: "strength", t: "—", n: "Strength A", dur: 30, plan: "A" },
  ],
  Sat: [
    { k: "gi", t: "11:00", n: "Adults Gi", dur: 90 },
  ],
  Sun: [
    { k: "strength", t: "—", n: "Strength B", dur: 30, plan: "B" },
    { k: "rest", t: "—", n: "Weekly review", dur: 2, review: true },
  ],
};

/* ═══════════════ STRENGTH ═══════════════ */

const strength = {
  A: {
    name: "Strength A", day: "Friday",
    ex: [
      { id: "rdl", n: "Romanian deadlift", sets: 3, reps: "8–10", bar: true, start: 55 },
      { id: "row", n: "Bent-over row", sets: 3, reps: "8–10", bar: true, start: 45 },
      { id: "floor", n: "Floor press", sets: 3, reps: "8–10", bar: true, start: 45 },
      { id: "abwheel", n: "Ab wheel rollout", sets: 3, reps: "6–10", bar: false },
      { id: "pinch", n: "Plate pinch hold", sets: 3, reps: "20–30 sec", bar: false, grip: true },
    ],
  },
  B: {
    name: "Strength B", day: "Sunday",
    ex: [
      { id: "lunge", n: "Reverse lunge with the bar", sets: 3, reps: "8 per leg", bar: true, start: 35 },
      { id: "ohp", n: "Overhead press", sets: 3, reps: "8–10", bar: true, start: 35 },
      { id: "pullup", n: "Pull-ups", sets: 3, reps: "near max", bar: false, needsBar: true, sub: "row" },
      { id: "plank", n: "Plank on the mat", sets: 3, reps: "45 sec", bar: false },
      { id: "hang", n: "Gi or towel hang", sets: 3, reps: "max time", bar: false, grip: true, needsBar: true, sub: "pinch" },
    ],
  },
};

const PLATES = [20, 30, 50, 70, 80, 100];

const harderVersions = {
  rdl: ["Single-leg Romanian deadlift", "3-second lowering", "Paused at the bottom"],
  row: ["Single-arm row", "3-second lowering", "Paused at the top"],
  floor: ["3-second lowering", "Paused on the floor", "Close grip"],
  lunge: ["Rear foot elevated", "3-second lowering", "Paused at the bottom"],
  ohp: ["3-second lowering", "Paused at the forehead", "Single-arm with a plate"],
};

/* ═══════════════ SOLO DRILL ═══════════════ */

const soloDrills = [
  { id: "hipescape", n: "Hip escapes", t: "both sides, down and back", goal: 20 },
  { id: "techstand", n: "Technical stand-ups", t: "post, base, stand facing forward", goal: 10 },
  { id: "situp", n: "Sit-outs", t: "from turtle, hip clears the mat", goal: 20 },
  { id: "sprawl", n: "Sprawls", t: "hips back and down, both legs together", restricted: ["knee"], goal: 15 },
  { id: "penstep", n: "Penetration steps", t: "knee down, back straight, head up", restricted: ["knee"], goal: 20 },
  { id: "guilgrip", n: "Guillotine grip reps", t: "wrist under the chin, fall back, never jump", goal: 15 },
];

/* ═══════════════ LIBRARY ═══════════════ */

const yt = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);

const library = [
  {
    id: "posture", n: "Closed guard posture break", pos: "Closed guard", group: "Guard",
    status: "know", focus: "grip", view: "top-down",
    start: "You on your back with your ankles crossed behind them. They kneel upright with their hands on your hips.",
    steps: [
      "Grips. Your hands take a sleeve and the collar in the gi, or a wrist and the back of the neck in no-gi.",
      "Knees to chest. Both thighs pull toward your chest. Their torso tips forward. Your arms pull in the same beat.",
      "Hands hit the mat. Their hands land past your shoulders and their head is over your chest.",
      "Lock it down. One of your arms wraps over their back or behind their head. Your ankles stay crossed.",
    ],
    cue: "Legs pull, arms steer.",
    mistake: "Your legs stay still while your arms pull alone. Their spine stays upright.",
    link: "https://www.youtube.com/watch?v=mvXRQrja2xo", linkName: "Breaking posture in closed guard",
    connects: ["armbar", "triangle", "kimura", "omoplata", "crosscollar"],
  },
  {
    id: "armbar", n: "Armbar from closed guard", pos: "Closed guard", group: "Submission",
    status: "know", view: "top-down",
    start: "Their posture is broken and one of their arms is across your chest.",
    steps: [
      "Trap the arm. Both your hands hold it, one at the wrist and one above the elbow, pinned to your chest.",
      "Foot on the hip. Your guard opens. Your trapped-side foot goes on their hip. Your other leg climbs high across their back and pulls them down.",
      "Pivot. You push off the hip foot and your head swings toward their far knee until you lie across them at about 90 degrees.",
      "Leg over the head. The hip leg swings over their head and lands across the side of their neck.",
      "Finish. Knees pinch, heels pull down, their thumb points at the ceiling, your hips rise.",
    ],
    cue: "Pivot first, then the leg.",
    mistake: "Your spine is still in line with theirs. The leg cannot clear their head and they pull the arm out.",
    link: "https://www.youtube.com/watch?v=_hxa6n1dxKM", linkName: "Armbar, triangle, omoplata combo",
    connects: ["triangle", "kimura", "omoplata"],
  },
  {
    id: "triangle", n: "Triangle from closed guard", pos: "Closed guard", group: "Submission",
    status: "know", view: "top-down",
    start: "Closed guard with both their wrists in your hands.",
    steps: [
      "One in, one out. You push one wrist back into their belly. That is the out arm. You pull the other toward you. That is the in arm.",
      "Shoot the hips. Your hips lift. The leg on the out-arm side swings over that shoulder and lands across the back of their neck.",
      "Hold them there. You pull the in arm across your body and cross your ankles behind their back for a moment.",
      "Cut the angle. Grab the shin of your neck leg with the opposite hand, put the other foot on their hip, and turn until you can see their ear on the out-arm side.",
      "Lock and finish. The ankle of your neck leg sits in the pit of your other knee. Knees squeeze, hands pull their head down.",
    ],
    cue: "Angle before squeeze.",
    mistake: "You are square to them and your lock is over your toes instead of your ankle. A gap shows beside their neck.",
    link: "https://www.youtube.com/watch?v=877B2t2v7mQ", linkName: "Armbar, triangle, omoplata from closed guard",
    connects: ["armbar", "omoplata"],
  },
  {
    id: "americana", n: "Americana from mount", pos: "Mount", group: "Submission",
    status: "know", view: "top-down",
    start: "You are mounted. One of their arms is bent beside their head like an L, palm up.",
    steps: [
      "Pin the wrist. Your hand on that side pins their wrist to the mat, all five fingers on top. Your elbow drops next to their ear.",
      "Thread under. Your other hand slides under their upper arm just above the elbow and grabs your own wrist.",
      "Paint the mat. The back of their hand stays on the mat while you slide it toward their hip.",
      "Lift the elbow. Their elbow rises a little while the hand stays down.",
    ],
    cue: "Their hand never leaves the mat.",
    mistake: "Their wrist has lifted off the mat and the arm is straightening out of the lock.",
    link: yt("americana from mount bjj"), linkName: "Americana from mount",
    connects: ["kimura"],
  },
  {
    id: "spider", n: "Spider guard", pos: "Open guard", group: "Guard",
    status: "know", focus: "grip", view: "top-down, gi",
    start: "You on your back, they are kneeling or standing in front of you.",
    steps: [
      "Cuffs. Both your hands hold their sleeve cuffs, four fingers inside.",
      "Feet on the biceps. The balls of your feet sit in the bend of both their elbows.",
      "Long and short. One leg straightens and the other bends. Their shoulders tilt and their balance tips.",
      "Switch. The legs swap. This rocking is the whole point.",
      "Hips off-center. Your hips shift to one side, so you are never flat underneath them.",
    ],
    cue: "One leg long, one leg short.",
    mistake: "Both legs are straight. They circle their hands free and step around.",
    link: yt("spider guard basics bjj"), linkName: "Spider guard basics",
    connects: ["triangle", "omoplata"],
  },
  {
    id: "dragback", n: "Arm drag to the back", pos: "Standing", group: "Entry",
    status: "know", focus: "grip", view: "top-down",
    start: "Facing each other, seated or standing.",
    steps: [
      "Cross grip. Your hand takes their wrist on the diagonal, right hand to right wrist.",
      "Cup the arm. Your other hand cups behind their arm just above the elbow.",
      "Drag and go. Their arm is pulled across your body past your hip while your body moves the other way toward their back.",
      "Land. Your chest lands on the back of their shoulder and your arm reaches around their waist.",
      "Climb. Seatbelt, then hooks.",
    ],
    cue: "Move yourself as much as the arm.",
    mistake: "You pulled the arm but stayed in front of them. They square up again.",
    link: "https://www.youtube.com/watch?v=e_c7G5T_ZR8", linkName: "Arm drag to back take — Gordon Ryan",
    connects: ["back", "dragsingle"],
  },
  {
    id: "dragsingle", n: "Arm drag to single leg", pos: "Standing", group: "Takedown",
    status: "know", focus: "takedown", view: "side-on",
    start: "You begin the arm drag and they pull the arm back and square up.",
    steps: [
      "They pull back. Their weight shifts to their heels as they retract the arm.",
      "Change level. Your knees bend and your back stays straight. You step in with the foot nearest their lead leg.",
      "Catch the leg. Your hands lock behind their knee, their leg is pinched between your thighs, and your head is on the inside against their ribs with your eyes up.",
      "Hand off into the single leg finish.",
    ],
    cue: "Head inside, eyes up.",
    mistake: "Your head is down and outside their body — that is the guillotine they are waiting for.",
    link: "https://www.youtube.com/watch?v=d4LpTRE_wOk", linkName: "3 ways to arm drag — Cobrinha",
    connects: ["singleleg", "guillotine"],
  },
  {
    id: "back", n: "Back control", pos: "Back", group: "Position",
    status: "know", view: "side-on",
    start: "Both seated, you behind them.",
    steps: [
      "Seatbelt. One arm over their shoulder and the other under the opposite armpit. Your hands lock at their chest. Your chest is glued to their back.",
      "Hooks. Both your heels sit inside their thighs. Your feet are apart, never crossed.",
      "Follow. They lean and turn. Your chest stays glued and you move with them as one shape.",
      "Body triangle option. One leg goes across their belly and your foot locks behind your other knee. For bigger opponents.",
    ],
    cue: "Chest to back, seatbelt before choke.",
    mistake: "Your ankles are crossed between their legs, and both your arms are hunting the neck with no seatbelt.",
    link: "https://www.youtube.com/watch?v=baSqWCtLysU", linkName: "Back mount seatbelt control",
    connects: ["rnc"],
  },
  {
    id: "rnc", n: "Rear naked choke", pos: "Back", group: "Submission",
    status: "know", view: "side-on",
    start: "Back control with the seatbelt.",
    steps: [
      "Slide under. Your top arm slides under their chin. Your elbow points straight down, lined up with the chin.",
      "Reach and lock. That hand reaches to their far shoulder, then grabs your own other biceps.",
      "Second hand. Your other hand slides behind their head.",
      "Finish. Your chest pushes out, both elbows draw back, your head presses against theirs.",
    ],
    cue: "Elbow under the chin.",
    mistake: "Your forearm is across their jaw and your elbow is off to one side.",
    link: yt("rear naked choke details bjj"), linkName: "Rear naked choke details",
    connects: [],
  },
  {
    id: "sidescape", n: "Side control escape", pos: "Side control", group: "Escape",
    status: "know", view: "top-down",
    start: "You are flat on your back. They are across you, chest on chest.",
    steps: [
      "Frames. Both your forearms press against their near shoulder and neck. Your elbows stay tight to your ribs.",
      "Bridge. Your hips lift into them for a moment.",
      "Shrimp. Your hips slide away and you end on your side facing them.",
      "Knee in. Your near knee slides across their stomach.",
      "Recover any guard. Closed, half or open — any of them counts.",
    ],
    cue: "On your side, never flat.",
    mistake: "Your arms are straight and pushing away from your ribs. That is the armbar you are offering them.",
    link: yt("side control escape frame shrimp bjj"), linkName: "Side control escape",
    connects: ["posture"],
  },
  {
    id: "kneebar", n: "Knee bar", pos: "Legs", group: "Submission",
    status: "know", legal: true, view: "side-on",
    start: "You have isolated one of their legs.",
    steps: [
      "Hips above the knee. Your hips sit on their thigh, higher than the kneecap.",
      "Wrap the thigh. Both your legs wrap that thigh and your knees pinch.",
      "Hug the shin. Their lower leg is hugged to your chest with their heel beside your head.",
      "Finish slowly. Your hips press forward a little at a time.",
    ],
    cue: "Hips above their knee.",
    mistake: "Your hips have slid below their knee and the leg bends free.",
    link: yt("knee bar basics bjj"), linkName: "Knee bar basics",
    connects: [],
  },
  {
    id: "guillotine", n: "Guillotine", pos: "Standing", group: "Submission",
    status: "learning", view: "side-on",
    start: "Standing. They lower their head toward your hip to shoot.",
    steps: [
      "Wrap. Your arm goes over the back of their neck and under the chin. Their head ends up beside your ribs. Your wrist bone sits under the chin.",
      "Connect. Your other hand grabs the choking hand and pulls it up toward your chest.",
      "Sit to guard. You sit back and lock your legs around their waist. You sit, you do not jump.",
      "Finish. Your back arches, your forearm lifts toward your chest, and you crunch toward the choking-arm side.",
    ],
    cue: "Wrist under the chin, lift up.",
    mistake: "Your legs are open and they are walking around to the side away from their head.",
    link: "https://www.youtube.com/watch?v=XCiRr7TW2bk", linkName: "The high elbow guillotine — Danaher",
    connects: ["posture"],
  },
  {
    id: "gripbreak", n: "Grip breaks and inside position", pos: "Standing", group: "Standing",
    status: "learning", focus: "grip", view: "side-on",
    start: "Standing. They have a grip on your sleeve or wrist.",
    steps: [
      "Their grip. Note where they hold you.",
      "Two on one. Your free hand takes their gripping wrist. You push it away while your held arm snaps back toward your hip, elbow leading.",
      "Replace. Before they regrip, your hands take your own grips: collar and sleeve in the gi, inside ties in no-gi.",
      "Inside position. Your arms are inside theirs.",
    ],
    cue: "Break and replace in one beat.",
    mistake: "The grip is broken but your hands are empty and paused. They take a new grip first.",
    link: "https://www.youtube.com/watch?v=6CZnVl1jUNI", linkName: "Wrestling for BJJ — stance and motion",
    connects: ["dragback", "dragsingle"],
  },
  {
    id: "singleleg", n: "Single leg finishes", pos: "Standing", group: "Takedown",
    status: "learning", focus: "takedown", view: "side-on",
    start: "You hold their leg high and tight with your head inside.",
    steps: [
      "Finish A, run the pipe. Your outside foot steps back in a circle while your shoulder drives down into their thigh.",
      "They sit. Their hips drop to the mat.",
      "Finish B, switch to the double. They hop and balance instead. You drop their foot, reach for the far knee, and drive across.",
      "Land on top. Both finishes end with you past their legs, chest on chest.",
    ],
    cue: "Keep moving. A still single leg is a lost single leg.",
    mistake: "You are standing upright holding the leg with no movement. They hop and push your head down.",
    link: yt("single leg takedown run the pipe"), linkName: "Run the pipe single leg",
    connects: ["sidescape"],
  },
  {
    id: "kimura", n: "Kimura from closed guard", pos: "Closed guard", group: "Submission",
    status: "next", priority: true, view: "top-down",
    start: "Closed guard. One of their hands is posted on the mat beside your hip.",
    steps: [
      "Catch the wrist. Your hand on that side grabs their wrist, thumb beside your fingers, and holds it to the mat.",
      "Sit up into it. Your guard opens and you sit up toward that arm. Your other arm reaches over their shoulder.",
      "Figure-four. That arm threads down behind their upper arm and grabs your own wrist. Their elbow is bent at 90 degrees.",
      "Fall back and angle. You drop back and scoot your hips out until you are on your side facing the trapped arm. One leg hooks over their lower back.",
      "Finish. Their elbow stays glued to your chest while you turn their hand up behind their back.",
    ],
    cue: "Elbow glued to your chest.",
    mistake: "Their elbow has drifted away from your chest and no leg is across their back. They roll out.",
    link: yt("kimura from closed guard bjj"), linkName: "Kimura from closed guard",
    connects: ["armbar", "omoplata"],
  },
  {
    id: "omoplata", n: "Omoplata", pos: "Closed guard", group: "Submission",
    status: "next", view: "top-down",
    start: "Closed guard. One of their arms is on the mat beside you.",
    steps: [
      "Control and open. You hold that wrist, open your guard, and put a foot on their hip.",
      "Pivot the other way. This is the opposite of the armbar. Your head swings toward their knee on the trapped side.",
      "Leg over the shoulder. Your trapped-side leg swings over their shoulder. Your shin lies across their upper back.",
      "Sit up. You sit up beside them, facing the same way they face. Your arm reaches across their back and holds the far hip.",
      "Flatten them. You scoot your hips away and stretch your legs until their chest is on the mat.",
      "Finish. You lean forward toward their far shoulder.",
    ],
    cue: "Hold the hip before you finish.",
    mistake: "No hand on the far hip. They roll forward and out.",
    link: "https://www.youtube.com/watch?v=plHjXl2fQy0", linkName: "3 ways to finish the omoplata",
    connects: ["triangle", "kimura"],
  },
  {
    id: "crosscollar", n: "Cross-collar choke", pos: "Closed guard", group: "Submission",
    status: "next", gi: true, view: "top-down, gi",
    start: "Closed guard with their posture broken.",
    steps: [
      "First grip, deep. One hand opens their collar and the other slides in palm up, four fingers inside, until it is behind their neck.",
      "Second grip, under. Your second hand goes under the first arm, palm up, deep into the other collar. Your forearms cross under their chin.",
      "Bring the head down. Your legs pull so their head comes to your chest.",
      "Finish. Both wrists turn toward your face and your elbows draw back to your ribs.",
    ],
    cue: "Win it with the first grip.",
    mistake: "Shallow grips near the chest and elbows flared wide. The collar sits loose around the neck.",
    link: yt("cross collar choke from closed guard"), linkName: "Cross-collar choke",
    connects: ["posture", "armbar"],
  },

  /* ── added Oct 8: the positions you lost in at Grappling X ── */
  {
    id: "traproll", n: "Trap and roll (mount escape)", pos: "Mount", group: "Escape",
    status: "learning", priority: true, view: "angle",
    start: "You are on your back. They are mounted, hands on your chest.",
    steps: [
      "Trap the arm. Both your hands hold one of their arms tight to your chest: one on the wrist, one over the elbow.",
      "Trap the foot. Your foot on the same side steps over their foot, so that side cannot post.",
      "Bridge. Drive your hips straight up, then over the shoulder on the trapped side.",
      "Land in their guard. Posture up straight away.",
    ],
    cue: "Trap the arm and the foot on the same side.",
    mistake: "You bridge without trapping the arm and foot. They post and stay on top.",
    link: yt("trap and roll upa mount escape bjj"), linkName: "Trap and roll",
    connects: ["elbowknee", "ezekieldef"],
  },
  {
    id: "elbowknee", n: "Elbow-knee escape (mount to half guard)", pos: "Mount", group: "Escape",
    status: "learning", priority: true, view: "angle",
    start: "You are on your back. They are mounted.",
    steps: [
      "Turn and frame. Turn onto your side. Your bottom elbow goes inside their knee, your other hand frames on their hip.",
      "Push the knee and shrimp. Your elbow pushes their knee toward your feet while your hips slide away.",
      "Knee in. Your bottom knee slides into the space you made, under their thigh.",
      "Half guard. Your other leg hooks over theirs. Stay on your side.",
    ],
    cue: "Elbow inside their knee, then shrimp.",
    mistake: "Flat on your back with no elbow inside their knee, so there is no space for your knee.",
    link: yt("elbow knee escape from mount bjj"), linkName: "Elbow-knee escape",
    connects: ["traproll"],
  },
  {
    id: "ezekieldef", n: "Ezekiel defence from mount", pos: "Mount", group: "Defence",
    status: "learning", priority: true, view: "angle",
    start: "You are on your back. They are mounted and one arm slides behind your head.",
    steps: [
      "Chin down, hands up. Both your hands catch the forearm that is coming across your throat, before it lands.",
      "Never push their chest with straight arms. That opens your neck and gives up the armbar.",
      "Trap that side. Pull the arm to your chest and step your foot over their foot on the same side.",
      "Bridge and roll toward the trapped side. Their arm behind your head cannot post.",
    ],
    cue: "Both their arms are busy, so roll.",
    mistake: "You push their chest with straight arms and your chin is up. The sleeve grip goes on and the forearm cuts across.",
    link: yt("ezekiel choke defense from mount bjj"), linkName: "Ezekiel defence",
    connects: ["traproll", "armbardef"],
  },
  {
    id: "armbardef", n: "Armbar defence from mount", pos: "Mount", group: "Defence",
    status: "learning", view: "angle",
    start: "You are on your back. They climb to high mount and go for an arm.",
    steps: [
      "Elbows in. Elbows glued to your ribs, hands by your chin. Never push with straight arms.",
      "They isolate an arm: clasp your hands together so the arm stays bent.",
      "They fall back: keep the clasp, turn onto your side toward their legs, thumb to the mat.",
      "Come up onto your knees into them and slide the elbow out toward your hip. You end on top.",
    ],
    cue: "Elbows in, hands clasped.",
    mistake: "You push their chest with straight arms. That hands them the arm.",
    link: yt("armbar defense from mount hitchhiker bjj"), linkName: "Armbar defence from mount",
    connects: ["elbowknee", "ezekieldef"],
  },
  {
    id: "schalf", n: "Side control escape to half guard", pos: "Side control", group: "Escape",
    status: "learning", priority: true, view: "angle",
    start: "You are flat on your back. They are across you, chest on chest.",
    steps: [
      "Frames. One forearm across their neck, the other on their hip. Elbows bent and tight.",
      "Shrimp away so you end on your side, facing them.",
      "Bottom knee in, low across their hip.",
      "Catch their near leg with both legs: half guard, on your side.",
    ],
    cue: "Get on your side, then get a knee in.",
    mistake: "You shrimp but stay flat on your back, so your knee cannot get in front of you.",
    link: yt("side control escape to half guard bjj"), linkName: "Side control to half guard",
    connects: ["sidescape", "scunder", "scmountblock"],
  },
  {
    id: "scunder", n: "Side control escape: underhook to your knees", pos: "Side control", group: "Escape",
    status: "next", view: "angle",
    start: "You are flat on your back. They are across you.",
    steps: [
      "Frames: forearm on the neck, forearm on the hip.",
      "Shrimp away and turn in, onto your side facing them.",
      "Swim the underhook: your bottom arm slides under their arm to their back.",
      "Drive into them and come up on your knees, head tight to their chest.",
    ],
    cue: "Turn in before you reach.",
    mistake: "You reach for the underhook while you are still flat. They crossface you back down.",
    link: yt("side control escape underhook to knees bjj"), linkName: "Underhook escape",
    connects: ["schalf"],
  },
  {
    id: "scmountblock", n: "Block the mount from side control", pos: "Side control", group: "Defence",
    status: "learning", view: "angle",
    start: "You are on the bottom of side control. Their knee lifts to slide across your belly.",
    steps: [
      "Their knee lifts: your near knee comes up straight away.",
      "Your near elbow drops to meet that knee. Knee and elbow together are a wall.",
      "Shrimp in behind the wall and keep the knee in front of you. Recover guard.",
    ],
    cue: "Knee to elbow.",
    mistake: "Your near leg lies flat on the mat and their knee slides straight across into mount.",
    link: yt("prevent mount from bottom side control knee elbow connection"), linkName: "Block the mount",
    connects: ["schalf", "sidescape"],
  },
  {
    id: "sitguard", n: "Sit to guard (don't jump)", pos: "Standing", group: "Guard pull",
    status: "learning", view: "side-on",
    start: "Standing, facing them.",
    steps: [
      "Grips first: both wrists, or collar and sleeve.",
      "Step in close and sit down right next to your heel.",
      "As your butt lands, both feet go on their hips. Keep the grips.",
      "Pull them down into closed guard, or play open guard.",
    ],
    cue: "You sit, you do not jump.",
    mistake: "You jump and wrap your legs around them. They drop you into a pass, and jumping guard is banned in many teen divisions.",
    link: yt("how to pull guard safely bjj sit to guard"), linkName: "Pulling guard safely",
    connects: ["posture", "guillotine"],
  },
];

const FOCUS = {
  grip: { label: "Grip fighting", c: "#60a5fa" },
  takedown: { label: "Finishing takedowns", c: "#a78bfa" },
  strength: { label: "Getting stronger", c: "#f472b6" },
};

const STATUSMETA = {
  know: { label: "Know", c: "#34d399" },
  learning: { label: "Learning", c: "#fbbf24" },
  next: { label: "Next", c: "#60a5fa" },
};

const INTERVALS = [1, 3, 7, 14, 30];

/* ═══════════════ POSITIONS ═══════════════ */

const POSITIONS = ["Standing", "Closed guard", "Open guard", "Half guard", "Side control", "Mount", "Back", "Legs"];

/* ═══════════════ GAME PLAN ═══════════════ */

const gamePlan = {
  top: {
    label: "From standing",
    rows: [
      [{ id: "gripbreak", n: "Standing grips" }, { id: "dragback", n: "Arm drag" }, { id: "back", n: "Back control", hi: true }, { id: "rnc", n: "RNC or armbar" }],
      [null, { id: "dragsingle", n: "Single leg", note: "they square up" }, { id: "singleleg", n: "Run the pipe" }, { id: "americana", n: "Top: americana" }],
    ],
    scramble: { id: "back", n: "Scramble" },
  },
  bottom: {
    label: "From the bottom",
    root: { id: "posture", n: "Closed guard" },
    branches: [
      { h: "Attacks you know", b: "Armbar and triangle, after the posture break", ids: ["armbar", "triangle"] },
      { h: "Learning next", b: "Kimura first, then omoplata and cross-collar choke", ids: ["kimura", "omoplata", "crosscollar"], hi: true },
    ],
  },
};

/* ═══════════════ SKILLS ═══════════════ */

const defaultSkills = [
  {
    id: "bridge", n: "Full bridge",
    steps: ["Wall slides and doorframe stretch before every attempt", "Supported backbend over a block", "Bridge on the head", "Partial bridge, arms bent", "Full bridge, arms straight", "Hold 10 seconds clean"],
  },
  {
    id: "gainer", n: "Cheater gainer",
    steps: ["Full bridge first", "Back walkover with a spot", "Gainer into the foam pit", "Gainer onto the crash mat, spotted", "Gainer on the floor, spotted"],
  },
];

/* ═══════════════ COMP DAY CONTENT (carried over) ═══════════════ */

const taping = [
  { n: "Toes", b: "Tape the two toes together on either side of a sore one. Thin strips, not tight enough to go white." },
  { n: "Ankle mat burn", b: "A square of gauze, then tape around it. Never tape straight onto a raw patch." },
  { n: "Fingers", b: "Buddy tape above and below the knuckle, not over it. You still need the joint to bend." },
  { n: "When", b: "All of it at home before you leave, on clean dry skin. Walk around on it for an hour so you can spot anything too tight." },
  { n: "Never", b: "Menthol rub under tape. It burns the skin once you sweat." },
];

const warmup = [
  { t: "0:00", d: "Light jog or skipping on the spot, 3 minutes. Just raise the temperature." },
  { t: "3:00", d: "Hip circles, leg swings, arm swings. 2 minutes." },
  { t: "5:00", d: "Shrimping, bridging, technical stand-ups across the mat. 3 minutes." },
  { t: "8:00", d: "Breakfalls, 10 each side. Wakes up the landing reflex." },
  { t: "10:00", d: "Grip fighting with a partner at half speed, 3 minutes." },
  { t: "13:00", d: "Three hard sprawls and three penetration steps. You want to be sweating now." },
  { t: "15:00", d: "Stop. Hoodie on, keep moving, sip water. Do not go cold." },
];

const kit = [
  "Gi (clean, correct colour for the ruleset)", "Rash guard and shorts for no-gi", "Belt",
  "Mouthguard", "Flip-flops for off the mat", "Two water bottles", "Bananas and a carb snack",
  "Tape", "Towel", "Spare shirt", "Phone charger and battery pack", "Headphones",
  "Printed or screenshotted bracket", "Cash for the venue",
];

const beforeYouPay = [
  "Registration deadline and the price tiers",
  "Your exact division: age bracket, belt, weight class",
  "Legal submissions for your belt and age",
  "Match length, and whether the bracket has enough entrants for a guarantee",
  "Pull the roster and see who is in your division before you commit",
  "Refund policy",
];

const compDay = [
  { t: "Wake", d: "Full glass of water before anything else." },
  { t: "Breakfast", d: "Something you have eaten a hundred times. Not the morning to try anything new." },
  { t: "Travel", d: "Keep sipping. Bring bananas — brackets run late and you do not want to be starving at hour three." },
  { t: "On arrival", d: "Find your mat, check the bracket, work out roughly how long until you are up. Then stop watching other people." },
  { t: "20 min before", d: "Full warm-up. Break a sweat. Cold muscles is how people get hurt in round one." },
  { t: "Between matches", d: "Small carbs and water. Keep moving — do not sit down and go cold." },
  { t: "After", d: "Real meal, lots of water, and write down what happened while it is fresh." },
];

/* ═══════════════ INJURY RULES ═══════════════ */

const injuryPresets = {
  knee: { n: "Knee", rules: ["No shooting", "No jumping", "No live rounds", "No pressure through that leg"], blocks: ["sprawl", "penstep"] },
  neck: { n: "Neck", rules: ["No stack passes", "No inverting", "No rounds where you land on your head", "Tell your partner before you start"], blocks: [] },
  shoulder: { n: "Shoulder", rules: ["No kimura or americana defence under load", "No hard posting", "No overhead pressing"], blocks: [] },
  finger: { n: "Finger", rules: ["No gi grips on that hand", "Tape above and below the knuckle", "No-gi only if it is bad"], blocks: [] },
  rib: { n: "Rib", rules: ["No body triangles", "No heavy top pressure taken", "Stop if breathing hurts"], blocks: [] },
};
