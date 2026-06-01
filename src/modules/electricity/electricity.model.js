import db from "../../common/config/db.js";

/*===========================================================================
| ADD ELECTRICITY READING
===========================================================================*/
export const createElectricityReading = async (data) => {
  const sql = `
    INSERT INTO electricity_readings
    (
      room_id,
      start_reading,
      end_reading,
      unit_price,
      bill_month
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
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
export const getElectricityReadingsModel = async () => {
  const sql = `
    SELECT *
    FROM electricity_readings
    WHERE deleted_at IS NULL
    ORDER BY reading_id DESC
  `;

  const [rows] = await db.query(sql);

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
        amount
      )
      VALUES (?, ?, ?)
      `,
      [tenant.tenant_id, reading_id, perTenantAmount]
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
export const getTenantBillsModel = async () => {
  const sql = `
    SELECT
      teb.bill_id,
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

    ORDER BY teb.bill_id DESC
  `;

  const [rows] = await db.query(sql);

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