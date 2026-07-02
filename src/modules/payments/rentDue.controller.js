import { validationResult } from "express-validator";
import * as rentDueService from "../payments/rentDue.service.js";

export async function listRentDues(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { branch_id, status, billing_month, page = 1, pageSize = 20 } = req.query;
    const limit = Number(pageSize);
    const offset = (Number(page) - 1) * limit;

    const dues = await rentDueService.getRentDuesForUser(
      req.user,
      { branch_id, status, billing_month },
      limit,
      offset
    );

    return res.status(200).json({ success: true, data: dues });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
}

export async function listRentDuesForTenant(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { tenant_id, tenant_branch_id } = req.params;

    const dues = await rentDueService.getRentDuesForTenantByStaff(
      Number(tenant_id),
      Number(tenant_branch_id),
      req.user
    );

    return res.status(200).json({ success: true, data: dues });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
}

export async function markPaid(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { rent_due_id } = req.params;
    const { payment_mode, payment_date, transaction_ref, notes } = req.body;

    const updated = await rentDueService.markDueAsPaid(
      Number(rent_due_id),
      { payment_mode, payment_date, transaction_ref, notes },
      req.user
    );

    return res.status(200).json({ success: true, message: "Payment marked as paid", data: updated });
  } catch (error) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
}