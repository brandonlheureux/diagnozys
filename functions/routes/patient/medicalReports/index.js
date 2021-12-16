const express = require("express");
const { requirePermissions } = require("../../../helpers/auth");
const {
  generateReport,
  getReport,
  getLatestReport,
  getReports,
} = require("./controllers");

/**
 * @router medical reports
 * ---
 * @endpoint GET /generateReport/:diagnosisType/:diagnosisId => creates and returns a compounded report
 * @endpoint GET /latest => retrieves user's latest report
 * @endpoint GET /:reportId => retrieves a report
 */
const medicalReportsRouter = express.Router();

// medical files = reports

medicalReportsRouter.get(
  "/generateReport/:diagnosisType/:diagnosisId",
  requirePermissions(["create:medicalReports"]),
  generateReport
);
medicalReportsRouter.get(
  "/",
  requirePermissions(["read:medicalReports"]),
  getReports
);
medicalReportsRouter.get(
  "/latest",
  requirePermissions(["read:medicalReports"]),
  getLatestReport
);

medicalReportsRouter.get(
  "/:reportId",
  requirePermissions(["read:medicalReports"]),
  getReport
);


module.exports = { medicalReportsRouter };
