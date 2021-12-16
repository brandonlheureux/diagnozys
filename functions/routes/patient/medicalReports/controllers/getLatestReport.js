require("dotenv").config("dev");
const { MongoClient } = require("mongodb");

/**
 * @controller get report - will retrieve the latest report from db
 * ---
 * @response the medical report
 */
const getLatestReport = async (req, res, next) => {
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

    // set up collection
    const medicalReports = client.db("medical").collection("reports");

    // get user profile
    const medicalReport = await medicalReports
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    if (!medicalReport.length) {
      errorCode = 404;
      throw new Error("Could not find medical report");
    } else {
      // send medical report to client
      res.status(200).json({ medicalReport: medicalReport[0] });
    }
  } catch (e) {
    res.status(errorCode).json({ error: await e.toString() });
  } finally {
    client.close();
  }
};

module.exports = { getLatestReport };
