import mealPlanModel from "./mealPlans.model.js";

/*------Create Meal---------*/

const createMealPlan = async (body) => {
  return await mealPlanModel.createMealPlan(body);
};

/*------Get All Meal---------*/

const getMealPlans = async () => {
  return await mealPlanModel.getMealPlans();
};

/*------Get Single Meal---------*/

const getSingleMealPlan = async (id) => {
  return await mealPlanModel.getSingleMealPlan(id);
};

/*----------get meal plan by branch id-----------*/

const getMealPlansByBranch = async (branch_id) => {
  return await mealPlanModel.getMealPlansByBranch(branch_id);
};

/*-----------update Meal Plan------------*/

const updateMealPlan = async (meal_plan_id, body) => {
  return await mealPlanModel.updateMealPlan(meal_plan_id, body);
};

/*-----Delete Meal Plan---------*/
const deleteMealPlan = async (meal_plan_id) => {
  return await mealPlanModel.deleteMealPlan(meal_plan_id);
};

export default {
  createMealPlan,
  getMealPlans,
  getSingleMealPlan,
  getMealPlansByBranch,
  updateMealPlan,
  deleteMealPlan,
};
