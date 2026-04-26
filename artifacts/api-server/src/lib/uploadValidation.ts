const ALLOWED_MIME_TYPES = new Set<string>([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set<string>(["jpg", "jpeg", "png", "webp"]);

const BLOCKED_EXTENSIONS = new Set<string>([
  "exe", "js", "mjs", "cjs", "ts", "php", "phtml", "html", "htm", "sh", "bash",
  "bat", "cmd", "ps1", "py", "pl", "rb", "jar", "war", "ear", "asp", "aspx",
  "jsp", "cgi", "svg", "xml", "xhtml",
]);

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export interface UploadValidationResult {
  ok: boolean;
  error?: string;
}

export function validateUploadMetadata(input: {
  name: string;
  size: number;
  contentType: string;
}): UploadValidationResult {
  const safeName = input.name.trim();
  if (!safeName || safeName.length > 255) {
    return { ok: false, error: "Invalid file name." };
  }

  if (/[\x00-\x1f<>:"\\|?*]/.test(safeName) || safeName.includes("..")) {
    return { ok: false, error: "File name contains illegal characters." };
  }

  const dot = safeName.lastIndexOf(".");
  const ext = dot >= 0 ? safeName.slice(dot + 1).toLowerCase() : "";
  if (!ext) return { ok: false, error: "File must have an extension." };
  if (BLOCKED_EXTENSIONS.has(ext)) {
    return { ok: false, error: "Executable or script files are not allowed." };
  }
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { ok: false, error: "Only JPG, JPEG, PNG, or WEBP images are allowed." };
  }

  const mime = input.contentType.toLowerCase().trim();
  if (!ALLOWED_MIME_TYPES.has(mime)) {
    return { ok: false, error: "Invalid file type. Only image uploads are accepted." };
  }

  if (typeof input.size !== "number" || input.size <= 0) {
    return { ok: false, error: "Invalid file size." };
  }
  if (input.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: `File too large. Maximum size is ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.` };
  }

  return { ok: true };
}

export const UPLOAD_LIMITS = {
  maxBytes: MAX_UPLOAD_BYTES,
  allowedMime: Array.from(ALLOWED_MIME_TYPES),
  allowedExtensions: Array.from(ALLOWED_EXTENSIONS),
} as const;
