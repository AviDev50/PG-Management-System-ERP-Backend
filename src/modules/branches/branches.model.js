import db from "../../common/config/db.js";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const parseArrayField = (value) => {
  if (!value) return [];

  try {
    return JSON.parse(value);
  } catch (error) {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

/*
|--------------------------------------------------------------------------
| Check Property Ownership
|--------------------------------------------------------------------------
*/

export const checkPropertyOwnership = async (property_id, user_id) => {
  const query = `
    SELECT *
    FROM properties
    WHERE property_id = ?
    AND user_id = ?
    LIMIT 1
  `;

  const [results] = await db.query(query, [property_id, user_id]);

  return results[0];
};

/*--------------Create Branch-----------*/

export const createBranchQuery = async (data) => {
  // console.log("DB DATA =>", data);
  const query = `
    INSERT INTO branches
    (
      property_id,
      name,
      contact_email,
      address,
      block_number,
      city,
      state,
      pincode,
      phone,
      stay_type,
      ideal_for,
      amenities,
      security_deposit_duration,
      notice_period,
      min_rent,
      max_rent,
      property_description,
      branch_photos
    )
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    data.property_id,
    data.name,
    data.contact_email,
    data.address,
    data.block_number,
    data.city,
    data.state,
    data.pincode,
    data.phone,
    data.stay_type,
    JSON.stringify(data.ideal_for || []),
    JSON.stringify(data.amenities || []),
    data.security_deposit_duration,
    data.notice_period,
    data.min_rent,
    data.max_rent,
    data.property_description,
    JSON.stringify(data.branch_photos || []),
  ]);

  return result.insertId;
};

// export const addUserBranchQuery = async (userId, branchId) => {
//   const query = `
//     INSERT INTO user_branches (user_id, branch_id)
//     VALUES (?, ?)
//   `;
//   const [result] = await db.query(query, [userId, branchId]);
//   return result.insertId;
// };

/*--------------Get Branch By Id-----------*/

export const getBranchByIdQuery = async (branch_id) => {
  const query = `
SELECT
  b.*,
  COUNT(DISTINCT r.room_id) AS total_rooms,

  m.manager_id,
  m.phone AS manager_phone,
  m.salary AS manager_salary,
  m.joining_date AS manager_joining_date,
  m.is_active AS manager_is_active,

  u.user_id AS manager_user_id,
  u.name AS manager_name,
  u.email AS manager_email

FROM branches b

LEFT JOIN rooms r
  ON r.branch_id = b.branch_id

LEFT JOIN managers m
  ON m.branch_id = b.branch_id
  AND m.is_active = 1
  AND m.deleted_at IS NULL

LEFT JOIN users u
  ON u.user_id = m.user_id

WHERE b.branch_id = ?

GROUP BY b.branch_id
`;

  const [results] = await db.query(query, [branch_id]);

  const branch = results[0];

  if (branch) {
    branch.ideal_for = parseArrayField(branch.ideal_for);
    branch.amenities = parseArrayField(branch.amenities);
    branch.branch_photos = parseArrayField(branch.branch_photos);
  }

  return branch;
};

/*--------------Get Branches-----------*/

export const getBranchesQuery = async () => {
  const query = `
SELECT
  b.*,
  COUNT(DISTINCT r.room_id) AS total_rooms,

  u.user_id AS manager_id,
  u.name AS manager_name

FROM branches b

LEFT JOIN rooms r
  ON r.branch_id = b.branch_id

LEFT JOIN users u
  ON u.user_id = b.manager_id

WHERE b.deleted_at IS NULL

GROUP BY b.branch_id

ORDER BY b.branch_id DESC
`;

  const [results] = await db.query(query);

  return results.map((branch) => ({
    ...branch,
    ideal_for: parseArrayField(branch.ideal_for),
    amenities: parseArrayField(branch.amenities),
    branch_photos: parseArrayField(branch.branch_photos),
  }));
};

/*--------------Get Single Branch-----------*/

export const getSingleBranchQuery = async (branch_id, user_id) => {
  const query = `
    SELECT branches.*
    FROM branches
    JOIN properties
      ON properties.property_id =
      branches.property_id
    WHERE branches.branch_id = ?
      AND properties.user_id = ?
    LIMIT 1
  `;

  const [results] = await db.query(query, [branch_id, user_id]);

  const branch = results[0];

  if (branch) {
    branch.ideal_for = parseArrayField(branch.ideal_for);

    branch.amenities = parseArrayField(branch.amenities);

    branch.branch_photos = parseArrayField(branch.branch_photos);
  }

  return branch;
};

/*--------------Update Branch-----------*/

export const updateBranchQuery = async (data, branch_id) => {
  const query = `
    UPDATE branches
    SET
      name = ?,
      contact_email = ?,
      address = ?,
      block_number = ?,
      city = ?,
      state = ?,
      pincode = ?,
      phone = ?,
      stay_type = ?,
      ideal_for = ?,
      amenities = ?,
      security_deposit_duration = ?,
      notice_period = ?,
      min_rent = ?,
      max_rent = ?,
      property_description = ?,
      branch_photos = ?,

      approval_status = 'pending',
      approved_by = NULL,
      approved_at = NULL,
      rejection_reason = NULL

    WHERE branch_id = ?
  `;

  const [result] = await db.query(query, [
    data.name,
    data.contact_email,
    data.address,
    data.block_number,
    data.city,
    data.state,
    data.pincode,
    data.phone,
    data.stay_type,
    JSON.stringify(data.ideal_for || []),
    JSON.stringify(data.amenities || []),
    data.security_deposit_duration,
    data.notice_period,
    data.min_rent,
    data.max_rent,
    data.property_description,
    JSON.stringify(data.branch_photos || []),
    branch_id,
  ]);

  return result;
};

/*--------------Delete Branch-----------*/

export const deleteBranchQuery = async (branch_id) => {
  const query = `
    UPDATE branches
    SET deleted_at = NOW()
    WHERE branch_id = ?
  `;

  const [result] = await db.query(query, [branch_id]);

  return result;
};

/*---------Get Branches By Property id-----*/

export const getBranchesByPropertyIdQuery = async (property_id) => {
  const query = `
   SELECT
  b.*,
  COUNT(DISTINCT r.room_id) AS total_rooms,

  u.user_id AS manager_id,
  u.name AS manager_name

FROM branches b

LEFT JOIN rooms r
  ON r.branch_id = b.branch_id

LEFT JOIN users u
  ON u.user_id = b.manager_id

WHERE b.property_id = ?
  AND b.deleted_at IS NULL

GROUP BY b.branch_id

ORDER BY b.branch_id DESC
  `;

  const [results] = await db.query(query, [property_id]);

  return results.map((branch) => ({
    ...branch,
    ideal_for: parseArrayField(branch.ideal_for),
    amenities: parseArrayField(branch.amenities),
    branch_photos: parseArrayField(branch.branch_photos),
  }));
};

/*--------------Approve Branch-----------*/

export const approveBranchQuery = async (branch_id, approved_by) => {
  const query = `
    UPDATE branches
    SET
      approval_status = 'approved',
      approved_by = ?,
      approved_at = NOW(),
      rejection_reason = NULL

    WHERE branch_id = ?
  `;

  const [result] = await db.query(query, [approved_by, branch_id]);

  return result;
};



/*===========================================================================
| GET PROPERTY BY USER ID (admin ki khud ki property)
===========================================================================*/
 
export async function getPropertyByUserIdQuery(user_id) {
  const query = `
    SELECT property_id, user_id, name
    FROM properties
    WHERE user_id = ?
      AND deleted_at IS NULL
    ORDER BY property_id ASC
    LIMIT 1
  `;
 
  const [rows] = await db.query(query, [user_id]);
 
  return rows[0];
}
 
/*===========================================================================
| ADD USER BRANCH (after branch creation)
===========================================================================*/
 
export async function addUserBranchQuery(user_id, branch_id) {
  const query = `
    INSERT INTO user_branches (user_id, branch_id)
    VALUES (?, ?)
  `;
 
  const [result] = await db.query(query, [user_id, branch_id]);
 
  return result;
}