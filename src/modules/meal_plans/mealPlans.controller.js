import mealPlanService from "./mealPlans.service.js";

/*---------------- Create Meal Plan ----------------*/
export const createMealPlan = async (req, res) => {
  try {
    const result = await mealPlanService.createMealPlan(req.body);

    res.status(201).json({
      success: true,
      message: "Meal plan created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*---------------- Get Meal Plans ----------------*/
export const getMealPlans = async (req, res) => {
  try {
    const result = await mealPlanService.getMealPlans();

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

/*---------------- Get Single Meal Plan ----------------*/
export const getSingleMealPlan = async (req, res) => {
  try {
    const result = await mealPlanService.getSingleMealPlan(req.params.id);

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

/*---------------- Today's Meal Plan ----------------*/
export const getTodayMealPlan = async (req, res) => {
  try {
    const result = await mealPlanService.getTodayMealPlan(req.params.branch_id);

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

/*---------------- Update Meal Plan ----------------*/
export const updateMealPlan = async (req, res) => {
  try {
    const result = await mealPlanService.updateMealPlan(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Meal plan updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*---------------- Delete Meal Plan ----------------*/
export const deleteMealPlan = async (req, res) => {
  try {
    await mealPlanService.deleteMealPlan(req.params.id);

    res.status(200).json({
      success: true,
      message: "Meal plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
