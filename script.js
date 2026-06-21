const STORAGE_KEY = "vacayMatchResults";
const META_KEY = "vacayMatchMeta";
const RESULT_COUNT = 12;

const form = document.getElementById("vacay-form");
const submitBtn = document.getElementById("submitBtn");
const randomBtn = document.getElementById("randomBtn");
const statusText = document.getElementById("statusText");
const vibePreview = document.getElementById("vibePreview");
const vibeTitle = document.getElementById("vibeTitle");
const vibeText = document.getElementById("vibeText");

function setStatus(message) {
  if (statusText) {
    statusText.textContent = message;
  }
}

function saveResults(destinations, preferences, extras = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
  localStorage.setItem(
    META_KEY,
    JSON.stringify({
      preferences,
      count: destinations.length,
      updatedAt: Date.now(),
      ...extras
    })
  );
}

const moodEmojis = {
  relaxing: "🌴",
  adventurous: "🏔️",
  cultural: "🏛️",
  romantic: "🌅",
  luxury: "✨"
};

function toPretty(value) {
  if (!value) return "";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function updateVibePreview() {
  if (!vibePreview || !vibeTitle || !vibeText) return;

  const mood = form.mood.value;
  const climate = form.climate.value;
  const budget = form.budget.value;
  const regions = form.regions.value.trim();

  const moodLabel = toPretty(mood) || "Dreamy";
  const climateLabel = toPretty(climate) || "Any-Weather";
  const budgetLabel = toPretty(budget) || "Flexible";
  const regionLabel = regions || "Anywhere in the world";
  const emoji = moodEmojis[mood] || "✈️";

  vibeTitle.textContent = `${emoji} ${moodLabel} ${climateLabel} Escape`;
  vibeText.textContent = `You're signaling ${budgetLabel.toLowerCase()} energy, a ${moodLabel.toLowerCase()} mood, and you're eyeing ${regionLabel}. That's a coherent brief—we respect it.`;

  vibePreview.classList.remove("is-pulse");
  void vibePreview.offsetWidth;
  vibePreview.classList.add("is-pulse");
}

/** Stable placeholder photos (Picsum) so cards always load offline-friendly */
function destImage(id) {
  return `https://picsum.photos/id/${id}/1200/800`;
}

/** Curated destinations with rich tags for hobby + preference matching */
const destinationCatalog = [
  {
    destination: "Kyoto, Japan",
    budget: "mid",
    climate: "cool",
    moods: ["cultural", "relaxing", "romantic"],
    region: "east asia",
    regionAliases: ["asia", "japan"],
    tags: ["culture", "temples", "food", "history", "walking"],
    perks: ["vegetarian friendly", "quiet neighborhoods", "religious sites"],
    imageUrl: destImage(29)
  },
  {
    destination: "Tokyo, Japan",
    budget: "high",
    climate: "temperate",
    moods: ["cultural", "luxury", "adventurous"],
    region: "east asia",
    regionAliases: ["asia", "japan"],
    tags: ["food", "culture", "city", "shopping", "photography", "music"],
    perks: ["walkable", "dietary variety"],
    imageUrl: destImage(30)
  },
  {
    destination: "Bali, Indonesia",
    budget: "low",
    climate: "tropical",
    moods: ["relaxing", "romantic", "adventurous"],
    region: "southeast asia",
    regionAliases: ["asia", "indonesia"],
    tags: ["beach", "wellness", "snorkeling", "nature", "yoga"],
    perks: ["vegetarian friendly", "family friendly"],
    imageUrl: destImage(31)
  },
  {
    destination: "Singapore",
    budget: "high",
    climate: "tropical",
    moods: ["luxury", "cultural", "adventurous"],
    region: "southeast asia",
    regionAliases: ["asia"],
    tags: ["food", "city", "shopping", "architecture", "culture"],
    perks: ["dietary variety", "family friendly"],
    imageUrl: destImage(32)
  },
  {
    destination: "Luang Prabang, Laos",
    budget: "very-low",
    climate: "tropical",
    moods: ["relaxing", "cultural"],
    region: "southeast asia",
    regionAliases: ["asia"],
    tags: ["temples", "culture", "nature", "walking", "food"],
    perks: ["quiet areas", "budget friendly"],
    imageUrl: destImage(33)
  },
  {
    destination: "Reykjavik, Iceland",
    budget: "very-high",
    climate: "cold",
    moods: ["adventurous", "romantic"],
    region: "europe",
    regionAliases: ["iceland", "scandinavia", "nordic"],
    tags: ["hiking", "nature", "photography", "adventure"],
    perks: ["quiet areas", "outdoor focus"],
    imageUrl: destImage(34)
  },
  {
    destination: "Lisbon, Portugal",
    budget: "mid",
    climate: "warm",
    moods: ["cultural", "relaxing"],
    region: "europe",
    regionAliases: ["portugal", "mediterranean"],
    tags: ["food", "culture", "music", "history", "city"],
    perks: ["walkable", "family friendly"],
    imageUrl: destImage(35)
  },
  {
    destination: "Porto, Portugal",
    budget: "low",
    climate: "temperate",
    moods: ["romantic", "cultural", "relaxing"],
    region: "europe",
    regionAliases: ["portugal", "mediterranean"],
    tags: ["food", "walking", "culture", "wine", "history"],
    perks: ["walkable", "budget friendly"],
    imageUrl: destImage(36)
  },
  {
    destination: "Paris, France",
    budget: "high",
    climate: "temperate",
    moods: ["cultural", "romantic", "luxury"],
    region: "europe",
    regionAliases: ["france", "western europe"],
    tags: ["museums", "art", "food", "walking", "history", "architecture"],
    perks: ["walkable", "dietary variety"],
    imageUrl: destImage(37)
  },
  {
    destination: "Vienna, Austria",
    budget: "mid",
    climate: "cool",
    moods: ["cultural", "romantic", "luxury"],
    region: "europe",
    regionAliases: ["austria", "central europe"],
    tags: ["museums", "music", "history", "architecture", "culture"],
    perks: ["walkable", "family friendly"],
    imageUrl: destImage(38)
  },
  {
    destination: "Santorini, Greece",
    budget: "very-high",
    climate: "warm",
    moods: ["romantic", "luxury", "relaxing"],
    region: "europe",
    regionAliases: ["greece", "mediterranean", "islands"],
    tags: ["beach", "photography", "food", "walking"],
    perks: ["quiet areas"],
    imageUrl: destImage(39)
  },
  {
    destination: "Amsterdam, Netherlands",
    budget: "mid",
    climate: "cool",
    moods: ["cultural", "relaxing"],
    region: "europe",
    regionAliases: ["netherlands", "holland"],
    tags: ["museums", "cycling", "city", "history", "architecture"],
    perks: ["walkable", "dietary variety"],
    imageUrl: destImage(40)
  },
  {
    destination: "Zermatt, Switzerland",
    budget: "very-high",
    climate: "cold",
    moods: ["adventurous", "romantic", "luxury"],
    region: "europe",
    regionAliases: ["switzerland", "alps"],
    tags: ["hiking", "photography", "nature", "adventure"],
    perks: ["outdoor focus", "quiet areas"],
    imageUrl: destImage(41)
  },
  {
    destination: "Cairo, Egypt",
    budget: "very-low",
    climate: "warm",
    moods: ["cultural", "adventurous"],
    region: "africa",
    regionAliases: ["egypt", "north africa"],
    tags: ["history", "museums", "culture", "architecture"],
    perks: ["halal friendly", "religious landmarks"],
    imageUrl: destImage(42)
  },
  {
    destination: "Marrakech, Morocco",
    budget: "low",
    climate: "warm",
    moods: ["cultural", "adventurous", "luxury"],
    region: "africa",
    regionAliases: ["morocco", "north africa"],
    tags: ["food", "culture", "architecture", "shopping", "history"],
    perks: ["halal friendly"],
    imageUrl: destImage(43)
  },
  {
    destination: "Cape Town, South Africa",
    budget: "mid",
    climate: "warm",
    moods: ["adventurous", "romantic", "relaxing"],
    region: "africa",
    regionAliases: ["south africa", "southern africa"],
    tags: ["hiking", "nature", "photography", "food", "beach"],
    perks: ["dietary variety", "outdoor focus"],
    imageUrl: destImage(44)
  },
  {
    destination: "Kruger Safari, South Africa",
    budget: "high",
    climate: "warm",
    moods: ["adventurous", "luxury"],
    region: "africa",
    regionAliases: ["south africa", "safari"],
    tags: ["nature", "photography", "adventure", "wildlife"],
    perks: ["outdoor focus", "family friendly"],
    imageUrl: destImage(45)
  },
  {
    destination: "Vancouver, Canada",
    budget: "high",
    climate: "cool",
    moods: ["adventurous", "relaxing"],
    region: "north america",
    regionAliases: ["canada"],
    tags: ["hiking", "nature", "city", "cycling"],
    perks: ["dietary variety", "family friendly"],
    imageUrl: destImage(46)
  },
  {
    destination: "Banff, Canada",
    budget: "high",
    climate: "cold",
    moods: ["adventurous", "romantic", "relaxing"],
    region: "north america",
    regionAliases: ["canada", "rockies"],
    tags: ["hiking", "nature", "photography", "adventure"],
    perks: ["outdoor focus", "quiet areas"],
    imageUrl: destImage(47)
  },
  {
    destination: "Maui, Hawaii, USA",
    budget: "very-high",
    climate: "tropical",
    moods: ["relaxing", "romantic", "adventurous"],
    region: "north america",
    regionAliases: ["usa", "hawaii", "pacific", "islands"],
    tags: ["beach", "snorkeling", "nature", "hiking", "photography"],
    perks: ["family friendly"],
    imageUrl: destImage(48)
  },
  {
    destination: "Mexico City, Mexico",
    budget: "very-low",
    climate: "temperate",
    moods: ["cultural", "adventurous"],
    region: "north america",
    regionAliases: ["mexico", "latin america"],
    tags: ["food", "museums", "culture", "architecture", "history"],
    perks: ["budget friendly", "walkable"],
    imageUrl: destImage(49)
  },
  {
    destination: "Miami, USA",
    budget: "high",
    climate: "warm",
    moods: ["luxury", "relaxing", "romantic"],
    region: "north america",
    regionAliases: ["usa", "florida", "beach"],
    tags: ["beach", "food", "nightlife", "shopping", "city"],
    perks: ["dietary variety"],
    imageUrl: destImage(50)
  },
  {
    destination: "Chiang Mai, Thailand",
    budget: "very-low",
    climate: "tropical",
    moods: ["relaxing", "cultural"],
    region: "southeast asia",
    regionAliases: ["thailand", "asia"],
    tags: ["food", "culture", "temples", "nature", "digital nomad"],
    perks: ["vegetarian friendly", "quiet areas", "budget friendly"],
    imageUrl: destImage(51)
  },
  {
    destination: "Hanoi, Vietnam",
    budget: "low",
    climate: "tropical",
    moods: ["cultural", "adventurous", "relaxing"],
    region: "southeast asia",
    regionAliases: ["vietnam", "asia"],
    tags: ["food", "culture", "history", "walking", "photography"],
    perks: ["budget friendly"],
    imageUrl: destImage(52)
  },
  {
    destination: "Dubai, UAE",
    budget: "very-high",
    climate: "warm",
    moods: ["luxury", "romantic"],
    region: "middle east",
    regionAliases: ["uae", "gulf", "arabia"],
    tags: ["luxury", "shopping", "beach", "city", "architecture"],
    perks: ["halal friendly", "family friendly", "religious access"],
    imageUrl: destImage(53)
  },
  {
    destination: "Istanbul, Turkey",
    budget: "mid",
    climate: "temperate",
    moods: ["cultural", "luxury", "romantic"],
    region: "middle east",
    regionAliases: ["turkey", "europe", "asia"],
    tags: ["history", "food", "architecture", "shopping", "museums"],
    perks: ["halal friendly", "walkable"],
    imageUrl: destImage(54)
  },
  {
    destination: "Barcelona, Spain",
    budget: "mid",
    climate: "temperate",
    moods: ["cultural", "romantic", "relaxing"],
    region: "europe",
    regionAliases: ["spain", "mediterranean"],
    tags: ["beach", "architecture", "food", "art", "music"],
    perks: ["vegetarian options", "walkable"],
    imageUrl: destImage(55)
  },
  {
    destination: "Queenstown, New Zealand",
    budget: "high",
    climate: "cool",
    moods: ["adventurous", "romantic"],
    region: "oceania",
    regionAliases: ["new zealand", "nz"],
    tags: ["adventure", "hiking", "nature", "photography"],
    perks: ["quiet retreats", "outdoor focus"],
    imageUrl: destImage(56)
  },
  {
    destination: "Sydney, Australia",
    budget: "high",
    climate: "warm",
    moods: ["relaxing", "adventurous", "romantic"],
    region: "oceania",
    regionAliases: ["australia", "aus"],
    tags: ["beach", "city", "food", "nature", "photography"],
    perks: ["family friendly", "dietary variety"],
    imageUrl: destImage(57)
  },
  {
    destination: "Patagonia, Chile",
    budget: "high",
    climate: "cool",
    moods: ["adventurous", "romantic"],
    region: "south america",
    regionAliases: ["chile", "latin america", "south america"],
    tags: ["hiking", "nature", "photography", "adventure"],
    perks: ["outdoor focus"],
    imageUrl: destImage(58)
  },
  {
    destination: "Buenos Aires, Argentina",
    budget: "mid",
    climate: "temperate",
    moods: ["cultural", "romantic", "relaxing"],
    region: "south america",
    regionAliases: ["argentina", "latin america", "south america"],
    tags: ["food", "music", "culture", "city", "tango"],
    perks: ["walkable", "nightlife"],
    imageUrl: destImage(59)
  },
  {
    destination: "Costa Rica (Guanacaste)",
    budget: "mid",
    climate: "tropical",
    moods: ["adventurous", "relaxing", "romantic"],
    region: "central america",
    regionAliases: ["costa rica", "latin america", "caribbean"],
    tags: ["nature", "beach", "hiking", "wildlife", "photography"],
    perks: ["outdoor focus", "family friendly"],
    imageUrl: destImage(60)
  },
  {
    destination: "Maldives",
    budget: "very-high",
    climate: "tropical",
    moods: ["luxury", "romantic", "relaxing"],
    region: "south asia",
    regionAliases: ["indian ocean", "islands", "asia"],
    tags: ["beach", "snorkeling", "wellness", "nature", "photography"],
    perks: ["quiet areas"],
    imageUrl: destImage(61)
  }
];

const hobbySynonyms = {
  museum: "museums",
  galleries: "museums",
  gallery: "museums",
  swimming: "beach",
  swim: "beach",
  ocean: "beach",
  sea: "beach",
  party: "nightlife",
  clubs: "nightlife",
  clubbing: "nightlife",
  trek: "hiking",
  treks: "hiking",
  walk: "walking",
  walks: "walking",
  cafe: "food",
  cafes: "food",
  dining: "food",
  wildlife: "nature",
  animals: "wildlife",
  safari: "wildlife",
  shop: "shopping",
  shops: "shopping",
  run: "hiking",
  running: "hiking",
  bike: "cycling",
  biking: "cycling",
  scuba: "snorkeling",
  dive: "snorkeling",
  diving: "snorkeling"
};

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2);
}

function normalizeHobbyTokens(rawTokens) {
  const out = new Set(rawTokens);
  for (const t of rawTokens) {
    const mapped = hobbySynonyms[t];
    if (mapped) out.add(mapped);
  }
  return [...out];
}

/** Tokens that can actually affect hobby scoring (length >= 3). */
function meaningfulHobbyTokens(hobbiesText) {
  const raw = tokenize(hobbiesText);
  return normalizeHobbyTokens(raw).filter((t) => t.length >= 3);
}

function buildGentleNotes(profile, meaningfulHobby, scoredFull) {
  const notes = [];
  const hobbiesTrim = (profile.hobbies || "").trim();

  if (hobbiesTrim && meaningfulHobby.length === 0) {
    notes.push(
      "We could not pick up hobby keywords from what you typed—try words of three letters or more (for example hiking, food, or museums). Your ranking below still uses budget, climate, mood, and any regions you added."
    );
  } else if (meaningfulHobby.length > 0) {
    const anyHobby = scoredFull.some((row) => row.scores.hobbies > 0);
    if (!anyHobby) {
      notes.push(
        "Your hobby words did not line up with the tags in our destination list. The matches below still reflect budget, climate, mood, and regions—tweaking your interests may shuffle things."
      );
    }
  }

  const regionToks = tokenize(profile.regions || "").filter((t) => t.length >= 3);
  if (regionToks.length > 0) {
    const maxR = Math.max(0, ...scoredFull.map((row) => row.scores.region));
    if (maxR === 0) {
      notes.push(
        "We could not match the regions you typed to places in our catalog. Try broader names (for example Europe or Southeast Asia) from the home page—results here still use budget, climate, and mood."
      );
    }
  }

  return notes;
}

function budgetScore(userBudget, destinationBudget) {
  const levels = { "very-low": 1, low: 2, mid: 3, high: 4, "very-high": 5 };
  if (!levels[userBudget] || !levels[destinationBudget]) return 0;
  const distance = Math.abs(levels[userBudget] - levels[destinationBudget]);
  if (distance === 0) return 6;
  if (distance === 1) return 4;
  if (distance === 2) return 2;
  return 0;
}

function climateScore(userClimate, destinationClimate) {
  const levels = { tropical: 1, warm: 2, temperate: 3, cool: 4, cold: 5 };
  if (!levels[userClimate] || !levels[destinationClimate]) return 0;
  const distance = Math.abs(levels[userClimate] - levels[destinationClimate]);
  if (distance === 0) return 6;
  if (distance === 1) return 4;
  if (distance === 2) return 2;
  return 0;
}

function moodScore(userMood, moods) {
  if (!userMood || !Array.isArray(moods) || !moods.length) return 0;
  const idx = moods.indexOf(userMood);
  if (idx === 0) return 6;
  if (idx > 0) return 4;
  const soft = {
    relaxing: ["romantic"],
    romantic: ["relaxing", "luxury"],
    adventurous: ["romantic"],
    cultural: ["romantic", "relaxing"],
    luxury: ["romantic", "cultural"]
  };
  const alt = soft[userMood] || [];
  if (alt.some((m) => moods.includes(m))) return 2;
  return 0;
}

function regionHaystack(place) {
  const parts = [
    place.region,
    ...(place.regionAliases || []),
    ...tokenize(place.destination.replace(/,/g, " "))
  ];
  return parts.join(" ").toLowerCase();
}

function regionScore(preferredRegions, place) {
  const tokens = tokenize(preferredRegions);
  if (!tokens.length) return 1;
  const hay = regionHaystack(place);
  let best = 0;
  for (const t of tokens) {
    if (t.length < 3) continue;
    if (hay.includes(t)) best = Math.max(best, 6);
    else if (t.length >= 4) {
      const words = hay.split(/\s+/);
      if (words.some((w) => w.includes(t) || t.includes(w))) best = Math.max(best, 3);
    }
  }
  return best;
}

function hobbyScore(tokens, place) {
  if (!tokens.length) return 0;
  const tags = [...place.tags, ...(place.perks || [])].map((s) => s.toLowerCase());
  let score = 0;
  const used = new Set();
  for (const tok of tokens) {
    if (tok.length < 3) continue;
    for (const tag of tags) {
      const key = `${tok}:${tag}`;
      if (used.has(key)) continue;
      if (tag === tok || tag.includes(tok) || tok.includes(tag)) {
        score += 4;
        used.add(key);
        break;
      }
    }
  }
  return Math.min(score, 18);
}

function collectHobbyMatches(tokens, place) {
  const matches = [];
  for (const tag of place.tags) {
    if (tokens.some((t) => t.length >= 3 && (tag.includes(t) || t.includes(tag)))) {
      matches.push(tag);
    }
  }
  return matches;
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickVariant(seed, variants) {
  return variants[seed % variants.length];
}

function cityShort(place) {
  const d = place.destination || "";
  const i = d.indexOf(",");
  return (i === -1 ? d : d.slice(0, i)).trim() || d;
}

function matchTier(rank, topScore, score, destination) {
  const delta = topScore - score;
  const seed = hashStr(destination);
  if (rank === 0) {
    return pickVariant(seed, [
      "Our hill to die on",
      "Book this first",
      "Main-character trip",
      "Start here—seriously",
      "The one we'd fight for"
    ]);
  }
  if (delta <= 3) {
    return pickVariant(seed + 11, [
      "Chef's kiss for your brief",
      "This is your lane",
      "Nailed what you asked for",
      "Rare honest fit",
      "Not messing around"
    ]);
  }
  if (delta <= 8) {
    return pickVariant(seed + 23, [
      "Sneaky strong",
      "Don't scroll past this",
      "Dark horse energy",
      "Underrated for you",
      "Better than it looks on paper"
    ]);
  }
  return pickVariant(seed + 37, [
    "Still in the conversation",
    "Solid plan B with teeth",
    "Backup that punches up",
    "Worth a serious look",
    "Keeps up with the top picks"
  ]);
}

function buildHighlights(place, hobbyMatches, profile, scores) {
  const seed = hashStr(`${place.destination}|${profile.mood}|${profile.climate}`);
  const city = cityShort(place);
  const moodWord = toPretty(profile.mood) || "that";
  const budgetWord = toPretty(profile.budget) || "your";
  const climateWord = toPretty(profile.climate) || "that";
  const lines = [];

  if (hobbyMatches.length >= 2) {
    lines.push(
      pickVariant(seed, [
        `${city} actually delivers on ${hobbyMatches.slice(0, 2).join(" and ")}—not brochure fluff.`,
        `You care about ${hobbyMatches.slice(0, 2).join(" + ")}; ${city} treats that as the point, not a footnote.`,
        `${hobbyMatches.slice(0, 2).join(", ")} land here with receipts, not stock photos.`
      ])
    );
  } else if (hobbyMatches.length === 1) {
    lines.push(
      pickVariant(seed, [
        `The ${hobbyMatches[0]} scene is real—less "we have an app," more actual life.`,
        `If ${hobbyMatches[0]} matters, ${city} isn't playing pretend.`,
        `Strong ${hobbyMatches[0]} angle without the tourist-trap autopilot.`
      ])
    );
  }

  if (scores.region >= 6) {
    lines.push(
      pickVariant(seed + 3, [
        "Geography check: this is the part of the map you named.",
        "Region-wise, we're not ignoring what you typed.",
        "You pointed at this corner of the world—we listened."
      ])
    );
  } else if (scores.region >= 3) {
    lines.push(
      pickVariant(seed + 5, [
        "Region match is cousin-close—same family, different passport.",
        "Near your zone without being a literal Ctrl+F on your list."
      ])
    );
  }

  if (scores.budget >= 6) {
    lines.push(
      pickVariant(seed + 7, [
        `${budgetWord} budget without the sad compromise arc.`,
        `Money-wise: honest ${budgetWord.toLowerCase()} territory, not performative "budget."`,
        "Your wallet and your standards can coexist here."
      ])
    );
  }

  if (scores.climate >= 6) {
    lines.push(
      pickVariant(seed + 9, [
        `${climateWord} weather—what you asked for, not a bait-and-switch.`,
        `Climate-wise it's aligned; pack for "${climateWord.toLowerCase()}" and mean it.`,
        "No surprise microclimate gaslighting."
      ])
    );
  }

  if (scores.mood >= 4 && lines.length < 3) {
    lines.push(
      pickVariant(seed + 13, [
        `The "${moodWord}" brief reads intentional here—not decorative.`,
        `${moodWord} isn't wallpaper; the place works with that mood.`,
        `If you want ${moodWord.toLowerCase()}, this isn't fighting you.`
      ])
    );
  }

  if (!lines.length) {
    lines.push(
      pickVariant(seed + 17, [
        "Broad appeal that still refuses brochure coma.",
        "Generalist pick with actual personality.",
        "Doesn't need a gimmick to earn the slot."
      ])
    );
  }

  return lines.slice(0, 3);
}

function generateReason(place, hobbyMatches, profile, scores, rank) {
  const city = cityShort(place);
  const mood = toPretty(profile.mood) || "great";
  const seed = hashStr(`${place.destination}#${rank}`);

  let hook;
  if (rank === 0) {
    hook = pickVariant(seed, [
      `${city} is the pick we'd defend in a group chat.`,
      `Lead with ${city}—it's putting in overtime for your "${mood}" brief.`,
      `${city} isn't subtle about earning the top spot.`,
      `If you only stalk flights for one place, make it ${city}.`
    ]);
  } else {
    hook = pickVariant(seed, [
      `${city} earns its spot: ${mood.toLowerCase()} travel without the template smell.`,
      `We're into ${city} for you—${mood.toLowerCase()} energy, zero checklist coma.`,
      `${city} fits the "${mood}" mood without selling you a brochure fantasy.`,
      `${city} belongs in your rotation for something that feels chosen, not assigned.`
    ]);
  }

  const whys = [];
  if (hobbyMatches.length) {
    whys.push(
      pickVariant(seed + 3, [
        `your ${hobbyMatches.slice(0, 2).join(" / ")} interests actually show up`,
        `${hobbyMatches.slice(0, 2).join(" and ")} aren't decorative here`,
        `it's not faking the ${hobbyMatches.slice(0, 2).join(" + ")} thing`
      ])
    );
  }
  if (regionScore(profile.regions, place) >= 6) {
    whys.push("the geography matches what you called out");
  }
  if (climateScore(profile.climate, place.climate) >= 6) {
    whys.push(`${profile.climate} climate without the plot twist`);
  }
  if (scores.budget >= 6) {
    whys.push(`${profile.budget} budget physics check out`);
  }

  let body = "";
  if (whys.length) {
    body =
      " " +
      pickVariant(seed + 5, [
        `Why we're loud about it: ${whys.slice(0, 2).join("; ")}.`,
        `Plain English: ${whys.slice(0, 2).join(", ")}.`,
        `The receipts: ${whys.slice(0, 2).join(" · ")}.`
      ]);
  }

  return `${hook}${body}`;
}

/** One wild-card destination from the full catalog (no quiz scoring). */
function rollRandomDestination() {
  const place = destinationCatalog[Math.floor(Math.random() * destinationCatalog.length)];
  const city = cityShort(place);
  const hooks = [
    `${city} wins the wheel spin—sometimes admitting you had zero plan *is* the plan.`,
    `We closed our eyes and pointed at the map: ${city}. You're welcome.`,
    `${city}—because analysis paralysis is not a personality trait.`,
    `Today's chaos pick: ${city}. Pack snacks and optimism.`,
    `${city} surfaced from pure RNG. Let fate argue with your group chat.`,
    `Globe says ${city}. The quiz wasn't consulted; we're not sorry.`,
    `${city} drew the short straw (which means you drew the adventure).`
  ];
  const hook = hooks[Math.floor(Math.random() * hooks.length)];

  const regionLabel = place.region
    ? place.region.replace(/\b\w/g, (ch) => ch.toUpperCase())
    : "";
  const moodBits = Array.isArray(place.moods) ? place.moods.map(toPretty).join(", ") : "";

  const seed = hashStr(place.destination);
  const highlights = [];
  if (regionLabel) {
    highlights.push(
      pickVariant(seed, [
        `Atlas pin: ${regionLabel}—still counts as "somewhere in the world."`,
        `Corner of the planet: ${regionLabel}. Passport sticker incoming.`,
        `Region file: ${regionLabel}. Broad enough to brag, specific enough to Google.`
      ])
    );
  }
  if (place.tags?.length) {
    highlights.push(
      pickVariant(seed + 2, [
        `Flavor notes: ${place.tags.slice(0, 3).join(", ")}.`,
        `You'll find ${place.tags.slice(0, 3).join(", ")} doing actual work here.`,
        `Trip résumé keywords: ${place.tags.slice(0, 3).join(", ")}.`
      ])
    );
  }
  if (moodBits) {
    highlights.push(
      pickVariant(seed + 4, [
        `Typical vibes lean ${moodBits.toLowerCase()}—your mileage may gloriously vary.`,
        `People usually chase a ${moodBits.toLowerCase()} mood—steal or subvert it.`,
        `Mood menu includes ${moodBits.toLowerCase()}—pick your subplot.`
      ])
    );
  }
  if (!highlights.length) {
    highlights.push("Random doesn't mean boring—it means you finally picked.");
  }

  const tier = pickVariant(seed + 8, [
    "Serendipity pick",
    "Wildcard draw",
    "Blindfold dart",
    "Fortune favors the chaotic",
    "RNG certified"
  ]);

  return {
    destination: place.destination,
    reason: hook,
    highlights: highlights.slice(0, 3),
    matchTier: tier,
    score: 0,
    imageUrl: place.imageUrl
  };
}

function generateRecommendations(profile) {
  const rawTokens = tokenize(profile.hobbies);
  const hobbyTokens = normalizeHobbyTokens(rawTokens);
  const meaningfulHobby = meaningfulHobbyTokens(profile.hobbies);

  const scored = destinationCatalog.map((place) => {
    const hobbyMatches = collectHobbyMatches(hobbyTokens, place);
    const scores = {
      hobbies: hobbyScore(hobbyTokens, place) + hobbyMatches.length,
      budget: budgetScore(profile.budget, place.budget),
      climate: climateScore(profile.climate, place.climate),
      mood: moodScore(profile.mood, place.moods),
      region: regionScore(profile.regions, place)
    };
    const score =
      scores.hobbies +
      scores.budget +
      scores.climate +
      scores.mood +
      scores.region;
    return { place, score, scores, hobbyMatches };
  });

  scored.sort((a, b) => b.score - a.score);
  const topScore = scored[0]?.score ?? 0;

  const gentleNotes = buildGentleNotes(profile, meaningfulHobby, scored);

  const destinations = scored.slice(0, RESULT_COUNT).map((row, rank) => {
    const { place, score, scores, hobbyMatches } = row;
    const tier = matchTier(rank, topScore, score, place.destination);
    const highlights = buildHighlights(place, hobbyMatches, profile, scores);
    return {
      destination: place.destination,
      reason: generateReason(place, hobbyMatches, profile, scores, rank),
      highlights,
      matchTier: tier,
      score,
      imageUrl: place.imageUrl
    };
  });

  return { destinations, gentleNotes };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const profile = {
    hobbies: form.hobbies.value.trim(),
    budget: form.budget.value,
    climate: form.climate.value,
    mood: form.mood.value,
    regions: form.regions.value.trim()
  };

  submitBtn.disabled = true;
  setStatus("Finding your best destination matches...");

  try {
    const { destinations, gentleNotes } = generateRecommendations(profile);
    saveResults(destinations, profile, { source: "quiz", gentleNotes });
    setStatus("Recommendations ready. Opening your results page...");
    window.location.href = "results.html";
  } catch (error) {
    console.error(error);
    setStatus("Could not generate recommendations. Please try again.");
  } finally {
    submitBtn.disabled = false;
  }
});

randomBtn?.addEventListener("click", () => {
  randomBtn.disabled = true;
  if (submitBtn) submitBtn.disabled = true;
  setStatus("Spinning the globe…");
  try {
    const pick = rollRandomDestination();
    saveResults([pick], null, { source: "random" });
    setStatus("Here's your wild card. Opening results…");
    window.location.href = "results.html";
  } catch (error) {
    console.error(error);
    setStatus("Could not pick a random place. Please try again.");
    randomBtn.disabled = false;
    if (submitBtn) submitBtn.disabled = false;
  }
});

["input", "change"].forEach((eventName) => {
  form.addEventListener(eventName, updateVibePreview);
});

updateVibePreview();
