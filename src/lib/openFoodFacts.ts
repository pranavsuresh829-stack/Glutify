import { CheckResult } from "./types";
import { checkIngredientsText } from "./glutenCheck";

interface OffProduct {
  product_name?: string;
  brands?: string;
  ingredients_text?: string;
  ingredients_text_en?: string;
  image_front_small_url?: string;
  image_small_url?: string;
  allergens_tags?: string[];
  traces_tags?: string[];
}

interface OffResponse {
  status: number;
  product?: OffProduct;
}

export class ProductNotFoundError extends Error {
  constructor(barcode: string) {
    super(`No product found for barcode ${barcode}.`);
    this.name = "ProductNotFoundError";
  }
}

export async function lookupBarcode(
  barcode: string,
  source: CheckResult["source"] = "barcode"
): Promise<CheckResult> {
  const clean = barcode.trim().replace(/\s+/g, "");
  if (!/^\d{6,14}$/.test(clean)) {
    throw new Error("That doesn't look like a valid barcode number.");
  }

  const res = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${clean}.json?fields=product_name,brands,ingredients_text,ingredients_text_en,image_front_small_url,image_small_url,allergens_tags,traces_tags`,
    { headers: { Accept: "application/json" } }
  );

  if (!res.ok) {
    throw new Error(`Lookup failed (${res.status}). Try again in a moment.`);
  }

  const data: OffResponse = await res.json();

  if (data.status !== 1 || !data.product) {
    throw new ProductNotFoundError(clean);
  }

  const p = data.product;
  const ingredientsText = p.ingredients_text_en || p.ingredients_text || "";
  const allergensSayGluten = (p.allergens_tags ?? []).some((a) => a.includes("gluten"));
  const tracesSayGluten = (p.traces_tags ?? []).some((a) => a.includes("gluten"));

  let result: CheckResult;

  if (!ingredientsText) {
    result = {
      verdict: "caution",
      summary: allergensSayGluten
        ? "This product lists gluten as an allergen, but no ingredient list was available to double-check."
        : "No ingredient list is available for this product yet. Check the physical label to be safe.",
      flags: [],
      source,
    };
  } else {
    result = checkIngredientsText(ingredientsText, source);
    if (allergensSayGluten && result.verdict !== "contains") {
      result = {
        ...result,
        verdict: "contains",
        summary: "This product explicitly lists gluten in its allergen declaration.",
      };
    } else if (tracesSayGluten && result.verdict === "gluten-free") {
      result = {
        ...result,
        verdict: "caution",
        summary: "No gluten ingredients found, but the label warns of possible gluten traces (cross-contamination).",
      };
    }
  }

  return {
    ...result,
    productName: p.product_name || undefined,
    brand: p.brands || undefined,
    imageUrl: p.image_front_small_url || p.image_small_url || undefined,
    barcode: clean,
  };
}
