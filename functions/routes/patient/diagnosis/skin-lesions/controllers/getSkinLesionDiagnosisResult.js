require("dotenv").config("dev");
const { MongoClient } = require("mongodb");

/**
 * @controller will retrieve updated diagnosis result
 * ---
 * @urlParam skinLesionDiagnosisId
 * ---
 * @response updated diagnosis object
 */
const getSkinLesionDiagnosisResult = async (req, res, next) => {
  // get user id
  const {
    user: { sub: userId },
    params: { skinLesionDiagnosisId: diagnosisId },
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

    // get diagnosis result document
    const diagnosisResult = await skinLesionResultCollection.findOne({
      _id: diagnosisId,
    });

    // check if it exists
    if (!diagnosisResult) {
      errorCode = 404;
      throw new Error("Could not find diagnosis result");
    } else {
      // send diagnosis document back to client
      res.status(200).json({ diagnosisResult });
    }
  } catch (e) {
    res.status(errorCode).json({ error: await e.toString() });
  } finally {
    client.close();
  }
};

module.exports = { getSkinLesionDiagnosisResult };
