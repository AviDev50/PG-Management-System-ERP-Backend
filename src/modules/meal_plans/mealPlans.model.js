import db from "../../common/config/db.js";

/*---------------- Create Meal Plan ----------------*/

const createMealPlan = async (data) => {
  const { branch_id, name, effective_date, days } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [planResult] = await connection.query(
      `
      INSERT INTO meal_plans
      (
        branch_id,
        name,
        effective_date
      )
      VALUES (?, ?, ?)
      `,
      [branch_id, name, effective_date],
    );

    const meal_plan_id = planResult.insertId;

    for (const day of days) {
      await connection.query(
        `
    INSERT INTO meal_plan_days
    (
      meal_plan_id,
      day_name,
      breakfast_menu,
      lunch_menu,
      snack_menu,
      dinner_menu
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
        [
          meal_plan_id,
          day.day_name,
          day.breakfast_menu,
          day.lunch_menu,
          day.snack_menu,
          day.dinner_menu,
        ],
      );
    }
    await connection.commit();

    return await getSingleMealPlan(meal_plan_id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/*-------------get all Meal---------*/

const getMealPlans = async () => {
  const [rows] = await db.query(`
    SELECT
      mp.meal_plan_id,
      mp.branch_id,
      b.name AS branch_name,
      mp.name,
      mp.effective_date,
      mp.is_active,
      mp.created_at,
      mp.updated_at

    FROM meal_plans mp

    JOIN branches b
      ON b.branch_id = mp.branch_id

    WHERE mp.deleted_at IS NULL

    ORDER BY mp.effective_date DESC,
             mp.meal_plan_id DESC
  `);

  return rows;
};

/*------------get single meal plan---------*/

const getSingleMealPlan = async (meal_plan_id) => {
  const [plans] = await db.query(
    `
  SELECT
    meal_plan_id,
    name,
    DATE_FORMAT(effective_date, '%Y-%m-%d') AS effective_date
  FROM meal_plans
  WHERE meal_plan_id = ?
  `,
    [meal_plan_id],
  );

  if (!plans.length) {
    return null;
  }

  const [days] = await db.query(
    `
    SELECT
      meal_day_id,
      day_name,
      breakfast_menu,
      lunch_menu,
      snack_menu,
      dinner_menu
    FROM meal_plan_days
    WHERE meal_plan_id = ?
    ORDER BY FIELD(
      day_name,
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    )
    `,
    [meal_plan_id],
  );

  return {
    meal_plan_id: plans[0].meal_plan_id,
    name: plans[0].name,
    effective_date: plans[0].effective_date,
    days,
  };
};

/*--------------get meal plan by Bracnh id------------*/
const getMealPlansByBranch = async (branch_id) => {
  const [plans] = await db.query(
    `
  SELECT
    mp.meal_plan_id,
    mp.branch_id,
    b.name AS branch_name,
    mp.name,
    DATE_FORMAT(mp.effective_date, '%Y-%m-%d') AS effective_date,
    mp.is_active,
    mp.created_at,
    mp.updated_at

  FROM meal_plans mp

  JOIN branches b
    ON b.branch_id = mp.branch_id

  WHERE mp.branch_id = ?
    AND mp.deleted_at IS NULL

  ORDER BY mp.effective_date DESC
  `,
    [branch_id],
  );

  for (const plan of plans) {
    const [days] = await db.query(
      `
  SELECT
    meal_day_id,
    day_name,
    breakfast_menu,
    lunch_menu,
    snack_menu,
    dinner_menu

  FROM meal_plan_days

  WHERE meal_plan_id = ?

  ORDER BY FIELD(
    day_name,
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  )
  `,
      [plan.meal_plan_id],
    );

    plan.days = days;
  }

  return plans;
};

/*------------- Update Meal Plan ------------*/

const updateMealPlan = async (meal_plan_id, data) => {
  const { name, effective_date, days } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `
      UPDATE meal_plans
      SET
        name = ?,
        effective_date = ?
      WHERE meal_plan_id = ?
      `,
      [name, effective_date, meal_plan_id],
    );

    await connection.query(
      `
      DELETE FROM meal_plan_days
      WHERE meal_plan_id = ?
      `,
      [meal_plan_id],
    );

    for (const day of days) {
      await connection.query(
        `
        INSERT INTO meal_plan_days
        (
          meal_plan_id,
          day_name,
          breakfast_menu,
          lunch_menu,
          snack_menu,
          dinner_menu
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          meal_plan_id,
          day.day_name,
          day.breakfast_menu ?? null,
          day.lunch_menu ?? null,
          day.snack_menu ?? null,
          day.dinner_menu ?? null,
        ],
      );
    }

    await connection.commit();

    return await getSingleMealPlan(meal_plan_id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/*-----Delete Meal Plan--------*/

const deleteMealPlan = async (meal_plan_id) => {
  const [result] = await db.query(
    `
    UPDATE meal_plans
    SET deleted_at = NOW()
    WHERE meal_plan_id = ?
    `,
    [meal_plan_id],
  );

  return result;
};

export default {
  createMealPlan,
  getMealPlans,
  getSingleMealPlan,
  getMealPlansByBranch,
  updateMealPlan,
  deleteMealPlan,
};
