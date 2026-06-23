import express from "express";
import { login, loginValidation } from "./auth.controller.js";

const router = express.Router();

router.post("/login", loginValidation, login);

export default router;