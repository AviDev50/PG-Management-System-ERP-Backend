import mealPlanService from "./mealPlans.service.js";

/*---------------- Create Meal Plan ----------------*/

export const createMealPlan = async (req, res) => {
  try {
    const result = await mealPlanService.createMealPlan(req.body);

    return res.status(201).json({
      success: true,
      message: "Meal plan created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*---------------- Get All Meal Plans ----------------*/
export const getMealPlans = async (req, res) => {
  try {
    const result = await mealPlanService.getMealPlans();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*---------------- Get Single Meal Plan ----------------*/
export const getSingleMealPlan = async (req, res) => {
  try {
    const result = await mealPlanService.getSingleMealPlan(req.params.id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-----------get meal plain by branch id-------------*/

export const getMealPlansByBranch = async (req, res) => {
  try {
    const result = await mealPlanService.getMealPlansByBranch(
      req.params.branch_id,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------Update Meal Plan-----------*/
export const updateMealPlan = async (req, res) => {
  try {
    const result = await mealPlanService.updateMealPlan(
      req.params.meal_plan_id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Meal plan updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*----------Delete Meal Plan-----------*/
export const deleteMealPlan = async (req, res) => {
  try {
    await mealPlanService.deleteMealPlan(
      req.params.meal_plan_id,
    );

    return res.status(200).json({
      success: true,
      message: "Meal plan deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};