import * as authService from "./auth.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";

export const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);

    return successResponse(res, data, "Login successful");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
