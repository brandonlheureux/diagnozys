const express = require("express");
const {
  requirePermissions,
} = require("../../../../helpers/auth/checkPermissions");
const { generateSkinLesionUploadUrl } = require("./controllers");

/**
 * @router upload router
 * ---
 * @endpoint GET: /skin-lesion-upload-url/:skinLesionDiagnosisId => returns s3 bucket signed url to uplaod skin lesion image
 * 
 */
const uploadRouter = express.Router();

uploadRouter.get(
  "/skin-lesion-upload-url/:skinLesionDiagnosisId",
  requirePermissions(["upload:medicalImages"]),
  generateSkinLesionUploadUrl
);

module.exports = { uploadRouter };
