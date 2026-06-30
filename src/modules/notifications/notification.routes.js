// routes/notification.routes.js
import express from "express";
import * as notificationController from "../notifications/notification.controller.js";
import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { verifyTenantToken } from "../../common/middlewares/tenantauth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";

import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

const router = express.Router();

// Staff (admin/super_admin/branch_manager) sends notification
router.post(
  "/send",
  verifyToken,
  allowRoles("admin", "super_admin", "branch_manager"),
  notificationController.sendNotification
);

// Staff fetches their own notifications
router.get("/my", verifyToken, notificationController.getMyNotifications);
router.patch("/my/:id/read", verifyToken, notificationController.markNotificationAsRead);
router.delete("/my/:id", verifyToken, notificationController.deleteMyNotification);

// Tenant fetches their own notifications
router.get("/tenant/my", verifyTenantToken, notificationController.getMyNotifications);
router.patch("/tenant/my/:id/read", verifyTenantToken, notificationController.markNotificationAsRead);
router.delete("/tenant/my/:id", verifyTenantToken, notificationController.deleteMyNotification);

export default router;