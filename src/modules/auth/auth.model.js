import db from "../../common/config/db.js";

export const findUserByEmail = async (email) => {
  const query = `
    SELECT
      users.user_id,
      users.name,
      users.email,
      users.password_hash,
      users.role_id,
      roles.name AS role,
      m.manager_id,
      m.branch_id,
      p.property_id

    FROM users

    JOIN roles
      ON roles.role_id = users.role_id

    LEFT JOIN managers m
      ON m.user_id = users.user_id

    LEFT JOIN properties p
      ON p.user_id = users.user_id
      AND p.deleted_at IS NULL

    WHERE users.email = ?
    LIMIT 1
  `;

  const [results] = await db.query(query, [email]);

  return results[0];
};

export const getBranchesByUserId = async (user_id) => {
  const query = `
    SELECT b.branch_id, b.name
    FROM branches b
    JOIN user_branches ub ON ub.branch_id = b.branch_id
    WHERE ub.user_id = ?
      AND ub.deleted_at IS NULL
      AND b.deleted_at IS NULL
      AND b.approval_status = 'approved'
  `;

  const [results] = await db.query(query, [user_id]);

  return results;
};

// export const findUserByEmail = async (email) => {
//   const query = `
//     SELECT
//       users.user_id,
//       users.name,
//       users.email,
//       users.password_hash,
//       users.role_id,
//       roles.name AS role,
//       m.manager_id,
//       m.branch_id

//     FROM users

//     JOIN roles
//       ON roles.role_id = users.role_id

//     LEFT JOIN managers m
//       ON m.user_id = users.user_id

//     WHERE users.email = ?
//     LIMIT 1
//   `;

//   const [results] = await db.query(query, [email]);

//   return results[0];
// };


// export const getBranchesByUserId = async (user_id) => {
//   const query = `
//     SELECT b.branch_id, b.name
//     FROM branches b
//     JOIN user_branches ub ON ub.branch_id = b.branch_id
//     WHERE ub.user_id = ?
//   `;

//   const [results] = await db.query(query, [user_id]);

//   return results;
// };