const {
  getCurrentSkinLesionRequest,
} = require("./getCurrentSkinLesionRequest");
const {
  getSkinLesionDiagnosisResult,
} = require("./getSkinLesionDiagnosisResult");
const {
  getSkinLesionDiagnosisResults,
} = require("./getSkinLesionDiagnosisResults");
const { startSkinLesionDiagnosis } = require("./startSkinLesionDiagnosis");

module.exports = {
  startSkinLesionDiagnosis,
  getSkinLesionDiagnosisResult,
  getSkinLesionDiagnosisResults,
  getCurrentSkinLesionRequest,
};
