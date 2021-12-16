const express = require("express");
const { requireCompletedProfile } = require("../../helpers/auth");

// controllers | handlers
const { completeProfile } = require("./controllers");

// sub routers
const { medicalReportsRouter } = require("./medicalReports");
const { diagnosisRouter } = require("./diagnosis");
const { profileRouter } = require("./profile");

/**
 * This router holds all business logic for the patient dashboard and services
 * @router router for patient api
 * ---
 * @endpoint POST: /completeProfile => updates base db profile documents and marks them as complete
 * ---
 * @subRouter  "/medicalReports"
 * @subRouter  "/diagnosis"
 * @subRouter  "/profile"
 */
const patientRouter = express.Router();

// if profile was not completed (post sign up), post here
patientRouter.post("/completeProfile", completeProfile);

// all other routes need a completed profile
patientRouter.use(requireCompletedProfile("patient"));

// sub routers
patientRouter.use("/medicalReports", medicalReportsRouter);
patientRouter.use("/diagnosis", diagnosisRouter);
patientRouter.use("/profile", profileRouter);

module.exports = { patientRouter };
