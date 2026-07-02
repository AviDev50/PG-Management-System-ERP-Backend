import * as rentDueService from "../payments/rentDue.service.js";

export async function getMyRentDues(req, res) {
  try {
    const dues = await rentDueService.getTenantOwnRentDues(req.tenant.tenant_id);
    return res.status(200).json({ success: true, data: dues });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
}

export async function getMyReceipt(req, res) {
  try {
    const { rent_due_id } = req.params;
    const receipt = await rentDueService.getReceiptForTenant(Number(rent_due_id), req.tenant.tenant_id);
    return res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
}