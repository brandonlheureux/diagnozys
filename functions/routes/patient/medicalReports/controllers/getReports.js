require("dotenv").config("dev");
const { MongoClient } = require("mongodb");

/**
 * @controller get report - will retrieve reports array from db
 * ---
 * @query limit - max number of reports to return
 * @query skip - number of reports to skip (set starting pount)
 * ---
 * @response medical reports array
 */
const getReports = async (req, res, next) => {
  // get user id
  const {
    user: { sub: userId },
    query: { limit, skip },
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
    const medicalReportsCollection = client.db("medical").collection("reports");

    // get user profile
    const medicalReports = await medicalReportsCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip) || 0)
      .limit(parseInt(limit) || 10)
      .toArray();

    if (!medicalReports.length) {
      errorCode = 404;
      throw new Error("Could not find medical report");
    } else {
      // send medical reports to client
      res.status(200).json({ medicalReports });
    }
  } catch (e) {
    res.status(errorCode).json({ error: await e.toString() });
  } finally {
    client.close();
  }
};

module.exports = { getReports };
