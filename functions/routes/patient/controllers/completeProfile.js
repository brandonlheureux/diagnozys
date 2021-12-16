require("dotenv").config();
const e = require("express");
const { MongoClient } = require("mongodb");

/**
 * @controller complete profile
 * ---
 * @body firstName
 * @body lastName
 * @body dateOfBirth
 * @body weight
 * @body height
 * @body race
 * @body sex
 * ---
 * @response profile completion status
 */

const completeProfile = async (req, res, next) => {
  const {
    user: { sub: userId },
    body: { firstName, lastName, dateOfBirth, weight, height, race, sex },
  } = req;
  // check for missing input and user
  if (!userId) return res.status(401).json({ error: "Unauthenticated" });
  if (
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !weight ||
    !height ||
    !race ||
    !sex
  ) {
    return res.status(400).json({ error: "Missing form data" });
  }

  // construct update object
  const userProfile = {
    firstName,
    lastName,
    dateOfBirth,
    weight,
    height,
    race,
    sex,
    profileComplete: true,
  };

  // default error
  let errorCode = 500;

  // mongo connect
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    // this should always query patient collection
    const patients = client.db("users").collection("patient");

    // verify profile exists and was not completed
    const profile = await patients.findOne({ _id: userId });
    if (!profile) {
      errorCode = 404;
      throw new Error(
        "profile not found - not registerd with authorization server"
      );
    } else if (profile.profileComplete) {
      errorCode = 400;
      throw new Error("profile already completed");
    }

    // update patient object
    const { acknowledged, matchedCount, modifiedCount } =
      await patients.updateOne({ _id: userId }, { $set: userProfile });

    // check for successfull operation
    if (!acknowledged || !matchedCount || !modifiedCount) {
      throw new Error("Could not complete profile");
    } else {
      res
        .status(201)
        .json({ userId, message: "Successfully completed profile" });
    }
  } catch (e) {
    res.status(errorCode).json({ error: await e.toString() });
  } finally {
    // done
    client.close();
  }
};

module.exports = { completeProfile };
