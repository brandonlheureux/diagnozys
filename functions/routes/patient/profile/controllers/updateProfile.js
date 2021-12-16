require("dotenv").config();
const { MongoClient } = require("mongodb");

/**
 * @controller update profile
 * ---
 * @body ?firstName
 * @body ?lastName
 * @body ?dateOfBirth
 * @body ?weight
 * @body ?height
 * @body ?race
 * ---
 * @response profile updated status
 */
const updateProfile = async (req, res, next) => {
  const {
    user: { sub: userId },
    body: { firstName, lastName, dateOfBirth, weight, height, race },
  } = req;

  // check for missing input and user
  if (!userId) return res.status(401).json({ error: "Unauthenticated" });

  // construct update object
  let userProfile = {};
  if (firstName) userProfile.firstName = firstName;
  if (lastName) userProfile.lastName = lastName;
  if (dateOfBirth) userProfile.dateOfBirth = dateOfBirth;
  if (weight) userProfile.weight = weight;
  if (height) userProfile.height = height;
  if (race) userProfile.race = race;

  // if nothin was passed for update, error
  if (!Object.keys(userProfile).length) {
    return res
      .status(400)
      .json({ error: "At least one update field required" });
  }

  //set default code
  errorCode = 500;

  // mongo connect
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  try {
    // set up patient collection
    const patients = client.db("users").collection("patient");

    // update patient object
    const { acknowledged, matchedCount, modifiedCount } =
      await patients.updateOne({ _id: userId }, { $set: userProfile });

    // check for successfull operation
    if (!acknowledged || !matchedCount || !modifiedCount) {
      throw new Error("Could not update profile");
    } else {
      res.status(200).json({ message: "Profile successfully updated" });
    }
  } catch (err) {
    res.status(errorCode).json({ error: await err.toString() });
  } finally {
    client.close();
  }
};

module.exports = { updateProfile };
