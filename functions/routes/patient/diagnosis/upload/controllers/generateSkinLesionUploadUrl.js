require("dotenv").config("dev");
const { MongoClient } = require("mongodb");

const {
  generateSignedPutUrl,
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
const generateSkinLesionUploadUrl = async (req, res, next) => {
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

    // check if diagnosis document exists & is not completed
    const result = await skinLesionResultCollection.findOne({
      _id: diagnosisId,
      userId: userId,
    });
    if (!result) {
      error = 404;
      throw new Error("Skin lesion diagnosis does not exist");
    } else if (result.completed) {
      error = 400;
      throw new Error("Skin lesion diagnosis already completed");
    } else if (result.uploaded) {
      error = 400;
      throw new Error("Skin lesion image already uploaded");
    }

    // generate s3 bucket url for upload
    const signedUrl = generateSignedPutUrl({
      bucket: process.env.AWS_S3_REKOG_SOURCE_BUCKET_NAME,

      // prepend user name & generate uuid for tracking
      key: diagnosisId + ".jpg",
    });

    // this should be handled in aws, but its slightly ?? complicated to speed-learn
    // i have the lambda set up, but cant use the event ????
    // tried to set up sns, had errors, gave up 🤷‍♂️
    // aws lambda would update mongo and add "resourceInfo" property
    // this allows the client to request read access based on the resource info
    // we can generate signed GET url for the protected resource
    const { acknowledged, modifiedCount } =
      await skinLesionResultCollection.updateOne(
        { _id: diagnosisId },
        { $set: { uploaded: true } }
      );

    if (!acknowledged || !modifiedCount) {
      console.log("what the heck");
      throw new Error(
        "could not set upload status due to database error, refusing to allow upload"
      );
    }

    // send s3 bucket url, content type and method to client
    // only send images to this bucket
    // other content types will not be processed by the aws lambdas
    res.status(200).json({ ...signedUrl, "content-type": "image/jpg" });
  } catch (e) {
    res.status(code).json({ error: await e.toString() });
  } finally {
    client.close();
  }
};

module.exports = { generateSkinLesionUploadUrl };
