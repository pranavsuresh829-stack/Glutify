import { AnalyzeResult, CheckResult, Flag } from "./types";

export const DEFINITE = [
  "wheat", "wheat flour", "wheat starch", "wheat bran", "wheat germ", "whole wheat",
  "barley", "barley malt", "rye", "malt", "malt extract", "malt syrup", "malt flavoring",
  "malt vinegar", "brewer's yeast", "brewers yeast", "spelt", "kamut", "farro", "farina",
  "durum", "semolina", "triticale", "seitan", "graham flour", "bulgur", "couscous",
  "einkorn", "emmer", "freekeh", "matzo", "matzo meal", "panko", "udon", "wheat protein",
  "hydrolyzed wheat protein", "vital wheat gluten", "gluten",
];

export const CHECK = [
  "oats", "oat flour", "modified food starch", "natural flavoring", "natural flavor",
  "caramel color", "dextrin", "maltodextrin", "soy sauce", "hydrolyzed vegetable protein",
  "hydrolyzed plant protein", "yeast extract", "starch", "flavoring", "vegetable protein",
  "modified starch", "stabilizer", "emulsifier",
];

export const TRACE_PHRASES = [
  "may contain wheat", "may contain gluten", "processed in a facility",
  "processed on shared equipment", "manufactured in a facility that also processes",
  "shared equipment with wheat", "allergen warning",
];

function dedupeOverlaps(arr: string[]): string[] {
  const sorted = Array.from(new Set(arr)).sort((a, b) => b.length - a.length);
  const kept: string[] = [];
  sorted.forEach((term) => {
    if (!kept.some((k) => k.includes(term))) kept.push(term);
  });
  return kept;
}

export function analyzeIngredients(rawText: string): AnalyzeResult {
  const text = rawText.toLowerCase();
  const found: AnalyzeResult = { definite: [], check: [], trace: [] };
  DEFINITE.forEach((k) => {
    if (text.includes(k)) found.definite.push(k);
  });
  CHECK.forEach((k) => {
    if (text.includes(k)) found.check.push(k);
  });
  TRACE_PHRASES.forEach((p) => {
    if (text.includes(p)) found.trace.push(p);
  });
  found.definite = dedupeOverlaps(found.definite);
  found.check = dedupeOverlaps(found.check).filter(
    (c) => !found.definite.some((d) => d.includes(c) || c.includes(d))
  );
  return found;
}

export function buildResult(
  found: AnalyzeResult,
  opts: { productName?: string; rawText?: string } = {}
): CheckResult {
  const flags: Flag[] = [
    ...found.definite.map((label) => ({ label, tag: "definite" as const })),
    ...found.check.map((label) => ({ label, tag: "check" as const })),
    ...found.trace.map((label) => ({ label, tag: "trace" as const })),
  ];

  let verdict: CheckResult["verdict"];
  let title: string;
  let subtitle: string;

  if (flags.length === 0) {
    verdict = "safe";
    title = "Likely Gluten-Free";
    subtitle = "No gluten-containing ingredients detected in this text.";
  } else if (found.definite.length > 0) {
    verdict = "bad";
    title = "Contains Gluten";
    subtitle = `${found.definite.length} gluten ingredient(s) found.`;
  } else {
    verdict = "warn";
    title = "Check This One Closer";
    subtitle = "Ambiguous ingredients or cross-contamination warning found.";
  }

  return {
    verdict,
    title,
    subtitle,
    flags,
    productName: opts.productName,
    rawText: opts.rawText,
  };
}

export function checkIngredientsText(rawText: string): CheckResult {
  return buildResult(analyzeIngredients(rawText), {});
}
