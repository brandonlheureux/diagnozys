require("dotenv").config();
const { response } = require("express");
const { MongoClient } = require("mongodb");

/**
 *
 * @param {"patient" | "practitioner"} role specifies which user collection to check for
 * @returns express middleware to check if profile was completed
 */
const requireCompletedProfile = (role) => {
  // make sure we have the role or else the middleware will break
  if (!role || !(role === "patient" || role === "practitioner")) {
    throw new Error("Must assign role to profile complete checker middleware");
  }

  // express middleware
  return async (req, res, next) => {
    const {
      user: { sub: userId },
    } = req;

    // sanity: check for missing user
    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    // construct default response
    let code = 500;
    let error = "Something went wrong when checking for profile completetion";
    let data = {};

    // mongo connect
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    try {
      const users = client.db("users").collection(role);

      // get user
      const user = await users.findOne({ _id: userId });

      // check for successfull operation
      if (!user) {
        code = 404;
        throw new Error("Could not find user");

        // check for completed profile
      } else if (!user.profileComplete) {
        code = 403;
        data = { profileCompleted: user.profileComplete };

        throw new Error("User does not have a completed profile");
      } else {
        error = false;
      }
    } catch (e) {
      // prepare error
      error = e.toString();
    } finally {
      // disconnect from mongo
      client.close();

      // exit before controller if error
      if (error) {
        return res
          .status(code)
          .json({ code, error, data, redirectUrl: "/completeProfile" });
      } else {
        next();
      }
    }
  };
};

module.exports = { requireCompletedProfile };
