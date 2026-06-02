// complaints.model.js

import db from "../../common/config/db.js";

/*===========================================================================

| GET TENANT BY ID
| Tenant ki basic details fetch karta hai

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

| CREATE COMPLAINT QUERY
===========================================================================*/

export const createComplaintQuery = async (data) => {
  const query = `
    INSERT INTO complaints
    (
      tenant_id,
      branch_id,
      room_id,
      title,
      description,
      category
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    data.tenant_id,
    data.branch_id,
    data.room_id,
    data.title,
    data.description,
    data.category,
  ]);

  return result;
};

/*===========================================================================

| GET ALL COMPLAINTS
| Saari complaints fetch karta hai

===========================================================================*/

export const getComplaintsQuery = async () => {
  const query = `
    SELECT
      c.complaint_id,
      c.tenant_id,
      c.branch_id,
      c.room_id,
      c.title,
      c.description,
      c.category,
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

    WHERE c.deleted_at IS NULL

    ORDER BY c.complaint_id DESC
  `;

  const [results] = await db.query(query);

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
      c.title,
      c.description,
      c.category,
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

    WHERE c.complaint_id = ?

    LIMIT 1
  `;

  const [rows] = await db.query(query, [complaint_id]);

  return rows[0];
};

/*===========================================================================

| RESOLVE COMPLAINT QUERY
| Complaint status update karta hai

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



/*-------------Update Complaint-------------------*/
export const updateComplaintQuery = async (
  complaint_id,
  data
) => {
  const query = `
    UPDATE complaints
    SET
      title = ?,
      description = ?,
      category = ?,
      updated_at = NOW()
    WHERE complaint_id = ?
  `;

  const [result] = await db.query(query, [
    data.title,
    data.description,
    data.category,
    complaint_id,
  ]);

  return result;
};


/*-----------Delete Complaints-------------*/
export const deleteComplaintQuery = async (
  complaint_id
) => {
  const query = `
    UPDATE complaints
    SET
      deleted_at = NOW()
    WHERE complaint_id = ?
  `;

  const [result] = await db.query(query, [
    complaint_id,
  ]);

  return result;
};