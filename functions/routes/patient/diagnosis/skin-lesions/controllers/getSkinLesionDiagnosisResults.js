require("dotenv").config("dev");
const { MongoClient } = require("mongodb");

/**
 * @controller will retrieve user diagnosis results
 * ---
 * @query skip - results to skip (starting point)
 * @query limit - number of results to fetch
 * @query complete - whether to filter by complete status
 * ---
 * @response paginated diagnosis results for current user
 */
const getSkinLesionDiagnosisResults = async (req, res, next) => {
  // get user id
  const {
    user: { sub: userId },
    query: { skip, limit, complete },
  } = req;
  console.log(limit, skip);

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

    let findOptions = { userId: userId };
    if (complete) findOptions.completed = true;

    // get diagnosis result document
    const diagnosisResults = await skinLesionResultCollection
      .find(findOptions)
      .skip(parseInt(skip) || 0)
      .limit(parseInt(limit) || 10)
      .toArray();

    // check if it exists
    if (!diagnosisResults.length) {
      errorCode = 404;
      throw new Error("Could not find diagnosis results");
    } else {
      // send diagnosis document back to client
      res.status(200).json({ diagnosisResults });
    }
  } catch (e) {
    res.status(errorCode).json({ error: await e.toString() });
  } finally {
    client.close();
  }
};

module.exports = { getSkinLesionDiagnosisResults };
