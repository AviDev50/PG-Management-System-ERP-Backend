// import db from "../config/db.js";

// /**
//  * Generic branch-ownership middleware.
//  *
//  * Handles three scenarios with one function:
//  *  1. CREATE        -> branch_id aata hai req.body se        (source: "body")
//  *  2. UPDATE/DELETE -> branch_id derive hota hai direct column se   (source: "params", join: false)
//  *  3. UPDATE/DELETE -> branch_id derive hota hai join table se      (source: "params", join: true)
//  *
//  * @param {Object} config
//  * @param {string} config.source        - "body" | "params" (default "params")
//  * @param {string} config.table         - resource ki table (params source ke liye required)
//  * @param {string} config.idParam       - req.params ka key (params source ke liye required)
//  * @param {string} config.idColumn      - table ka PK column (params source ke liye required)
//  * @param {string} config.branchColumn  - branch_id column naam (default "branch_id")
//  * @param {Object} config.join          - { table, localColumn } -> agar resource table mein direct branch_id nahi hai
//  */
// export const checkBranchAccess = (config) => {
//   const {
//     source = "params",
//     table,
//     idParam,
//     idColumn,
//     branchColumn = "branch_id",
//     join = null,
//   } = config;

//   return async (req, res, next) => {
//     try {
//       const { role, user_id, manager_id } = req.user;

//       // super_admin -> full bypass
//       if (role === "super_admin") {
//         return next();
//       }

//       let resourceBranchId;

//       if (source === "body") {
//         resourceBranchId = req.body[branchColumn];

//         if (!resourceBranchId) {
//           return res.status(400).json({
//             success: false,
//             message: `${branchColumn} is required`,
//           });
//         }
//       } else {
//         const resourceId = req.params[idParam];

//         if (!resourceId) {
//           return res.status(400).json({
//             success: false,
//             message: `${idParam} is required`,
//           });
//         }

//         let query;

//         if (join) {
//           // Resource ka apna branch_id nahi hai, parent table se join karke nikalna hai
//           // e.g. beds -> rooms.branch_id
//           query = `
//             SELECT j.${branchColumn} AS branch_id
//             FROM ${table} t
//             JOIN ${join.table} j ON t.${join.localColumn} = j.${join.localColumn}
//             WHERE t.${idColumn} = ?
//             LIMIT 1
//           `;
//         } else {
//           query = `SELECT ${branchColumn} FROM ${table} WHERE ${idColumn} = ? LIMIT 1`;
//         }

//         const [rows] = await db.query(query, [resourceId]);

//         if (!rows.length) {
//           return res.status(404).json({
//             success: false,
//             message: "Resource not found",
//           });
//         }

//         resourceBranchId = join ? rows[0].branch_id : rows[0][branchColumn];
//       }

//       // admin -> multiple branches, user_branches se verify
//       if (role === "admin") {
//         const [branchRows] = await db.query(
//           `SELECT branch_id FROM user_branches WHERE user_id = ? AND branch_id = ? LIMIT 1`,
//           [user_id, resourceBranchId]
//         );

//         if (!branchRows.length) {
//           return res.status(403).json({
//             success: false,
//             message: "Access denied: this branch is not assigned to you",
//           });
//         }

//         return next();
//       }

//       // branch_manager -> sirf ek branch, managers table se verify
//       if (role === "branch_manager") {
//         if (!manager_id) {
//           return res.status(403).json({
//             success: false,
//             message: "Manager not found",
//           });
//         }

//         const [managerRows] = await db.query(
//           `SELECT branch_id FROM managers WHERE manager_id = ? LIMIT 1`,
//           [manager_id]
//         );

//         if (!managerRows.length || managerRows[0].branch_id !== resourceBranchId) {
//           return res.status(403).json({
//             success: false,
//             message: "Access denied: this resource does not belong to your branch",
//           });
//         }

//         return next();
//       }

//       // Koi aur role yahan tak pahunch gaya -> deny by default
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };
// };




import db from "../config/db.js";

/**
 * Generic branch-ownership middleware.
 *
 * Handles three scenarios with one function:
 *  1. CREATE        -> branch_id aata hai req.body se        (source: "body")
 *  2. UPDATE/DELETE -> branch_id derive hota hai direct column se   (source: "params", join: false)
 *  3. UPDATE/DELETE -> branch_id derive hota hai join table se      (source: "params", join: true)
 *
 * @param {Object} config
 * @param {string} config.source        - "body" | "params" (default "params")
 * @param {string} config.table         - resource ki table (params source ke liye required)
 * @param {string} config.idParam       - req.params ka key (params source ke liye required)
 * @param {string} config.idColumn      - table ka PK column (params source ke liye required)
 * @param {string} config.branchColumn  - branch_id column naam (default "branch_id")
 * @param {Object} config.join          - { table, localColumn } -> agar resource table mein direct branch_id nahi hai
 */
export const checkBranchAccess = (config) => {
  const {
    source = "params",
    table,
    idParam,
    idColumn,
    branchColumn = "branch_id",
    join = null,
  } = config;

  return async (req, res, next) => {
    try {
      const { role, user_id, manager_id } = req.user;

      // super_admin -> full bypass
      if (role === "super_admin") {
        return next();
      }

      let resourceBranchId;

      if (source === "body") {
        resourceBranchId = req.body[branchColumn];

        if (!resourceBranchId) {
          return res.status(400).json({
            success: false,
            message: `${branchColumn} is required`,
          });
        }
      } else if (source === "query") {
        resourceBranchId = req.query[branchColumn];

        if (!resourceBranchId) {
          return res.status(400).json({
            success: false,
            message: `${branchColumn} is required`,
          });
        }

        // query string hamesha string aata hai, DB compare ke liye number karna zaruri hai
        resourceBranchId = Number(resourceBranchId);

        if (Number.isNaN(resourceBranchId)) {
          return res.status(400).json({
            success: false,
            message: `${branchColumn} must be a valid number`,
          });
        }
      } else {
        const resourceId = req.params[idParam];

        if (!resourceId) {
          return res.status(400).json({
            success: false,
            message: `${idParam} is required`,
          });
        }

        let query;

        if (join) {
          // Resource ka apna branch_id nahi hai, parent table se join karke nikalna hai
          // e.g. beds -> rooms.branch_id
          query = `
            SELECT j.${branchColumn} AS branch_id
            FROM ${table} t
            JOIN ${join.table} j ON t.${join.localColumn} = j.${join.localColumn}
            WHERE t.${idColumn} = ?
            LIMIT 1
          `;
        } else {
          query = `SELECT ${branchColumn} FROM ${table} WHERE ${idColumn} = ? LIMIT 1`;
        }

        const [rows] = await db.query(query, [resourceId]);

        if (!rows.length) {
          return res.status(404).json({
            success: false,
            message: "Resource not found",
          });
        }

        resourceBranchId = join ? rows[0].branch_id : rows[0][branchColumn];
      }

      // admin -> multiple branches, user_branches se verify
      if (role === "admin") {
        const [branchRows] = await db.query(
          `SELECT branch_id FROM user_branches WHERE user_id = ? AND branch_id = ? LIMIT 1`,
          [user_id, resourceBranchId]
        );

        if (!branchRows.length) {
          return res.status(403).json({
            success: false,
            message: "Access denied: this branch is not assigned to you",
          });
        }

        return next();
      }

      // branch_manager -> sirf ek branch, managers table se verify
      if (role === "branch_manager") {
        if (!manager_id) {
          return res.status(403).json({
            success: false,
            message: "Manager not found",
          });
        }

        const [managerRows] = await db.query(
          `SELECT branch_id FROM managers WHERE manager_id = ? LIMIT 1`,
          [manager_id]
        );

        if (!managerRows.length || managerRows[0].branch_id !== resourceBranchId) {
          return res.status(403).json({
            success: false,
            message: "Access denied: this resource does not belong to your branch",
          });
        }

        return next();
      }

      // Koi aur role yahan tak pahunch gaya -> deny by default
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};


