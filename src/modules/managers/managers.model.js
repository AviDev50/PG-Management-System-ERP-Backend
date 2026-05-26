import db from "../../common/config/db.js";
import bcrypt from "bcrypt";

/*---------------- Create Manager ----------------*/

const createManager = async (data) => {
  const {
    name,
    email,
    password,
    phone,
    salary,
    joining_date,
    branch_id,
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // branch_manager role
    const [roles] = await connection.query(
      `
      SELECT role_id
      FROM roles
      WHERE name = 'branch_manager'
      LIMIT 1
      `
    );

    if (!roles.length) {
      throw new Error("Branch manager role not found");
    }

    const roleId = roles[0].role_id;

   
    const passwordHash = await bcrypt.hash(password, 10);

    // create user
    const [userResult] = await connection.query(
      `
      INSERT INTO users
      (
        role_id,
        name,
        email,
        password_hash
      )
      VALUES (?, ?, ?, ?)
      `,
      [roleId, name, email, passwordHash]
    );

    const userId = userResult.insertId;

    // create manager
    const [managerResult] = await connection.query(
      `
      INSERT INTO managers
      (
        user_id,
        branch_id,
        phone,
        salary,
        joining_date
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        userId,
        branch_id,
        phone,
        salary,
        joining_date,
      ]
    );

    const managerId = managerResult.insertId;

    // default permissions row
    await connection.query(
      `
      INSERT INTO manager_permissions
      (
        manager_id
      )
      VALUES (?)
      `,
      [managerId]
    );

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
};

/*---------------- Get All Managers ----------------*/

const getManagers = async () => {
  const [rows] = await db.query(
    `
      SELECT
        m.manager_id,
        u.user_id,
        u.name AS manager_name,
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
      WHERE m.deleted_at IS NULL
      ORDER BY m.manager_id DESC
      `,
  );

  return rows;
};

/*---------------- Get Single Manager ----------------*/

const getSingleManager = async (id) => {
  const [rows] = await db.query(
    `
      SELECT
        m.manager_id,
        u.user_id,
        u.name AS manager_name,
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
      `,
    [id],
  );

  return rows[0];
};

/*---------------- Update Manager ----------------*/

const updateManager = async (id, data) => {
  const { phone, salary, joining_date } = data;

  const [result] = await db.query(
    `
      UPDATE managers
      SET
        phone = ?,
        salary = ?,
        joining_date = ?
      WHERE manager_id = ?
      `,
    [phone, salary, joining_date, id],
  );

  return result;
};

/*---------------- Delete Manager ----------------*/

const deleteManager = async (id) => {
  const [result] = await db.query(
    `
      DELETE FROM managers
      WHERE manager_id = ?
      `,
    [id],
  );

  return result;
};


/*---------------- Get Manager Permissions ----------------*/

const getManagerPermissions = async (managerId) => {
  const [rows] = await db.query(
    `
      SELECT
        permission_id,
        manager_id,
        rooms,
        beds,
        tenants,
        payments,
        expenses,
        amenities,
        complaints,
        meal_plans,
        reports
      FROM manager_permissions
      WHERE manager_id = ?
      LIMIT 1
    `,
    [managerId]
  );

  return rows[0];
};


/*---------------- Update Manager Permissions ----------------*/

const updateManagerPermissions = async (managerId, data) => {
  const {
    rooms,
    beds,
    tenants,
    payments,
    expenses,
    amenities,
    complaints,
    meal_plans,
    reports,
  } = data;

  const [result] = await db.query(
    `
      UPDATE manager_permissions
      SET
        rooms = ?,
        beds = ?,
        tenants = ?,
        payments = ?,
        expenses = ?,
        amenities = ?,
        complaints = ?,
        meal_plans = ?,
        reports = ?
      WHERE manager_id = ?
    `,
    [
      rooms,
      beds,
      tenants,
      payments,
      expenses,
      amenities,
      complaints,
      meal_plans,
      reports,
      managerId,
    ]
  );

  return result;
};

export default {
  createManager,
  getManagers,
  getSingleManager,
  updateManager,
  deleteManager,
  getManagerPermissions,
  updateManagerPermissions,
};