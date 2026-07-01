import express from "express";
import { body, query, param } from "express-validator";
import * as rentDueController from "./rentDue.controller.js"; // confirm karo actual path
import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

router.use(verifyToken);
router.use(allowRoles(["admin", "branch_manager"]));

router.get(
  "/",
  [
    query("status").optional().isIn(["pending", "paid"]),
    query("billing_month").optional().isDate(),
    query("page").optional().isInt({ min: 1 }),
    query("pageSize").optional().isInt({ min: 1, max: 100 }),
  ],
  rentDueController.listRentDues
);

router.get(
  "/tenant/:tenant_id/branch/:tenant_branch_id",
  [param("tenant_id").isInt(), param("tenant_branch_id").isInt()],
  rentDueController.listRentDuesForTenant
);

router.patch(
  "/:rent_due_id/mark-paid",
  checkBranchAccess({
    source: "params",
    table: "rent_dues",
    idParam: "rent_due_id",
    idColumn: "rent_due_id",
    branchColumn: "branch_id",
  }),
  [
    param("rent_due_id").isInt(),
    body("payment_mode").isIn(["cash", "upi", "bank_transfer", "cheque"]),
    body("payment_date").isDate(),
    body("transaction_ref").optional().isString(),
    body("notes").optional().isString(),
  ],
  rentDueController.markPaid
);

export default router;