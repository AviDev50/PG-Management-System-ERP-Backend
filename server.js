import express from "express";
import dotenv from "dotenv";
import cors from "cors";

/*------------ ROUTES------------------*/

import authRoutes from "./src/modules/auth/auth.routes.js";
import adminRoutes from "./src/modules/admin/admin.routes.js";
import pgRoutes from "./src/modules/pg/pg.routes.js";
import branchesRoutes from "./src/modules/branches/branches.routes.js";
import roomsRoutes from "./src/modules/rooms/rooms.routes.js";
import bedsRoutes from "./src/modules/beds/bed.routes.js";
import tenantsRoutes from "./src/modules/tenants/tenants.routes.js";
import paymentsRoutes from "./src/modules/payments/payments.routes.js";
import expensesRoutes from "./src/modules/expenses/expenses.routes.js";
import complaintsRoutes from "./src/modules/complaints/complaints.routes.js";
import transfersRoutes from "./src/modules/transfers/transfers.routes.js";
import amenitiesRoutes from "./src/modules/amenities/amenities.routes.js";
import electricityRoutes from "./src/modules/electricity/electricity.routes.js";
import dashboardRoutes from "./src/modules/dashboard/dashboard.routes.js";
import userBranchesRoutes from "./src/modules/user_branches/userBranches.routes.js";
import managersRoutes from "./src/modules/managers/managers.routes.js";
import mealPlansRoutes from "./src/modules/meal_plans/mealPlans.routes.js";
import reportsRoutes from "./src/modules/reports/reports.routes.js";
import notificationRoutes from "./src/modules/notifications/notifications.routes.js";

import complaintCategoryRoutes from "./src/modules/complaintCategory/complaintCategory.routes.js";

dotenv.config();
const app = express();

/*-----------Middlware--------------*/
app.use(cors());
app.use(express.json());

/*------------ ROUTES------------------*/
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pg", pgRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/beds", bedsRoutes);
app.use("/api/tenants", tenantsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/transfers", transfersRoutes);
app.use("/api/amenities", amenitiesRoutes);
app.use("/api/electricity", electricityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user-branches", userBranchesRoutes);
app.use("/api/managers", managersRoutes);
app.use("/api/meal-plans", mealPlansRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/notifications", notificationRoutes);  
app.use("/api/complaint-categories", complaintCategoryRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
