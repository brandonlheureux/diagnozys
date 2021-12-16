require("dotenv").config("dev");
const { MongoClient } = require("mongodb");

/**
 * @controller will retrieve user's current latest diagnosis request/result
 * ---
 * @response latest skin lesion diagnosis request (completed = false)
 */
const getCurrentSkinLesionRequest = async (req, res, next) => {
  // get user id
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

  let errorCode = 500;

  try {
    await client.connect();
    const skinLesionResultCollection = client
      .db("diagnosis-results")
      .collection("skin-lesions");

    // get diagnosis result that are not completed (still a request), sort by latest, only grab first
    const diagnosisResults = await skinLesionResultCollection
      .find({
        userId,
        completed: false,
      })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    // check if it exists
    if (!diagnosisResults.length) {
      errorCode = 404;
      throw new Error("Could not find open diagnosis request");
    } else {
      // send diagnosis document back to client
      res.status(200).json({ latestDiagnosisRequest: diagnosisResults[0] });
    }
  } catch (e) {
    res.status(errorCode).json({ error: await e.toString() });
  } finally {
    client.close();
  }
};

module.exports = { getCurrentSkinLesionRequest };
