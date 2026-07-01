// services/deviceToken.service.js
import * as deviceTokenModel from "../device_tokens/deviceToken.model.js";

export async function registerDeviceToken({
  ownerType,
  userId,
  tenantId,
  fcmToken,
  deviceType,
}) {
  return await deviceTokenModel.upsertDeviceTokenQuery({
    ownerType,
    userId: ownerType === "staff" ? userId : null,
    tenantId: ownerType === "tenant" ? tenantId : null,
    fcmToken,
    deviceType,
  });
}
