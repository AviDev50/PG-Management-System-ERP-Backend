import * as expensesService from "./expenses.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";
import cloudinary from "../../common/config/cloudinary.js";

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

//update

export const updateExpenseCategory = async (req, res) => {
  try {
    const data = await expensesService.updateExpenseCategory(
      req.params.id,
      req.body,
    );

    return successResponse(res, data, "Expense category updated successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

//====Delete
export const deleteExpenseCategory = async (req, res) => {
  try {
    const data = await expensesService.deleteExpenseCategory(req.params.id);

    return successResponse(res, data, "Expense category deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};


//===========get expense category by branch id
export const getExpenseCategoriesByBranch = async (req, res) => {
  try {
    const data =
      await expensesService.getExpenseCategoriesByBranch(
        req.params.branch_id
      );

    return successResponse(
      res,
      data,
      "Expense categories fetched successfully"
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};


/*--------------Create Expense-----------*/

export const createExpense = async (req, res) => {
  try {
    if (req.file) {
      const receiptUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "pg_erp/expenses",
      });

      req.body.receipt_url = receiptUpload.secure_url;
    }

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

/*--------------Get Expenses By Branch-----------*/

export const getExpensesByBranch = async (req, res) => {
  try {
    const data = await expensesService.getExpensesByBranch(
      req.params.branch_id,
      req.user,
    );

    return successResponse(res, data, "Branch expenses fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Update Expense-----------*/

export const updateExpense = async (req, res) => {
  try {
    const oldExpense = await expensesService.getExpenseById(
      req.params.expense_id,
    );

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "pg_erp/expenses",
      });

      req.body.receipt_url = uploadResult.secure_url;
    } else {
      req.body.receipt_url = oldExpense.receipt_url;
    }

    const data = await expensesService.updateExpense(
      req.params.expense_id,
      req.body,
      req.user,
    );

    return successResponse(res, data, "Expense updated successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Delete Expense-----------*/

export const deleteExpense = async (req, res) => {
  try {
    const data = await expensesService.deleteExpense(
      req.params.expense_id,
      req.user,
    );

    return successResponse(res, data, "Expense deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
