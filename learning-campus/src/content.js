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

function choiceProblem({ prompt, speak, answer, hint, extras = [], meaning, format }) {
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
    meaning: meaning || hint,
    format: format || "Type the answer in the box.",
  };
}

function typedProblem({ prompt, speak, answer, hint, meaning, format, accept }) {
  return {
    prompt,
    speak,
    type: "input",
    answer: String(answer),
    hint,
    meaning,
    format,
    accept,
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
  let p;
  switch (subject) {
    case "math":
      p = generateMath(grade);
      break;
    case "science":
      p = generateScience(grade);
      break;
    case "geography":
      p = generateGeography(grade);
      break;
    case "english":
      p = generateEnglish(grade);
      break;
    case "history":
      p = generateHistory(grade);
      break;
    default:
      p = generateMath(grade);
  }
  if (!p.meaning) p.meaning = p.hint;
  if (!p.format) p.format = "Type the answer in the box, then press Enter.";
  return p;
}

function generateMath(grade) {
  const g = gradeNum(grade);
  if (g <= 0) {
    const n = rand(2, 8);
    const icon = pick(["★", "●", "■", "▲"]);
    const name = { "★": "stars", "●": "pebbles", "■": "tiles", "▲": "trees" }[icon];
    return typedProblem({
      prompt: `How many ${name} are there?\n${icon.repeat(n)}`,
      speak: `Count the ${name}. Type how many as a whole number.`,
      answer: n,
      hint: "Count each mark once.",
      meaning: `This asks you to count the ${name} and type that count, with no extra words.`,
      format: "Type a whole number (example: 4).",
    });
  }
  if (g === 1) {
    const a = rand(1, 9);
    const b = rand(1, 10 - a);
    return typedProblem({
      prompt: `Add: ${a} + ${b} = ?`,
      speak: `Add ${a} plus ${b}. Type the total as a whole number.`,
      answer: a + b,
      hint: `Start at ${a}, then count up ${b} more.`,
      meaning: `You are putting ${a} and ${b} together. Type only the total.`,
      format: "Type a whole number (example: 12).",
    });
  }
  if (g === 2) {
    const a = rand(20, 70);
    const b = rand(5, 20);
    const add = Math.random() < 0.5;
    const ans = add ? a + b : a - b;
    return typedProblem({
      prompt: add ? `Add: ${a} + ${b} = ?` : `Subtract: ${a} − ${b} = ?`,
      speak: add ? `What is ${a} plus ${b}?` : `What is ${a} minus ${b}?`,
      answer: ans,
      hint: add ? "Add ones, then tens." : "Subtract ones, then tens.",
      meaning: add
        ? `Join ${a} and ${b}. Type only the total.`
        : `Start at ${a} and take away ${b}. Type what is left.`,
      format: "Type a whole number (example: 46).",
    });
  }
  if (g === 3) {
    const a = rand(2, 9);
    const b = rand(2, 9);
    return typedProblem({
      prompt: `Multiply: ${a} × ${b} = ?`,
      speak: `What is ${a} times ${b}? Type a whole number.`,
      answer: a * b,
      hint: `${a} groups of ${b}.`,
      meaning: `Multiplication is ${a} equal groups of ${b}. Type the total.`,
      format: "Type a whole number (example: 24).",
    });
  }
  if (g === 4) {
    const a = rand(12, 28);
    const b = rand(3, 8);
    return typedProblem({
      prompt: `Multiply: ${a} × ${b} = ?`,
      speak: `Multiply ${a} by ${b}. Type a whole number.`,
      answer: a * b,
      hint: `Break ${a} into tens and ones, multiply each by ${b}.`,
      meaning: `The product is how many you get if you take ${a}, ${b} times. Type digits only.`,
      format: "Type a whole number (example: 84).",
    });
  }
  if (g === 5) {
    const n = rand(2, 8) + rand(1, 9) / 10;
    const add = rand(1, 4) / 10;
    const ans = Math.round((n + add) * 10) / 10;
    return typedProblem({
      prompt: `Add the decimals: ${n.toFixed(1)} + ${add.toFixed(1)} = ?`,
      speak: `Add ${n.toFixed(1)} and ${add.toFixed(1)}. Type one decimal place.`,
      answer: ans.toFixed(1),
      hint: "Line up the decimal points, then add.",
      meaning: `These are tenths. Type a number like ${ans.toFixed(1)}, not a fraction.`,
      format: "Type a decimal with one place (example: 3.4).",
    });
  }
  if (g === 6) {
    const a = rand(2, 8);
    const b = rand(a + 1, 12);
    return typedProblem({
      prompt: `A mix uses ${a} cups of oats in ${b} cups of mix. Type oats:mix.`,
      speak: `Type the ratio of oats to mix as ${a} colon ${b}.`,
      answer: `${a}:${b}`,
      hint: "Oats first, then the whole mix, with a colon.",
      meaning: `A ratio compares two amounts in order. Type ${a}:${b} with a colon.`,
      format: "Type a ratio like 3:7",
    });
  }
  if (g === 7) {
    const x = rand(3, 12);
    const m = rand(2, 6);
    const b = rand(1, 9);
    return typedProblem({
      prompt: `Solve for x.\n${m}x + ${b} = ${m * x + b}`,
      speak: `Solve ${m} x plus ${b}. Type x as a whole number.`,
      answer: x,
      hint: `Subtract ${b}, then divide by ${m}.`,
      meaning: `Undo adding ${b}, then undo multiplying by ${m}. Type only x.`,
      format: "Type a whole number for x (example: 5).",
    });
  }
  if (g === 8) {
    const y1 = rand(1, 5);
    const x2 = rand(2, 6);
    const slope = pick([2, 3, -1, -2, 1]);
    const y2 = y1 + slope * x2;
    return typedProblem({
      prompt: `A line goes through (0, ${y1}) and (${x2}, ${y2}). What is the slope?`,
      speak: `Type the slope as an integer.`,
      answer: slope,
      hint: `Slope = (${y2} − ${y1}) ÷ ${x2}.`,
      meaning: `Slope is rise over run. Type a single integer, with a minus if it goes down.`,
      format: "Type an integer (example: -2 or 3).",
    });
  }
  if (g === 9) {
    const x = rand(-6, 8) || 3;
    const a = rand(2, 5);
    const c = rand(-8, 8);
    return typedProblem({
      prompt: `Solve for x.\n${a}x + ${c} = ${a * x + c}`,
      speak: `Type x as an integer.`,
      answer: x,
      hint: `Subtract ${c}, then divide by ${a}.`,
      meaning: `Undo adding ${c}, then undo multiplying by ${a}. Type only the number for x.`,
      format: "Type an integer for x (example: -3 or 8).",
    });
  }
  if (g === 10) {
    const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
    if (Math.random() < 0.5) {
      const [a, b, c] = pick(triples);
      return typedProblem({
        prompt: `A right triangle has legs ${a} and ${b}. What is the hypotenuse?`,
        speak: `Type the hypotenuse as a whole number.`,
        answer: c,
        hint: `Hypotenuse² = ${a}² + ${b}².`,
        meaning: `Use a² + b² = c². Type c as a whole number.`,
        format: "Type a whole number (example: 13).",
      });
    }
    const w = rand(4, 12);
    const h = rand(3, 9);
    return typedProblem({
      prompt: `A rectangle is ${w} by ${h}. What is its area?`,
      speak: `Type the area as a whole number.`,
      answer: w * h,
      hint: "Length times width.",
      meaning: `Multiply ${w} by ${h}. Type that product only.`,
      format: "Type a whole number (example: 48).",
    });
  }
  if (g === 11) {
    const r1 = rand(1, 5);
    const r2 = r1 + rand(1, 4);
    return typedProblem({
      prompt: `x² − ${r1 + r2}x + ${r1 * r2} = 0 has one root ${r1}. Type the other root.`,
      speak: `Type the other root as a whole number.`,
      answer: r2,
      hint: `The roots multiply to ${r1 * r2}.`,
      meaning: `The other root multiplies with ${r1} to make ${r1 * r2}. Type that number only.`,
      format: "Type a whole number (example: 4).",
    });
  }
  const deg = pick([0, 30, 45, 60, 90]);
  const table = { 0: "0", 30: "1/2", 45: "√2/2", 60: "√3/2", 90: "1" };
  return typedProblem({
    prompt: `What is sin(${deg}°)?`,
    speak: `Type sine of ${deg} degrees.`,
    answer: table[deg],
    hint: "Sine is the y-coordinate on the unit circle.",
    meaning: `Type ${table[deg]} exactly, not a long decimal.`,
    format: "Type 0, 1, 1/2, √2/2, or √3/2.",
  });
}

function generateScience(grade) {
  const g = gradeNum(grade);
  if (g <= 2) {
    return pick([
      typedProblem({
        prompt: "Is a seedling living or not living?",
        speak: "Type living or not living.",
        answer: "living",
        hint: "Living things grow.",
        meaning: "A seedling grows, so it is living. Type the word living.",
        format: "Type: living",
      }),
      typedProblem({
        prompt: "Which sense notices a bell ringing: sight or hearing?",
        speak: "Type sight or hearing.",
        answer: "hearing",
        hint: "A bell makes sound.",
        meaning: "A ringing bell is sound, so you use hearing. Type that one word.",
        format: "Type: hearing",
      }),
    ]);
  }
  if (g <= 5) {
    return pick([
      typedProblem({
        prompt: "Water vapor turning into droplets is called what?",
        speak: "Type the process name.",
        answer: "condensation",
        hint: "A cold glass gets misty.",
        meaning: "Vapor cools and becomes liquid drops. Type condensation.",
        format: "Type: condensation",
      }),
      typedProblem({
        prompt: "A habitat needs food, water, shelter, and what else?",
        speak: "Type the missing need.",
        answer: "space",
        hint: "Living things need room.",
        meaning: "Animals also need space to move. Type the word space.",
        format: "Type: space",
      }),
    ]);
  }
  if (g <= 8) {
    return pick([
      typedProblem({
        prompt: "Which plant-cell part captures sunlight?",
        speak: "Type the organelle name.",
        answer: "chloroplast",
        hint: "It relates to green leaves.",
        meaning: "Chloroplasts catch sunlight for food-making. Type chloroplast.",
        format: "Type: chloroplast",
      }),
      typedProblem({
        prompt: "Heat is the motion of what?",
        speak: "Type particles.",
        answer: "particles",
        hint: "Warmer things jiggle more.",
        meaning: "Heat means particles moving faster. Type particles.",
        format: "Type: particles",
      }),
    ]);
  }
  return pick([
    typedProblem({
      prompt: "Photosynthesis stores sunlight mainly in what molecules?",
      speak: "Type sugars.",
      answer: "sugars",
      hint: "Plants build energy-rich molecules.",
      meaning: "Sunlight is stored in sugars. Type sugars.",
      format: "Type: sugars",
    }),
    typedProblem({
      prompt: "A net force on an object causes what change in motion?",
      speak: "Type acceleration.",
      answer: "acceleration",
      hint: "Force changes velocity.",
      meaning: "A net force speeds up, slows, or turns an object. Type acceleration.",
      format: "Type: acceleration",
    }),
  ]);
}

function generateGeography(grade) {
  const g = gradeNum(grade);
  if (g <= 2) {
    return pick([
      typedProblem({
        prompt: "On many maps, blue usually stands for what?",
        speak: "Type water.",
        answer: "water",
        hint: "Think lakes and oceans.",
        meaning: "Mapmakers often color water blue. Type water.",
        format: "Type: water",
      }),
      typedProblem({
        prompt: "A continent is a very large what: land or cloud?",
        speak: "Type land or cloud.",
        answer: "land",
        hint: "Africa is an example.",
        meaning: "A continent is a huge piece of land. Type land.",
        format: "Type: land",
      }),
    ]);
  }
  if (g <= 5) {
    return pick([
      typedProblem({
        prompt: "How many continents are commonly taught on Earth?",
        speak: "Type a whole number.",
        answer: "7",
        hint: "Count Africa through Antarctica.",
        meaning: "Most classrooms teach seven continents. Type 7.",
        format: "Type a whole number (example: 7).",
      }),
      typedProblem({
        prompt: "Climate is weather over many years or just today?",
        speak: "Type years or today.",
        answer: "years",
        hint: "Weather is now; climate is the long pattern.",
        meaning: "Climate is the usual weather over years. Type years.",
        format: "Type: years",
      }),
    ]);
  }
  if (g <= 8) {
    return pick([
      typedProblem({
        prompt: "Latitude is measured from which line: equator or moon?",
        speak: "Type equator or moon.",
        answer: "equator",
        hint: "Halfway between the poles.",
        meaning: "Latitude starts at the equator. Type equator.",
        format: "Type: equator",
      }),
      typedProblem({
        prompt: "Cities often grow along rivers for water and what: travel or gravity?",
        speak: "Type travel or gravity.",
        answer: "travel",
        hint: "Boats move goods.",
        meaning: "Rivers give drinking water and travel routes. Type travel.",
        format: "Type: travel",
      }),
    ]);
  }
  return pick([
    typedProblem({
      prompt: "Physical geography studies landforms, climate, and biomes. Type biomes or elections.",
      speak: "Type biomes or elections.",
      answer: "biomes",
      hint: "Think living regions of Earth.",
      meaning: "Physical geography is about the natural Earth, including biomes. Type biomes.",
      format: "Type: biomes",
    }),
    typedProblem({
      prompt: "Earthquakes are linked to moving plates of Earth’s crust. Type plates or soil-color.",
      speak: "Type plates.",
      answer: "plates",
      hint: "Earth’s outer shell is in large pieces.",
      meaning: "Moving crustal plates cause quakes. Type plates.",
      format: "Type: plates",
    }),
  ]);
}

function generateEnglish(grade) {
  const g = gradeNum(grade);
  if (g <= 2) {
    return pick([
      typedProblem({
        prompt: "Which word rhymes with cat: hat or dog?",
        speak: "Type hat or dog.",
        answer: "hat",
        hint: "Rhymes share an ending sound.",
        meaning: "Cat and hat both end with at. Type hat.",
        format: "Type: hat",
      }),
      typedProblem({
        prompt: "A telling sentence usually ends with a period. Type period or plus.",
        speak: "Type period or plus.",
        answer: "period",
        hint: "It looks like a small dot.",
        meaning: "Most sentences end with a period. Type period.",
        format: "Type: period",
      }),
    ]);
  }
  if (g <= 5) {
    return pick([
      typedProblem({
        prompt: "In “The fox jumps,” which word is the verb?",
        speak: "Type the verb.",
        answer: "jumps",
        hint: "A verb shows action.",
        meaning: "Jumps is the action. Type jumps.",
        format: "Type: jumps",
      }),
      typedProblem({
        prompt: "The main idea is what a paragraph is mostly about. Type main or page.",
        speak: "Type main or page.",
        answer: "main",
        hint: "Details support it.",
        meaning: "You want the main idea, not a tiny detail. Type main.",
        format: "Type: main",
      }),
    ]);
  }
  if (g <= 8) {
    return pick([
      typedProblem({
        prompt: "“The lake was a mirror” is a metaphor or a timeline?",
        speak: "Type metaphor or timeline.",
        answer: "metaphor",
        hint: "It compares without like or as.",
        meaning: "It says the lake is a mirror. That is a metaphor. Type metaphor.",
        format: "Type: metaphor",
      }),
      typedProblem({
        prompt: "A narrator who uses I is first person or third person?",
        speak: "Type first or third.",
        answer: "first",
        hint: "The teller is inside the story.",
        meaning: "I means first person. Type first.",
        format: "Type: first",
      }),
    ]);
  }
  return pick([
    typedProblem({
      prompt: "A claim is the point a writer wants the reader to accept. Type claim or font.",
      speak: "Type claim or font.",
      answer: "claim",
      hint: "Evidence supports it.",
      meaning: "The claim is the writer’s main point. Type claim.",
      format: "Type: claim",
    }),
    typedProblem({
      prompt: "Which is more precise: measured or did?",
      speak: "Type measured or did.",
      answer: "measured",
      hint: "Precise verbs tell the exact action.",
      meaning: "Measured names the action clearly. Type measured.",
      format: "Type: measured",
    }),
  ]);
}

function generateHistory(grade) {
  const g = gradeNum(grade);
  if (g <= 2) {
    return pick([
      typedProblem({
        prompt: "History studies people over time. Type people or clouds.",
        speak: "Type people or clouds.",
        answer: "people",
        hint: "Then and now.",
        meaning: "History is about people and events over time. Type people.",
        format: "Type: people",
      }),
      typedProblem({
        prompt: "A school helper who teaches is a teacher. Type teacher or mountain.",
        speak: "Type teacher or mountain.",
        answer: "teacher",
        hint: "This person helps students learn.",
        meaning: "The helper at school who helps you learn is a teacher. Type teacher.",
        format: "Type: teacher",
      }),
    ]);
  }
  if (g <= 5) {
    return pick([
      typedProblem({
        prompt: "A timeline puts events in order. Type order or paint.",
        speak: "Type order or paint.",
        answer: "order",
        hint: "Earlier to later.",
        meaning: "Timelines show what happened first and next. Type order.",
        format: "Type: order",
      }),
      typedProblem({
        prompt: "Early cities grew near rivers for water. Type water or stars.",
        speak: "Type water or stars.",
        answer: "water",
        hint: "Farms and boats need it.",
        meaning: "Rivers gave water for farms and travel. Type water.",
        format: "Type: water",
      }),
    ]);
  }
  if (g <= 8) {
    return pick([
      typedProblem({
        prompt: "Civics is how people govern. Type govern or rocks.",
        speak: "Type govern or rocks.",
        answer: "govern",
        hint: "Rights, laws, public decisions.",
        meaning: "Civics is living together under rules. Type govern.",
        format: "Type: govern",
      }),
      typedProblem({
        prompt: "Historians ask whose voice is in a source. Type voice or font.",
        speak: "Type voice or font.",
        answer: "voice",
        hint: "Sources have points of view.",
        meaning: "Ask whose story is told and whose is missing. Type voice.",
        format: "Type: voice",
      }),
    ]);
  }
  return pick([
    typedProblem({
      prompt: "Continuity means some patterns stay similar. Type continuity or rumor.",
      speak: "Type continuity or rumor.",
      answer: "continuity",
      hint: "Change and continuity can both happen.",
      meaning: "Continuity is what stays similar over time. Type continuity.",
      format: "Type: continuity",
    }),
    typedProblem({
      prompt: "A strong historical claim should cite evidence. Type evidence or rumors.",
      speak: "Type evidence or rumors.",
      answer: "evidence",
      hint: "Use sources, not guesses.",
      meaning: "Claims about the past need evidence. Type evidence.",
      format: "Type: evidence",
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
