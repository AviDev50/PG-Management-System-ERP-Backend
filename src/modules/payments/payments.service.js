import {
  checkTenantOwnership,
  createPaymentQuery,
  getPaymentsQuery,
  getPaymentByIdQuery,
  updatePaymentQuery,
  deletePaymentQuery,
  getTenantPaymentHistoryQuery,
  getMonthlySummaryQuery,
} from "./payments.model.js";

/*===========================================================================
|
| CREATE PAYMENT.
===========================================================================*/

export const createPayment = async (payload, user) => {
  const {
    tenant_id,
    amount,
    payment_mode,
    payment_date,
    billing_month,
    status,
    transaction_ref,
    notes,
  } = payload;

  if (!tenant_id) {
    throw new Error("Tenant is required");
  }

  if (!amount) {
    throw new Error("Amount is required");
  }

  if (!payment_mode) {
    throw new Error("Payment mode is required");
  }

  const tenant = await checkTenantOwnership(tenant_id, user.user_id);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  const receipt_no = `RCPT-${Date.now()}`;

  const result = await createPaymentQuery({
    tenant_id,
    branch_id: tenant.branch_id,
    amount,
    payment_mode,
    payment_date,
    billing_month,
    status,
    receipt_no,
    collected_by: user.user_id,
    transaction_ref,
    notes,
  });

  return {
    payment_id: result.insertId,
    receipt_no,
  };
};

/*===========================================================================
|
| GET PAYMENTS
|
===========================================================================*/

export const getPayments = async (user, filters) => {
  return await getPaymentsQuery(user.user_id, filters);
};

/*===========================================================================
|
| GET PAYMENT BY ID
|
===========================================================================*/

export const getPaymentById = async (payment_id, user) => {
  const payment = await getPaymentByIdQuery(payment_id, user.user_id);

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

/*===========================================================================
|
| UPDATE PAYMENT
|
===========================================================================*/

export const updatePayment = async (
  payment_id,
  payload,
  user
) => {
  const payment = await getPaymentByIdQuery(
    payment_id,
    user.user_id
  );

  if (!payment) {
    throw new Error("Payment not found");
  }

  await updatePaymentQuery(
    payment_id,
    payload
  );

  const updatedPayment =
    await getPaymentByIdQuery(
      payment_id,
      user.user_id
    );

  return updatedPayment;
};

/*===========================================================================
|
| DELETE PAYMENT
|
===========================================================================*/

export const deletePayment = async (payment_id, user) => {
  const payment = await getPaymentByIdQuery(payment_id, user.user_id);

  if (!payment) {
    throw new Error("Payment not found");
  }

  await deletePaymentQuery(payment_id);

  return {
  payment_id,
  deleted: true,
};
};

/*===========================================================================
|
| GET TENANT PAYMENT HISTORY
|
| Fetches complete payment history for a tenant
|
===========================================================================*/

export const getTenantPaymentHistory = async (tenant_id, user) => {
  const tenant = await checkTenantOwnership(tenant_id, user.user_id);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return await getTenantPaymentHistoryQuery(tenant_id);
};


/*===========================================================================
|
| GET MONTHLY SUMMARY
|
===========================================================================*/

export const getMonthlySummary = async (
  user,
  filters
) => {
  return await getMonthlySummaryQuery(
    user.user_id,
    filters
  );
};