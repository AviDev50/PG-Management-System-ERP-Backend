// models/deviceToken.model.js
import db from "../../common/config/db.js"

export async function upsertDeviceTokenQuery({ ownerType, userId, tenantId, fcmToken, deviceType }) {
  const [result] = await db.execute(
    `INSERT INTO device_tokens (owner_type, user_id, tenant_id, fcm_token, device_type, is_active)
     VALUES (?, ?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE
       owner_type = VALUES(owner_type),
       user_id = VALUES(user_id),
       tenant_id = VALUES(tenant_id),
       device_type = VALUES(device_type),
       is_active = 1,
       updated_at = CURRENT_TIMESTAMP`,
    [ownerType, userId, tenantId, fcmToken, deviceType]
  );
  return result;
}

export async function getTokensByUserIdsQuery(userIds) {
  if (!userIds.length) return [];
  const placeholders = userIds.map(() => "?").join(",");
  const [rows] = await db.execute(
    `SELECT fcm_token FROM device_tokens 
     WHERE owner_type = 'staff' AND user_id IN (${placeholders}) AND is_active = 1`,
    userIds
  );
  return rows.map((r) => r.fcm_token);
}

export async function getTokensByTenantIdsQuery(tenantIds) {
  if (!tenantIds.length) return [];
  const placeholders = tenantIds.map(() => "?").join(",");
  const [rows] = await db.execute(
    `SELECT fcm_token FROM device_tokens 
     WHERE owner_type = 'tenant' AND tenant_id IN (${placeholders}) AND is_active = 1`,
    tenantIds
  );
  return rows.map((r) => r.fcm_token);
}

export async function deactivateTokenQuery(fcmToken) {
  const [result] = await db.execute(
    `UPDATE device_tokens SET is_active = 0 WHERE fcm_token = ?`,
    [fcmToken]
  );
  return result;
}