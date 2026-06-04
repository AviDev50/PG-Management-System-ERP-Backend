import express from "express";

import {
  createMealPlan,
  getMealPlans,
  getSingleMealPlan,
  getMealPlansByBranch,
  updateMealPlan,
  deleteMealPlan,
} from "./mealPlans.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

/*-----------Create Meal----------*/

router.post("/create", verifyToken, allowRoles("admin"), createMealPlan);

/*-----------Get All Meal----------*/

router.get("/", getMealPlans);

/*-----------Get Meal By Branch Id ----------*/

router.get("/branch/:branch_id", getMealPlansByBranch);

/*-----------Get Single Meal ----------*/

router.get("/:id", getSingleMealPlan);

/*-----------Update Meal----------*/

router.put(
  "/update/:meal_plan_id",
  verifyToken,
  allowRoles("admin"),
  updateMealPlan,
);

/*-----------Delete Meal----------*/

router.delete(
  "/delete/:meal_plan_id",
  verifyToken,
  allowRoles("admin"),
  deleteMealPlan,
);

export default router;
