// routes/files.js
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const { upload, PRIVATE_UPLOAD_DIR } = require("../utils/upload");
const { requireRole } = require("../middleware/auth");
const { audit } = require("../middleware/audit");

// Upload a file (patient/admin/doctor)
router.post(
  "/upload",
  requireRole("patient", "doctor", "admin"),
  upload.single("file"),
  audit("file.upload", (req) => req.file?.filename),
  (req, res) => {
    return res.json({ fileId: req.file.filename, requestId: req.id });
  }
);

// Download a file (owner patient, doctor, or admin) — implement your own authorization logic here
router.get(
  "/:fileId",
  requireRole("patient", "doctor", "admin"),
  audit("file.download", (req) => req.params.fileId),
  (req, res) => {
    const filePath = path.join(PRIVATE_UPLOAD_DIR, req.params.fileId);
    if (!fs.existsSync(filePath)) return res.sendStatus(404);

    const ct = mime.lookup(filePath) || "application/octet-stream";
    res.setHeader("Content-Type", ct);
    res.setHeader("Content-Disposition", "inline");
    fs.createReadStream(filePath).pipe(res);
  }
);

module.exports = router;
