require("dotenv").config("dev");
const { MongoClient } = require("mongodb");
const { v4: uuid } = require("uuid");

// controller that will get all info from database for medical file creation aka medical report
/**
 * @controller generate report - will create a report based on demanded diagnosis result
 * ---
 * @urlParam 1 -  /:diagnosisType - type of diagnosis to query
 * @urlParam 2 -  /:diagnosisId   - diagnosis id
 * ---
 * @response sends back the report to the client
 */
const generateReport = async (req, res, next) => {
  // get user id
  const {
    user: { sub: userId },
    params: { diagnosisType, diagnosisId },
  } = req;

  // sanity check for userId and params
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - no user id" });
  } else if (!diagnosisType || !diagnosisId) {
    return res.status(400).json({ error: "Missing diagnosis type or id" });
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let errorCode = 500;

  try {
    await client.connect();

    // set up collections
    const skinLesionResultCollection = client
      .db("diagnosis-results")
      .collection(diagnosisType);

    const patients = client.db("users").collection("patient");
    const medicalReports = client.db("medical").collection("reports");

    // get user profile
    const userProfile = await patients.findOne({ _id: userId });

    // check if profile exists
    if (!userProfile) {
      errorCode = 404;
      throw new Error("Could not find user profile");
    }

    // get diagnosis result document
    const diagnosisResult = await skinLesionResultCollection.findOne({
      _id: diagnosisId,
    });

    // check if it exists
    if (!diagnosisResult) {
      errorCode = 404;
      throw new Error("Could not find diagnosis result");
    } else if (!diagnosisResult.completed) {
      errorCode = 400;
      throw new Error("Diagnosis result not complete");
    }

    // construct report
    const medicalReport = {
      _id: uuid(),
      createdAt: Date.now(),
      userId,
      diagnosisType,
      diagnosisId,
      diagnosisResult,
      userProfile,
    };

    // store in db
    const { acknowledged, insertedId } = await medicalReports.insertOne(
      medicalReport
    );

    if (!acknowledged || !insertedId) {
      throw new Error("Could not create medical report");
    } else {
      // send medical report to client
      res.status(200).json({ medicalReport });
    }
  } catch (e) {
    res.status(errorCode).json({ error: await e.toString() });
  } finally {
    client.close();
  }
};

module.exports = { generateReport };
