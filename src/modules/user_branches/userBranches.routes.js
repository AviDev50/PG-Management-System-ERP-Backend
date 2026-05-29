import express from "express";

import userBranchController from "./userBranches.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";

import { allowRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

/*------------------Assign User Branch-------------*/
router.post(
  "/assign",
  verifyToken,
  allowRoles("admin"),
  userBranchController.assignUserBranch,
);

/*------------------Get All User Branches-------------*/
router.get(
  "/",
  verifyToken,
  allowRoles("admin"),
  userBranchController.getAllUserBranches,
);

/*------------------Get Single User Branches-------------*/
router.get(
  "/user/:user_id",
  verifyToken,
  allowRoles("admin"),
  userBranchController.getUserBranches,
);

/*------------------Delete User Branch  id-------------*/
router.delete(
  "/delete/:user_branch_id",
  verifyToken,
  allowRoles("admin"),
  userBranchController.deleteUserBranch,
);

export default router;
