import { AnalyzeResult, CheckResult, Flag } from "./types";

export const DEFINITE = [
  "wheat", "wheat flour", "wheat starch", "wheat bran", "wheat germ", "whole wheat",
  "barley", "barley malt", "rye", "malt", "malt extract", "malt syrup", "malt flavoring",
  "malt vinegar", "brewer's yeast", "brewers yeast", "spelt", "kamut", "farro", "farina",
  "durum", "semolina", "triticale", "seitan", "graham flour", "bulgur", "couscous",
  "einkorn", "emmer", "freekeh", "matzo", "matzo meal", "panko", "udon", "wheat protein",
  "hydrolyzed wheat protein", "vital wheat gluten",
];

export const CHECK = [
  "oats", "oat flour", "modified food starch", "natural flavoring", "natural flavor",
  "caramel color", "dextrin", "maltodextrin", "soy sauce", "hydrolyzed vegetable protein",
  "hydrolyzed plant protein", "yeast extract", "starch", "flavoring", "vegetable protein",
  "modified starch", "stabilizer", "emulsifier",
];

export const TRACE_PHRASES = [
  "may contain wheat", "may contain gluten", "traces of gluten", "traces of wheat",
  "trace of gluten", "trace of wheat", "processed in a facility",
  "processed on shared equipment", "manufactured in a facility that also processes",
  "shared equipment with wheat", "allergen warning",
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Strips "<keyword>-free" / "<keyword> free" claims (e.g. "gluten-free",
 * "wheat free") out of the text before matching, so an explicit
 * gluten-free label doesn't get flagged just because it contains the word
 * "gluten".
 */
function stripFreeClaims(text: string, keywords: string[]): string {
  let cleaned = text;
  for (const k of keywords) {
    cleaned = cleaned.replace(new RegExp(`\\b${escapeRegex(k)}[\\s-]?free\\b`, "gi"), " ");
  }
  return cleaned;
}

/** Word-boundary match so keywords don't fire inside unrelated longer words. */
function findMatches(text: string, keywords: string[]): string[] {
  return keywords.filter((k) => new RegExp(`\\b${escapeRegex(k)}\\b`, "i").test(text));
}

function dedupeOverlaps(arr: string[]): string[] {
  const sorted = Array.from(new Set(arr)).sort((a, b) => b.length - a.length);
  const kept: string[] = [];
  sorted.forEach((term) => {
    if (!kept.some((k) => k.includes(term))) kept.push(term);
  });
  return kept;
}

export function analyzeIngredients(rawText: string): AnalyzeResult {
  const lowered = rawText.toLowerCase();
  const text = stripFreeClaims(lowered, [...DEFINITE, ...CHECK]);

  const found: AnalyzeResult = {
    definite: findMatches(text, DEFINITE),
    check: findMatches(text, CHECK),
    trace: TRACE_PHRASES.filter((p) => text.includes(p)),
  };

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

  if (found.definite.length > 0) {
    verdict = "bad";
    title = "Contains Gluten";
    subtitle = `${found.definite.length} gluten ingredient(s) found.`;
  } else if (flags.length > 0) {
    verdict = "warn";
    title = "Check This One Closer";
    subtitle = "Ambiguous ingredients or cross-contamination warning found.";
  } else {
    verdict = "safe";
    title = "Likely Gluten-Free";
    subtitle = "No gluten-containing ingredients detected in this text.";
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

/**
 * Rough sanity check that OCR text actually looks like an ingredient list
 * rather than garbled noise (e.g. a misread barcode). Requires at least a
 * couple of real alphabetic words.
 */
export function looksLikeIngredientText(text: string): boolean {
  const words = text.split(/[^a-zA-Z']+/).filter((w) => w.length >= 3);
  return words.length >= 2;
}
