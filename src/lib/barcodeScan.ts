export const BARCODE_PATTERN = /^\d{8,14}$/;

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
    return BARCODE_PATTERN.test(code) ? code : null;
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
