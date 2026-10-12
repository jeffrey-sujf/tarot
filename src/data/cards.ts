export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Orientation = "upright" | "reversed";

export interface TarotCard {
  /** Stable id, also used for art lookup. */
  id: string;
  /** Position in the 78-card deck, 0..77 — used by the compact reading code. */
  index: number;
  name: string;
  arcana: Arcana;
  suit?: Suit;
  rank?: string;
  /** One short, literal sentence describing the pictured scene (orientation-independent). */
  image: string;
  meaning: { upright: string; reversed: string };
  /** The card's own traditional implication, independent of its position in a reading. */
  implication: { upright: string; reversed: string };
}

const SUIT_THEME: Record<Suit, { domain: string; element: string }> = {
  wands: { domain: "will, passion, and creative drive", element: "fire" },
  cups: { domain: "feeling, bonds, and the inner life", element: "water" },
  swords: { domain: "thought, conflict, and truth", element: "air" },
  pentacles: { domain: "work, body, and material life", element: "earth" },
};

/** One short, literal sentence describing each card's pictured scene. */
const MAJOR_IMAGE: string[] = [
  "A young traveler steps toward a cliff's edge, bundle in hand, a small dog at his heels.",
  "A figure stands at a table, one hand raised and one pointing down, the four suit symbols spread before him.",
  "A seated woman holds a scroll between two pillars, a crescent moon at her feet.",
  "A crowned woman reclines among cushions and wheat in a lush garden.",
  "An armored king sits on a ram-carved stone throne, scepter in hand.",
  "A robed figure sits between two pillars, blessing two kneeling acolytes.",
  "A man and woman stand beneath a winged figure, a tree rising behind each of them.",
  "An armored figure rides a stone chariot pulled by a black sphinx and a white one.",
  "A woman calmly closes a lion's jaws with her bare hands.",
  "An old man in a grey cloak holds a lantern aloft on a snowy peak.",
  "A great wheel turns in the sky, ringed by four winged creatures reading books.",
  "A crowned figure sits between two pillars holding an upright sword and a balanced scale.",
  "A man hangs calmly upside down by one foot from a wooden beam.",
  "An armored skeleton rides a pale horse under a black banner, a sun rising between two towers.",
  "A winged figure pours water between two cups, one foot on land and one in a stream.",
  "A horned figure looms over a man and woman loosely chained before him.",
  "Lightning splits a crowned tower as two figures fall from its shattered top.",
  "A kneeling woman pours water from two jugs beneath a sky of eight stars.",
  "A troubled moon watches over two towers as a dog and a wolf howl below.",
  "A joyful child rides a white horse beneath a huge, radiant sun.",
  "An angel sounds a trumpet as figures rise from open graves below.",
  "A dancing figure floats inside a laurel wreath, ringed by the four evangelists.",
];

/** The card's own traditional implication, independent of reading position. */
const MAJOR_IMPLICATION: { upright: string; reversed: string }[] = [
  { upright: "Trust the leap even without a guarantee of where it lands.", reversed: "Slow down and weigh the risk before committing further." },
  { upright: "You already have what's needed; the next move is yours to make.", reversed: "Check whether skill is being used honestly before trusting the outcome." },
  { upright: "Let instinct guide this before asking for outside answers.", reversed: "Question what's being kept hidden, including from yourself." },
  { upright: "Give this more care and time to grow rather than forcing it.", reversed: "Notice where giving has outpaced what's coming back." },
  { upright: "Set clear terms now; structure will carry this further than impulse.", reversed: "Loosen the grip before control turns into resistance." },
  { upright: "A proven method or mentor is worth following here.", reversed: "It's fine to question the rule rather than follow it blindly." },
  { upright: "Choose with your values in plain view, not around them.", reversed: "A mismatch in values is worth naming before it widens." },
  { upright: "Push forward: the will to direct this is stronger than the obstacles.", reversed: "Pick one direction before momentum splits in two." },
  { upright: "Meet this with patience rather than force.", reversed: "Be gentler with yourself, depletion isn't a failure of nerve." },
  { upright: "Step back before deciding; the answer isn't out there yet.", reversed: "Too much isolation here is starting to work against you." },
  { upright: "Let this turn happen; timing is doing more work than effort.", reversed: "Resisting the shift will cost more than adapting to it." },
  { upright: "Weigh this honestly, the outcome follows directly from the facts.", reversed: "Something here hasn't been accounted for yet." },
  { upright: "Hold still and let the view change before acting.", reversed: "This pause has gone on long enough to become its own avoidance." },
  { upright: "Let this end cleanly rather than dragging it out.", reversed: "Holding on past its time is costing more than letting go would." },
  { upright: "Blend the opposing parts slowly rather than picking one side.", reversed: "Pull back from whichever extreme has crept in." },
  { upright: "Name the thing that has a hold on you, that's the first loosening.", reversed: "The grip is weaker than it feels, test it." },
  { upright: "Let the break happen; what falls wasn't load-bearing.", reversed: "Brace for a delayed version of the same reckoning." },
  { upright: "Let hope back in; the worst of it has already passed.", reversed: "Faith needs tending here before it can do its work." },
  { upright: "Don't expect full clarity yet, trust instinct over certainty.", reversed: "The fog is thinner than it was, look again." },
  { upright: "Take this at face value; it's as good as it looks.", reversed: "The win is real but smaller than hoped, and that's fine." },
  { upright: "Answer the call plainly rather than second-guessing it.", reversed: "Be less harsh in the self-accounting than you're tempted to be." },
  { upright: "Let this close fully before starting the next thing.", reversed: "One piece is still unfinished, find it before moving on." },
];

const MAJOR_ARCANA: Omit<TarotCard, "index" | "arcana">[] = [
  { id: "major-00", name: "The Fool", meaning: { upright: "A fresh start taken on trust, before the path is proven.", reversed: "Hesitation, or a leap taken without any care at all." } },
  { id: "major-01", name: "The Magician", meaning: { upright: "The tools are already in hand; action turns intent into form.", reversed: "Scattered focus, or ability used to deceive rather than build." } },
  { id: "major-02", name: "The High Priestess", meaning: { upright: "Quiet knowledge beneath the surface, trusted before it is explained.", reversed: "A loss of touch with instinct, or truth being withheld." } },
  { id: "major-03", name: "The Empress", meaning: { upright: "Growth that comes from care, comfort, and fertile conditions.", reversed: "Creativity blocked, or giving until nothing is left." } },
  { id: "major-04", name: "The Emperor", meaning: { upright: "Order and discipline that give a situation a firm shape.", reversed: "Control tightened too far, or structure without flexibility." } },
  { id: "major-05", name: "The Hierophant", meaning: { upright: "Established wisdom and shared ritual offering steady ground.", reversed: "Breaking from convention, or convention clung to without reason." } },
  { id: "major-06", name: "The Lovers", meaning: { upright: "A meeting of values, a bond chosen with open eyes.", reversed: "Values pulling apart, or a choice made from imbalance." } },
  { id: "major-07", name: "The Chariot", meaning: { upright: "Opposing forces brought under one will and driven forward.", reversed: "Momentum stalled by conflicting directions." } },
  { id: "major-08", name: "Strength", meaning: { upright: "A gentle, sustained courage that tames rather than forces.", reversed: "Confidence that has worn thin, or force without grace." } },
  { id: "major-09", name: "The Hermit", meaning: { upright: "Stepping back to listen for one's own answer.", reversed: "Withdrawal that has tipped into isolation." } },
  { id: "major-10", name: "Wheel of Fortune", meaning: { upright: "A turn in circumstance arriving on its own schedule.", reversed: "Resisting a cycle that is already in motion." } },
  { id: "major-11", name: "Justice", meaning: { upright: "A clear-eyed accounting of what is true and what is owed.", reversed: "A truth avoided, or a scale left unbalanced." } },
  { id: "major-12", name: "The Hanged Man", meaning: { upright: "A deliberate pause that reveals a situation from a new angle.", reversed: "Delay that has become avoidance." } },
  { id: "major-13", name: "Death", meaning: { upright: "A clean ending that makes room for what comes next.", reversed: "An ending resisted long after its time has passed." } },
  { id: "major-14", name: "Temperance", meaning: { upright: "Opposing elements mixed into a steady, workable whole.", reversed: "Extremes pulling against each other, patience running out." } },
  { id: "major-15", name: "The Devil", meaning: { upright: "A bond to habit or desire that feels heavier than it should.", reversed: "Loosening a grip once mistaken for the only option." } },
  { id: "major-16", name: "The Tower", meaning: { upright: "A sudden break that clears away what was never stable.", reversed: "A collapse postponed, or disaster narrowly avoided." } },
  { id: "major-17", name: "The Star", meaning: { upright: "A quiet renewal of hope after difficulty.", reversed: "Faith in the outcome running thin." } },
  { id: "major-18", name: "The Moon", meaning: { upright: "A path seen only partly, lit by instinct rather than fact.", reversed: "Fog beginning to lift; fear losing its grip." } },
  { id: "major-19", name: "The Sun", meaning: { upright: "Plain, uncomplicated clarity and warmth.", reversed: "Joy dimmed for now, or success that stayed incomplete." } },
  { id: "major-20", name: "Judgement", meaning: { upright: "A clear-eyed reckoning that calls for a decisive response.", reversed: "A verdict avoided, or self-criticism too harsh to be useful." } },
  { id: "major-21", name: "The World", meaning: { upright: "A cycle completed, with something whole to show for it.", reversed: "A close that keeps slipping out of reach." } },
].map((c, i) => ({ ...c, image: MAJOR_IMAGE[i], implication: MAJOR_IMPLICATION[i] }));

const MINOR_RANKS: {
  rank: string;
  meaningTemplate: (s: Suit) => { up: string; rev: string };
  implicationTemplate: () => { up: string; rev: string };
}[] = [
  { rank: "Ace",
    meaningTemplate: (s) => ({ up: `A pure opening in ${SUIT_THEME[s].domain}, raw and unshaped.`, rev: `An opening missed, or offered before it was ready.` }),
    implicationTemplate: () => ({ up: `Say yes to the opening before it closes.`, rev: `Wait: this isn't quite ready to act on yet.` }) },
  { rank: "Two",
    meaningTemplate: (s) => ({ up: `A first deliberate choice within ${SUIT_THEME[s].domain}.`, rev: `Weighing options too long, or an uneven start.` }),
    implicationTemplate: () => ({ up: `Make the choice deliberately rather than drifting into it.`, rev: `Indecision is costing more than either option would.` }) },
  { rank: "Three",
    meaningTemplate: (s) => ({ up: `Early momentum building through ${SUIT_THEME[s].domain}.`, rev: `Progress slowed by friction or poor coordination.` }),
    implicationTemplate: () => ({ up: `Bring others in now: this grows faster with help.`, rev: `Realign before the friction slows things further.` }) },
  { rank: "Four",
    meaningTemplate: (s) => ({ up: `A settled, steady footing within ${SUIT_THEME[s].domain}.`, rev: `Stability that has hardened into a rut.` }),
    implicationTemplate: () => ({ up: `Use this stability as a base, not a stopping point.`, rev: `Check whether this has become a rut rather than a rest.` }) },
  { rank: "Five",
    meaningTemplate: (s) => ({ up: `Strain or loss that tests ${SUIT_THEME[s].domain}.`, rev: `The worst of a conflict passing, though not fully resolved.` }),
    implicationTemplate: () => ({ up: `Expect some friction here: it's part of getting through.`, rev: `The worst has passed, don't relitigate it.` }) },
  { rank: "Six",
    meaningTemplate: (s) => ({ up: `A return to balance within ${SUIT_THEME[s].domain}.`, rev: `An old pattern resurfacing before it was truly settled.` }),
    implicationTemplate: () => ({ up: `Let the win land before looking for the next one.`, rev: `Notice the old pattern before it repeats again.` }) },
  { rank: "Seven",
    meaningTemplate: (s) => ({ up: `A considered stocktake of effort spent on ${SUIT_THEME[s].domain}.`, rev: `Avoiding a hard look at what isn't working.` }),
    implicationTemplate: () => ({ up: `Take real stock before committing further effort.`, rev: `Face what isn't working instead of looking past it.` }) },
  { rank: "Eight",
    meaningTemplate: (s) => ({ up: `Quick, decisive motion through ${SUIT_THEME[s].domain}.`, rev: `Effort spread too thin to gain real ground.` }),
    implicationTemplate: () => ({ up: `Move now: the pace itself is the advantage.`, rev: `Consolidate before spreading any thinner.` }) },
  { rank: "Nine",
    meaningTemplate: (s) => ({ up: `Close to the end of a long stretch of ${SUIT_THEME[s].domain}.`, rev: `Weariness that has started to outweigh the effort.` }),
    implicationTemplate: () => ({ up: `You're close, hold the line a little longer.`, rev: `Rest is overdue, not optional.` }) },
  { rank: "Ten",
    meaningTemplate: (s) => ({ up: `The full weight or full reward of ${SUIT_THEME[s].domain}, delivered.`, rev: `A conclusion that overstayed, or never quite landed.` }),
    implicationTemplate: () => ({ up: `Set this weight down once it's delivered its due.`, rev: `Close this out instead of carrying it further.` }) },
  { rank: "Page",
    meaningTemplate: (s) => ({ up: `A curious, early-stage energy exploring ${SUIT_THEME[s].domain}.`, rev: `Eagerness without enough grounding yet.` }),
    implicationTemplate: () => ({ up: `Stay curious: this is still early enough to explore freely.`, rev: `Get a little more grounded before going further.` }) },
  { rank: "Knight",
    meaningTemplate: (s) => ({ up: `Active, driven pursuit of something within ${SUIT_THEME[s].domain}.`, rev: `Haste or impatience undercutting the pursuit.` }),
    implicationTemplate: () => ({ up: `Go after it directly: hesitation will cost more than haste.`, rev: `Slow the pace before it outruns the judgment behind it.` }) },
  { rank: "Queen",
    meaningTemplate: (s) => ({ up: `A mature, intuitive command over ${SUIT_THEME[s].domain}.`, rev: `Self-doubt undermining an otherwise steady hand.` }),
    implicationTemplate: () => ({ up: `Lead with the steady, intuitive hand you already have.`, rev: `Don't let self-doubt override what you actually know.` }) },
  { rank: "King",
    meaningTemplate: (s) => ({ up: `Full, settled authority over ${SUIT_THEME[s].domain}.`, rev: `Authority held too tightly, or used unwisely.` }),
    implicationTemplate: () => ({ up: `Take the authority that's already earned here.`, rev: `Loosen control before it tips into overreach.` }) },
];

/** One short, literal sentence per suit+rank describing that card's pictured scene. */
const MINOR_IMAGE: Record<Suit, Record<string, string>> = {
  wands: {
    Ace: "A hand reaches from a cloud holding a sprouting wand.",
    Two: "A man atop a castle wall holds a globe, gazing out past a planted wand.",
    Three: "A man on a cliff watches ships pass three planted wands.",
    Four: "Two figures celebrate under a garland strung between four wands.",
    Five: "Five young men clash in a chaotic mock battle with raised wands.",
    Six: "A rider on a white horse carries a laurel-crowned wand past cheering onlookers.",
    Seven: "A man on a hilltop fends off six wands below with his own.",
    Eight: "Eight wands fly low across a clear sky over open country.",
    Nine: "A wounded man stands guard before eight planted wands, leaning on a ninth.",
    Ten: "A man strains forward under the weight of ten bundled wands.",
    Page: "A young page studies a sprouting wand in an open desert.",
    Knight: "An armored knight charges forward on a rearing horse, wand raised.",
    Queen: "A queen sits enthroned between lions, a sunflower and wand in hand.",
    King: "A crowned king sits on a salamander-carved throne, wand in hand.",
  },
  cups: {
    Ace: "A hand offers an overflowing cup as a dove descends above a lily pond.",
    Two: "A man and woman exchange cups beneath a caduceus and a lion's head.",
    Three: "Three women raise their cups together in a joyful toast.",
    Four: "A seated man stares past three cups, ignoring a fourth offered from a cloud.",
    Five: "A cloaked figure mourns three spilled cups, back turned to two still standing.",
    Six: "Two children exchange flower-filled cups in a quiet garden.",
    Seven: "A man faces seven cups in the clouds, each holding a different vision.",
    Eight: "A cloaked figure walks away at night, leaving eight stacked cups behind.",
    Nine: "A satisfied man sits before a curved row of nine cups on display.",
    Ten: "A couple stands beneath a rainbow of ten cups as children dance nearby.",
    Page: "A young page by the shore studies a fish peeking from his cup.",
    Knight: "A knight on a slow white horse carries a cup across a quiet river.",
    Queen: "A queen gazes into an ornate cup at the water's edge.",
    King: "A king sits calmly on a throne afloat at sea, cup in hand.",
  },
  swords: {
    Ace: "A hand grips an upright sword crowned with a wreath.",
    Two: "A blindfolded woman sits by the sea, arms crossed over two balanced swords.",
    Three: "A heart hangs pierced by three swords beneath a stormy sky.",
    Four: "A knight lies in effigy on a tomb, three swords mounted above him.",
    Five: "A smirking man gathers fallen swords as two figures walk away defeated.",
    Six: "A ferryman poles a boat of upright swords toward calmer water.",
    Seven: "A man sneaks away from a camp carrying an armful of swords.",
    Eight: "A bound, blindfolded woman stands trapped among eight planted swords.",
    Nine: "A figure sits up in bed, head in hands, beneath nine hanging swords.",
    Ten: "A man lies face down, pierced by ten swords, under a darkened sky.",
    Page: "A young page stands alert on a windswept hill, sword raised.",
    Knight: "A knight charges headlong into a storm, sword held high.",
    Queen: "A stern queen sits enthroned, sword upright, one hand raised.",
    King: "A king sits in judgment, sword upright, beneath scattered clouds.",
  },
  pentacles: {
    Ace: "A hand offers a single large pentacle above a flowering garden.",
    Two: "A young man juggles two pentacles joined by a looping cord, balanced before rough waves.",
    Three: "A craftsman carves in a cathedral doorway as two figures look on.",
    Four: "A man clutches a pentacle to his chest, guarding coins underfoot and overhead.",
    Five: "Two weary figures trudge through snow past a lit window of pentacles.",
    Six: "A wealthy man weighs coins in a scale, giving to two kneeling beggars.",
    Seven: "A farmer leans on his hoe, surveying a vine heavy with pentacles.",
    Eight: "A craftsman carves pentacles one by one at his workbench.",
    Nine: "A woman stands alone in a vineyard, a hooded falcon on her glove.",
    Ten: "An old man and family gather beneath an archway hung with ten pentacles.",
    Page: "A young page studies a pentacle held up in a flowering field.",
    Knight: "A knight sits still on a stationary horse in a plowed field.",
    Queen: "A queen sits in a garden, gazing fondly at a pentacle in her lap.",
    King: "A crowned king sits amid a lush vineyard, a pentacle resting on his knee.",
  },
};

const SUITS: Suit[] = ["wands", "cups", "swords", "pentacles"];

function buildMinorArcana(): Omit<TarotCard, "index" | "arcana">[] {
  const cards: Omit<TarotCard, "index" | "arcana">[] = [];
  for (const suit of SUITS) {
    for (const r of MINOR_RANKS) {
      const { up, rev } = r.meaningTemplate(suit);
      const { up: impUp, rev: impRev } = r.implicationTemplate();
      const image = MINOR_IMAGE[suit][r.rank];
      cards.push({
        id: `${suit}-${r.rank.toLowerCase()}`,
        name: `${r.rank} of ${suit[0].toUpperCase()}${suit.slice(1)}`,
        suit,
        rank: r.rank,
        image,
        meaning: { upright: up, reversed: rev },
        implication: { upright: impUp, reversed: impRev },
      });
    }
  }
  return cards;
}

export const DECK: TarotCard[] = [
  ...MAJOR_ARCANA.map((c, i) => ({ ...c, index: i, arcana: "major" as Arcana })),
  ...buildMinorArcana().map((c, i) => ({ ...c, index: MAJOR_ARCANA.length + i, arcana: "minor" as Arcana })),
];

if (DECK.length !== 78) {
  // Defensive — should be unreachable; keeps the deck's integrity obvious during development.
  throw new Error(`Deck must contain exactly 78 cards, got ${DECK.length}`);
}

const BY_INDEX = new Map(DECK.map((c) => [c.index, c]));
const BY_ID = new Map(DECK.map((c) => [c.id, c]));

export function cardByIndex(index: number): TarotCard {
  const card = BY_INDEX.get(index);
  if (!card) throw new Error(`Unknown card index: ${index}`);
  return card;
}

export function cardById(id: string): TarotCard {
  const card = BY_ID.get(id);
  if (!card) throw new Error(`Unknown card id: ${id}`);
  return card;
}

export const DECK_SIZE = DECK.length;
