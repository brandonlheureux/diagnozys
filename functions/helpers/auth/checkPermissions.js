// HOC - Guard against authenticated but non permitted access

/**
 *
 *  @HigherOrderFunction  creates an express middleware that checks resource authorization
 * ---
 *  @param {string[]} requiredPermissions -  List of required permissions
 *  @returns middleware - The permission aware express middleware to guard against insufficient permissions
 *
 */
const requirePermissions = (requiredPermissions) => {
  // check arg
  if (!Array.isArray(requiredPermissions)) {
    throw new Error("Permissions must be contained in a string array");
  } else {
    // generate auth aware middleware
    return (req, res, next) => {
      const { user: auth } = req;

      // sanity check for auth
      if (!auth) {
        res.status(401).json({ error: "Unauthorized access" });

        // check permissions
      } else if (
        // if not every required permission is included in the user permissions -> error
        !requiredPermissions.every((permission) =>
          auth.permissions.includes(permission)
        )
      ) {
        res.status(403).json({ error: "Insufficent permissions" });

        // continue to controller/handler
      } else {
        next();
      }
    };
  }
};

module.exports = { requirePermissions };
