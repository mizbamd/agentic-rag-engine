export const GRADES = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

export const SUBJECTS = [
  {
    id: "math",
    name: "Math",
    icon: "▣",
    blurb: "Numbers, shapes, and calm problem-solving.",
    lodge: "Number Lodge",
    biome: "meadow",
  },
  {
    id: "science",
    name: "Science",
    icon: "◎",
    blurb: "Living things, matter, and how the world works.",
    lodge: "Greenhouse Lab",
    biome: "forest",
  },
  {
    id: "geography",
    name: "Geography",
    icon: "○",
    blurb: "Maps, land, water, and places people call home.",
    lodge: "Lookout Mesa",
    biome: "desert",
  },
  {
    id: "english",
    name: "Reading & English",
    icon: "▢",
    blurb: "Words, stories, and clear writing.",
    lodge: "Reading Lodge",
    biome: "snow",
  },
  {
    id: "history",
    name: "History",
    icon: "◇",
    blurb: "People, communities, and how the past still teaches.",
    lodge: "Stone Archive",
    biome: "ruins",
  },
];

export function gradeLabel(grade) {
  return grade === "K" ? "Kindergarten" : `Grade ${grade}`;
}

export function gradeNum(grade) {
  return grade === "K" ? 0 : Number(grade);
}

function band(grade) {
  const g = gradeNum(grade);
  if (g <= 2) return "early";
  if (g <= 5) return "elem";
  if (g <= 8) return "middle";
  return "high";
}

function rand(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function choiceProblem({ prompt, speak, answer, hint, extras = [] }) {
  const ans = String(answer);
  const opts = shuffle(
    [...new Set([ans, ...extras.map(String), String(answer)])]
  ).slice(0, 4);
  if (!opts.includes(ans)) opts[0] = ans;
  return {
    prompt,
    speak,
    type: "choice",
    choices: shuffle(opts).map((label) => ({ id: label, label })),
    answer: ans,
    hint,
  };
}

const LESSONS = {
  math: {
    early: {
      title: "Numbers we can hold",
      paragraphs: [
        "A number tells how many. Two cubes and one more cube make three cubes.",
        "When we add, the group grows. When we take away, the group shrinks. Count slowly and check once more.",
      ],
      speak:
        "Numbers tell us how many. If you have two cubes and you get one more, you have three. Let’s count carefully, then try a short practice.",
    },
    elem: {
      title: "Operations as tools",
      paragraphs: [
        "Addition and subtraction move amounts. Multiplication is adding the same group again and again.",
        "A fraction is a fair share of a whole. The bottom number names the equal pieces; the top number tells how many pieces we have.",
      ],
      speak:
        "Today we treat operations as tools. Multiplication is repeated groups, and a fraction names a fair share of a whole. I’ll keep the questions friendly.",
    },
    middle: {
      title: "Patterns that keep a balance",
      paragraphs: [
        "An equation is a balanced scale. Whatever you do to one side, do to the other so the scale still agrees.",
        "Ratios compare quantities. If 2 out of 5 tiles are green, the ratio of green tiles to all tiles is 2 to 5.",
      ],
      speak:
        "An equation is a balanced scale. We’ll keep both sides honest, and we’ll use ratios to compare amounts.",
    },
    high: {
      title: "Functions and figures",
      paragraphs: [
        "A function pairs each input with exactly one output. Linear functions grow by a constant rate — the slope.",
        "In geometry, the Pythagorean relation ties the sides of a right triangle: a² + b² = c². Algebra lets us solve for a missing piece.",
      ],
      speak:
        "High school math looks at functions and figures. A function gives one output for each input, and right triangles hide a tidy relationship among their sides.",
    },
  },
  science: {
    early: {
      title: "Living and not living",
      paragraphs: [
        "Living things grow, need food or sunlight, and can make more living things. A rock is not living. A seedling is.",
        "Our senses — seeing, hearing, touching, smelling, tasting — help us gather clues about the world, safely.",
      ],
      speak:
        "Science begins with careful noticing. Living things grow and need energy. We use our senses to collect clues, and we keep our questions kind to the world.",
    },
    elem: {
      title: "Cycles and habitats",
      paragraphs: [
        "A habitat is a home that gives food, water, shelter, and space. Deserts, forests, and ponds each offer a different mix.",
        "Water travels in a cycle: evaporate, condense, precipitate, and flow again. Energy from the Sun keeps that cycle moving.",
      ],
      speak:
        "A habitat is a home with food, water, shelter, and space. Water also has a home cycle — evaporate, condense, fall, and flow — powered by the Sun.",
    },
    middle: {
      title: "Cells, matter, and energy",
      paragraphs: [
        "Cells are the small rooms of life. Plants have cell walls and chloroplasts; animals do not.",
        "Matter is made of particles. Heat is the motion of those particles. Energy can change form, but it does not vanish.",
      ],
      speak:
        "We’ll look at cells as tiny rooms of life, and at matter as particles in motion. Energy can change form, yet it is never simply gone.",
    },
    high: {
      title: "Systems that trade energy",
      paragraphs: [
        "Photosynthesis stores sunlight in sugars; cellular respiration releases that stored energy for work.",
        "Forces change motion. A net force causes acceleration. In chemistry, atoms rearrange, and mass is conserved in a closed system.",
      ],
      speak:
        "Living systems store and spend energy. Photosynthesis banks sunlight; respiration spends it. Forces change motion, and atoms rearrange without losing mass.",
    },
  },
  geography: {
    early: {
      title: "Land, water, and maps",
      paragraphs: [
        "A map is a picture of a place from above. Water is often shown as blue; land can be green, tan, or brown.",
        "A continent is a very large land. An ocean is a very large body of salt water. We use maps so we do not get lost — even in a classroom.",
      ],
      speak:
        "A map is a bird’s-eye picture of a place. Continents are huge lands, oceans are huge waters, and symbols help us read the story of a place.",
    },
    elem: {
      title: "Climates and continents",
      paragraphs: [
        "Earth has seven continents. Climate is the usual weather of a place over many years, not just today’s rain.",
        "Near the equator, many places stay warm. Toward the poles, places stay colder. Mountains can make their own cooler climates.",
      ],
      speak:
        "We’ll travel by idea across seven continents. Climate is the long pattern of weather, shaped by latitude, oceans, and mountains.",
    },
    middle: {
      title: "Coordinates and human places",
      paragraphs: [
        "Latitude lines run east–west and measure distance from the equator. Longitude lines run north–south and meet at the poles.",
        "People settle where they can find water, food, and trade routes. Cities often grow along rivers and coasts.",
      ],
      speak:
        "Latitude and longitude are a global address system. People build communities where water, food, and trade make daily life possible.",
    },
    high: {
      title: "Earth systems and regions",
      paragraphs: [
        "Physical geography studies landforms, climate, and biomes. Human geography studies how people organize space — cities, borders, and culture.",
        "Plate movement builds mountains and earthquakes. Understanding regions helps us read both the planet and the news with more care.",
      ],
      speak:
        "Geography braids physical Earth with human choices. Plates lift mountains; people draw regions. Reading both helps us understand a place, not just a pin on a map.",
    },
  },
  english: {
    early: {
      title: "Letters that make voices",
      paragraphs: [
        "Letters stand for sounds. When we blend sounds, we can read a word. A sentence starts with a capital and often ends with a period.",
        "A story has characters and a place. We can retell what happened first, next, and last.",
      ],
      speak:
        "Letters hold sounds, and sounds build words. A sentence has a start and a stop, and a story can be told in order: first, next, last.",
    },
    elem: {
      title: "Parts of a clear sentence",
      paragraphs: [
        "A noun names a person, place, or thing. A verb shows action or being. An adjective describes.",
        "The main idea is what a paragraph is mostly about. Details are the clues that support it.",
      ],
      speak:
        "Nouns name, verbs do, adjectives describe. Find the main idea first — then the details that hold it up like sturdy tiles.",
    },
    middle: {
      title: "Language with extra spark",
      paragraphs: [
        "A simile compares using like or as. A metaphor says one thing is another to show a likeness.",
        "Authors choose point of view. First person uses I. Third person uses he, she, or they. Tone is the author’s attitude.",
      ],
      speak:
        "Figurative language makes pictures with words. Notice who is telling the story, and how the author’s tone leans — warm, stern, playful, or curious.",
    },
    high: {
      title: "Claims, evidence, and craft",
      paragraphs: [
        "An argument states a claim and supports it with evidence and reasoning. A counterclaim shows you have considered another view.",
        "Grammar is a courtesy to the reader. Parallel structure, clear pronouns, and precise verbs keep ideas from wobbling.",
      ],
      speak:
        "Strong writing makes a claim, then earns it with evidence. We’ll also treat grammar as courtesy — a way to keep ideas steady for the reader.",
    },
  },
  history: {
    early: {
      title: "Then, now, and helpers",
      paragraphs: [
        "History is the story of people over time. Long ago, some tools looked different, but people still needed food, homes, and friends.",
        "Community helpers — teachers, nurses, builders — keep a place working. We can compare yesterday’s chores with today’s.",
      ],
      speak:
        "History is people over time. Tools change, but needs like food, home, and kindness stay. Let’s notice helpers in a community, then and now.",
    },
    elem: {
      title: "Communities and calendars",
      paragraphs: [
        "A timeline orders events from earlier to later. Primary sources are clues from the time, such as a letter or photograph.",
        "Civilizations grew near rivers because water supported farms and travel. Rules and leaders helped people live together.",
      ],
      speak:
        "Timelines keep events in order. People built early cities near rivers, and they left clues — letters, tools, pictures — that we can still read.",
    },
    middle: {
      title: "Civics and cultures",
      paragraphs: [
        "Civics is how people govern themselves. Constitutions and laws try to balance power and rights.",
        "Trade, migration, and ideas move between cultures. When we study another time, we ask: who is speaking, and whose voice is missing?",
      ],
      speak:
        "Civics is the craft of living together under rules. Cultures meet through trade and travel, and good historians ask whose story is being told.",
    },
    high: {
      title: "Causes, effects, and evidence",
      paragraphs: [
        "Historical thinking looks for causes and effects, continuity and change. Revolutions, for example, often mix new ideas with old grievances.",
        "A reliable claim about the past cites evidence and admits uncertainty. Maps, treaties, diaries, and data each answer different questions.",
      ],
      speak:
        "We’ll practice historical thinking: cause and effect, change and continuity. Claims about the past need evidence, and a little humility, too.",
    },
  },
};

export function getLesson(subject, grade) {
  const pack = LESSONS[subject][band(grade)];
  return { ...pack, subject, grade, gradeName: gradeLabel(grade) };
}

export function generateProblem(subject, grade) {
  switch (subject) {
    case "math":
      return generateMath(grade);
    case "science":
      return generateScience(grade);
    case "geography":
      return generateGeography(grade);
    case "english":
      return generateEnglish(grade);
    case "history":
      return generateHistory(grade);
    default:
      return generateMath(grade);
  }
}

function generateMath(grade) {
  const g = gradeNum(grade);
  if (g <= 0) {
    const n = rand(2, 8);
    const icon = pick(["★", "●", "■", "▲"]);
    const name = { "★": "stars", "●": "pebbles", "■": "tiles", "▲": "trees" }[icon];
    return choiceProblem({
      prompt: `Count the ${name}:\n${icon.repeat(n)}`,
      speak: `Count slowly. How many ${name} do you see?`,
      answer: n,
      hint: "Touch each one in your mind: one, two, three…",
      extras: [n - 1, n + 1, n + 2, Math.max(1, n - 2)],
    });
  }
  if (g === 1) {
    const a = rand(1, 9);
    const b = rand(1, 10 - a);
    return choiceProblem({
      prompt: `${a} + ${b} = ?`,
      speak: `What is ${a} plus ${b}?`,
      answer: a + b,
      hint: `Start at ${a}, then count up ${b} more.`,
      extras: [a + b + 1, Math.abs(a - b), a + b + 2, b],
    });
  }
  if (g === 2) {
    const a = rand(20, 70);
    const b = rand(5, 20);
    const add = Math.random() < 0.5;
    const ans = add ? a + b : a - b;
    return {
      prompt: `${a} ${add ? "+" : "−"} ${b} = ?`,
      speak: `What is ${a} ${add ? "plus" : "minus"} ${b}?`,
      type: "input",
      answer: String(ans),
      hint: add ? "Add the ones, then the tens." : "Subtract the ones, then the tens.",
    };
  }
  if (g === 3) {
    const a = rand(2, 9);
    const b = rand(2, 9);
    return choiceProblem({
      prompt: `${a} × ${b} = ?`,
      speak: `What is ${a} times ${b}?`,
      answer: a * b,
      hint: `${a} groups of ${b} is the same as adding ${b}, ${a} times.`,
      extras: [a * b + a, a * (b - 1), a + b, a * b + 1],
    });
  }
  if (g === 4) {
    const a = rand(12, 28);
    const b = rand(3, 8);
    return {
      prompt: `${a} × ${b} = ?`,
      speak: `Multiply ${a} by ${b}.`,
      type: "input",
      answer: String(a * b),
      hint: `Think of ${a} × ${b} as ${a} tens and ones, each multiplied by ${b}.`,
    };
  }
  if (g === 5) {
    const whole = rand(2, 8);
    const tenths = rand(1, 9);
    const n = whole + tenths / 10;
    const add = rand(1, 4) / 10;
    const ans = Math.round((n + add) * 10) / 10;
    return {
      prompt: `${n.toFixed(1)} + ${add.toFixed(1)} = ?`,
      speak: `Add the decimals ${n.toFixed(1)} and ${add.toFixed(1)}.`,
      type: "input",
      answer: String(ans),
      hint: "Line up the decimal points, then add.",
    };
  }
  if (g === 6) {
    const a = rand(2, 8);
    const b = rand(a + 1, 12);
    return choiceProblem({
      prompt: `A recipe uses ${a} cups of oats for ${b} cups of mix. What is the ratio of oats to mix?`,
      speak: `What is the ratio of oats to the whole mix?`,
      answer: `${a}:${b}`,
      hint: "Ratio of part to whole keeps both numbers in the same order.",
      extras: [`${b}:${a}`, `${a}:${a + b}`, `${a - 1}:${b}`, `${a}:${b - 1}`],
    });
  }
  if (g === 7) {
    const x = rand(3, 12);
    const m = rand(2, 6);
    const b = rand(1, 9);
    return {
      prompt: `Solve for x: ${m}x + ${b} = ${m * x + b}`,
      speak: `Solve ${m} x plus ${b} equals ${m * x + b}. What is x?`,
      type: "input",
      answer: String(x),
      hint: `Subtract ${b} from both sides, then divide by ${m}.`,
    };
  }
  if (g === 8) {
    const x1 = 0;
    const y1 = rand(1, 5);
    const x2 = rand(2, 6);
    const slope = pick([2, 3, -1, -2, 1]);
    const y2 = y1 + slope * (x2 - x1);
    return {
      prompt: `A line passes through (${x1}, ${y1}) and (${x2}, ${y2}). What is the slope?`,
      speak: `Find the slope between those two points.`,
      type: "input",
      answer: String(slope),
      hint: "Slope is rise over run: change in y divided by change in x.",
    };
  }
  if (g === 9) {
    const x = rand(-6, 8) || 3;
    const a = rand(2, 5);
    const c = rand(-8, 8);
    return {
      prompt: `Solve: ${a}(x − ${x}) = ${c}. Wait — find x if ${a}x + ${c} = ${a * x + c}.`,
      speak: `Solve ${a} x plus ${c} equals ${a * x + c}.`,
      type: "input",
      answer: String(x),
      hint: `Undo addition first, then divide by ${a}.`,
    };
  }
  if (g === 10) {
    const a = pick([3, 5, 6, 8]);
    const b = pick([4, 12, 8, 15]);
    if (Math.random() < 0.5) {
      return {
        prompt: `A right triangle has legs ${a} and ${b}. What is the hypotenuse length? (whole number)`,
        speak: `Use the Pythagorean relation to find the hypotenuse.`,
        type: "input",
        answer: String(Math.hypot(a, b) % 1 === 0 ? Math.hypot(a, b) : Math.round(Math.hypot(a, b))),
        hint: "Hypotenuse squared equals the two legs squared and added.",
        accept: (val) =>
          Math.abs(Number(val) - Math.hypot(a, b)) < 0.15 ||
          String(val) === String(Math.round(Math.hypot(a, b))),
      };
    }
    const w = rand(4, 12);
    const h = rand(3, 9);
    return {
      prompt: `A rectangle is ${w} by ${h}. What is its area?`,
      speak: `What is the area of a ${w} by ${h} rectangle?`,
      type: "input",
      answer: String(w * h),
      hint: "Area of a rectangle is length times width.",
    };
  }
  if (g === 11) {
    const r1 = rand(1, 5);
    const r2 = r1 + rand(1, 4);
    return choiceProblem({
      prompt: `One root of x² − ${r1 + r2}x + ${r1 * r2} = 0 is ${r1}. What is the other root?`,
      speak: `The constant term is the product of the roots. What is the other root?`,
      answer: r2,
      hint: "For x² − (sum)x + product = 0, the roots add to the middle coefficient.",
      extras: [r1 + r2, r1 * r2, r2 + 1, r1 - 1],
    });
  }
  const deg = pick([0, 30, 45, 60, 90]);
  const table = { 0: "0", 30: "1/2", 45: "√2/2", 60: "√3/2", 90: "1" };
  return choiceProblem({
    prompt: `What is sin(${deg}°)?`,
    speak: `On the unit circle, what is sine of ${deg} degrees?`,
    answer: table[deg],
    hint: "Sine is the y-coordinate on the unit circle.",
    extras: ["0", "1", "1/2", "√2/2", "√3/2"].filter((x) => x !== table[deg]),
  });
}

function generateScience(grade) {
  const g = gradeNum(grade);
  if (g <= 2) {
    return pick([
      choiceProblem({
        prompt: "Which of these is a living thing?",
        speak: "Which one is living?",
        answer: "A seedling",
        extras: ["A pebble", "A glass marble", "A metal key"],
        hint: "Living things grow and need energy.",
      }),
      choiceProblem({
        prompt: "Which sense helps you notice a bell ringing?",
        speak: "Which sense notices a bell?",
        answer: "Hearing",
        extras: ["Taste", "Sight", "Touch"],
        hint: "A bell makes sound.",
      }),
    ]);
  }
  if (g <= 5) {
    return pick([
      choiceProblem({
        prompt: "In the water cycle, water vapor turning into droplets is called…",
        speak: "What do we call vapor turning into droplets?",
        answer: "Condensation",
        extras: ["Evaporation", "Erosion", "Orbit"],
        hint: "Think of a cold glass getting misty on the outside.",
      }),
      choiceProblem({
        prompt: "A habitat must provide food, water, shelter, and…",
        speak: "What else does a habitat need besides food, water, and shelter?",
        answer: "Space",
        extras: ["Homework", "Plastic", "Magnets"],
        hint: "Living things need room to move and grow.",
      }),
    ]);
  }
  if (g <= 8) {
    return pick([
      choiceProblem({
        prompt: "Which organelle is found in plant cells and captures sunlight?",
        speak: "Which plant-cell part captures sunlight?",
        answer: "Chloroplast",
        extras: ["Mitochondrion only", "Nucleus only", "Cell membrane only"],
        hint: "It is related to the green color of many leaves.",
      }),
      choiceProblem({
        prompt: "Heat is best described as…",
        speak: "What is heat, in particle language?",
        answer: "The motion of particles",
        extras: ["A kind of atom", "A color of light", "A type of gravity"],
        hint: "Warmer things have particles jiggling more.",
      }),
    ]);
  }
  return pick([
    choiceProblem({
      prompt: "Photosynthesis primarily stores sunlight in…",
      speak: "What does photosynthesis store sunlight in?",
      answer: "Sugars",
      extras: ["Iron nails", "Sound waves", "Fossils only"],
      hint: "Plants build energy-rich molecules from carbon dioxide and water.",
    }),
    choiceProblem({
      prompt: "A net force on an object causes…",
      speak: "What does a net force cause?",
      answer: "Acceleration",
      extras: ["A change of color only", "A new element", "Zero mass"],
      hint: "Newton’s second idea links force, mass, and changing velocity.",
    }),
  ]);
}

function generateGeography(grade) {
  const g = gradeNum(grade);
  if (g <= 2) {
    return pick([
      choiceProblem({
        prompt: "On many maps, blue usually stands for…",
        speak: "What does blue often mean on a map?",
        answer: "Water",
        extras: ["Fire", "Night", "Sand only"],
        hint: "Think of lakes, rivers, and oceans.",
      }),
      choiceProblem({
        prompt: "A continent is…",
        speak: "What is a continent?",
        answer: "A very large land",
        extras: ["A small hill", "A kind of cloud", "A classroom rule"],
        hint: "Africa and Asia are examples.",
      }),
    ]);
  }
  if (g <= 5) {
    return pick([
      choiceProblem({
        prompt: "How many continents are there on Earth, as commonly taught?",
        speak: "How many continents are commonly taught?",
        answer: "7",
        extras: ["3", "12", "21"],
        hint: "Count from Africa through Australia and Antarctica.",
      }),
      choiceProblem({
        prompt: "Climate is…",
        speak: "What is climate?",
        answer: "The usual weather over many years",
        extras: ["Today’s puddle", "A single lightning flash", "A city mayor"],
        hint: "Weather is now; climate is the long pattern.",
      }),
    ]);
  }
  if (g <= 8) {
    return pick([
      choiceProblem({
        prompt: "Latitude lines measure distance from the…",
        speak: "Latitude is measured from which line?",
        answer: "Equator",
        extras: ["Prime street", "Moon", "North Star only"],
        hint: "The equator sits halfway between the poles.",
      }),
      choiceProblem({
        prompt: "Cities often grow along rivers because rivers provide…",
        speak: "Why do cities often grow along rivers?",
        answer: "Water and travel routes",
        extras: ["Extra gravity", "Thinner air only", "Shorter years"],
        hint: "People need drinking water and a way to move goods.",
      }),
    ]);
  }
  return pick([
    choiceProblem({
      prompt: "Physical geography focuses most on…",
      speak: "What does physical geography study?",
      answer: "Landforms, climate, and biomes",
      extras: ["Only election results", "Only novel plots", "Only multiplication"],
      hint: "Think mountains, rainfall, and living regions.",
    }),
    choiceProblem({
      prompt: "Earthquakes are most closely linked to…",
      speak: "What are earthquakes most closely linked to?",
      answer: "Moving plates of Earth’s crust",
      extras: ["The color of soil only", "Classroom bells", "Ocean names"],
      hint: "Earth’s outer shell is broken into large moving pieces.",
    }),
  ]);
}

function generateEnglish(grade) {
  const g = gradeNum(grade);
  if (g <= 2) {
    return pick([
      choiceProblem({
        prompt: "Which word rhymes with “cat”?",
        speak: "Which word rhymes with cat?",
        answer: "hat",
        extras: ["dog", "sun", "tree"],
        hint: "Rhymes share the same ending sound.",
      }),
      choiceProblem({
        prompt: "A sentence usually ends with a…",
        speak: "What mark often ends a sentence?",
        answer: "period",
        extras: ["plus sign", "comma only", "hashtag"],
        hint: "It looks like a small dot.",
      }),
    ]);
  }
  if (g <= 5) {
    return pick([
      choiceProblem({
        prompt: "In the sentence “The fox jumps,” the verb is…",
        speak: "Which word is the verb?",
        answer: "jumps",
        extras: ["The", "fox", "the fox"],
        hint: "A verb shows action.",
      }),
      choiceProblem({
        prompt: "The main idea of a paragraph is…",
        speak: "What is a main idea?",
        answer: "What the paragraph is mostly about",
        extras: ["The longest word", "A random detail", "The page number"],
        hint: "Details support the main idea; they are not the whole story.",
      }),
    ]);
  }
  if (g <= 8) {
    return pick([
      choiceProblem({
        prompt: "“The lake was a mirror” is an example of a…",
        speak: "What kind of figurative language is that?",
        answer: "metaphor",
        extras: ["timeline", "footnote", "equation"],
        hint: "It compares without using like or as.",
      }),
      choiceProblem({
        prompt: "A narrator who uses “I” is speaking in…",
        speak: "What point of view uses I?",
        answer: "first person",
        extras: ["future tense only", "stage left", "third planet"],
        hint: "The storyteller is inside the story.",
      }),
    ]);
  }
  return pick([
    choiceProblem({
      prompt: "A claim in an argument is…",
      speak: "What is a claim?",
      answer: "The point the writer wants the reader to accept",
      extras: ["A decorative font", "A random statistic with no job", "The page margin"],
      hint: "Evidence is what supports the claim.",
    }),
    choiceProblem({
      prompt: "Which sentence uses a precise verb?",
      speak: "Which verb is more precise?",
      answer: "The scientist measured the rainfall.",
      extras: ["The scientist did the thing.", "The scientist went stuff.", "The scientist was."],
      hint: "Precise verbs tell the exact action.",
    }),
  ]);
}

function generateHistory(grade) {
  const g = gradeNum(grade);
  if (g <= 2) {
    return pick([
      choiceProblem({
        prompt: "History is mainly the study of…",
        speak: "What is history mainly about?",
        answer: "People and events over time",
        extras: ["Only clouds", "Only multiplication facts", "Only animal speeds"],
        hint: "It is a story of then and now.",
      }),
      choiceProblem({
        prompt: "A community helper you might find at school is a…",
        speak: "Who is a helper at school?",
        answer: "teacher",
        extras: ["lighthouse", "mountain", "comet"],
        hint: "This person helps students learn.",
      }),
    ]);
  }
  if (g <= 5) {
    return pick([
      choiceProblem({
        prompt: "A timeline is used to…",
        speak: "What is a timeline for?",
        answer: "Put events in order from earlier to later",
        extras: ["Measure rainfall only", "Mix paint", "Count syllables"],
        hint: "Left is often earlier; right is later.",
      }),
      choiceProblem({
        prompt: "Many early cities grew near rivers because rivers offered…",
        speak: "Why rivers for early cities?",
        answer: "Water for farms and travel",
        extras: ["Shorter alphabets", "Fewer stars", "Thicker dictionaries"],
        hint: "Farms and boats both need water.",
      }),
    ]);
  }
  if (g <= 8) {
    return pick([
      choiceProblem({
        prompt: "Civics is the study of…",
        speak: "What is civics?",
        answer: "How people govern and live together",
        extras: ["Only rock types", "Only verb tenses", "Only ocean tides"],
        hint: "Think rights, laws, and public decisions.",
      }),
      choiceProblem({
        prompt: "A good historian asks…",
        speak: "What question should a historian ask?",
        answer: "Whose voice is in this source, and whose is missing?",
        extras: ["How do I erase the past?", "Which font is luckiest?", "Can I skip evidence?"],
        hint: "Sources have points of view.",
      }),
    ]);
  }
  return pick([
    choiceProblem({
      prompt: "Continuity in history means…",
      speak: "What does continuity mean?",
      answer: "Some patterns stay similar even as other things change",
      extras: ["Nothing ever changes", "Maps are always wrong", "Dates do not matter"],
      hint: "Change and continuity can happen at the same time.",
    }),
    choiceProblem({
      prompt: "A strong historical claim should…",
      speak: "What should a historical claim do?",
      answer: "Cite evidence and admit uncertainty",
      extras: ["Ignore diaries", "Use only rumors", "Avoid dates"],
      hint: "Evidence first; humility when the record is thin.",
    }),
  ]);
}

export function normalizeAnswer(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\s+/g, " ");
}

export function checkAnswer(problem, value) {
  if (problem.accept) return Boolean(problem.accept(value));
  const got = normalizeAnswer(value);
  const want = normalizeAnswer(problem.answer);
  if (got === want) return true;
  if (!Number.isNaN(Number(got)) && !Number.isNaN(Number(want))) {
    return Math.abs(Number(got) - Number(want)) < 1e-6;
  }
  return false;
}

export const LINES = {
  welcome:
    "Welcome to the learning trails. I’m Verity, your guide. Click your grade, and I’ll keep every lesson at your height.",
  pickGrade: (g) =>
    `${gradeLabel(g)} it is. Good. Now choose a subject, and I’ll open a campus that matches.`,
  pickSubject: (g, subject) => {
    const s = SUBJECTS.find((x) => x.id === subject);
    return `${s.name} for ${gradeLabel(g)}. I’ll wait in the courtyard. The ${s.lodge} is ready when you are, and we can practice together whenever you like.`;
  },
  muteOn: "I’ll keep my voice quiet. You can still read my words on the card.",
  muteOff: "Voice back on. I’ll speak softly so the ideas stay clear.",
  enterBiome: {
    meadow:
      "Soft grass tiles, and the Number Lodge ahead. This meadow is a calm place to think with quantities.",
    forest:
      "The greenhouse lab sits among the trees. Listen — even the leaves are a science clue.",
    desert:
      "Warm sand underfoot. From Lookout Mesa we can read the land the way a map does.",
    snow:
      "Quiet snow, and the Reading Lodge with a lantern in the window. Words feel slower here, in a good way.",
    ruins:
      "Older stone, stacked on purpose. The archive keeps stories of people who were here before us.",
    plaza:
      "This courtyard is our meeting place. I’m Verity. Walk the trails, or talk with me to start practice.",
  },
  enterLodge: (subject, grade) => {
    const s = SUBJECTS.find((x) => x.id === subject);
    return `Here we are: the ${s.lodge}. I’ll share a short ${s.name.toLowerCase()} lesson for ${gradeLabel(grade)}, then a few checks for understanding.`;
  },
  practiceStart: (subject, grade) =>
    `Practice time. These ${SUBJECTS.find((x) => x.id === subject).name.toLowerCase()} questions are tuned for ${gradeLabel(grade)}. Take a breath; one problem at a time.`,
  correct: [
    "Yes. That’s solid thinking.",
    "Exactly. You kept the idea steady.",
    "Well done. Let’s try another while the path is clear.",
    "That’s right. I like how carefully you checked.",
  ],
  incorrect: [
    "Not quite. Peek at the hint, then try again with fresh eyes.",
    "Close, but the trail bends a different way. Read the hint and have another go.",
    "A miss is useful. The hint will set the next step.",
  ],
  hintLead: "Here’s a hint. ",
  lessonDone: (subject) =>
    `Lesson complete for ${SUBJECTS.find((x) => x.id === subject).name}. Your progress is saved on this computer. Want more practice? Talk with me in the courtyard.`,
  talk: (grade, subject) =>
    `I’m right here. We can start ${SUBJECTS.find((x) => x.id === subject).name.toLowerCase()} practice for ${gradeLabel(grade)}, or you can wander into a lodge for a short lesson.`,
  progress: (score, grade, subject) => {
    const s = SUBJECTS.find((x) => x.id === subject);
    if (!score.attempted) {
      return `No practice recorded yet for ${gradeLabel(grade)} ${s.name}. Shall we begin with a gentle question?`;
    }
    return `For ${gradeLabel(grade)} ${s.name}, you have ${score.correct} correct out of ${score.attempted}. Best streak: ${score.bestStreak}. Ready for another?`;
  },
};

export function pickLine(list) {
  return pick(list);
}
