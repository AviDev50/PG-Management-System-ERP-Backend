import db from "../../common/config/db.js";

/*---------------- Get Meal Plan By ID ----------------*/

const getMealPlanById = async (meal_plan_id) => {
  const [rows] = await db.query(
    `
      SELECT
        mp.meal_plan_id,
        mp.branch_id,
        b.name AS branch_name,
        mp.meal_date,
        mp.name,
        mp.breakfast,
        mp.lunch,
        mp.dinner,
        mp.is_active,
        mp.created_at,
        mp.updated_at

      FROM meal_plans mp

      JOIN branches b
        ON b.branch_id = mp.branch_id

      WHERE mp.meal_plan_id = ?
      LIMIT 1
    `,
    [meal_plan_id],
  );

  return rows[0];
};

/*---------------- Create Meal Plan ----------------*/

const createMealPlan = async (data) => {
  const { branch_id, meal_date, name, breakfast, lunch, dinner } = data;

  const [result] = await db.query(
    `
      INSERT INTO meal_plans
      (
        branch_id,
        meal_date,
        name,
        breakfast,
        lunch,
        dinner
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [branch_id, meal_date, name, breakfast, lunch, dinner],
  );

  return await getMealPlanById(result.insertId);
};

/*---------------- Get Meal Plans ----------------*/

const getMealPlans = async () => {
  const [rows] = await db.query(
    `
      SELECT
        mp.meal_plan_id,
        mp.branch_id,
        b.name AS branch_name,
        mp.meal_date,
        mp.name,
        mp.breakfast,
        mp.lunch,
        mp.dinner,
        mp.is_active,
        mp.created_at,
        mp.updated_at

      FROM meal_plans mp

      JOIN branches b
        ON b.branch_id = mp.branch_id

      WHERE mp.deleted_at IS NULL

      ORDER BY mp.meal_date DESC,
               mp.meal_plan_id DESC
    `,
  );

  return rows;
};

/*---------------- Get Single Meal Plan ----------------*/

const getSingleMealPlan = async (id) => {
  const [rows] = await db.query(
    `
      SELECT
        mp.meal_plan_id,
        mp.branch_id,
        b.name AS branch_name,
        mp.meal_date,
        mp.name,
        mp.breakfast,
        mp.lunch,
        mp.dinner,
        mp.is_active,
        mp.created_at,
        mp.updated_at

      FROM meal_plans mp

      JOIN branches b
        ON b.branch_id = mp.branch_id

      WHERE mp.meal_plan_id = ?
      LIMIT 1
    `,
    [id],
  );

  return rows[0];
};

/*---------------- Get Today's Meal Plan ----------------*/

const getTodayMealPlan = async (branch_id) => {
  const [rows] = await db.query(
    `
      SELECT
        mp.meal_plan_id,
        mp.branch_id,
        b.name AS branch_name,
        mp.meal_date,
        mp.name,
        mp.breakfast,
        mp.lunch,
        mp.dinner,
        mp.is_active,
        mp.created_at,
        mp.updated_at

      FROM meal_plans mp

      JOIN branches b
        ON b.branch_id = mp.branch_id

      WHERE mp.branch_id = ?
      AND mp.meal_date = CURDATE()
      AND mp.deleted_at IS NULL

      LIMIT 1
    `,
    [branch_id],
  );

  return rows[0];
};

/*---------------- Update Meal Plan ----------------*/

const updateMealPlan = async (id, data) => {
  const { meal_date, name, breakfast, lunch, dinner } = data;

  await db.query(
    `
      UPDATE meal_plans
      SET
        meal_date = ?,
        name = ?,
        breakfast = ?,
        lunch = ?,
        dinner = ?
      WHERE meal_plan_id = ?
    `,
    [meal_date, name, breakfast, lunch, dinner, id],
  );

  return await getMealPlanById(id);
};

/*---------------- Delete Meal Plan ----------------*/

const deleteMealPlan = async (id) => {
  const [result] = await db.query(
    `
      DELETE FROM meal_plans
      WHERE meal_plan_id = ?
    `,
    [id],
  );

  return result;
};

export default {
  createMealPlan,
  getMealPlans,
  getSingleMealPlan,
  getTodayMealPlan,
  updateMealPlan,
  deleteMealPlan,
  getMealPlanById,
};
