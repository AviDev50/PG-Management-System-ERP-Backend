import * as userBranchModel from "./userBranches.model.js";

/*===========================================================================
| ASSIGN USER BRANCH
===========================================================================*/

export async function assignUserBranch(payload) {
  const { user_id, branch_id } = payload;

  if (!user_id || !branch_id) {
    const error = new Error("user_id and branch_id are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userBranchModel.getUserByIdQuery(user_id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const branch = await userBranchModel.getBranchByIdQuery(branch_id);

  if (!branch) {
    const error = new Error("Branch not found");
    error.statusCode = 404;
    throw error;
  }

  return await userBranchModel.assignUserBranchQuery(user_id, branch_id);
}

/*===========================================================================
| GET ALL USER BRANCHES
===========================================================================*/

export async function getAllUserBranches() {
  return await userBranchModel.getAllUserBranchesQuery();
}

/*===========================================================================
| GET USER BRANCHES (single user)
===========================================================================*/

export async function getUserBranches(user_id) {
  return await userBranchModel.getUserBranchesQuery(user_id);
}

/*===========================================================================
| DELETE USER BRANCH
===========================================================================*/

export async function deleteUserBranch(user_branch_id) {
  const existing = await userBranchModel.getUserBranchByIdQuery(user_branch_id);

  if (!existing) {
    const error = new Error("User branch not found");
    error.statusCode = 404;
    throw error;
  }

  await userBranchModel.deleteUserBranchQuery(user_branch_id);

  return existing;
}