
/* ═══════════════ MOVE TREE ═══════════════
   One line per node:  Name ~kind flags | what it is and how it goes
   Two spaces of indent per level. Lines without "~" are folders.
   kind: pos ct tk sw pa sub esc tr gr con dr
   flags: gi (gi only) · ng (no-gi only) · r (often illegal for teens and white belts) · x (banned almost everywhere)
          lib=id (has a card with steps and an animation in your library) */
const TREE_SRC = `
Foundations
  Principles
    Position before submission ~con | Win and hold the position first. A submission from a stable position works far more often than a rushed one.
    Frames, not pushes ~con | Make space with bones (forearm across the neck, shin across the hips) instead of pushing with straight arms, which gives up armbars.
    Inside position ~con | Elbows, knees and hands inside theirs decide where both of you can move. Fight to be inside first.
    Head position ~con | Where the head goes the body follows. Head inside on shots, head up and over their shoulder when you defend.
    Base and posture ~con | Wide knees, hips under your shoulders, straight back. You cannot be pulled down or swept from good posture.
    Hip movement ~con | The hips are the engine: shrimp to make space, bridge to lift, switch hips to change angle.
    Angles ~con | Almost every attack works better from off-centre. If you are square to them, move first, attack second.
    Grips first ~con | Break their grip, then take yours. The person with better grips decides the exchange.
    Pressure ~con | Put weight through your hips and shoulder into them, not into your hands on the mat.
    Connection ~con | Elbows to knees and chest to chest. Gaps are where they insert frames and escape.
    Off-balancing (kuzushi) ~con | Break their balance before throwing or sweeping: pull, push or lift until their weight is on one leg.
    Action and reaction ~con | Threaten one thing so they defend it and open the next. Chains beat single moves.
    Breathe under pressure ~con | Breathe out when you are squashed. Panic burns energy and makes you push with your arms.
    Three-second rule ~con | After a scramble, settle and hold the new position for three seconds before you attack.
  Solo movement
    Shrimp (hip escape) ~dr anim=drill_hipescape | On your side, push off one foot and drive your hips back. Ends on your side with space for a knee.
    Bridge (upa) ~dr | Feet close to your butt, drive your hips up and over one shoulder, not straight up.
    Technical stand-up ~dr anim=drill_techstand | Post a hand behind you and the opposite foot, lift the hips, swing the free leg back and stand facing forward.
    Sit-out ~dr anim=drill_situp | From turtle, post on one hand, thread the opposite leg under and turn your chest to face the other way.
    Granby roll ~dr | Shoulder roll across your upper back to bring your legs back in front of you. Never over the top of the head.
    Forward roll ~dr | Tuck the chin and roll over one shoulder diagonally.
    Backward roll ~dr | Roll back over one shoulder, head turned away, and come to your knees.
    Sprawl ~dr anim=drill_sprawl | Throw both legs back, drop the hips to the mat, chest heavy, hands ready.
    Penetration step ~dr anim=drill_penstep | Level change, step deep between their feet, lead knee touches down, back straight, head up.
    Hip switch / hip heist ~dr | Base on a hand and the opposite foot, swing the other leg under you to come up facing a new direction.
    Breakfalls ~dr | Back, side and forward falls. Chin tucked, slap the mat with the arm, never post a straight arm.
    Shoulder walk ~dr | On your back, move by walking your shoulders, keeping your hips off the mat.
    Inversion ~dr | Roll onto your shoulders with your legs over you to keep facing them. Turn the head, never stack on the neck.
    Bear crawl and crab walk ~dr | Coordination and shoulder strength for scrambles.
  Scoring (IBJJF style)
    Takedown, 2 points ~con | Taking them from standing to the mat and holding top for three seconds.
    Sweep, 2 points ~con | From guard, ending on top. Held three seconds.
    Knee on belly, 2 points ~con | Knee on their belly, other foot posted, three seconds.
    Guard pass, 3 points ~con | Getting past their legs to side control or north-south, three seconds.
    Mount, 4 points ~con | Sitting on their torso with both knees on the mat, three seconds.
    Back control, 4 points ~con | Both hooks in behind them. Many events also count the body triangle.
    Advantages ~con | Almost scoring (a nearly finished sweep or submission) is an advantage. They break ties.
    Penalties ~con | Stalling, fleeing the mat, illegal moves. Repeated penalties can give points or disqualify.
    Teen rules ~con | Kids and teen divisions usually ban leg locks other than the straight ankle lock, wrist locks, slicers, slams, neck cranks and the scissor takedown. Always read your event's ruleset.
Standing
  Stance and hand fighting
    Square stance ~con | Feet level, knees bent, hands up. Good for shooting either leg and for sprawling.
    Staggered stance ~con | One foot forward. Easier to move, but the lead leg is the target.
    Level change ~con | Drop your hips by bending the knees, not by bending forward at the waist.
    Collar tie ~gr | Hand behind their neck, elbow on their collarbone. Controls the head and measures distance.
    Inside tie ~gr | Your hand on the inside of their biceps. Blocks their shots and opens drags.
    Wrist control ~gr | Hold their wrist so the hand cannot grip. Two hands on one wrist is a two-on-one.
    Two-on-one (Russian tie) ~gr | Both your hands on one of their arms, one at the wrist and one at the elbow, chest close.
    Underhook ~gr | Your arm under their armpit, hand on their back. The underhook usually wins the scramble.
    Overhook (whizzer) ~gr | Your arm over theirs, clamping it. Defends their underhook and their single leg.
    Grip breaks ~gr lib=gripbreak | Two on one on their wrist, snap your arm back toward your hip, then replace with your own grip.
    Pummeling ~dr | Swimming your arms inside theirs to win underhooks. Drill it daily.
    Snap down ~tr | Pull their head down sharply with a collar tie as they lean in, ending in a front headlock.
    Arm drag ~tr lib=dragsingle | Cross grip on the wrist, cup behind the elbow, pull their arm past your hip and step to their side.
    Duck under ~tr | Push their arm up, drop your head under their armpit and step behind them.
    Shuck (slide-by) ~tr | Push their elbow across their body and step past to their back.
    Go-behind ~tr | Any move that ends with you behind them standing: drag, duck under, shuck, snap down.
  Gi grips
    Collar and sleeve ~gr gi | Same-side collar and sleeve. Classic for foot sweeps and guard pulls.
    Cross collar grip ~gr gi | Your hand reaches across to their opposite collar. Strong for throws and controlling posture.
    Pistol grip on the sleeve ~gr gi | Fist wrapped around the end of the sleeve like a handle. Hard for them to break.
    Pocket grip ~gr gi | Four fingers inside the cuff. Strong but hard on your fingers, often used in spider guard.
    Lapel grip ~gr gi | Grabbing the lapel (the front of the jacket). Used for pulls and lapel guards.
    Belt grip ~gr gi | Grip the belt over their back for throws or under the arm for control.
    Break a collar grip ~gr gi | Both hands on their wrist, posture up and peel it off, or turn your shoulder and strip it down.
    Grip fighting strategy ~con gi | Never let them hold two grips you do not answer. Break, then take.
  Wrestling takedowns
    Double leg ~tk anim=doubleleg | Level change, penetration step, both arms around the legs, head up on their chest, drive across.
      Blast double ~tk | A fast double leg straight through them with your head tight to their ribs.
      Double leg, turn the corner ~tk | Hit the double, then drive at an angle and pull the far leg toward you.
      Double leg from the clinch ~tk | Change levels out of the over-under clinch and catch both legs.
    Single leg ~tk lib=singleleg | Step in with the near leg, head inside on their chest, hands locked behind the knee.
      High crotch ~tk | A single leg with your head on the outside of their hip and arm deep between their legs.
      Low single ~tk | Shoot to their ankle while they stand tall. Finish by lifting the foot and driving forward.
      Run the pipe ~tk lib=singleleg | Leg held tight, step back in a circle and drive your shoulder down into their thigh.
      Single to double switch ~tk lib=singleleg | Drop the leg, reach for the far knee and drive across.
      Shelf the leg ~tk | Lift their leg onto your thigh, hold the ankle and trip the standing leg.
      Head-outside single ~tk | Riskier version with the head outside. Watch for the guillotine.
    Ankle pick ~tk anim=anklepick | Pull their head down to bring their weight forward, then pick the heel of the stepping foot.
    Knee tap ~tk | Pull the head or collar, step to the side and tap the near knee with your hand while you drive in.
    Fireman's carry ~tk | Grip the arm, drop to a knee between their legs, carry them across your shoulders and roll them over.
    Body lock takedown ~tk | Hands locked around their waist, head tight, step behind and trip or tilt them back.
    Duck under ~tk | Push their elbow up, duck your head under, come out behind them, then take them down.
    Arm drag to single ~tk lib=dragsingle | Drag the arm, their lead leg is exposed, change level and catch it.
    Lateral drop ~tk | From the over-under clinch, step in front and throw them sideways while you drop.
    Headlock throw ~tk | Headlock with an arm trapped, hip in, throw them over your hip. Risky if they defend.
    Suplex ~tk r | Lifting throw backward from a body lock. Never slam. Banned or restricted in many teen rulesets.
    Snap down to front headlock ~tr | Snap the head as they step in and spin to their back or attack the neck.
  Judo throws and trips
    O soto gari ~tk | Major outer reap. Off-balance them backward, step deep beside them and reap the near leg.
    O uchi gari ~tk | Major inner reap. Hook their leg from the inside and drive them back.
    Ko uchi gari ~tk | Minor inner reap. Sweep their heel from the inside as they step.
    Ko soto gari ~tk | Minor outer reap. Sweep their heel from the outside.
    De ashi barai ~tk | Advancing foot sweep. Time their step and sweep the foot as it lands.
    Okuri ashi barai ~tk | Sliding foot sweep. Sweep both feet as they step sideways.
    Sasae tsurikomi ashi ~tk | Block the shin with your sole and turn them over it.
    O goshi ~tk | Major hip throw. Arm around the waist, hip in, lift and turn.
    Koshi guruma ~tk | Hip wheel with your arm around their head instead of their waist.
    Harai goshi ~tk | Hip sweep. Load them on your hip and sweep the thigh.
    Uchi mata ~tk | Inner thigh throw. Lift their inner thigh with yours as you turn.
    Seoi nage ~tk gi | Shoulder throw. Turn in, arm under their armpit, throw them over your shoulder.
    Drop seoi nage ~tk gi | Seoi nage dropping to your knees. Hard on the knees, practise on mats.
    Tai otoshi ~tk | Body drop. Block their leg with yours and turn them over it.
    Kata guruma ~tk | Shoulder wheel, the judo fireman's carry.
    Tomoe nage ~tk | Circle throw. Sit back, foot on their belly, throw them over your head.
    Sumi gaeshi ~tk | Corner reversal. Sacrifice back with a hook under their thigh.
    Tani otoshi ~tk | Valley drop. Sit beside their leg and pull them back over it.
    Sode tsurikomi goshi ~tk gi | Sleeve lifting hip throw.
    Kani basami (scissor takedown) ~tk x | Jumping scissor with the legs. Banned almost everywhere because of knee injuries.
  Pulling guard and sitting down
    Pull closed guard ~tr | Take grips, sit to your butt close to them and wrap your legs.
    Sit to guard ~tr lib=sitguard | Sit down with a grip and put your feet on their hips or legs straight away. You sit, you do not jump.
    Collar drag ~tr gi | Collar grip, sit to the side and drag their head past you to take the back or a single leg.
    Guillotine pull ~sub lib=guillotine | Lock the guillotine standing, sit to guard and finish.
    Jumping guard ~tr r | Jumping onto them and wrapping the legs. Illegal in many kids, teen and white-belt rulesets.
    Flying armbar ~sub r | Jump into an armbar from standing. High risk, often banned for teens.
    Flying triangle ~sub r | Jump into a triangle from standing. High risk, often banned for teens.
    Imanari roll ~tr r | Rolling entry to the legs from standing. It leads to heel hooks.
  Takedown defence
    Sprawl ~esc anim=drill_sprawl | Legs back, hips heavy on their head or shoulders, crossface.
    Whizzer ~esc | Overhook on the arm that holds your leg, hip into them, push the head away.
    Crossface ~esc | Forearm across their face to turn their head away from you.
    Downblock ~esc | Hands meet their shoulders or head as they shoot, before they reach your legs.
    Limp arm ~esc | Straighten and turn your arm out of their grip and step away.
    Single leg defence ~esc | Leg between their legs, hip down, whizzer, push the head. Never hop in place.
    Go behind after the sprawl ~tr | Sprawl, then circle behind them to take the back.
    Guillotine counter ~sub lib=guillotine | Head outside on their shot? Wrap the neck, connect hands, sit to guard.
  Front headlock
    Front headlock control ~ct | Chest on their head, one arm around the neck, the other blocking an arm. Hips back.
    Go-behind from front headlock ~tr | Hold the head, circle to their side and take the back.
    Arm-in guillotine ~sub | Their arm trapped inside the choke. Strong when they defend with the arm.
    High-elbow guillotine ~sub | Wrist under the chin, elbow high, roll your body to their arm side.
    Anaconda choke ~sub | Arm-in choke with your arm under the neck and arm, gator roll toward the trapped arm.
    D'Arce choke ~sub | Arm threads under their armpit and neck, grab your own biceps, sprawl to finish.
    Front headlock escape ~esc | Hips forward, head up and turn it to the side, pummel an arm inside and stand or sit to guard.
Guards (you on the bottom)
  Closed guard ~pos | Your legs locked behind their back. You control their posture and attack.
    Posture break ~ct lib=posture | Grips, then knees to chest while the arms pull. Their hands hit the mat.
    Breaking their grips ~gr | Strip their hands off your belt or collar before you attack.
    High guard ~ct | Legs climb high on their back so they cannot posture up.
    Overhook guard ~ct | Overhook one arm deep and pin it to you. Sets up triangles and omoplatas.
    Shoulder clamp ~ct | Leg over their shoulder clamps them down. Sets up omoplatas and triangles.
    Rubber guard ~ct | Hold your own shin over their back. Needs flexibility; go slowly.
    Williams guard ~ct | Shin across their back with your arm hooking your own shin.
    Two-on-one to the back ~tr | Grab one arm with both hands, open the guard, pull and climb to the back.
    Sweeps
      Scissor sweep ~sw anim=scissor | Collar and sleeve, shin across their belly, other leg chops their knee. Pull and scissor.
      Hip bump sweep ~sw anim=hipbump | Sit up on a hand, hip into their shoulder and drive them over to mount.
      Flower sweep ~sw | Arm and leg on the same side controlled, swing your other leg up and pendulum them over.
      Balloon sweep ~sw | Feet on their hips, lift them over your head as you roll back.
      Double ankle sweep ~sw | When they stand, grab both heels, push their hips with your feet and sit up.
      Lumberjack sweep ~sw | When they stand, grab both ankles, drive your hips into their legs and sit up to mount.
      Elevator hook sweep ~sw | Butterfly hook under the thigh lifts them while you roll to that side.
      Hip bump to kimura ~tr | If they post a hand to stop the hip bump, catch the kimura.
    Submissions
      Armbar ~sub lib=armbar | Trap the arm, foot on the hip, pivot, leg over the head, knees pinch, hips up.
      Triangle ~sub lib=triangle | One arm in, one arm out, leg across the back of the neck, cut the angle, lock and squeeze.
      Kimura ~sub lib=kimura | Catch the wrist, sit up, figure-four the arm, fall back and turn the hand up their back.
      Omoplata ~sub lib=omoplata | Leg over their shoulder, turn to sit beside them, hips forward to bend the shoulder.
      Cross collar choke ~sub gi lib=crosscollar | Deep first grip, second hand crosses, elbows out and down.
      Guillotine ~sub lib=guillotine | Wrist under the chin, connect hands, legs locked, crunch toward the choking arm.
      Loop choke ~sub gi | Collar grip with the forearm across the back of the neck as they drive their head in.
      Gogoplata ~sub | Shin across their throat from rubber guard, pull their head down. Check your ruleset.
      Straight armlock ~sub | Their arm across your neck or shoulder, hands on the elbow, squeeze it straight.
      Wrist lock ~sub r | Bending the wrist. Banned in most teen divisions.
      Bicep slicer ~sub r | Shin behind their elbow crushes the biceps. Banned in most teen divisions.
  Open guards
    Butterfly guard ~pos | Seated or on your back, both insteps hooked inside their thighs.
      Butterfly sweep ~sw | Underhook one side, block their arm on the other, fall to the side and lift with the hook.
      Arm drag to the back ~tr lib=dragback | Cross grip, cup the elbow, drag their arm past your hip, climb to their back.
      Elevator sweep ~sw | Hook lifts their thigh as you pull them over your body.
      Butterfly to X-guard ~tr | Lift with a hook, slip under them and switch to X-guard.
      Butterfly to single leg X ~tr | Lift a leg, hug it and enter single leg X.
      Guillotine from butterfly ~sub | They drive in head first: wrap the neck and finish from guard.
    Seated guard ~pos | Sitting up, one hand posted or gripping, feet active. Good for wrestling up.
      Wrestle up ~tr | Post a hand, come up on a knee and attack a single leg.
      Ankle pick from seated ~sw | Grab their heel as they step and push them back.
      Collar drag ~tr gi | Collar grip, pull their head past and go to their back.
    Spider guard ~pos gi lib=spider | Sleeve grips, feet in the biceps. One leg long, one leg short.
      Spider guard sweep ~sw gi | Pull one sleeve, push the other bicep, chop the near leg.
      Triangle from spider ~sub gi | Feet on biceps, push one arm in, swing the leg over the neck.
      Omoplata from spider ~sub gi | Foot on the biceps, swing the leg over their shoulder.
    Lasso guard ~pos gi | Your leg wraps around their arm with your foot in the armpit and a sleeve grip.
      Lasso sweep ~sw gi | Pull the lassoed arm and kick out the far leg.
      Lasso to omoplata ~sub gi | Lasso leg turns the arm into an omoplata.
    Collar-sleeve guard ~pos gi | Collar grip and sleeve grip, foot on the biceps of the sleeve arm.
      Collar-sleeve sweep ~sw gi | Hook behind their knee and pull them over while kicking the biceps.
      Triangle from collar-sleeve ~sub gi | Pull the collar, kick the arm through, triangle.
    De La Riva guard ~pos | Your outside leg hooks around their lead leg from the outside, foot on the back of the thigh.
      Tripod sweep ~sw | Foot on the hip, pull the ankle and push them back.
      Sickle sweep ~sw | Hold the ankle, chop the far leg out from behind the knee.
      DLR to X-guard ~tr | Slide under their lead leg into X-guard.
      Berimbolo ~tr | Invert under them and spin to their back. Advanced; neck safety first.
      Baby bolo ~tr | A less inverted berimbolo that turns to the back.
    Reverse De La Riva ~pos | Your inside leg hooks their lead leg from the inside, knee pointing out.
      Kiss of the dragon ~tr | Invert under them from RDLR and come out at their back.
      RDLR to single leg X ~tr | Slide under the lead leg and catch it for single leg X.
      RDLR spin-under sweep ~sw | Spin under them and come out on top.
    X-guard ~pos | Under them with one of their legs on your shoulder and your two hooks forming an X on the other leg.
      X-guard technical stand-up sweep ~sw | Extend the hooks, stand up holding the leg.
      X-guard backward sweep ~sw | Extend the hooks to tip them over backward.
    Single leg X ~pos | You hug one of their legs, one foot on the hip and the other behind the knee.
      SLX technical stand-up ~sw | Kick the hip, stand up holding the ankle.
      SLX trip ~sw | Kick the back of the knee and push the hip to drop them.
      Straight ankle lock from SLX ~sub | Fall back with their foot under your armpit. The one leg lock legal for most teens.
    K-guard ~pos | Inside leg across their hip, outside leg hooked under. A leg lock entry.
    Waiter guard ~pos | Under them, arm hooked around their leg like a waiter's tray.
      Waiter sweep ~sw | Lift the leg on your arm and roll them over.
    Shin-to-shin ~pos | Your shin against their shin, hand on the ankle. Leads to single leg X and sweeps.
    Inverted guard ~pos | Upside down on your shoulders with feet on their hips. Neck risk.
    Lapel guards ~pos gi | Worm, squid and similar guards using their lapel wrapped around their leg.
    50/50 guard ~pos | Both of you with one leg entangled the same way. Equal position, often a stall.
      50/50 sweep ~sw | Come up on top while keeping the entanglement.
      Straight ankle lock from 50/50 ~sub | Foot under your armpit, arch back.
  Guard retention
    Frames ~esc | Forearm on the neck, shin across the hips. Keep space so you can bring the knees back.
    Recover guard with a shrimp ~esc | Shrimp away and put your knee back in front of them.
    Leg pummeling ~esc | Swim your feet and knees inside their arms and legs to get in front again.
    Granby to recover guard ~esc | Roll over your shoulder and come back facing them.
    Inversion to recover ~esc | Invert to bring your legs back in front. Turn the head.
  Half guard (bottom) ~pos | One of their legs trapped between yours. Never flat on your back.
    Knee shield (Z-guard) ~pos | Your top knee across their belly keeps them away.
    Underhook half guard ~ct | Underhook their far side and get your head under their chin.
      Old school sweep ~sw | Underhook, grab the trapped ankle, come up on top.
      Dog fight ~tr | Come up to your knees with the underhook. Leads to sweeps, single legs and the back.
      Back take from half guard ~tr | Use the underhook to slide behind them.
    Deep half guard ~pos | Your whole body under their hips, arms wrapped around the trapped leg.
      Homer Simpson sweep ~sw | From deep half, kick their far leg out and come up.
      Waiter sweep from deep half ~sw | Lift their far leg on your arm and roll them over.
    Half butterfly ~pos | A butterfly hook inside their thigh with their leg trapped.
      Hook sweep from half butterfly ~sw | Lift with the hook and roll toward the underhook side.
    Lockdown ~ct | Figure-four your legs around their trapped leg and stretch it out.
      Electric chair sweep ~sw | From lockdown, stretch their legs wide and come up.
    Kimura from half guard ~sub | They post a hand; sit up and catch the kimura.
    Recover full guard ~esc | Knee shield, shrimp, and slide the trapped leg out to close the guard.
Passing (you on top)
  Opening closed guard
    Posture first ~con | Head up, back straight, hands on their hips or belly. Then open.
    Standing guard break ~pa | Grips on the collar and belt, step up one foot at a time, then the other, push the knee down.
    Kneeling guard break ~pa | Knee in the tailbone, other leg back, push the opposite knee down.
    Elbow-knee wedge ~pa | Elbow into their inner thigh to pry the ankles open.
    Can opener ~sub r | Pulling the head forward to open the guard. A neck crank, banned at most teen events.
  Passing open guard
    Toreando pass ~pa | Grip their pants or knees, push the legs to one side and run around to side control.
    Leg drag ~pa | Drag their leg across their body, pin it with your hip and settle on their side.
    Knee cut ~pa | Knee slides across their thigh to the mat, crossface and underhook, slide through.
    Over-under pass ~pa | One arm over a leg, one under the other, stack and walk around.
    Double under pass ~pa | Both arms under their legs, stack them on their shoulders and pass to the side.
    Stack pass ~pa | Fold them onto their shoulders and walk around their legs.
    X-pass ~pa | Step across in an X to the side as you push their knees away.
    Long step ~pa | From a half pass, take a long step back over their legs to the other side.
    Body lock pass ~pa | Hands locked around their waist, chest down, walk your legs free.
    Smash pass ~pa | Fold their legs to one side and smash your chest into them.
    Backstep ~pa | Turn your back to their head to step your leg free and land on the other side.
    Float pass ~pa | Weight on their chest, hips light, float around their legs.
    Headquarters ~ct | One knee between their legs, the other leg outside, hips heavy. A base for many passes.
    Leg weave ~pa | Thread an arm under one leg and weave it to pin both legs together.
  Passing half guard
    Crossface and underhook ~ct | Crossface their head away and win the underhook before anything else.
    Knee cut from half guard ~pa | Free your knee, cut it across their thigh, slide through.
    Switch base (hip switch) pass ~pa | Turn your hips to face their legs and slide the trapped leg out.
    Tripod pass ~pa | Base on your toes with your weight on them, then step the trapped leg free.
    Mount pass ~pa | Walk the trapped leg free and step straight to mount.
    Kimura from top half guard ~sub | Their arm on the mat, catch the kimura grip and turn the hand behind them.
    Arm triangle from half guard ~sub | Their arm pushed across their neck, your head beside theirs, squeeze.
Side control
  Top ~pos | Chest on their chest across their body, past their legs.
    Standard side control ~ct | Crossface and far underhook, knees tight to their hip and head.
    Kesa gatame (scarf hold) ~ct | Sit beside them facing their head, arm around their neck, trap their near arm.
    Reverse kesa ~ct | Sit beside them facing their legs, hips heavy.
    North-south transition ~tr | Walk around their head, chest on chest.
    Knee on belly transition ~tr | Pop your knee onto their belly and post the other foot.
    Mount transition ~tr | Slide your knee across their belly to the far side.
    Americana ~sub lib=americana | Pin the wrist with your head-side hand, thread the other arm under, paint the mat, lift the elbow.
    Kimura from side control ~sub | Far arm: figure-four grip, lift it behind them.
    Arm triangle ~sub | Push their arm across their neck, head beside theirs, walk to the side and squeeze.
    Paper cutter choke ~sub gi | Deep collar grip, forearm across the throat, sprawl back.
    Baseball bat choke ~sub gi | Both hands on the collar like a bat, then walk around their head.
    Breadcutter choke ~sub gi | Collar grip with your forearm cutting across the neck.
    Far side armbar ~sub | They reach across; step over the head and fall back.
    Near side armbar ~sub | Trap the near arm and spin to the armbar.
    Wrist lock ~sub r | Banned in most teen divisions.
  Bottom: escapes
    Shrimp to guard ~esc lib=sidescape | Frames, bridge, shrimp, knee in, recover guard.
    Bridge and roll ~esc | Underhook their far side, bridge into them and roll them over.
    Underhook to knees ~esc lib=scunder | Win the near underhook, turn into them and come up to your knees.
    Ghost escape ~esc | Turn away onto your shoulders and slide out to your knees or to their back.
    Running escape ~esc | Turn away to your side, legs running, and recover to turtle.
    Recover half guard ~esc lib=schalf |
    Block the mount ~esc lib=scmountblock | Their knee lifts to slide across: your near knee comes up and your elbow meets it, then shrimp in behind it. Frame, shrimp, catch one of their legs between yours.
Knee on belly
  Top ~pos | Your shin across their belly, other foot posted, upright.
    Knee on belly control ~ct | Grip the far collar and belt, ride their movement.
    Far side armbar from knee on belly ~sub | They push your knee; step over the head and fall back.
    Baseball choke from knee on belly ~sub gi | Choke grips with your knee in their belly.
    Mount from knee on belly ~tr | Slide the knee over the belly to mount.
  Bottom
    Push the knee and shrimp ~esc | Frame on the knee, shrimp away, recover guard.
    Turn in under the knee ~esc | Turn into them, get your knees under you.
North-south
  Top ~pos | Chest on chest, your head over their belly, facing their legs.
    North-south choke ~sub | Arm around their neck, drop your shoulder on the jaw line, sprawl.
    Kimura from north-south ~sub | Catch the arm with a figure-four and lift.
  Bottom
    Escape from north-south ~esc | Frame on the hips, turn and get to your knees or back to guard.
Mount
  Top ~pos | Sitting on their torso, knees on the mat.
    Low mount ~ct | Hips low, grapevine their legs if needed, chest heavy.
    High mount ~ct | Knees in their armpits so they cannot bridge.
    S-mount ~ct | One knee up by their head, the other leg under them. Sets up the armbar.
    Technical mount ~ct | On your side with one knee up when they turn. Leads to the back.
    Gift wrap ~ct | Their arm pulled around their own neck. Leads to the back.
    Armbar from mount ~sub | Step to S-mount, swing the leg over the head and fall back.
    Americana from mount ~sub lib=americana | Pin the wrist by the head, thread under, paint the mat.
    Cross collar choke from mount ~sub gi | Deep first grip, second hand crosses, drop your chest.
    Ezekiel choke ~sub | One hand grips your own sleeve or wrist behind their neck, the other forearm cuts across the throat.
    Arm triangle from mount ~sub | Push their arm across, head down beside theirs, step off to the side.
    Mounted triangle ~sub | Step up to high mount and triangle their arm and head.
    Back take from mount ~tr | They turn; take a hook and the seatbelt as they go.
  Bottom: escapes
    Trap and roll ~esc lib=traproll | Trap an arm and the same-side foot, bridge over that shoulder.
    Elbow-knee escape ~esc lib=elbowknee | Frame on their hip, shrimp, slide your knee inside and recover half guard.
    Kipping escape ~esc | Kick your legs up to bump them forward and slide out.
    Ezekiel defence ~esc lib=ezekieldef | Tuck your chin, catch the hand that grips the sleeve, never push straight-armed. Escape the mount, do not just survive it.
    Armbar defence from mount ~esc lib=armbardef | Clasp your hands, turn your thumb out, stack them or hitchhike out.
Back
  Top ~pos lib=back | Chest on their back, seatbelt and hooks.
    Seatbelt ~ct lib=back | One arm over their shoulder, one under the other armpit, hands locked.
    Hooks ~ct lib=back | Heels inside their thighs. Never cross your ankles.
    Body triangle ~ct | One leg across their belly, foot locked behind your other knee.
    Rear naked choke ~sub lib=rnc | Elbow under the chin, grab your biceps, hand behind their head, elbows back.
    Bow and arrow choke ~sub gi | Collar grip, catch their far leg, stretch them out.
    Short choke ~sub | Choking arm in tight, the other hand pushes your fist into the neck.
    Collar choke from the back ~sub gi | Deep collar grip feeds into a strangle.
    Armbar from the back ~sub | They defend the choke with both hands; switch to the arm.
    Crucifix ~pos | Their arm trapped by your legs, the other by your arm. Choke or armlock.
    Re-take the back ~tr | They slip out the side; follow with a hook and get back behind them.
  Bottom: escapes
    Hand fighting the choke ~esc | Two hands on the choking arm, chin down, ear to your shoulder.
    Shoulders to the mat ~esc | Slide down so your shoulders touch the mat, then turn to face them.
    Escape to the side of the bottom hook ~esc | Clear the bottom hook, fall to that side and turn in.
Turtle
  Top ~pos | Behind or beside them while they are on knees and elbows.
    Seatbelt from turtle ~ct | Chest on their back, seatbelt grip.
    Back take with hooks ~tr | Seatbelt, fall to the side, put in hooks.
    Clock choke ~sub gi | Collar grip, walk around their head like a clock.
    Crucifix from turtle ~tr | Trap one arm with your legs and roll through.
    Front headlock from turtle ~tr | From in front, sprawl and attack the neck.
    Spiral ride ~ct | Wrestling ride with an arm under their armpit and across the chest.
  Bottom
    Sit-out ~esc anim=drill_situp | Post, thread the leg through and turn to face them.
    Granby roll to guard ~esc | Roll over your shoulder to bring your legs back in front.
    Roll to guard ~esc | Roll under them toward the side they are on.
    Peterson roll ~sw | Trap their arm, roll forward and come up on top.
    Single leg from turtle ~tr | Reach back for a leg and stand into a single leg.
    Stand up ~esc | Hands fight, build up to your feet.
Leg locks
  Positions
    Ashi garami ~pos | Basic straight entanglement: your leg across their hip, the other behind the knee, their foot under your arm.
    Outside ashi ~pos r | Your top leg across the outside of their hip. A heel hook position.
    Inside sankaku (saddle) ~pos r | Legs triangled around their leg from the inside. Heel hook position.
    50/50 ~pos | Mirror entanglement. Equal and often a stall.
    Cross ashi ~pos | X-guard style entanglement.
    Backside 50/50 ~pos r | 50/50 with your opponent's back to you.
  Attacks
    Straight ankle lock ~sub | Foot under your armpit, blade of the wrist under the Achilles, arch back. The one most teens can use.
    Estima lock ~sub r | A foot lock with your foot pushing their foot. Hard to feel coming.
    Toe hold ~sub r | Figure-four grip on the foot, twist toward the outside.
    Knee bar ~sub r lib=kneebar | Hips above their knee, legs wrap the thigh, hug the shin, press the hips forward slowly.
    Inside heel hook ~sub r | Rotating the heel toward the inside. Very dangerous, banned for teens and most white belts.
    Outside heel hook ~sub r | Rotating the heel from outside ashi. Very dangerous, banned for teens and most white belts.
    Calf slicer ~sub r | Shin behind their knee crushes the calf.
    Banana split ~sub r | Stretching their legs apart. Banned in most teen rules.
  Defence
    Boot the foot ~esc | Point your toes and keep your knee line safe.
    Hide the heel ~esc | Turn your heel away so they cannot grip it.
    Clear the knee line ~esc | Get your knee out past their hips before turning.
    Knee bar defence ~esc | Turn into them and pull your knee out before they extend.
Submission families
  Chokes and strangles
    Rear naked choke ~sub lib=rnc | Blood choke from the back.
    Guillotine ~sub lib=guillotine | Front choke with the arm under the chin.
    Triangle ~sub lib=triangle | Legs around the neck and one arm.
    Arm triangle ~sub | Arm and head trapped by your arms.
    D'Arce ~sub | Arm-in choke threaded under the armpit.
    Anaconda ~sub | Arm-in choke with a roll.
    Ezekiel ~sub | Sleeve or wrist grip, forearm across the throat.
    Cross collar choke ~sub gi lib=crosscollar | Two hands in the collar, wrists cutting.
    Bow and arrow ~sub gi | Collar choke stretching from the back.
    Loop choke ~sub gi | Single collar grip looped around the neck.
    North-south choke ~sub | Arm around the neck from north-south.
    Von Flue choke ~sub | Shoulder pressure against someone holding a guillotine from guard.
    Peruvian necktie ~sub | Front headlock choke with your legs over their back.
    Buggy choke ~sub | A triangle-like choke with your arms from bottom side control.
    Reverse triangle ~sub | Triangle locked from the back side.
    Gogoplata ~sub | Shin across the throat.
  Arm locks
    Armbar (juji gatame) ~sub lib=armbar | Straightens the elbow across your hips.
    Belly-down armbar ~sub | Armbar finished face down.
    Straight armlock (ude gatame) ~sub | Squeeze the arm straight against your shoulder or neck.
    Kimura ~sub lib=kimura | Figure-four, turns the hand behind the back.
    Americana ~sub lib=americana | Figure-four, turns the hand toward the head.
    Omoplata ~sub lib=omoplata | Shoulder lock with your legs.
    Monoplata ~sub | An omoplata variation with their arm trapped by your leg and finished with your legs.
    Baratoplata ~sub | Shoulder lock from an omoplata-like position with your shin.
    Tarikoplata ~sub | Shoulder lock from a kimura grip where their arm is folded behind them.
    Wrist lock ~sub r | Bending the wrist. Banned in most teen divisions.
    Bicep slicer ~sub r | Crushing the biceps. Banned in most teen divisions.
  Leg locks
    Straight ankle lock ~sub | The common foot lock.
    Knee bar ~sub r lib=kneebar | Straightens the knee.
    Toe hold ~sub r | Twists the foot.
    Heel hooks ~sub r | Twist the knee through the heel. Most dangerous.
    Calf slicer ~sub r | Crushes the calf.
  Neck and spine
    Can opener ~sub r | Neck crank from inside closed guard.
    Neck crank ~sub x | Twisting or bending the neck without choking. Banned for teens.
    Twister ~sub x | Spine lock from the back. Banned in almost all teen and gi rules.
`;

const TREE_KINDS = {
  pos: { label: "Position", c: "#cbd5e1" }, ct: { label: "Control", c: "#93c5fd" }, tk: { label: "Takedown", c: "#fbbf24" },
  sw: { label: "Sweep", c: "#34d399" }, pa: { label: "Pass", c: "#22d3ee" }, sub: { label: "Submission", c: "#fb7185" },
  esc: { label: "Escape", c: "#c4b5fd" }, tr: { label: "Transition", c: "#38bdf8" }, gr: { label: "Grip", c: "#fcd34d" },
  con: { label: "Concept", c: "#e2e8f0" }, dr: { label: "Drill", c: "#a3e635" },
};

const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* parse TREE_SRC into nodes: { key, name, kind, gi, ng, r, x, lib, text, depth, kids:[], parent } */
const TREE = (() => {
  const root = { key: "root", name: "All", kids: [], depth: -1 };
  const stack = [root];
  const byKey = {};
  TREE_SRC.split("\n").forEach(line => {
    if (!line.trim()) return;
    const depth = (line.match(/^ */)[0].length) / 2;
    const [head, ...rest] = line.trim().split(" | ");
    const text = rest.join(" | ");
    const ti = head.indexOf(" ~");
    const name = ti >= 0 ? head.slice(0, ti) : head;
    const tags = ti >= 0 ? head.slice(ti + 2).split(/\s+/) : [];
    while (stack.length > depth + 1) stack.pop();
    const parent = stack[stack.length - 1];
    let key = (parent.key === "root" ? "" : parent.key + "/") + slugify(name);
    while (byKey[key]) key += "-2";
    const node = { key, name, text, depth, kids: [], parent, kind: null, gi: false, ng: false, r: false, x: false, lib: null, anim: null };
    tags.forEach(t => {
      if (TREE_KINDS[t]) node.kind = t;
      else if (t === "gi") node.gi = true;
      else if (t === "ng") node.ng = true;
      else if (t === "r") node.r = true;
      else if (t === "x") node.x = true;
      else if (t.startsWith("lib=")) node.lib = t.slice(4);
      else if (t.startsWith("anim=")) node.anim = t.slice(5);
    });
    parent.kids.push(node);
    byKey[key] = node;
    stack.push(node);
  });
  const all = Object.values(byKey);
  return { root, byKey, all, moves: all.filter(n => n.kind) };
})();

const ytSearch = n => "https://www.youtube.com/results?search_query=" + encodeURIComponent(`bjj ${n.name}${n.gi ? " gi" : ""} tutorial`);
/* the animation a node can play: its library card's, or one of the extra animations */
const nodeAnim = n => (n.lib && anims[n.lib] ? n.lib : n.anim && anims[n.anim] ? n.anim : null);
/* the animation a card can play */
const cardAnim = (st, id) => (anims[id] ? id : (st.cards[id] || {}).anim && anims[st.cards[id].anim] ? st.cards[id].anim : null);
