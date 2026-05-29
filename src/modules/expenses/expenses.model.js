import db from "../../common/config/db.js";

/*--------------Create Expense Category-----------*/

export const createExpenseCategoryQuery = async (name) => {
  const query = `
      INSERT INTO expense_categories
      (
        name
      )
      VALUES (?)
    `;

  const [result] = await db.query(query, [name]);

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
        amount,
        expense_date,
        description,
        receipt_url
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

  const [result] = await db.query(query, [
    data.branch_id,
    data.expense_category_id,
    data.amount,
    data.expense_date,
    data.description,
    data.receipt_url,
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



