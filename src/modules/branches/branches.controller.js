import * as userBranchService from "./userBranches.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";

/*===========================================================================
| ASSIGN USER BRANCH
===========================================================================*/

export async function assignUserBranch(req, res) {
  try {
    const result = await userBranchService.assignUserBranch(req.body);

    return successResponse(res, result, "User assigned to branch successfully", 201);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return errorResponse(res, "User already assigned to this branch", 400);
    }

    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| GET ALL USER BRANCHES
===========================================================================*/

export async function getAllUserBranches(req, res) {
  try {
    const result = await userBranchService.getAllUserBranches();

    return successResponse(res, result, "User branches fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| GET USER BRANCHES (single user)
===========================================================================*/

export async function getUserBranches(req, res) {
  try {
    const result = await userBranchService.getUserBranches(req.params.user_id);

    return successResponse(res, result, "User branch fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| DELETE USER BRANCH
===========================================================================*/

export async function deleteUserBranch(req, res) {
  try {
    const data = await userBranchService.deleteUserBranch(req.params.user_branch_id);

    return successResponse(res, data, "User branch deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}