import { CheckResult, Flag, GlutenVerdict } from "./types";

interface Term {
  term: string;
  reason: string;
  aliases?: string[];
}

// Ingredients that definitively contain gluten.
export const CONTAINS_GLUTEN: Term[] = [
  { term: "wheat", reason: "Wheat is a primary source of gluten." },
  { term: "wheat flour", reason: "Wheat is a primary source of gluten." },
  { term: "wheat starch", reason: "Usually contains residual gluten unless labeled gluten-free." },
  { term: "barley", reason: "Barley contains gluten." },
  { term: "malt", reason: "Malt is typically derived from barley.", aliases: ["malt extract", "malt syrup", "malt flavoring", "malt vinegar", "malted barley"] },
  { term: "rye", reason: "Rye contains gluten." },
  { term: "triticale", reason: "A wheat-rye hybrid that contains gluten." },
  { term: "semolina", reason: "Made from durum wheat." },
  { term: "durum", reason: "A type of wheat." },
  { term: "spelt", reason: "An ancient wheat variety containing gluten." },
  { term: "farro", reason: "A wheat variety containing gluten." },
  { term: "einkorn", reason: "An ancient wheat variety containing gluten." },
  { term: "kamut", reason: "An ancient wheat variety containing gluten." },
  { term: "couscous", reason: "Made from wheat semolina." },
  { term: "bulgur", reason: "A wheat product." },
  { term: "graham flour", reason: "A whole-wheat flour." },
  { term: "brewer's yeast", reason: "Typically a byproduct of barley-based beer brewing.", aliases: ["brewers yeast"] },
  { term: "seitan", reason: "Made from wheat gluten." },
  { term: "panko", reason: "Breadcrumbs typically made from wheat." },
  { term: "udon", reason: "Wheat-based noodles." },
  { term: "vital wheat gluten", reason: "Pure wheat gluten." },
];

// Ingredients that hide gluten under less obvious names — the "cheat sheet".
export const HIDDEN_GLUTEN: Term[] = [
  { term: "modified food starch", reason: "Can be wheat-derived; source isn't specified by this name alone." },
  { term: "dextrin", reason: "Can be wheat-derived depending on source.", aliases: ["maltodextrin"] },
  { term: "hydrolyzed vegetable protein", reason: "Can be derived from wheat.", aliases: ["hvp", "hydrolyzed wheat protein"] },
  { term: "natural flavoring", reason: "Carrier ingredients can occasionally include gluten-containing grains.", aliases: ["natural flavor", "artificial flavor", "artificial flavoring"] },
  { term: "caramel color", reason: "Can rarely be derived from barley in some regions." },
  { term: "soy sauce", reason: "Traditional soy sauce is brewed with wheat.", aliases: ["shoyu"] },
  { term: "yeast extract", reason: "Can be derived from barley-based brewing byproducts." },
  { term: "starch", reason: "Ambiguous — could be wheat starch unless another source is named." },
  { term: "stabilizer", reason: "Ambiguous catch-all term that can mask a gluten-containing source." },
  { term: "emulsifier", reason: "Ambiguous catch-all term that can mask a gluten-containing source." },
  { term: "glucose syrup", reason: "Occasionally wheat-derived, especially outside the US." },
  { term: "dextrose", reason: "Usually corn-derived but occasionally wheat-derived." },
  { term: "textured vegetable protein", reason: "Can be wheat-derived.", aliases: ["tvp"] },
  { term: "rice malt", reason: "Malt processing sometimes involves barley enzymes." },
  { term: "oats", reason: "Naturally gluten-free but very frequently cross-contaminated with wheat unless certified gluten-free.", aliases: ["oat", "oatmeal"] },
];

// Explicit labeling / certifications that indicate the product is safe.
const SAFE_SIGNALS = [
  "certified gluten-free",
  "gluten-free",
  "gluten free",
  "no gluten",
  "contains no gluten ingredients",
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function findMatches(normalized: string, terms: Term[]): Flag[] {
  const flags: Flag[] = [];
  for (const t of terms) {
    const candidates = [t.term, ...(t.aliases ?? [])];
    for (const c of candidates) {
      const pattern = new RegExp(`\\b${c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (pattern.test(normalized)) {
        flags.push({ term: t.term, matched: c, reason: t.reason });
        break;
      }
    }
  }
  return flags;
}

export function checkIngredientsText(
  rawText: string,
  source: CheckResult["source"] = "text"
): CheckResult {
  const normalized = normalize(rawText);

  if (!normalized) {
    return {
      verdict: "caution",
      summary: "No ingredient text was found to check.",
      flags: [],
      source,
      rawText,
    };
  }

  const explicitlyLabeledGF = SAFE_SIGNALS.some((s) => normalized.includes(s));
  const containsFlags = findMatches(normalized, CONTAINS_GLUTEN);
  const hiddenFlags = findMatches(normalized, HIDDEN_GLUTEN);

  let verdict: GlutenVerdict;
  let summary: string;
  let flags: Flag[];

  if (containsFlags.length > 0) {
    verdict = "contains";
    flags = containsFlags;
    summary = `Contains gluten: found ${containsFlags.map((f) => f.term).join(", ")}.`;
  } else if (hiddenFlags.length > 0 && !explicitlyLabeledGF) {
    verdict = "caution";
    flags = hiddenFlags;
    summary = `Check closer: ${hiddenFlags.length} ambiguous ingredient${hiddenFlags.length > 1 ? "s" : ""} could hide gluten (${hiddenFlags
      .map((f) => f.term)
      .join(", ")}). Look for a "gluten-free" label or contact the manufacturer.`;
  } else if (explicitlyLabeledGF) {
    verdict = "gluten-free";
    flags = [];
    summary = "Labeled gluten-free and no gluten-containing ingredients were detected.";
  } else {
    verdict = "gluten-free";
    flags = [];
    summary = "No gluten-containing ingredients were detected in this list.";
  }

  return { verdict, summary, flags, source, rawText };
}
