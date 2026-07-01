import express from "express";
import { param } from "express-validator";
import * as tenantRentDueController from "../payments/tenantRentDue.controller.js";
import {verifyTenantToken} from "../../common/middlewares/tenantauth.middleware.js"

const router = express.Router();

router.use(verifyTenantToken);

router.get("/my", tenantRentDueController.getMyRentDues);

router.get(
  "/:rent_due_id/receipt",
  [param("rent_due_id").isInt()],
  tenantRentDueController.getMyReceipt
);

export default router;