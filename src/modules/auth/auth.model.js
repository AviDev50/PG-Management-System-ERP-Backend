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
      properties.property_id,
      m.manager_id,
      m.branch_id

    FROM users

    JOIN roles
      ON roles.role_id = users.role_id

    LEFT JOIN properties
      ON properties.user_id = users.user_id

    LEFT JOIN managers m
      ON m.user_id = users.user_id

    WHERE users.email = ?
    LIMIT 1
  `;

  const [results] = await db.query(query, [email]);

  return results[0];
};

export const getBranchesByPropertyId = async (property_id) => {
  const query = `
    SELECT
      branch_id,
      name
    FROM branches
    WHERE property_id = ?
  `;

  const [results] = await db.query(query, [property_id]);

  return results;
};
