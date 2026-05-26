import express from "express";

import {
  createMealPlan,
  getMealPlans,
  getSingleMealPlan,
  getTodayMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "./mealPlans.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

/*---------------- Create Meal Plan ----------------*/
router.post("/create", verifyToken, allowRoles("admin"), createMealPlan);

/*---------------- Get Meal Plans ----------------*/
router.get("/", getMealPlans);

/*---------------- Get Today's Meal Plan(mean ye branch id ke current date ka meal return krega ) ----------------*/
router.get("/today/:branch_id",getTodayMealPlan,);

/*---------------- Get Single Meal Plan ----------------*/
router.get("/:id", getSingleMealPlan);

/*---------------- Update Meal Plan ----------------*/
router.put("/update/:id", verifyToken, allowRoles("admin"), updateMealPlan);

/*---------------- Delete Meal Plan ----------------*/
router.delete("/delete/:id", verifyToken, allowRoles("admin"), deleteMealPlan);

export default router;
