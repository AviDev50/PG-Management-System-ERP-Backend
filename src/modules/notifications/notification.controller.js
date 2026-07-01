// controllers/notification.controller.js
import * as notificationService from "../notifications/notification.service.js";

export async function sendNotification(req, res) {
  try {
    const { target_type, scope, branch_id, recipient_id, title, message } = req.body;

    const result = await notificationService.sendNotification({
      senderUserId: req.user.user_id,
      senderRole: req.user.role,
      branchId: branch_id,
      targetType: target_type,
      scope,
      recipientId: recipient_id,
      title,
      message,
    });

    return res.status(201).json({ success: true, message: "Notification sent", data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

export async function getMyNotifications(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const isTenant = req.user.role === "tenant";

    const data = await notificationService.getMyNotifications({
      role: req.user.role,
      userId: isTenant ? null : req.user.user_id,
      tenantId: isTenant ? req.user.tenant_id : null,
      page,
      limit,
    });

    return res.status(200).json({ success: true, data, page, limit });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const isTenant = req.user.role === "tenant";
    const result = await notificationService.markNotificationAsRead({
      notificationId: req.params.id,
      role: req.user.role,
      userId: isTenant ? null : req.user.user_id,
      tenantId: isTenant ? req.user.tenant_id : null,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteMyNotification(req, res) {
  try {
    const isTenant = req.user.role === "tenant";
    const result = await notificationService.deleteMyNotification({
      notificationId: req.params.id,
      role: req.user.role,
      userId: isTenant ? null : req.user.user_id,
      tenantId: isTenant ? req.user.tenant_id : null,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getSentNotifications(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const data = await notificationService.getSentNotifications({
      senderUserId: req.user.user_id,
      page,
      limit,
    });

    return res.status(200).json({ success: true, data, page, limit });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}