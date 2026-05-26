import db from "../config/db.js";

export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // Admin ko direct access
      if (req.user.role === "admin") {
        return next();
      }

      const managerId = req.user.manager_id;

      if (!managerId) {
        return res.status(403).json({
          success: false,
          message: "Manager not found",
        });
      }

      const [rows] = await db.query(
        `
        SELECT *
        FROM manager_permissions
        WHERE manager_id = ?
        LIMIT 1
        `,
        [managerId],
      );

      if (!rows.length) {
        return res.status(403).json({
          success: false,
          message: "Permission record not found",
        });
      }

      if (!rows[0][permission]) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};
