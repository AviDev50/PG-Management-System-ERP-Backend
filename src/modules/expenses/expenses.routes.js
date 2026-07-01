import express from "express";

import {
  createExpenseCategory,
  getExpenseCategories,
  getExpenseCategoriesByBranch,
  createExpense,
  getExpenses,
  updateExpenseCategory,
  deleteExpenseCategory,
  getExpensesByBranch,
  updateExpense,
  deleteExpense,
} from "./expenses.controller.js";
import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";

import { allowRoles } from "../../common/middlewares/role.middleware.js";
import upload from "../../common/config/upload.js";

const router = express.Router();

/*--------------Create Expense Category-----------*/

router.post(
  "/category/create",
  verifyToken,
  allowRoles("admin"),
  createExpenseCategory,
);

/*--------------Get Expense Categories-----------*/

router.get(
  "/categories",
  verifyToken,
  allowRoles("admin"),
  getExpenseCategories,
);

router.put(
  "/category/:id",
  verifyToken,
  allowRoles("admin"),
  updateExpenseCategory,
);

router.delete(
  "/category/:id",
  verifyToken,
  allowRoles("admin"),
  deleteExpenseCategory,
);

router.get(
  "/expense-categories/branch/:branch_id",
  verifyToken,
  allowRoles("admin"),
  getExpenseCategoriesByBranch,
);

/*--------------Create Expense-----------*/

router.post(
  "/create",
  verifyToken,
  allowRoles("admin"),
  upload.single("receipt_image"),
  createExpense,
);

/*--------------Get Expenses-----------*/

router.get("/", verifyToken, allowRoles("admin"), getExpenses);

//========Get Expense by Branch id===========
router.get(
  "/branch/:branch_id",
  verifyToken,
  allowRoles("admin"),
  getExpensesByBranch,
);

/*--------------Update Expense-----------*/

router.put(
  "/:expense_id",
  verifyToken,
  allowRoles("admin"),
  upload.single("receipt_image"),
  updateExpense,
);

//==========Delete Expenses

router.delete("/:expense_id", verifyToken, allowRoles("admin"), deleteExpense);
export default router;
