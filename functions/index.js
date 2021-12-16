const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { Router } = require("express");

const { authRequired } = require("./helpers/auth/authRequired");
const { routes } = require("./routes");



const app = Router();

// api routes
app.use("/", routes);

// extended app / endpoints ------------

// auth testing
app.get("/authRequired", authRequired, (req, res, next) => {
  res.status(200).json(req.user);
});

// 404
app.get("*", (req, res, next) => {
  functions.logger.info(req.headers.origin);
  res.status(404).json({ message: "route not found" });
});

// base router
const apiv1 = express();

apiv1.use(morgan("dev"));
apiv1.use(helmet());
apiv1.use(cors());
apiv1.use(express.json());


apiv1.use("/api/v1", app);

exports.apiv1 = functions.https.onRequest(apiv1);
