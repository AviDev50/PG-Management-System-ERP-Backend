import express from "express";
import dashboardController from "./dashboard.controller.js";
import {checkBranchAccess} from "../../common/middlewares/checkBranchAccess.middleware.js";

const router = express.Router();

/* ======================================================
   Dashboard Statistics APIs
====================================================== */

// Get Overall Dashboard Stats
router.get("/stats", dashboardController.getDashboardStats);

// Get Monthly Revenue Analytics
router.get("/monthly-revenue", dashboardController.getMonthlyRevenue);

// Get Occupancy Statistics
router.get("/occupancy-stats", dashboardController.getOccupancyStats);

// Get Recent Payments
router.get("/recent-payments", dashboardController.getRecentPayments);

// Get Recent Tenants
router.get("/recent-tenants", dashboardController.getRecentTenants);

// Get Branch Analytics
router.get("/branch-analytics", dashboardController.getBranchAnalytics);

export default router;