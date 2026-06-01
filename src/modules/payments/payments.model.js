import db from "../../common/config/db.js";

/*===========================================================================
|
| CHECK TENANT OWNERSHIP
|
| Verifies that the requested tenant belongs to the logged-in admin.
| Prevents access to tenants from other properties.
|
===========================================================================*/

export const checkTenantOwnership = async (tenant_id, user_id) => {
  const query = `
    SELECT
      tenants.*,
      branches.branch_id

    FROM tenants

    JOIN beds
      ON beds.bed_id = tenants.bed_id

    JOIN rooms
      ON rooms.room_id = beds.room_id

    JOIN branches
      ON branches.branch_id = rooms.branch_id

    JOIN properties
      ON properties.property_id = branches.property_id

    WHERE tenants.tenant_id = ?
    AND properties.user_id = ?

    LIMIT 1
  `;

  const [results] = await db.query(query, [tenant_id, user_id]);

  return results[0];
};

/*--------------Create Payment-----------*/

export const createPaymentQuery = async (data) => {
  const query = `
    INSERT INTO payments
    (
      tenant_id,
      branch_id,
      amount,
      payment_mode,
      payment_date,
      billing_month,
      status,
      receipt_no,
      collected_by,
      transaction_ref,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    data.tenant_id,
    data.branch_id,
    data.amount,
    data.payment_mode,
    data.payment_date,
    data.billing_month,
    data.status,
    data.receipt_no,
    data.collected_by,
    data.transaction_ref,
    data.notes,
  ]);

  return result;
};

/*===========================================================================
|
| GET PAYMENTS QUERY
|
| Fetches all payments belonging to the logged-in admin.
| Supports filtering by tenant, branch, status,
| payment mode and billing month.
|
===========================================================================*/

export const getPaymentsQuery = async (user_id, filters = {}) => {
  const { tenant_id, branch_id, status, payment_mode, month } = filters;

  let query = `
 SELECT
  payments.*,
  CONCAT(
    tenants.first_name,
    ' ',
    tenants.last_name
  ) AS tenant_name,
  tenants.phone,
  branches.name AS branch_name

    FROM payments

    JOIN tenants
      ON tenants.tenant_id = payments.tenant_id

    JOIN branches
      ON branches.branch_id = payments.branch_id

    JOIN properties
      ON properties.property_id = branches.property_id

    WHERE properties.user_id = ?
    AND payments.deleted_at IS NULL
  `;

  const params = [user_id];

  /*--------------Filters-----------*/

  if (tenant_id) {
    query += ` AND payments.tenant_id = ?`;
    params.push(tenant_id);
  }

  if (branch_id) {
    query += ` AND payments.branch_id = ?`;
    params.push(branch_id);
  }

  if (status) {
    query += ` AND payments.status = ?`;
    params.push(status);
  }

  if (payment_mode) {
    query += ` AND payments.payment_mode = ?`;
    params.push(payment_mode);
  }

  if (month) {
    query += ` AND DATE_FORMAT(payments.billing_month,'%Y-%m') = ?`;
    params.push(month);
  }

  query += ` ORDER BY payments.payment_id DESC`;

  const [results] = await db.query(query, params);

  return results;
};

/*===========================================================================
|
| GET PAYMENT BY ID QUERY
|
| Fetches a single payment record with tenant
| and branch details while ensuring ownership.
|
===========================================================================*/

export const getPaymentByIdQuery = async (payment_id, user_id) => {
  const query = `
   SELECT
  payments.*,
  CONCAT(
    tenants.first_name,
    ' ',
    tenants.last_name
  ) AS tenant_name,
  tenants.phone,
  branches.name AS branch_name

    FROM payments

    JOIN tenants
      ON tenants.tenant_id = payments.tenant_id

    JOIN branches
      ON branches.branch_id = payments.branch_id

    JOIN properties
      ON properties.property_id = branches.property_id

    WHERE payments.payment_id = ?
    AND properties.user_id = ?
    AND payments.deleted_at IS NULL

    LIMIT 1
  `;

  const [results] = await db.query(query, [payment_id, user_id]);

  return results[0];
};

/*===========================================================================
|
| UPDATE PAYMENT QUERY
|
===========================================================================*/

export const updatePaymentQuery = async (payment_id, payload) => {
  const fields = [];
  const values = [];

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (!fields.length) {
    return null;
  }

  values.push(payment_id);

  const query = `
    UPDATE payments
    SET
      ${fields.join(", ")},
      updated_at = NOW()

    WHERE payment_id = ?
  `;

  const [result] = await db.query(query, values);

  return result;
};

/*===========================================================================
|
| SOFT DELETE PAYMENT QUERY
|
===========================================================================*/

export const deletePaymentQuery = async (payment_id) => {
  const query = `
    UPDATE payments

    SET deleted_at = NOW()

    WHERE payment_id = ?
  `;

  const [result] = await db.query(query, [payment_id]);

  return result;
};

/*===========================================================================
|
| GET TENANT PAYMENT HISTORY QUERY
|
===========================================================================*/

export const getTenantPaymentHistoryQuery = async (tenant_id) => {
  const query = `
      SELECT
        payment_id,
        amount,
        payment_mode,
        payment_date,
        billing_month,
        status,
        receipt_no,
        transaction_ref,
        notes,
        created_at

      FROM payments

      WHERE tenant_id = ?
      AND deleted_at IS NULL

      ORDER BY payment_date DESC
    `;

  const [results] = await db.query(query, [tenant_id]);

  return results;
};

/*===========================================================================
|
| GET MONTHLY SUMMARY QUERY
|
| Returns:
| - Total Collection
| - Pending Dues
| - Overdue Tenants
|
===========================================================================*/

export const getMonthlySummaryQuery = async (user_id, filters = {}) => {
  const { branch_id, month } = filters;

  let query = `
    SELECT

      COALESCE(
        SUM(
          CASE
            WHEN payments.status = 'paid'
            THEN payments.amount
            ELSE 0
          END
        ),
        0
      ) AS total_collection,

      COALESCE(
        SUM(
          CASE
            WHEN payments.status = 'pending'
            THEN payments.amount
            ELSE 0
          END
        ),
        0
      ) AS pending_dues,

      COUNT(
        DISTINCT CASE
          WHEN payments.status = 'pending'
          THEN payments.tenant_id
        END
      ) AS overdue_tenants

    FROM payments

    JOIN branches
      ON branches.branch_id = payments.branch_id

    JOIN properties
      ON properties.property_id = branches.property_id

    WHERE properties.user_id = ?
    AND payments.deleted_at IS NULL
  `;

  const params = [user_id];

  if (branch_id) {
    query += ` AND payments.branch_id = ?`;
    params.push(branch_id);
  }

  if (month) {
    query += `
      AND DATE_FORMAT(
        payments.billing_month,
        '%Y-%m'
      ) = ?
    `;
    params.push(month);
  }

  const [results] = await db.query(query, params);

  return results[0];
};
