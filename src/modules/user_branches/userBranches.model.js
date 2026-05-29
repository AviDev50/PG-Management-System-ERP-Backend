import db from "../../common/config/db.js";

/*---------------- Assign User Branch ----------------*/

const assignUserBranch = async (user_id, branch_id) => {
  /*-------------Insert data----------*/
  await db.query(
    `
    INSERT INTO user_branches (user_id, branch_id)
    VALUES (?, ?)
    `,
    [user_id, branch_id],
  );

  /*------------Fetch inserted data-------------------*/

  const [rows] = await db.query(
    `
  SELECT
    ub.user_id,
    u.name AS user_name,
    ub.branch_id,
    b.name AS branch_name
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
};
/*---------------- Get All User Branches ----------------*/

const getAllUserBranches = async () => {
  const [rows] = await db.query(`
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

      WHERE ub.deleted_at IS NULL

      ORDER BY ub.user_branch_id DESC
  `);

  return rows;
};

/*---------------- Get User Branches ----------------*/

const getUserBranches = async (user_id) => {
  const [rows] = await db.query(
    `
      SELECT
        ub.user_branch_id,
        b.branch_id,
        b.name AS branch_name

      FROM user_branches ub

      JOIN branches b
        ON b.branch_id = ub.branch_id

      WHERE ub.user_id = ?
      AND ub.deleted_at IS NULL
      `,
    [user_id],
  );

  return rows;
};

/*---------------- Delete User Branch ----------------*/

const deleteUserBranch = async (id) => {
  /*------- Get branch data before delete-----------*/
  const [rows] = await db.query(
    `
    SELECT
      ub.branch_id,
      b.name AS branch_name
    FROM user_branches ub

    JOIN branches b
      ON b.branch_id = ub.branch_id

    WHERE ub.user_branch_id = ?
    `,
    [id],
  );

  /*------- Check if record exists-------------*/
  if (rows.length === 0) {
    throw new Error("User branch not found");
  }

  /*---------- Store deleted data------------*/
  const deletedData = rows[0];

  /*--------- Delete record-------------------*/
  await db.query(
    `
    DELETE FROM user_branches
    WHERE user_branch_id = ?
    `,
    [id],
  );

  return deletedData;
};

export default {
  assignUserBranch,
  getAllUserBranches,
  getUserBranches,
  deleteUserBranch,
};
