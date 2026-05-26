import userBranchService from "./userBranches.service.js";

/*---------assign branch to manager-----------*/

const assignUserBranch = async (req, res) => {
  try {
    const result = await userBranchService.assignUserBranch(req.body);

    res.status(201).json({
      success: true,
      message: "User assigned to branch successfully",
      data: result,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "User already assigned to this branch",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*------------Get All users Branches-------------------*/
const getAllUserBranches = async (req, res) => {
  try {
    const result = await userBranchService.getAllUserBranches();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*------------Get single  users Branches-------------------*/

const getUserBranches = async (req, res) => {
  try {
    const result = await userBranchService.getUserBranches(req.params.user_id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*----------------Delete users Branches-------------------*/

const deleteUserBranch = async (req, res) => {
  try {
    await userBranchService.deleteUserBranch(req.params.id);

    res.status(200).json({
      success: true,
      message: "User branch deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  assignUserBranch,
  getAllUserBranches,
  getUserBranches,
  deleteUserBranch,
};
