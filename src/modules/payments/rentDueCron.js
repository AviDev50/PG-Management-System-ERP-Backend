import cron from "node-cron";
import * as rentDueService from "../payments/rentDue.service.js";

// Runs at 12:05 AM on the 1st of every month
export function startRentDueCron() {
  cron.schedule("5 0 1 * *", async () => {
    try {
      const result = await rentDueService.generateMonthlyDuesForAllTenants();
      console.log(`[RentDueCron] Created: ${result.created}, Skipped: ${result.skipped}, Total: ${result.total}`);
    } catch (error) {
      console.error("[RentDueCron] Failed:", error.message);
    }
  });
}