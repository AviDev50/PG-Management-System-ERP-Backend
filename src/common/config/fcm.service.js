// services/fcm.service.js
import { messaging } from "../config/firebase.js";

export async function sendPushToTokens(tokens, title, body, data = {}) {
  if (!tokens || tokens.length === 0)
    return { successCount: 0, failureCount: 0 };

  const message = {
    notification: { title, body },
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)]),
    ),
    tokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    return response;
  } catch (err) {
    console.error("FCM send error:", err.message);
    return { successCount: 0, failureCount: tokens.length, error: err.message };
  }
}
