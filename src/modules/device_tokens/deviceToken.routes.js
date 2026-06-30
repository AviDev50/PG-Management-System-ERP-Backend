// routes/deviceToken.routes.js
import express from "express";
import { registerDeviceToken } from "../device_tokens/deviceToken.controller.js";
import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { verifyTenantToken } from "../../common/middlewares/tenantauth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

// Staff route
router.post("/staff/register", verifyToken, registerDeviceToken);

// Tenant route
router.post("/tenant/register", verifyTenantToken, registerDeviceToken);

export default router;