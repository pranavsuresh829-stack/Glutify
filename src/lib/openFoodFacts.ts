import { CheckResult } from "./types";
import { analyzeIngredients, buildResult } from "./glutenCheck";

interface OffProduct {
  product_name?: string;
  ingredients_text?: string;
  ingredients_text_en?: string;
  allergens_tags?: string[];
  traces_tags?: string[];
}

interface OffResponse {
  status: number;
  product?: OffProduct;
}

export interface LookupOutcome {
  result: CheckResult | null;
  statusMessage: string;
}

export async function lookupBarcode(code: string): Promise<LookupOutcome> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const fields = "product_name,ingredients_text,ingredients_text_en,allergens_tags,traces_tags";

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=${fields}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        result: null,
        statusMessage: "Lookup failed. The database didn't respond. Try again, or snap a photo of the ingredients instead.",
      };
    }

    const data: OffResponse = await res.json();

    if (data.status !== 1 || !data.product) {
      return {
        result: null,
        statusMessage: "Not in the database. Fastest fix: switch to the Photo tab and snap the ingredients list, which reads any product.",
      };
    }

    const product = data.product;
    const ingredientsText = product.ingredients_text_en || product.ingredients_text || "";
    const allergens = (product.allergens_tags || []).join(" ");
    const tracesTags = product.traces_tags || [];
    const tracesMentionGluten = tracesTags.some((t) => /gluten/i.test(t));

    if (!ingredientsText && !allergens) {
      return {
        result: buildResult(
          { definite: [], check: [], trace: [] },
          { productName: product.product_name || code }
        ),
        statusMessage: `Found "${product.product_name || code}" but it has no ingredient data. Snap the label on the Photo tab to check it.`,
      };
    }

    // Ingredients + declared allergens are direct "this product has X" signals.
    // Traces (may contain due to shared equipment) are a separate, lesser
    // caution and should never on their own push the verdict to "Contains
    // Gluten" the way an actual ingredient does.
    const found = analyzeIngredients([ingredientsText, allergens].join(" "));
    if (tracesMentionGluten && !found.trace.includes("may contain traces of gluten")) {
      found.trace = [...found.trace, "may contain traces of gluten"];
    }

    return {
      result: buildResult(found, {
        productName: product.product_name || code,
        rawText: ingredientsText,
      }),
      statusMessage: "",
    };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        result: null,
        statusMessage: "That took too long. The database is slow right now. Try again, or use the Photo tab to read the label directly.",
      };
    }
    return {
      result: null,
      statusMessage: "Lookup failed. Check your connection, or snap the ingredients on the Photo tab.",
    };
  }
}
