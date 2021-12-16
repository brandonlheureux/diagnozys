require("dotenv").config("dev");
const { MongoClient } = require("mongodb");

const {
  generateSignedGetUrl,
} = require("../../../../../helpers/aws/generateSignedUrl");

// This creates and sends a 5 min authorized upload link to the aws s3 rekog source bucket
// The file name is generated here and the user can upload multiple times, any file, up to 5GB (aws defaults?)
// A policy should be implemented to lower the file size limit
/**
 *
 * @controller will generate s3 upload url and create a mongo db entry
 * ---
 * @urlParam skinLesionDiagnosisId
 * ---
 * @response s3 bucket signed upload url mapped to the diagnosis id
 */
const generateSkinLesionDownloadLink = async (req, res, next) => {
  // get user id
  const {
    user: { sub: userId },
    params: { skinLesionDiagnosisId: diagnosisId },
  } = req;

  // sanity check for userId
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - no user id" });
  } else if (!diagnosisId) {
    return res.status(400).json({ error: "No diagnosis id provided" });
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let code = 500;

  try {
    await client.connect();
    const skinLesionResultCollection = client
      .db("diagnosis-results")
      .collection("skin-lesions");

    // check if diagnosis document exists & is completed, continue
    const result = await skinLesionResultCollection.findOne({
      _id: diagnosisId,
      userId: userId
    });
    if (!result) {
      error = 404;
      throw new Error("Skin lesion diagnosis does not exist");
    } else if (!result.completed) {
      error = 400;
      throw new Error("Skin lesion diagnosis not complete");
    }

    // generate s3 bucket url for upload
    const signedUrl = generateSignedGetUrl({
      bucket: process.env.AWS_S3_REKOG_FINALS_BUCKET_NAME,

      // prepend user name & generate uuid for tracking
      key: diagnosisId + ".jpg",
    });

    // send s3 bucket url and method to client
    res.status(200).json({ ...signedUrl });
  } catch (e) {
    res.status(code).json({ error: await e.toString() });
  } finally {
    client.close();
  }
};

module.exports = { generateSkinLesionDownloadLink };
