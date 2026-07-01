import * as deviceTokenService from "../device_tokens/deviceToken.service.js";

export async function registerDeviceToken(req, res) {
  try {
    const { fcm_token, device_type } = req.body;
    const isTenant = req.user.role === "tenant";

    const result = await deviceTokenService.registerDeviceToken({
      ownerType: isTenant ? "tenant" : "staff",
      userId: isTenant ? null : req.user.user_id,
      tenantId: isTenant ? req.user.tenant_id : null,
      fcmToken: fcm_token,
      deviceType: device_type,
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Device token registered",
        data: result,
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
