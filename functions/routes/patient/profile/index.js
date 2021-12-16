const express = require("express");
const { getProfile, updateProfile } = require("./controllers");

/**
 * @router profile router
 * ---
 * @endpoint GET "/" => retrieve user profile from db
 * @endpoint PUT "/" => update user profile
 */
const profileRouter = express.Router();

profileRouter.get("/", getProfile);
profileRouter.put("/", updateProfile);

module.exports = { profileRouter };
