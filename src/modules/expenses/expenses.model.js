import db from "../../common/config/db.js";

/*--------------Create Expense Category-----------*/

export const createExpenseCategoryQuery = async (
  branch_id,
  name,
  description,
) => {
  const query = `
    INSERT INTO expense_categories
    (
      branch_id,
      name,
      description
    )
    VALUES (?, ?, ?)
  `;

  const [result] = await db.query(query, [
    branch_id,
    name,
    description || null,
  ]);

  return result;
};
/*--------------Get Expense Categories-----------*/

export const getExpenseCategoriesQuery = async () => {
  const query = `
      SELECT *
      FROM expense_categories

      WHERE deleted_at IS NULL

      ORDER BY expense_category_id DESC
    `;

  const [results] = await db.query(query);

  return results;
};

//=========Get Category By Id

export const getExpenseCategoryByIdQuery = async (expense_category_id) => {
  const query = `
    SELECT *
    FROM expense_categories
    WHERE expense_category_id = ?
    AND deleted_at IS NULL
    LIMIT 1
  `;

  const [result] = await db.query(query, [expense_category_id]);

  return result[0];
};

//======update

export const updateExpenseCategoryQuery = async (
  expense_category_id,
  name,
  description,
) => {
  const query = `
    UPDATE expense_categories
    SET
      name = ?,
      description = ?,
      updated_at = NOW()
    WHERE expense_category_id = ?
  `;

  const [result] = await db.query(query, [
    name,
    description || null,
    expense_category_id,
  ]);

  return result;
};

//=====Delete

export const deleteExpenseCategoryQuery = async (expense_category_id) => {
  const query = `
    UPDATE expense_categories
    SET deleted_at = NOW()
    WHERE expense_category_id = ?
  `;

  const [result] = await db.query(query, [expense_category_id]);

  return result;
};

/*-------------Get expense category by branch id -----------*/
export const getExpenseCategoriesByBranchQuery = async (branch_id) => {
  const query = `
    SELECT
      expense_category_id,
      branch_id,
      name,
      description,
      DATE_FORMAT(created_at,'%Y-%m-%d %H:%i:%s') as created_at,
      DATE_FORMAT(updated_at,'%Y-%m-%d %H:%i:%s') as updated_at
    FROM expense_categories
    WHERE branch_id = ?
    AND deleted_at IS NULL
    ORDER BY expense_category_id DESC
  `;

  const [results] = await db.query(query, [branch_id]);

  return results;
};

/*--------------Check Branch Ownership-----------*/

export const checkBranchOwnership = async (branch_id, user_id) => {
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

  return results[0];
};

/*--------------Create Expense-----------*/

export const createExpenseQuery = async (data) => {
  const query = `
    INSERT INTO expenses
    (
      branch_id,
      expense_category_id,
      expense_name,
      amount,
      expense_date,
      description,
      receipt_url
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    data.branch_id,
    data.expense_category_id,
    data.expense_name,
    data.amount,
    data.expense_date,
    data.description,
    data.receipt_url || null,
  ]);

  return result;
};

/*--------------Get Expenses-----------*/

export const getExpensesQuery = async (user_id) => {
  const query = `
      SELECT
        expenses.*,

        expense_categories.name
        AS expense_category_name

      FROM expenses

      JOIN expense_categories
      ON expense_categories.expense_category_id =
      expenses.expense_category_id

      JOIN branches
      ON branches.branch_id =
      expenses.branch_id

      JOIN properties
      ON properties.property_id =
      branches.property_id

      WHERE properties.user_id = ?

      AND expenses.deleted_at IS NULL

      ORDER BY expense_id DESC
    `;

  const [results] = await db.query(query, [user_id]);

  return results;
};

/*--------------Get Expenses By Branch-----------*/

export const getExpensesByBranchQuery = async (branch_id) => {
  const query = `
    SELECT
      expenses.expense_id,
      expenses.branch_id,
      expenses.expense_category_id,
      expenses.expense_name,
      expenses.amount,

      DATE_FORMAT(
        expenses.expense_date,
        '%d-%m-%y'
      ) AS expense_date,

      expenses.description,
      expenses.receipt_url,

      DATE_FORMAT(
        expenses.created_at,
        '%d-%m-%y'
      ) AS created_at,

      DATE_FORMAT(
        expenses.updated_at,
        '%d-%m-%y'
      ) AS updated_at,

      expense_categories.name AS expense_category_name

    FROM expenses

    JOIN expense_categories
      ON expense_categories.expense_category_id =
         expenses.expense_category_id

    WHERE expenses.branch_id = ?
      AND expenses.deleted_at IS NULL

    ORDER BY expenses.expense_id DESC
  `;

  const [results] = await db.query(query, [branch_id]);

  return results;
};

/*--------------Get Expense By ID-----------*/

export const getExpenseByIdQuery = async (expense_id) => {
  const query = `
    SELECT *
    FROM expenses
    WHERE expense_id = ?
    AND deleted_at IS NULL
    LIMIT 1
  `;

  const [result] = await db.query(query, [expense_id]);

  return result[0];
};

/*--------------Update Expense-----------*/

export const updateExpenseQuery = async (expense_id, data) => {
  const query = `
    UPDATE expenses
    SET
      expense_category_id = ?,
      expense_name = ?,
      amount = ?,
      expense_date = ?,
      description = ?,
      receipt_url = ?,
      updated_at = NOW()

    WHERE expense_id = ?
  `;

  const [result] = await db.query(query, [
    data.expense_category_id,
    data.expense_name,
    data.amount,
    data.expense_date,
    data.description,
    data.receipt_url,
    expense_id,
  ]);

  return result;
};

/*--------------Delete Expense-----------*/

export const deleteExpenseQuery = async (expense_id) => {
  const query = `
    UPDATE expenses
    SET
      deleted_at = NOW(),
      updated_at = NOW()

    WHERE expense_id = ?
  `;

  const [result] = await db.query(query, [expense_id]);

  return result;
};
