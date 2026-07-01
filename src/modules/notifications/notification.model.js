// models/notification.model.js
import db from "../../common/config/db.js";

export async function createBatchQuery({ senderUserId, senderRole, targetType, scope, branchId, title, message, recipientCount }) {
  const [result] = await db.execute(
    `INSERT INTO notification_batches 
      (sender_user_id, sender_role, target_type, scope, branch_id, title, message, recipient_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [senderUserId, senderRole, targetType, scope, branchId, title, message, recipientCount]
  );
  return result.insertId;
}

export async function bulkInsertNotificationsQuery(rows) {
  if (!rows.length) return null;
  const values = rows.map((r) => [
    r.batchId,
    r.recipientType,
    r.userId,
    r.tenantId,
    r.type,
    r.title,
    r.message,
    r.referenceId,
  ]);

  const [result] = await db.query(
    `INSERT INTO notifications 
      (batch_id, recipient_type, user_id, tenant_id, type, title, message, reference_id)
     VALUES ?`,
    [values]
  );
  return result;
}

export async function getBranchManagersByBranchIdQuery(branchId) {
  const [rows] = await db.execute(
    `SELECT u.user_id, u.name 
     FROM managers m
     JOIN users u ON u.user_id = m.user_id
     WHERE m.branch_id = ? AND m.is_active = 1`,
    [branchId]
  );
  return rows;
}

export async function getManagerBranchIdQuery(userId) {
  const [rows] = await db.execute(
    `SELECT branch_id FROM managers WHERE user_id = ? AND is_active = 1 LIMIT 1`,
    [userId]
  );
  return rows.length ? rows[0].branch_id : null;
}

export async function getTenantsByBranchIdQuery(branchId) {
  const [rows] = await db.execute(
    `SELECT tenant_id, first_name, last_name FROM tenants 
     WHERE branch_id = ? AND status = 'active'`,
    [branchId]
  );
  return rows;
}

export async function getTenantBranchIdQuery(tenantId) {
  const [rows] = await db.execute(
    `SELECT branch_id FROM tenants WHERE tenant_id = ?`,
    [tenantId]
  );
  return rows.length ? rows[0].branch_id : null;
}

export async function getUserAllowedBranchIdsQuery(userId) {
  const [rows] = await db.execute(
    `SELECT branch_id FROM user_branches WHERE user_id = ?`,
    [userId]
  );
  return rows.map((r) => r.branch_id);
}

export async function getNotificationsForStaffQuery(userId, limit, offset) {
  const [rows] = await db.execute(
    `SELECT * FROM notifications 
     WHERE recipient_type = 'staff' AND user_id = ?
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  return rows;
}

export async function getNotificationsForTenantQuery(tenantId, limit, offset) {
  const [rows] = await db.execute(
    `SELECT * FROM notifications 
     WHERE recipient_type = 'tenant' AND tenant_id = ?
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [tenantId, limit, offset]
  );
  return rows;
}

export async function markAsReadQuery(notificationId, recipientType, recipientId) {
  const column = recipientType === "staff" ? "user_id" : "tenant_id";
  const [result] = await db.execute(
    `UPDATE notifications SET is_read = 1 
     WHERE notification_id = ? AND recipient_type = ? AND ${column} = ?`,
    [notificationId, recipientType, recipientId]
  );
  return result;
}

export async function deleteNotificationQuery(notificationId, recipientType, recipientId) {
  const column = recipientType === "staff" ? "user_id" : "tenant_id";
  const [result] = await db.execute(
    `DELETE FROM notifications 
     WHERE notification_id = ? AND recipient_type = ? AND ${column} = ?`,
    [notificationId, recipientType, recipientId]
  );
  return result;
}

export async function getSentNotificationBatchesQuery(senderUserId, limit, offset) {
  const [rows] = await db.execute(
    `SELECT 
      nb.batch_id,
      nb.target_type,
      nb.scope,
      nb.branch_id,
      nb.title,
      nb.message,
      nb.recipient_count,
      nb.created_at,
      b.name AS branch_name
     FROM notification_batches nb
     LEFT JOIN branches b ON b.branch_id = nb.branch_id
     WHERE nb.sender_user_id = ?
     ORDER BY nb.created_at DESC
     LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
    [senderUserId]  // sirf senderUserId placeholder mein, LIMIT/OFFSET interpolated
  );
  return rows;
}








//add when needed


// export async function getNotificationsForStaffQuery(userId, limit, offset) {
//   const [rows] = await db.execute(
//     `SELECT * FROM notifications 
//      WHERE recipient_type = 'staff' AND user_id = ?
//      ORDER BY created_at DESC
//      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
//     [userId]
//   );
//   return rows;
// }

// export async function getNotificationsForTenantQuery(tenantId, limit, offset) {
//   const [rows] = await db.execute(
//     `SELECT * FROM notifications 
//      WHERE recipient_type = 'tenant' AND tenant_id = ?
//      ORDER BY created_at DESC
//      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
//     [tenantId]
//   );
//   return rows;
// }