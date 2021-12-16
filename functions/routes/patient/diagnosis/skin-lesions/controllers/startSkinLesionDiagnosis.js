require("dotenv").config("dev");
const { MongoClient } = require("mongodb");
const { v4: uuid } = require("uuid");

/**
 * @controller will create a new skin lesion diagnosis document
 *  ---
 * @response skin lesion document id
 */
const startSkinLesionDiagnosis = async (req, res, next) => {
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

  // create diagnosis document for db
  const diagnosisUUID = uuid().toString();
  const diagnosisId = `${userId.split("|").join("_")}_${diagnosisUUID}`;
  const diagnosisDocument = {
    _id: diagnosisId,
    userId,
    diagnosisUUID,
    createdAt: Date.now(),
    completed: false,
    uploaded: false,
  };
  let code = 500
  try {
    await client.connect();
    const skinLesionResultCollection = client
      .db("diagnosis-results")
      .collection("skin-lesions");

    // create diagnosis document in mongo
    const { acknowledged, insertedId } =
      await skinLesionResultCollection.insertOne(diagnosisDocument);

    if (!acknowledged || !insertedId) {
      error = 400
      throw new Error("Could not create diagnosis");
    } else {
      // send diagnosis document back to client
      // use the diagnosis id to request for an image upload url
      res.status(200).json({ diagnosisDocument });
    }
  } catch (e) {
    res.status(code).json({ error: await e.toString() });
  } finally {
    client.close();
  }
};

module.exports = { startSkinLesionDiagnosis };
