import managerService from "./managers.service.js";

/*---------------- Create Manager ----------------*/
export const createManager = async (req, res) => {
  try {
    const result = await managerService.createManager(req.body);

    res.status(201).json({
      success: true,
      message: "Manager created successfully",
      data: result,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Manager already assigned to this branch",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*---------------- Get Managers ----------------*/
export const getManagers = async (req, res) => {
  try {
    const result = await managerService.getManagers();

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

/*---------------- Get Single Manager ----------------*/
export const getSingleManager = async (req, res) => {
  try {
    const result = await managerService.getSingleManager(req.params.id);

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

/*---------------- Update Manager ----------------*/
export const updateManager = async (req, res) => {
  try {
    const result = await managerService.updateManager(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Manager updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*---------------- Delete Manager ----------------*/
export const deleteManager = async (req, res) => {
  try {
    await managerService.deleteManager(req.params.id);

    res.status(200).json({
      success: true,
      message: "Manager deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*---------------- Get Manager Permissions ----------------*/
export const getManagerPermissions = async (req, res) => {
  try {
    const result = await managerService.getManagerPermissions(
      req.params.managerId,
    );

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

/*---------------- Update Manager Permissions ----------------*/
export const updateManagerPermissions = async (req, res) => {
  try {
    const result = await managerService.updateManagerPermissions(
      req.params.managerId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Permissions updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
