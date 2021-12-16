// this could fetch from db, but not worth implementing at the time
/**
 * @controller get diagnosis types
 * ---
 * @response diagnosis type array
 */
const getDiagnosisTypes = async (req, res, next) => {
  res.status(200).json({ types: ["skin-lesion"] });
};

module.exports = { getDiagnosisTypes };
