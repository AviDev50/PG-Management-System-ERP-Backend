import db from "../config/db.js";

/**
 * Property-ownership middleware.
 *
 * properties table has a direct user_id column (the owner) - so this
 * check is simpler than checkBranchAccess (no user_branches/managers join needed).
 *
 * @param {Object} config
 * @param {string} config.idParam - req.params ka key jisme property_id hai (default "property_id")
 */
export const checkPropertyAccess = (config = {}) => {
  const { idParam = "property_id" } = config;

  return async (req, res, next) => {
    try {
      const { role, user_id } = req.user;

      if (role === "super_admin") {
        return next();
      }

      const propertyId = req.params[idParam];

      if (!propertyId) {
        return res.status(400).json({
          success: false,
          message: `${idParam} is required`,
        });
      }

      const [rows] = await db.query(
        `SELECT user_id FROM properties WHERE property_id = ? LIMIT 1`,
        [propertyId],
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      if (rows[0].user_id !== user_id) {
        return res.status(403).json({
          success: false,
          message: "Access denied: this property does not belong to you",
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};