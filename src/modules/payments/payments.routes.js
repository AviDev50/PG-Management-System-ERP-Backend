import express from "express";

import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getTenantPaymentHistory,
  getMonthlySummary
} from "./payments.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

/*===========================================================================
| CREATE PAYMENT
===========================================================================*/
router.post("/create", verifyToken, allowRoles("admin"), createPayment);

/*===========================================================================
|
| GET PAYMENTS

|
| Supported Filters:
|
| ?tenant_id=1
| ?branch_id=2
| ?status=paid
| ?status=pending
| ?payment_mode=upi
| ?month=2026-05
|
| Combined:
| ?tenant_id=1&status=paid
|
===========================================================================*/
router.get("/", verifyToken, allowRoles("admin"), getPayments);

/*===========================================================================
|
| GET TENANT PAYMENT HISTORY
|
===========================================================================*/
router.get(
  "/tenant/:tenant_id/history",
  verifyToken,
  allowRoles("admin"),
  getTenantPaymentHistory,
);

/*-------------GET MONTHLY SUMMARY------------------*/
router.get(
  "/summary",
  verifyToken,
  allowRoles("admin"),
  getMonthlySummary
);

/*===========================================================================
|
| GET PAYMENT BY ID
|
===========================================================================*/
router.get("/:payment_id", verifyToken, allowRoles("admin"), getPaymentById);

/*===========================================================================
|
| UPDATE PAYMENT
|
===========================================================================*/
router.put("/:payment_id", verifyToken, allowRoles("admin"), updatePayment);

/*===========================================================================
|
| SOFT DELETE PAYMENT
|
===========================================================================*/
router.delete("/:payment_id", verifyToken, allowRoles("admin"), deletePayment);

export default router;
