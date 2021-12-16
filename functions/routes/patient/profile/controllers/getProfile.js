require("dotenv").config("dev");
const { MongoClient } = require("mongodb");

/**
 * @controller responds with the profile information of the current user
 * ---
 * @response user profile
 */
const getProfile = async (req, res, next) => {
  // get user id (we need this to get profile)
  const {
    user: { sub: userId },
  } = req;

  // sanity check for userId
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - no user id" });
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let code = 500;
  try {
    await client.connect();
    const patients = client.db("users").collection("patient");

    // get user profile
    const userProfile = await patients.findOne({ _id: userId });

    if (!userProfile) {
      code = 404;
      throw new Error("Could not find profile");
    } else {
      // return profile
      res.status(200).json({ userProfile });
    }
  } catch (e) {
    res.status(code || 500).json({ error: e.toString() });
  } finally {
    client.close();
  }
};

module.exports = { getProfile };
