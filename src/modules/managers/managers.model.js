import db from "../../common/config/db.js";
import bcrypt from "bcryptjs";

/*===========================================================================
| CREATE MANAGER (user + manager record, single transaction)
===========================================================================*/

export async function createManagerQuery(data) {
  const { name, email, password, phone, salary, joining_date, branch_id } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existingManager] = await connection.query(
      `
      SELECT manager_id
      FROM managers
      WHERE branch_id = ?
        AND is_active = 1
        AND deleted_at IS NULL
      LIMIT 1
      `,
      [branch_id],
    );

    if (existingManager.length) {
      const error = new Error("This branch already has an active manager assigned");
      error.statusCode = 400;
      throw error;
    }

    const [roles] = await connection.query(
      `SELECT role_id FROM roles WHERE name = 'branch_manager' LIMIT 1`,
    );

    if (!roles.length) {
      throw new Error("Branch manager role not found");
    }

    const roleId = roles[0].role_id;

    const passwordHash = await bcrypt.hash(password, 10);

    const [userResult] = await connection.query(
      `
      INSERT INTO users
        (role_id, name, email, password_hash)
      VALUES (?, ?, ?, ?)
      `,
      [roleId, name, email, passwordHash],
    );

    const userId = userResult.insertId;

    const [managerResult] = await connection.query(
      `
      INSERT INTO managers
        (user_id, branch_id, phone, salary, joining_date)
      VALUES (?, ?, ?, ?, ?)
      `,
      [userId, branch_id, phone, salary, joining_date],
    );

    const managerId = managerResult.insertId;

    await connection.commit();

    return {
      manager_id: managerId,
      user_id: userId,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/*===========================================================================
| GET ALL MANAGERS (super_admin - unrestricted)
===========================================================================*/

export async function getAllManagersQuery() {
  const query = `
    SELECT
      m.manager_id,
      u.user_id,
      u.name AS manager_name,
      u.email AS manager_email,
      m.phone,
      m.salary,
      m.joining_date,
      m.is_active,

      b.branch_id,
      b.name AS branch_name,

      p.property_id,
      p.name AS property_name

    FROM managers m
    JOIN users u
      ON u.user_id = m.user_id
    JOIN branches b
      ON b.branch_id = m.branch_id
    JOIN properties p
      ON p.property_id = b.property_id
    WHERE m.deleted_at IS NULL
    ORDER BY m.manager_id DESC
  `;

  const [rows] = await db.query(query);

  return rows;
}

/*===========================================================================
| GET MANAGERS SCOPED TO ADMIN'S ASSIGNED BRANCHES (user_branches)
===========================================================================*/

export async function getManagersByUserBranchesQuery(user_id) {
  const query = `
    SELECT
      m.manager_id,
      u.user_id,
      u.name AS manager_name,
      u.email AS manager_email,
      m.phone,
      m.salary,
      m.joining_date,
      m.is_active,

      b.branch_id,
      b.name AS branch_name,

      p.property_id,
      p.name AS property_name

    FROM managers m
    JOIN users u
      ON u.user_id = m.user_id
    JOIN branches b
      ON b.branch_id = m.branch_id
    JOIN properties p
      ON p.property_id = b.property_id
    JOIN user_branches ub
      ON ub.branch_id = m.branch_id
    WHERE m.deleted_at IS NULL
      AND ub.user_id = ?
    ORDER BY m.manager_id DESC
  `;

  const [rows] = await db.query(query, [user_id]);

  return rows;
}

/*===========================================================================
| GET SINGLE MANAGER
===========================================================================*/

export async function getSingleManagerQuery(manager_id) {
  const query = `
    SELECT
      m.manager_id,
      u.user_id,
      u.name AS manager_name,
      u.email AS manager_email,
      b.branch_id,
      b.name AS branch_name,
      m.phone,
      m.salary,
      m.joining_date,
      m.is_active
    FROM managers m
    JOIN users u
      ON u.user_id = m.user_id
    JOIN branches b
      ON b.branch_id = m.branch_id
    WHERE m.manager_id = ?
      AND m.deleted_at IS NULL
    LIMIT 1
  `;

  const [rows] = await db.query(query, [manager_id]);

  return rows[0];
}

/*===========================================================================
| UPDATE MANAGER
===========================================================================*/

export async function updateManagerQuery(manager_id, data) {
  const { phone, salary, joining_date } = data;

  const query = `
    UPDATE managers
    SET
      phone = ?,
      salary = ?,
      joining_date = ?,
      updated_at = NOW()
    WHERE manager_id = ?
  `;

  const [result] = await db.query(query, [phone, salary, joining_date, manager_id]);

  return result;
}

/*===========================================================================
| DELETE MANAGER (also removes linked users row - project decision: cascade)
===========================================================================*/

export async function deleteManagerQuery(manager_id) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [managerRows] = await connection.query(
      `SELECT user_id FROM managers WHERE manager_id = ? LIMIT 1`,
      [manager_id],
    );

    if (!managerRows.length) {
      throw new Error("Manager not found");
    }

    const { user_id } = managerRows[0];

    const [result] = await connection.query(
      `DELETE FROM managers WHERE manager_id = ?`,
      [manager_id],
    );

    await connection.query(`DELETE FROM users WHERE user_id = ?`, [user_id]);

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}