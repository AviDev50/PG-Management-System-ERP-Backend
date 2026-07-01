// services/notification.service.js
import * as notificationModel from "../notifications/notification.model.js";
import * as deviceTokenModel from "../device_tokens/deviceToken.model.js";
import { sendPushToTokens } from "./../../common/config/fcm.service.js";

export async function sendNotification({ senderUserId, senderRole, branchId, targetType, scope, recipientId, title, message }) {
  // Step 1: Validate sender's branch access
  if (senderRole !== "super_admin") {
    const allowedBranches = await notificationModel.getUserAllowedBranchIdsQuery(senderUserId);
    if (!allowedBranches.includes(branchId)) {
      throw new Error("Access denied: branch not assigned to this user");
    }
  }

  // Step 2: Block branch_manager -> branch_manager
  if (senderRole === "branch_manager" && targetType === "branch_manager") {
    throw new Error("Branch managers cannot send notifications to other managers");
  }

  // Step 3: If branch_manager, force branch_id to their own branch
  if (senderRole === "branch_manager") {
    const managerBranchId = await notificationModel.getManagerBranchIdQuery(senderUserId);
    if (managerBranchId !== branchId) {
      throw new Error("Access denied: not your branch");
    }
  }

  // Step 4: Resolve recipients
  let recipients = [];
  const recipientType = targetType === "branch_manager" ? "staff" : "tenant";

  if (scope === "all") {
    if (targetType === "branch_manager") {
      recipients = await notificationModel.getBranchManagersByBranchIdQuery(branchId);
      recipients = recipients.map((r) => ({ id: r.user_id }));
    } else {
      recipients = await notificationModel.getTenantsByBranchIdQuery(branchId);
      recipients = recipients.map((r) => ({ id: r.tenant_id }));
    }
  } else {
    // specific
    if (!recipientId) throw new Error("recipientId required for specific scope");

    if (targetType === "tenant") {
      const tenantBranchId = await notificationModel.getTenantBranchIdQuery(recipientId);
      if (tenantBranchId !== branchId) {
        throw new Error("Access denied: tenant does not belong to this branch");
      }
    } else {
      const managers = await notificationModel.getBranchManagersByBranchIdQuery(branchId);
      const valid = managers.some((m) => m.user_id === recipientId);
      if (!valid) {
        throw new Error("Access denied: manager does not belong to this branch");
      }
    }
    recipients = [{ id: recipientId }];
  }

  if (recipients.length === 0) {
    throw new Error("No recipients found for this scope");
  }

  // Step 5: Create batch
  const batchId = await notificationModel.createBatchQuery({
    senderUserId,
    senderRole,
    targetType,
    scope,
    branchId,
    title,
    message,
    recipientCount: recipients.length,
  });

  // Step 6: Bulk insert notifications
  const rows = recipients.map((r) => ({
    batchId,
    recipientType,
    userId: recipientType === "staff" ? r.id : null,
    tenantId: recipientType === "tenant" ? r.id : null,
    type: "custom_message",
    title,
    message,
    referenceId: null,
  }));

  await notificationModel.bulkInsertNotificationsQuery(rows);

  // Step 7: Push notification (fire and forget — don't block response on FCM)
  const recipientIds = recipients.map((r) => r.id);
  const tokens =
    recipientType === "staff"
      ? await deviceTokenModel.getTokensByUserIdsQuery(recipientIds)
      : await deviceTokenModel.getTokensByTenantIdsQuery(recipientIds);

  sendPushToTokens(tokens, title, message, { batchId }).catch((err) =>
    console.error("Push notification failed:", err.message)
  );

  return { batchId, recipientCount: recipients.length };
}

export async function getMyNotifications({ role, userId, tenantId, page, limit }) {
  const offset = (page - 1) * limit;
  if (role === "tenant") {
    return await notificationModel.getNotificationsForTenantQuery(tenantId, limit, offset);
  }
  return await notificationModel.getNotificationsForStaffQuery(userId, limit, offset);
}

export async function markNotificationAsRead({ notificationId, role, userId, tenantId }) {
  const recipientType = role === "tenant" ? "tenant" : "staff";
  const recipientId = role === "tenant" ? tenantId : userId;
  return await notificationModel.markAsReadQuery(notificationId, recipientType, recipientId);
}

export async function deleteMyNotification({ notificationId, role, userId, tenantId }) {
  const recipientType = role === "tenant" ? "tenant" : "staff";
  const recipientId = role === "tenant" ? tenantId : userId;
  return await notificationModel.deleteNotificationQuery(notificationId, recipientType, recipientId);
}

export async function getSentNotifications({ senderUserId, page, limit }) {
  const offset = (page - 1) * limit;
  return await notificationModel.getSentNotificationBatchesQuery(senderUserId, limit, offset);
}