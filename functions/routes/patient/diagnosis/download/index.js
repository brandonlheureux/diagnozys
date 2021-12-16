const express = require("express");
const {
  requirePermissions,
} = require("../../../../helpers/auth/checkPermissions");
const { generateSkinLesionDownloadLink } = require("./controllers");

/**
 * @router download router
 * ---
 * @endpoint GET: /skin-lesion-image-url/:skinLesionDiagnosisId => returns s3 bucket signed url to download or view the image
 * 
 */
const downloadRouter = express.Router();

downloadRouter.get(
  "/skin-lesion-image-url/:skinLesionDiagnosisId",
  requirePermissions(["read:medicalImages"]),
  generateSkinLesionDownloadLink
);

module.exports = { downloadRouter };
