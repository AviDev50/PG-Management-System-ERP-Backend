import userBranchModel from "./userBranches.model.js";

/*---------Assign User Branch-----------*/

const assignUserBranch = async (body) => {
  const { user_id, branch_id } = body;

  return await userBranchModel.assignUserBranch(user_id, branch_id);
};

/*---------Get All User Branches-----------*/

const getAllUserBranches = async () => {
  return await userBranchModel.getAllUserBranches();
};

/*---------Get User Branches-----------*/

const getUserBranches = async (user_id) => {
  return await userBranchModel.getUserBranches(user_id);
};

/*---------Delete User Branch-----------*/

const deleteUserBranch = async (id) => {
  return await userBranchModel.deleteUserBranch(id);
};

export default {
  assignUserBranch,
  getAllUserBranches,
  getUserBranches,
  deleteUserBranch,
};
