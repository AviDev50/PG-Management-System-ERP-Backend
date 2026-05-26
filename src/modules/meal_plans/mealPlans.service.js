import mealPlanModel from "./mealPlans.model.js";

const createMealPlan = async (body) => {
  return await mealPlanModel.createMealPlan(body);
};

const getMealPlans = async () => {
  return await mealPlanModel.getMealPlans();
};

const getSingleMealPlan = async (id) => {
  return await mealPlanModel.getSingleMealPlan(id);
};

const getTodayMealPlan = async (branch_id) => {
  return await mealPlanModel.getTodayMealPlan(branch_id);
};

const updateMealPlan = async (id, body) => {
  return await mealPlanModel.updateMealPlan(id, body);
};

const deleteMealPlan = async (id) => {
  return await mealPlanModel.deleteMealPlan(id);
};

export default {
  createMealPlan,
  getMealPlans,
  getSingleMealPlan,
  getTodayMealPlan,
  updateMealPlan,
  deleteMealPlan,
};
