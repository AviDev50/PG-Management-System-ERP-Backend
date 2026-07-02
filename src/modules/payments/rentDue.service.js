import * as rentDueModel from "../payments/rentDue.model.js";

function toBillingMonth(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

// Access-scope resolution — matches checkBranchAccess middleware logic exactly
export async function resolveAccessibleBranchIds(user) {
  const { role, user_id, manager_id } = user;

  if (role === "admin") {
    return rentDueModel.getBranchIdsForAdmin(user_id);
  }

  if (role === "branch_manager") {
    if (!manager_id) return [];
    const branchId = await rentDueModel.getBranchIdForManager(manager_id);
    return branchId ? [branchId] : [];
  }

  // super_admin or any other role — out of scope for this module
  return [];
}

// Called when a tenant is created / bed assigned
export async function generateInitialDue(tenant) {
  const { tenant_id, branch_id, room_id, bed_id, accommodation_date } = tenant;

  const billing_month = toBillingMonth(accommodation_date);

  const existing = await rentDueModel.findRentDueByTenantAndMonth(tenant_id, billing_month);
  if (existing) return existing;

  const amount_due = await rentDueModel.getRoomMonthlyRent(room_id);
  if (amount_due === null) {
    throw { status: 400, message: "Room rent not found, cannot generate due" };
  }

  const rent_due_id = await rentDueModel.createRentDue({
    tenant_id,
    branch_id,
    room_id,
    bed_id,
    billing_month,
    amount_due,
  });

  return rentDueModel.getRentDueById(rent_due_id);
}

// Cron entry point — runs monthly on the 1st
export async function generateMonthlyDuesForAllTenants() {
  const tenants = await rentDueModel.getActiveTenantsForDueGeneration();
  const currentBillingMonth = toBillingMonth(new Date());

  let created = 0;
  let skipped = 0;

  for (const tenant of tenants) {
    const existing = await rentDueModel.findRentDueByTenantAndMonth(tenant.tenant_id, currentBillingMonth);

    if (existing) {
      skipped++;
      continue;
    }

    const latestDue = await rentDueModel.findLatestRentDueByTenant(tenant.tenant_id);
    const amount_due = latestDue ? latestDue.amount_due : null;

    if (amount_due === null) {
      skipped++;
      continue;
    }

    await rentDueModel.createRentDue({
      tenant_id: tenant.tenant_id,
      branch_id: tenant.branch_id,
      room_id: tenant.room_id,
      bed_id: tenant.bed_id,
      billing_month: currentBillingMonth,
      amount_due,
    });
    created++;
  }

  return { created, skipped, total: tenants.length };
}

// Admin/Manager — list rent dues within their accessible branches
export async function getRentDuesForUser(user, filters, limit, offset) {
  const accessibleBranchIds = await resolveAccessibleBranchIds(user);

  if (accessibleBranchIds.length === 0) {
    return [];
  }

  let branchIdsToQuery = accessibleBranchIds;

  if (filters.branch_id) {
    const requestedBranchId = Number(filters.branch_id);

    if (!accessibleBranchIds.includes(requestedBranchId)) {
      throw { status: 403, message: "You do not have access to this branch" };
    }

    branchIdsToQuery = [requestedBranchId];
  }

  return rentDueModel.listRentDuesByBranches(branchIdsToQuery, filters, limit, offset);
}

// Admin/Manager — list rent dues for a specific tenant (with branch ownership check)
export async function getRentDuesForTenantByStaff(tenant_id, tenantBranchId, user) {
  const branchIds = await resolveAccessibleBranchIds(user);

  if (!branchIds.includes(tenantBranchId)) {
    throw { status: 403, message: "You do not have access to this tenant's branch" };
  }

  return rentDueModel.listRentDuesByTenant(tenant_id);
}

// Tenant — their own view
export async function getTenantOwnRentDues(tenant_id) {
  return rentDueModel.listRentDuesByTenant(tenant_id);
}

// Admin/Manager — mark a due as paid
export async function markDueAsPaid(rent_due_id, paymentData, user) {
  const due = await rentDueModel.getRentDueById(rent_due_id);
  if (!due) {
    throw { status: 404, message: "Rent due not found" };
  }

  const allowedBranchIds = await resolveAccessibleBranchIds(user);
  if (!allowedBranchIds.includes(due.branch_id)) {
    throw { status: 403, message: "You do not have access to this branch" };
  }

  if (due.status === "paid") {
    throw { status: 400, message: "This due is already marked as paid" };
  }

  const receipt_no = `RCPT-${Date.now()}`;

  const affectedRows = await rentDueModel.markRentDuePaid(rent_due_id, {
    ...paymentData,
    collected_by: user.user_id,
    receipt_no,
  });

  if (affectedRows === 0) {
    throw { status: 500, message: "Failed to mark due as paid" };
  }

  return rentDueModel.getRentDueById(rent_due_id);
}

// Tenant — fetch their own receipt (IDOR-safe: tenant_id must match)
export async function getReceiptForTenant(rent_due_id, tenant_id) {
  const due = await rentDueModel.getRentDueById(rent_due_id);

  if (!due || due.tenant_id !== tenant_id) {
    throw { status: 404, message: "Receipt not found" };
  }

  if (due.status !== "paid") {
    throw { status: 400, message: "Receipt not available for unpaid dues" };
  }

  return rentDueModel.getRentDueReceiptData(rent_due_id);
}