import * as expensesService from "./expenses.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";

/*--------------Create Expense Category-----------*/

export const createExpenseCategory = async (req, res) => {
  try {
    const data = await expensesService.createExpenseCategory(req.body);

    return successResponse(res, data, "Expense category created successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Get Expense Categories-----------*/

export const getExpenseCategories = async (req, res) => {
  try {
    const data = await expensesService.getExpenseCategories();

    return successResponse(
      res,
      data,
      "Expense categories fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Create Expense-----------*/

export const createExpense = async (req, res) => {
  console.log(req.user);
  try {
    const data = await expensesService.createExpense(req.body, req.user);

    return successResponse(res, data, "Expense created successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Get Expenses-----------*/

export const getExpenses = async (req, res) => {
  try {
    const data = await expensesService.getExpenses(req.user);

    return successResponse(res, data, "Expenses fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
