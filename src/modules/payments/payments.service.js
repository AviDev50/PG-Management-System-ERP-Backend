import {
  checkTenantOwnership,
  createPaymentQuery,
  getPaymentsQuery,
} from "./payments.model.js";

import { createNotificationService } from "../notifications/notifications.service.js";

/*===========================================================================
| CREATE PAYMENT
===========================================================================*/

export const createPayment = async (payload, user) => {
  const {
    tenant_id,
    branch_id,
    amount,
    payment_mode,
    payment_date,
    billing_month,
    status,
    transaction_ref,
    notes,
  } = payload;

  /*
  |--------------------------------------------------------------------------
  | CHECK TENANT OWNERSHIP
  |--------------------------------------------------------------------------
  | Ye function check karta hai ki logged-in admin
  | jis tenant par payment create kar raha hai,
  | kya wo tenant usi admin ka hai ya nahi.
  |--------------------------------------------------------------------------
  */

  const tenant = await checkTenantOwnership(tenant_id, user.user_id);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE PAYMENT
  |--------------------------------------------------------------------------
  */

  const result = await createPaymentQuery({
    tenant_id,
    branch_id,
    amount,
    payment_mode,
    payment_date,
    billing_month,
    status,
    transaction_ref,
    notes,
  });

  /*
  |--------------------------------------------------------------------------
  | NOTIFICATION :
  | PAYMENT RECEIVED
  |--------------------------------------------------------------------------
  */

  await createNotificationService({
    user_id: 1,
    type: "payment_received",
    title: "Payment Received",
    message: `Payment of ₹${amount} received successfully`,
    reference_id: result.insertId,
  });

  /*
  |--------------------------------------------------------------------------
  | NOTIFICATION :
  | RENT DUE
  |--------------------------------------------------------------------------
  | Agar payment pending ho to
  | rent due notification create hogi
  |--------------------------------------------------------------------------
  */

  if (status === "pending") {
    await createNotificationService({
      user_id: 1,
      type: "rent_due",
      title: "Rent Due",
      message: `Your rent of ₹${amount} is pending`,
      reference_id: result.insertId,
    });
  }

  return null;
};

/*===========================================================================

| GET PAYMENTS

===========================================================================*/

export const getPayments = async (user) => {
  return await getPaymentsQuery(user.user_id);
};
