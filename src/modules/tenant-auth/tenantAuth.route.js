import express from "express";
import { tenantLogin, tenantLoginValidation } from "./tenantAuth.controller.js";

const router = express.Router();

router.post("/login", tenantLoginValidation, tenantLogin);

export default router;