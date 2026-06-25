import * as tenantAuthService from "./tenantAuth.service.js";
import { validationResult, body } from "express-validator";
import { successResponse, errorResponse } from "../../common/utils/response.js";

export const tenantLoginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Valid email is required"),
  body("password")
    .notEmpty().withMessage("Password is required"),
];

export async function tenantLogin(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const data = await tenantAuthService.login(req.body);
    return successResponse(res, data, "Login successful");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}