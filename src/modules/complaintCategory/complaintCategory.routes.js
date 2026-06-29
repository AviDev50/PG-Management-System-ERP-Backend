import express from "express";

import {
  createCategory,
  getCategories,
  getCategoriesTenantSide,
  deleteCategory,
  updateCategory,
} from "./complaintCategory.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { verifyTenantToken } from "../../common/middlewares/tenantAuth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";
import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

const router = express.Router();

/*===========================================================================
| CREATE CATEGORY
===========================================================================*/

router.post(
  "/",
  verifyToken,
  allowRoles("admin", "branch_manager"),
  checkBranchAccess({ source: "body" }),
  createCategory,
);

/*===========================================================================
| GET CATEGORIES (TENANT SIDE - own branch only)
===========================================================================*/

router.get("/tenant", verifyTenantToken, getCategoriesTenantSide);

/*===========================================================================
| GET ALL CATEGORIES (role-scoped inside service)
===========================================================================*/

router.get(
  "/",
  verifyToken,
  allowRoles("super_admin", "admin", "branch_manager"),
  getCategories,
);

/*===========================================================================
| UPDATE CATEGORY
===========================================================================*/

router.put(
  "/:id",
  verifyToken,
  allowRoles("admin", "branch_manager"),
  checkBranchAccess({
    source: "params",
    table: "complaint_categories",
    idParam: "id",
    idColumn: "category_id",
  }),
  updateCategory,
);

/*===========================================================================
| DELETE CATEGORY
===========================================================================*/

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "branch_manager"),
  checkBranchAccess({
    source: "params",
    table: "complaint_categories",
    idParam: "id",
    idColumn: "category_id",
  }),
  deleteCategory,
);

export default router;