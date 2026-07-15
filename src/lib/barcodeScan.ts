export const BARCODE_PATTERN = /^\d{8,14}$/;

const CHECKSUM_LENGTHS = new Set([8, 12, 13, 14]);

/**
 * GS1 check-digit validation (EAN-8/EAN-13/UPC-A/GTIN-14). A camera
 * misread (blur, glare, wrong angle) can still produce a string that
 * matches BARCODE_PATTERN but isn't a real barcode; this catches those
 * before they're sent off as a lookup for the wrong product.
 */
export function hasValidChecksum(code: string): boolean {
  if (!/^\d+$/.test(code) || !CHECKSUM_LENGTHS.has(code.length)) return true;
  const digits = code.split("").map(Number);
  const checkDigit = digits.pop()!;
  let sum = 0;
  digits.forEach((d, i) => {
    const posFromRight = digits.length - i;
    sum += d * (posFromRight % 2 === 1 ? 3 : 1);
  });
  return (10 - (sum % 10)) % 10 === checkDigit;
}

async function makeFileScanner(elementId: string) {
  const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
  const formats = [
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.CODE_128,
  ];
  return new Html5Qrcode(elementId, {
    formatsToSupport: formats,
    experimentalFeatures: { useBarCodeDetectorIfSupported: false },
    verbose: false,
  });
}

/**
 * Tries to decode a product barcode from a still image. Returns the digits
 * if a valid-looking barcode was found, or null if nothing usable was
 * decoded (caller should fall back to whatever else it wants to try, e.g.
 * OCR for a label).
 */
export async function decodeBarcodeFromFile(file: File, elementId: string): Promise<string | null> {
  const scanner = await makeFileScanner(elementId);
  try {
    const result = await scanner.scanFileV2(file, false);
    const code = (result?.decodedText ?? "").trim();
    return BARCODE_PATTERN.test(code) && hasValidChecksum(code) ? code : null;
  } catch {
    return null;
  } finally {
    try {
      scanner.clear();
    } catch {
      /* noop */
    }
  }
}
