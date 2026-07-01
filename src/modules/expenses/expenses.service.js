import {
  createExpenseCategoryQuery,
  getExpenseCategoriesQuery,
  createExpenseQuery,
  getExpensesQuery,
  checkBranchOwnership,
  getExpenseCategoryByIdQuery,
  updateExpenseCategoryQuery,
  deleteExpenseCategoryQuery,
  getExpenseByIdQuery,
  getExpensesByBranchQuery,
  updateExpenseQuery,
  deleteExpenseQuery,
  getExpenseCategoriesByBranchQuery,
} from "./expenses.model.js";

/*--------------Create Expense Category-----------*/

export const createExpenseCategory = async (payload) => {
  const { branch_id, name, description } = payload;

  if (!branch_id) {
    throw new Error("Branch id is required");
  }

  if (!name) {
    throw new Error("Expense category name is required");
  }

  const result = await createExpenseCategoryQuery(branch_id, name, description);

  return await getExpenseCategoryByIdQuery(result.insertId);
};

/*--------------Get Expense Categories-----------*/

export const getExpenseCategories = async () => {
  return await getExpenseCategoriesQuery();
};

//==============update===========

export const updateExpenseCategory = async (expense_category_id, payload) => {
  const { name, description } = payload;

  const category = await getExpenseCategoryByIdQuery(expense_category_id);

  if (!category) {
    throw new Error("Expense category not found");
  }

  await updateExpenseCategoryQuery(expense_category_id, name, description);

  return await getExpenseCategoryByIdQuery(expense_category_id);
};

//=====Delete

export const deleteExpenseCategory = async (expense_category_id) => {
  const category = await getExpenseCategoryByIdQuery(expense_category_id);

  if (!category) {
    throw new Error("Expense category not found");
  }

  await deleteExpenseCategoryQuery(expense_category_id);

  return category;
};

/*-----------Get expense category by branch id-------*/
export const getExpenseCategoriesByBranch = async (branch_id) => {
  if (!branch_id) {
    throw new Error("Branch id is required");
  }

  const categories = await getExpenseCategoriesByBranchQuery(branch_id);

  return {
    total_categories: categories.length,
    categories,
  };
};
/*--------------Create Expense-----------*/

export const createExpense = async (payload, user) => {
  const {
    branch_id,
    expense_category_id,
    expense_name,
    amount,
    expense_date,
    description,
    receipt_url,
  } = payload;

  if (!expense_name) {
    throw new Error("Expense name is required");
  }

  const branch = await checkBranchOwnership(branch_id, user.user_id);

  if (!branch) {
    throw new Error("Branch not found or you are not authorized");
  }

  const result = await createExpenseQuery({
    branch_id,
    expense_category_id,
    expense_name,
    amount,
    expense_date,
    description,
    receipt_url,
  });

  return await getExpenseByIdQuery(result.insertId);

  return result;
};

/*--------------Get Expenses-----------*/

export const getExpenses = async (user) => {
  return await getExpensesQuery(user.user_id);
};

/*--------------Get Expenses By Branch-----------*/

export const getExpensesByBranch = async (branch_id, user) => {
  const branch = await checkBranchOwnership(branch_id, user.user_id);

  if (!branch) {
    throw new Error("Branch not found or you are not authorized");
  }

  const expenses = await getExpensesByBranchQuery(branch_id);

  const total_expense = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0,
  );

  return {
    branch_id: Number(branch_id),
    total_expense,
    expenses,
  };
};

/*--------------Update Expense-----------*/

export const updateExpense = async (expense_id, payload, user) => {
  const expense = await getExpenseByIdQuery(expense_id);

  if (!expense) {
    throw new Error("Expense not found");
  }

  const branch = await checkBranchOwnership(expense.branch_id, user.user_id);

  if (!branch) {
    throw new Error("You are not authorized");
  }

  await updateExpenseQuery(expense_id, payload);

  return await getExpenseByIdQuery(expense_id);
};

/*--------------Get Expense By ID-----------*/

export const getExpenseById = async (expense_id) => {
  return await getExpenseByIdQuery(expense_id);
};

/*--------------Delete Expense-----------*/

export const deleteExpense = async (expense_id, user) => {
  const expense = await getExpenseByIdQuery(expense_id);

  if (!expense) {
    throw new Error("Expense not found");
  }

  const branch = await checkBranchOwnership(expense.branch_id, user.user_id);

  if (!branch) {
    throw new Error("You are not authorized");
  }

  await deleteExpenseQuery(expense_id);

  return expense;
};
