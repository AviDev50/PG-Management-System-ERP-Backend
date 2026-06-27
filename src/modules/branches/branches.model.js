import db from "../../common/config/db.js";

/*===========================================================================
| CHECK USER EXISTS
===========================================================================*/

export async function getUserByIdQuery(user_id) {
  const query = `SELECT user_id, role_id FROM users WHERE user_id = ? LIMIT 1`;

  const [rows] = await db.query(query, [user_id]);

  return rows[0];
}

/*===========================================================================
| CHECK BRANCH EXISTS
===========================================================================*/

export async function getBranchByIdQuery(branch_id) {
  const query = `SELECT branch_id FROM branches WHERE branch_id = ? LIMIT 1`;

  const [rows] = await db.query(query, [branch_id]);

  return rows[0];
}

/*===========================================================================
| ASSIGN USER BRANCH
===========================================================================*/

export async function assignUserBranchQuery(user_id, branch_id) {
  await db.query(
    `
    INSERT INTO user_branches (user_id, branch_id)
    VALUES (?, ?)
    `,
    [user_id, branch_id],
  );

  const [rows] = await db.query(
    `
    SELECT
      ub.user_branch_id,
      ub.user_id,
      u.name AS user_name,
      ub.branch_id,
      b.name AS branch_name,
      ub.assigned_at
    FROM user_branches ub

    JOIN users u
      ON u.user_id = ub.user_id

    JOIN branches b
      ON b.branch_id = ub.branch_id

    WHERE ub.user_id = ?
      AND ub.branch_id = ?
    `,
    [user_id, branch_id],
  );

  return rows[0];
}

/*===========================================================================
| GET ALL USER BRANCHES
===========================================================================*/

export async function getAllUserBranchesQuery() {
  const query = `
    SELECT
      ub.user_branch_id,
      u.user_id,
      u.name AS user_name,
      b.branch_id,
      b.name AS branch_name,
      ub.assigned_at
    FROM user_branches ub

    JOIN users u
      ON u.user_id = ub.user_id

    JOIN branches b
      ON b.branch_id = ub.branch_id

    ORDER BY ub.user_branch_id DESC
  `;

  const [rows] = await db.query(query);

  return rows;
}

/*===========================================================================
| GET USER BRANCHES (single user)
===========================================================================*/

export async function getUserBranchesQuery(user_id) {
  const query = `
    SELECT
      ub.user_branch_id,
      b.branch_id,
      b.name AS branch_name,
      ub.assigned_at
    FROM user_branches ub

    JOIN branches b
      ON b.branch_id = ub.branch_id

    WHERE ub.user_id = ?
  `;

  const [rows] = await db.query(query, [user_id]);

  return rows;
}

/*===========================================================================
| GET USER BRANCH BY ID (for ownership/existence checks)
===========================================================================*/

export async function getUserBranchByIdQuery(user_branch_id) {
  const query = `
    SELECT
      ub.user_branch_id,
      ub.branch_id,
      b.name AS branch_name
    FROM user_branches ub

    JOIN branches b
      ON b.branch_id = ub.branch_id

    WHERE ub.user_branch_id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(query, [user_branch_id]);

  return rows[0];
}

/*===========================================================================
| DELETE USER BRANCH
===========================================================================*/

export async function deleteUserBranchQuery(user_branch_id) {
  const query = `DELETE FROM user_branches WHERE user_branch_id = ?`;

  const [result] = await db.query(query, [user_branch_id]);

  return result;
}