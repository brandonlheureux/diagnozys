const express = require("express");
const { authRequired } = require("../helpers/auth");
const { patientRouter } = require("./patient");


// this main router could be split into cloud functions
/**
 * @router main api router
 * ---
 * @subRouter "/patient" - all patient related business logic
 */
const routes = express.Router();

routes.use("/patient", authRequired, patientRouter);

// TODO
// routes.use("/practitioner, authRequired, practitionerRouter");

module.exports = { routes };
