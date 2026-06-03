import express from "express";

import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} from "./complaintCategory.controller.js";

const router = express.Router();

/*===========================================================================
| CREATE CATEGORY
===========================================================================*/

router.post("/", createCategory);

/*===========================================================================
| GET ALL CATEGORIES
===========================================================================*/

router.get("/", getCategories);

/*===========================================================================
| DELETE CATEGORY
===========================================================================*/

router.delete("/:id", deleteCategory);

/*===========================================================================
| UPDATE CATEGORY
===========================================================================*/

router.put("/:id", updateCategory);

export default router;
