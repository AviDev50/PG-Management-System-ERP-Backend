import db from "../../common/config/db.js";

export const findTenantByEmail = async (email) => {
  const query = `
    SELECT
      tenant_id,
      bed_id,
      room_id,
      branch_id,
      first_name,
      last_name,
      email,
      phone,
      password_hash,
      status
    FROM tenants
    WHERE email = ?
      AND deleted_at IS NULL
    LIMIT 1
  `;

  const [results] = await db.query(query, [email]);

  return results[0];
};