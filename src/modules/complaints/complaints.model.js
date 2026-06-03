import db from "../../common/config/db.js";

/*===========================================================================
| GET TENANT BY ID
===========================================================================*/

export const getTenantById = async (tenant_id) => {
  const query = `
    SELECT
      tenant_id,
      room_id,
      branch_id
    FROM tenants
    WHERE tenant_id = ?
    LIMIT 1
  `;

  const [results] = await db.query(query, [tenant_id]);

  return results[0];
};

/*===========================================================================
| CREATE COMPLAINT
===========================================================================*/

export const createComplaintQuery = async (data) => {
  const query = `
    INSERT INTO complaints
    (
      tenant_id,
      branch_id,
      room_id,
      category_id,
      title,
      description
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    data.tenant_id,
    data.branch_id,
    data.room_id,
    data.category_id,
    data.title,
    data.description,
  ]);

  return result;
};

/*===========================================================================
| GET ALL COMPLAINTS
===========================================================================*/

export const getComplaintsQuery = async () => {
  const query = `
    SELECT
      c.complaint_id,
      c.tenant_id,
      c.branch_id,
      c.room_id,
      c.category_id,
      cc.category_name,
      c.title,
      c.description,
      c.status,
      c.created_at,
      c.updated_at,

      CONCAT(
        t.first_name,
        ' ',
        t.last_name
      ) AS tenant_name,

      r.name AS room_name,

      b.name AS branch_name

    FROM complaints c

    LEFT JOIN tenants t
      ON t.tenant_id = c.tenant_id

    LEFT JOIN rooms r
      ON r.room_id = c.room_id

    LEFT JOIN branches b
      ON b.branch_id = c.branch_id

    LEFT JOIN complaint_categories cc
      ON cc.category_id = c.category_id

    WHERE c.deleted_at IS NULL

    ORDER BY c.complaint_id DESC
  `;

  const [results] = await db.query(query);

  return results;
};




/*===========================================================================

| GET COMPLAINTS BY TENANT

===========================================================================*/

export const getComplaintsByTenantQuery = async (
  tenant_id
) => {
  const query = `
    SELECT
      c.complaint_id,
      c.tenant_id,
      c.branch_id,
      c.room_id,
      c.category_id,
      cc.category_name,
      c.title,
      c.description,
      c.status,
      c.created_at,
      c.updated_at,

      CONCAT(
        t.first_name,
        ' ',
        t.last_name
      ) AS tenant_name,

      r.name AS room_name,

      b.name AS branch_name

    FROM complaints c

    LEFT JOIN tenants t
      ON t.tenant_id = c.tenant_id

    LEFT JOIN rooms r
      ON r.room_id = c.room_id

    LEFT JOIN branches b
      ON b.branch_id = c.branch_id

    LEFT JOIN complaint_categories cc
      ON cc.category_id = c.category_id

    WHERE c.deleted_at IS NULL
      AND c.tenant_id = ?

    ORDER BY c.complaint_id DESC
  `;

  const [results] = await db.query(query, [
    tenant_id,
  ]);

  return results;
};





/*===========================================================================
| GET SINGLE COMPLAINT
===========================================================================*/

export const getComplaintById = async (complaint_id) => {
  const query = `
    SELECT
      c.complaint_id,
      c.tenant_id,
      c.branch_id,
      c.room_id,
      c.category_id,
      cc.category_name,
      c.title,
      c.description,
      c.status,
      c.created_at,
      c.updated_at,

      CONCAT(
        t.first_name,
        ' ',
        t.last_name
      ) AS tenant_name,

      r.name AS room_name,

      b.name AS branch_name

    FROM complaints c

    LEFT JOIN tenants t
      ON t.tenant_id = c.tenant_id

    LEFT JOIN rooms r
      ON r.room_id = c.room_id

    LEFT JOIN branches b
      ON b.branch_id = c.branch_id

    LEFT JOIN complaint_categories cc
      ON cc.category_id = c.category_id

    WHERE c.complaint_id = ?
      AND c.deleted_at IS NULL

    LIMIT 1
  `;

  const [rows] = await db.query(query, [complaint_id]);

  return rows[0];
};

/*===========================================================================
| RESOLVE COMPLAINT
===========================================================================*/

export const resolveComplaintQuery = async (complaint_id) => {
  const query = `
    UPDATE complaints
    SET
      status = 'resolved',
      updated_at = NOW()
    WHERE complaint_id = ?
  `;

  const [result] = await db.query(query, [complaint_id]);

  return result;
};

/*===========================================================================
| UPDATE COMPLAINT
===========================================================================*/

export const updateComplaintQuery = async (complaint_id, data) => {
  const query = `
    UPDATE complaints
    SET
      title = ?,
      description = ?,
      category_id = ?,
      updated_at = NOW()
    WHERE complaint_id = ?
  `;

  const [result] = await db.query(query, [
    data.title,
    data.description,
    data.category_id,
    complaint_id,
  ]);

  return result;
};

/*===========================================================================
| DELETE COMPLAINT
===========================================================================*/

export const deleteComplaintQuery = async (complaint_id) => {
  const query = `
    UPDATE complaints
    SET
      deleted_at = NOW()
    WHERE complaint_id = ?
  `;

  const [result] = await db.query(query, [complaint_id]);

  return result;
};
