const express = require("express");
const { requirePermissions } = require("../../../../helpers/auth");
const {
  startSkinLesionDiagnosis,
  getSkinLesionDiagnosisResult,
  getSkinLesionDiagnosisResults,
  getCurrentSkinLesionRequest,
} = require("./controllers");

/**
 * @router skin lesion router
 * ---
 * @endpoint GET: /newDiagnosis => creates a skin lesion diagnosis ID and db document
 * @endpoint GET: /diagnosisResult/:skinLesionDiagnosisId => retreives diagnosis result object from db
 * @endpoint GET: /allDiagnosisResults?limit={integer}&skip={integer} => gets paginated diagnosis results from db
 */
const skinLesionsRouter = express.Router();

skinLesionsRouter.get(
  "/newDiagnosis",
  requirePermissions(["create:diagnosis"]),
  startSkinLesionDiagnosis
);

skinLesionsRouter.get(
  "/allDiagnosisResults",
  requirePermissions(["read:diagnosis"]),
  getSkinLesionDiagnosisResults
);

skinLesionsRouter.get(
  "/diagnosisResult/:skinLesionDiagnosisId",
  requirePermissions(["read:diagnosis"]),
  getSkinLesionDiagnosisResult
);

skinLesionsRouter.get(
  "/latestRequest",
  requirePermissions(["read:diagnosis"]),
  getCurrentSkinLesionRequest
);

module.exports = { skinLesionsRouter };
