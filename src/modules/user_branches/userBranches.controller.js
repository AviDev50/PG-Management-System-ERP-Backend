import userBranchService from "./userBranches.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";

/*---------assign branch to manager-----------*/

const assignUserBranch = async (req, res) => {
  try {
    const result = await userBranchService.assignUserBranch(req.body);

    return successResponse(
      res,
      result,
      "User assigned to branch successfully",
      201,
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return errorResponse(res, "User already assigned to this branch", 400);
    }

    return errorResponse(res, error.message);
  }
};

/*------------Get All users Branches-------------------*/

const getAllUserBranches = async (req, res) => {
  try {
    const result = await userBranchService.getAllUserBranches();

    return successResponse(res, result, "User branches fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*------------Get single users Branches-------------------*/

const getUserBranches = async (req, res) => {
  try {
    const result = await userBranchService.getUserBranches(req.params.user_id);

    return successResponse(res, result, "User branch fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*----------------Delete users Branches-------------------*/
const deleteUserBranch = async (req, res) => {
  try {
    const data = await userBranchService.deleteUserBranch(
      req.params.user_branch_id,
    );

    return successResponse(res, data, "User branch deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export default {
  assignUserBranch,
  getAllUserBranches,
  getUserBranches,
  deleteUserBranch,
};
