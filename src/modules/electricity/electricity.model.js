import db from "../../common/config/db.js";

/*===========================================================================
| ADD ELECTRICITY READING
===========================================================================*/
export const createElectricityReading = async (data) => {
  const sql = `
    INSERT INTO electricity_readings
    (
      branch_id,
      room_id,
      start_reading,
      end_reading,
      unit_price,
      bill_month
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.branch_id,
    data.room_id,
    data.start_reading,
    data.end_reading,
    data.unit_price,
    data.bill_month,
  ];

  const [result] = await db.query(sql, values);

  return {
    reading_id: result.insertId,
    ...data,
  };
};

/*===========================================================================
| GET ALL ELECTRICITY READINGS
===========================================================================*/
export const getElectricityReadingsModel = async (filters) => {
  let sql = `
    SELECT
      er.*,
      r.room_number
    FROM electricity_readings er
    LEFT JOIN rooms r
      ON r.room_id = er.room_id
    WHERE er.deleted_at IS NULL
  `;

  const values = [];

  if (filters.branch_id) {
    sql += ` AND er.branch_id = ?`;
    values.push(filters.branch_id);
  }

  if (filters.room_id) {
    sql += ` AND er.room_id = ?`;
    values.push(filters.room_id);
  }

  if (filters.bill_month) {
    sql += ` AND er.bill_month = ?`;
    values.push(filters.bill_month);
  }

  if (filters.start_date) {
    sql += ` AND DATE(er.created_at) >= ?`;
    values.push(filters.start_date);
  }

  if (filters.end_date) {
    sql += ` AND DATE(er.created_at) <= ?`;
    values.push(filters.end_date);
  }

  sql += ` ORDER BY er.reading_id DESC`;

  const [rows] = await db.query(sql, values);

  return rows;
};

/*===========================================================================
|
| GENERATE TENANT ELECTRICITY BILLS
|
| Flow:
| 1. Fetch electricity reading
| 2. Fetch active tenants of the room
| 3. Split room bill equally
| 4. Create tenant bills
| 5. Skip duplicate bills
|
===========================================================================*/
export const generateTenantBillsModel = async (reading_id) => {
  /*---------------------------------------------------------
  | GET READING
  ---------------------------------------------------------*/
  const [readingRows] = await db.query(
    `
    SELECT *
    FROM electricity_readings
    WHERE reading_id = ?
    AND deleted_at IS NULL
    `,
    [reading_id]
  );

  const reading = readingRows[0];

  if (!reading) {
    throw new Error("Reading not found");
  }

  /*---------------------------------------------------------
  | GET ACTIVE TENANTS OF ROOM
  ---------------------------------------------------------*/
  const [tenantRows] = await db.query(
    `
    SELECT
      tenant_id
    FROM tenants
    WHERE room_id = ?
    AND status = 'active'
    AND deleted_at IS NULL
    `,
    [reading.room_id]
  );

  if (tenantRows.length === 0) {
    throw new Error("No active tenants found");
  }

  /*---------------------------------------------------------
  | CALCULATE PER TENANT AMOUNT
  ---------------------------------------------------------*/
  const perTenantAmount = Number(
    (
      reading.total_amount /
      tenantRows.length
    ).toFixed(2)
  );

  let insertedBills = 0;

  /*---------------------------------------------------------
  | CREATE TENANT BILLS
  ---------------------------------------------------------*/
  for (const tenant of tenantRows) {
    const [existingBill] = await db.query(
      `
      SELECT bill_id
      FROM tenant_electricity_bills
      WHERE tenant_id = ?
      AND reading_id = ?
      `,
      [tenant.tenant_id, reading_id]
    );

    /*-------------------------------------------------------
    | Skip duplicate bill
    -------------------------------------------------------*/
    if (existingBill.length > 0) {
      continue;
    }

await db.query(
  `
  INSERT INTO tenant_electricity_bills
  (
    tenant_id,
    reading_id,
    branch_id,
    amount
  )
  VALUES (?, ?, ?, ?)
  `,
  [
    tenant.tenant_id,
    reading_id,
    reading.branch_id,
    perTenantAmount,
  ]
);

    insertedBills++;
  }

  return {
    total_tenants: tenantRows.length,
    inserted_bills: insertedBills,
    skipped_duplicate_bills:
      tenantRows.length - insertedBills,
    per_tenant_amount: perTenantAmount,
  };
};

/*===========================================================================
|
| GET ALL TENANT ELECTRICITY BILLS
|
| Returns tenant-wise electricity bills.
|
===========================================================================*/
export const getTenantBillsModel = async (filters) => {
  let sql = `
    SELECT
      teb.bill_id,
      teb.branch_id,
      teb.amount,
      teb.status,
      teb.paid_at,
      teb.created_at,

      t.tenant_id,
      t.first_name,
      t.last_name,

      er.bill_month,
      er.total_units,
      er.total_amount

    FROM tenant_electricity_bills teb

    INNER JOIN tenants t
      ON t.tenant_id = teb.tenant_id

    INNER JOIN electricity_readings er
      ON er.reading_id = teb.reading_id

    WHERE teb.deleted_at IS NULL
    AND t.deleted_at IS NULL
  `;

  const values = [];

  if (filters.branch_id) {
    sql += ` AND teb.branch_id = ?`;
    values.push(filters.branch_id);
  }

  if (filters.tenant_id) {
    sql += ` AND teb.tenant_id = ?`;
    values.push(filters.tenant_id);
  }

  if (filters.status) {
    sql += ` AND teb.status = ?`;
    values.push(filters.status);
  }

  if (filters.bill_month) {
    sql += ` AND er.bill_month = ?`;
    values.push(filters.bill_month);
  }

  if (filters.start_date) {
  sql += ` AND DATE(teb.created_at) >= ?`;
  values.push(filters.start_date);
}

if (filters.end_date) {
  sql += ` AND DATE(teb.created_at) <= ?`;
  values.push(filters.end_date);
}
  sql += ` ORDER BY teb.bill_id DESC`;

  const [rows] = await db.query(sql, values);

  return rows;
};








/*===========================================================================
| MARK ELECTRICITY BILL AS PAID
===========================================================================*/
export const markBillPaidModel = async (bill_id) => {
  const [billRows] = await db.query(
    `
    SELECT *
    FROM tenant_electricity_bills
    WHERE bill_id = ?
    AND deleted_at IS NULL
    `,
    [bill_id]
  );

  if (billRows.length === 0) {
    throw new Error("Bill not found");
  }

  const bill = billRows[0];

  /*---------------------------------------------------------
  | Prevent duplicate payment updates
  ---------------------------------------------------------*/
  if (bill.status === "paid") {
    throw new Error("Bill already marked as paid");
  }

  const sql = `
    UPDATE tenant_electricity_bills
    SET
      status = 'paid',
      paid_at = NOW(),
      updated_at = NOW()
    WHERE bill_id = ?
  `;

  await db.query(sql, [bill_id]);

  return {
    bill_id,
    status: "paid",
  };
};