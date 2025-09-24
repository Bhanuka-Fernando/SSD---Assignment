// utils/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const { v4: uuidv4 } = require("uuid");

const PRIVATE_UPLOAD_DIR = path.join(process.cwd(), "private_uploads");
if (!fs.existsSync(PRIVATE_UPLOAD_DIR)) fs.mkdirSync(PRIVATE_UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Set(["application/pdf", "image/png", "image/jpeg"]);
const MAX_FILE_MB = 10;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PRIVATE_UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = mime.extension(file.mimetype) || "bin";
    cb(null, `${uuidv4()}.${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const original = (file.originalname || "").toLowerCase();
  const badExt = original.includes("..") || /\.(exe|js|sh|bat|cmd|php|jsp|aspx)(\.|$)/i.test(original);
  if (badExt) return cb(new Error("Disallowed file type"), false);
  if (!ALLOWED_MIME.has(file.mimetype)) return cb(new Error("Invalid file type (PDF/PNG/JPG only)"), false);
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_MB * 1024 * 1024 },
});

module.exports = { upload, PRIVATE_UPLOAD_DIR };
