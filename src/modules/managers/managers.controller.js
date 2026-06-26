import * as managerService from "./managers.service.js";
import { successResponse, errorResponse } from "../../common/utils/response.js";

/*===========================================================================
| CREATE MANAGER
===========================================================================*/

export async function createManager(req, res) {
  try {
    const data = await managerService.createManager(req.body);

    return successResponse(res, data, "Manager created successfully");
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return errorResponse(res, "This email or branch assignment already exists", 400);
    }

    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| GET MANAGERS (filtered by admin's assigned branches)
===========================================================================*/

export async function getManagers(req, res) {
  try {
    const data = await managerService.getManagers(req.user);

    return successResponse(res, data, "Managers fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| GET SINGLE MANAGER
===========================================================================*/

export async function getSingleManager(req, res) {
  try {
    const data = await managerService.getSingleManager(req.params.id);

    return successResponse(res, data, "Manager fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| UPDATE MANAGER
===========================================================================*/

export async function updateManager(req, res) {
  try {
    const data = await managerService.updateManager(req.params.id, req.body);

    return successResponse(res, data, "Manager updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| DELETE MANAGER
===========================================================================*/

export async function deleteManager(req, res) {
  try {
    const data = await managerService.deleteManager(req.params.id);

    return successResponse(res, data, "Manager deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}