import {
  createNotificationService,
  getNotificationsService,
  markAsReadService,
  unreadCountService,
} from "./notifications.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";

/*------------------CREATE NOTIFICATION------------------*/

export const createNotification = async (req, res) => {
  try {
    const result = await createNotificationService(req.body);

    return successResponse(res, result, "Notification created", 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*------------------GET ALL NOTIFICATIONS------------------*/

export const getNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await getNotificationsService(user_id);

    return successResponse(res, result, "Notifications fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*------------------MARK AS READ------------------*/

export const markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;

    const result = await markAsReadService(notification_id);

    return successResponse(res, result, "Notification marked as read");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*------------------UNREAD COUNT------------------*/

export const unreadCount = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await unreadCountService(user_id);

    return successResponse(
      res,
      result,
      "Unread notification count fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
