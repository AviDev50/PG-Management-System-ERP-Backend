import db from "../../common/config/db.js";

// Create a new rent due record
export async function createRentDue(data) {
  const { tenant_id, branch_id, room_id, bed_id, billing_month, amount_due, status = "pending" } = data;

  const [result] = await db.execute(
    `INSERT INTO rent_dues 
      (tenant_id, branch_id, room_id, bed_id, billing_month, amount_due, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [tenant_id, branch_id, room_id, bed_id, billing_month, amount_due, status]
  );

  return result.insertId;
}

// Check if a due already exists for tenant + month (idempotency)
export async function findRentDueByTenantAndMonth(tenant_id, billing_month) {
  const [rows] = await db.execute(
    `SELECT * FROM rent_dues WHERE tenant_id = ? AND billing_month = ? AND deleted_at IS NULL`,
    [tenant_id, billing_month]
  );
  return rows[0] || null;
}

// Most recent due for a tenant (used to copy amount_due forward each month)
export async function findLatestRentDueByTenant(tenant_id) {
  const [rows] = await db.execute(
    `SELECT * FROM rent_dues 
     WHERE tenant_id = ? AND deleted_at IS NULL 
     ORDER BY billing_month DESC LIMIT 1`,
    [tenant_id]
  );
  return rows[0] || null;
}

export async function getRentDueById(rent_due_id) {
  const [rows] = await db.execute(
    `SELECT * FROM rent_dues WHERE rent_due_id = ? AND deleted_at IS NULL`,
    [rent_due_id]
  );
  return rows[0] || null;
}

// All active tenants eligible for monthly due generation (cron uses this)
export async function getActiveTenantsForDueGeneration() {
  const [rows] = await db.execute(
    `SELECT tenant_id, branch_id, room_id, bed_id 
     FROM tenants 
     WHERE status = 'active' AND deleted_at IS NULL`
  );
  return rows;
}

// Get room's current monthly rent (used only at initial due creation)
export async function getRoomMonthlyRent(room_id) {
  const [rows] = await db.execute(
    `SELECT room_monthly_rent FROM rooms WHERE room_id = ? AND deleted_at IS NULL`,
    [room_id]
  );
  return rows[0] ? rows[0].room_monthly_rent : null;
}

// Admin's accessible branches — via user_branches (matches checkBranchAccess logic)
export async function getBranchIdsForAdmin(user_id) {
  const [rows] = await db.query(
    `SELECT branch_id FROM user_branches WHERE user_id = ?`,
    [user_id]
  );
  return rows.map((r) => r.branch_id);
}

// Branch manager's single branch — via managers table (matches checkBranchAccess logic)
export async function getBranchIdForManager(manager_id) {
  const [rows] = await db.query(
    `SELECT branch_id FROM managers WHERE manager_id = ? LIMIT 1`,
    [manager_id]
  );
  return rows[0] ? rows[0].branch_id : null;
}

// List rent dues for given branch_id(s) with optional filters, paginated
export async function listRentDuesByBranches(branchIds, filters = {}, limit = 20, offset = 0) {
  const { status, billing_month } = filters;

  let query = `
    SELECT rd.*, t.first_name, t.last_name, r.name AS room_name, bd.label AS bed_label
    FROM rent_dues rd
    JOIN tenants t ON t.tenant_id = rd.tenant_id
    JOIN rooms r ON r.room_id = rd.room_id
    JOIN beds bd ON bd.bed_id = rd.bed_id
    WHERE rd.branch_id IN (${branchIds.map(() => "?").join(",")})
      AND rd.deleted_at IS NULL
  `;
  const params = [...branchIds];

  if (status) {
    query += ` AND rd.status = ?`;
    params.push(status);
  }
  if (billing_month) {
    query += ` AND rd.billing_month = ?`;
    params.push(billing_month);
  }

  query += ` ORDER BY rd.billing_month DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

  const [rows] = await db.execute(query, params);
  return rows;
}

// List rent dues for a single tenant (admin/manager tenant-detail view)
export async function listRentDuesByTenant(tenant_id) {
  const [rows] = await db.execute(
    `SELECT rd.*, r.name AS room_name, bd.label AS bed_label
     FROM rent_dues rd
     JOIN rooms r ON r.room_id = rd.room_id
     JOIN beds bd ON bd.bed_id = rd.bed_id
     WHERE rd.tenant_id = ? AND rd.deleted_at IS NULL 
     ORDER BY rd.billing_month DESC`,
    [tenant_id]
  );
  return rows;
}

// Mark a due as paid
export async function markRentDuePaid(rent_due_id, paymentData) {
  const { payment_mode, payment_date, transaction_ref, receipt_no, collected_by, notes } = paymentData;

  const [result] = await db.execute(
    `UPDATE rent_dues 
     SET status = 'paid', payment_mode = ?, payment_date = ?, 
         transaction_ref = ?, receipt_no = ?, collected_by = ?, notes = ?
     WHERE rent_due_id = ? AND deleted_at IS NULL`,
    [payment_mode, payment_date, transaction_ref || null, receipt_no, collected_by, notes || null, rent_due_id]
  );

  return result.affectedRows;
}

// Full receipt data — joined with tenant, branch, room, bed, collected_by user
export async function getRentDueReceiptData(rent_due_id) {
  const [rows] = await db.execute(
    `SELECT 
       rd.rent_due_id, rd.billing_month, rd.amount_due, rd.status,
       rd.payment_mode, rd.payment_date, rd.transaction_ref, rd.receipt_no, rd.notes,
       t.first_name, t.last_name, t.phone,
       br.name AS branch_name, br.address AS branch_address, br.city, br.state,
       r.name AS room_name, bd.label AS bed_label,
       u.name AS collected_by_name
     FROM rent_dues rd
     JOIN tenants t ON t.tenant_id = rd.tenant_id
     JOIN branches br ON br.branch_id = rd.branch_id
     JOIN rooms r ON r.room_id = rd.room_id
     JOIN beds bd ON bd.bed_id = rd.bed_id
     LEFT JOIN users u ON u.user_id = rd.collected_by
     WHERE rd.rent_due_id = ? AND rd.deleted_at IS NULL`,
    [rent_due_id]
  );
  return rows[0] || null;
}