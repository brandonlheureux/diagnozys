const express = require("express");
const { getDiagnosisTypes } = require("./controllers");
const { downloadRouter } = require("./download");
const { skinLesionsRouter } = require("./skin-lesions");
const { uploadRouter } = require("./upload");

/**
 * @router diagnosis router
 * ---
 * @endpoint GET: "/types" => sends all diagnosis types
 * ---
 * @subRouter "/skin-lesions"
 * @subRouter "/upload"
 * @subRouter "/download"
 */
const diagnosisRouter = express.Router();

diagnosisRouter.get("/types", getDiagnosisTypes)

// possible diagnosis
diagnosisRouter.use("/skin-lesions", skinLesionsRouter);
diagnosisRouter.use("/upload", uploadRouter);
diagnosisRouter.use("/download", downloadRouter)

module.exports = { diagnosisRouter };
