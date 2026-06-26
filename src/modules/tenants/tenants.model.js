import db from "../../common/config/db.js";

/*===========================================================================
| CHECK BED OCCUPIED
===========================================================================*/

export async function checkBedOccupied(bed_id) {
  const query = `
    SELECT *
    FROM beds
    WHERE bed_id = ?
      AND status = 'occupied'
    LIMIT 1
  `;

  const [results] = await db.query(query, [bed_id]);

  return results[0];
}

/*===========================================================================
| GET BED BY ID (basic existence check)
===========================================================================*/

export async function getBedByIdQuery(bed_id) {
  const query = `
    SELECT bed_id, room_id, status
    FROM beds
    WHERE bed_id = ?
    LIMIT 1
  `;

  const [results] = await db.query(query, [bed_id]);

  return results[0];
}

/*===========================================================================
| CREATE TENANT
===========================================================================*/

export async function createTenantQuery(data) {
  const query = `
    INSERT INTO tenants
    (
      bed_id,
      room_id,
      branch_id,
      room_number,

      first_name,
      last_name,
      profile_image,

      phone,
      email,
      password_hash,

      gender,
      dob,
      marital_status,
      profession,

      document_image,

      address,
      state,
      district,
      pincode,

      college_name,

      registration_date,
      accommodation_date,

      father_name,
      father_contact,
      father_occupation,

      mother_name,
      mother_contact,
      mother_occupation,

      guardian_name,
      guardian_relation,
      guardian_contact,

      security_deposit,
      emergency_contact
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    data.bed_id,
    data.room_id,
    data.branch_id,
    data.room_number,

    data.first_name,
    data.last_name,
    data.profile_image,

    data.phone,
    data.email,
    data.password_hash,

    data.gender,
    data.dob,
    data.marital_status,
    data.profession,

    data.document_image,

    data.address,
    data.state,
    data.district,
    data.pincode,

    data.college_name,

    data.registration_date,
    data.accommodation_date,

    data.father_name,
    data.father_contact,
    data.father_occupation,

    data.mother_name,
    data.mother_contact,
    data.mother_occupation,

    data.guardian_name,
    data.guardian_relation,
    data.guardian_contact,

    data.security_deposit,
    data.emergency_contact,
  ]);

  return result;
}

/*===========================================================================
| UPDATE BED STATUS
===========================================================================*/

export async function updateBedStatusQuery(bed_id, status) {
  const query = `
    UPDATE beds
    SET status = ?
    WHERE bed_id = ?
  `;

  const [result] = await db.query(query, [status, bed_id]);

  return result;
}

/*===========================================================================
| GET ALL TENANTS (scoped to admin's assigned branches)
===========================================================================*/

export async function getTenantsByUserBranchesQuery(user_id) {
  const query = `
    SELECT t.*
    FROM tenants t
    JOIN user_branches ub
      ON ub.branch_id = t.branch_id
    WHERE t.deleted_at IS NULL
      AND ub.user_id = ?
    ORDER BY t.tenant_id DESC
  `;

  const [results] = await db.query(query, [user_id]);

  return results;
}

/*===========================================================================
| GET ALL TENANTS (super_admin - unrestricted)
===========================================================================*/

export async function getAllTenantsQuery() {
  const query = `
    SELECT *
    FROM tenants
    WHERE deleted_at IS NULL
    ORDER BY tenant_id DESC
  `;

  const [results] = await db.query(query);

  return results;
}

/*===========================================================================
| VACATE TENANT
===========================================================================*/

export async function vacateTenantQuery(tenant_id) {
  const query = `
    UPDATE tenants
    SET
      status = 'vacated',
      vacated_date = CURDATE()
    WHERE tenant_id = ?
  `;

  const [result] = await db.query(query, [tenant_id]);

  return result;
}

/*===========================================================================
| GET TENANT BY ID
===========================================================================*/

export async function getTenantByIdQuery(tenant_id) {
  const query = `
    SELECT
      tenants.*,
      beds.label AS bed_name,
      beds.bed_type,
      beds.bed_monthly_rent
    FROM tenants

    LEFT JOIN beds
      ON beds.bed_id = tenants.bed_id

    WHERE tenants.tenant_id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(query, [tenant_id]);

  return rows[0];
}

/*===========================================================================
| GET TENANTS BY BRANCH ID
===========================================================================*/

export async function getTenantsByBranchQuery(branch_id) {
  const query = `
    SELECT *
    FROM tenants
    WHERE branch_id = ?
      AND deleted_at IS NULL
    ORDER BY tenant_id DESC
  `;

  const [rows] = await db.query(query, [branch_id]);

  return rows;
}

/*===========================================================================
| UPDATE TENANT DETAILS
===========================================================================*/

export async function updateTenantQuery(tenant_id, data) {
  const query = `
    UPDATE tenants
    SET
      first_name = ?,
      last_name = ?,
      profile_image = ?,

      phone = ?,
      email = ?,

      gender = ?,
      dob = ?,
      marital_status = ?,
      profession = ?,

      document_image = ?,

      address = ?,
      state = ?,
      district = ?,
      pincode = ?,

      college_name = ?,
      registration_date = ?,
      accommodation_date = ?,

      father_name = ?,
      father_contact = ?,
      father_occupation = ?,

      mother_name = ?,
      mother_contact = ?,
      mother_occupation = ?,

      guardian_name = ?,
      guardian_relation = ?,
      guardian_contact = ?,

      security_deposit = ?,
      emergency_contact = ?

    WHERE tenant_id = ?
  `;

  const [result] = await db.query(query, [
    data.first_name,
    data.last_name,
    data.profile_image,

    data.phone,
    data.email,

    data.gender,
    data.dob,
    data.marital_status,
    data.profession,

    data.document_image,

    data.address,
    data.state,
    data.district,
    data.pincode,

    data.college_name,
    data.registration_date,
    data.accommodation_date,

    data.father_name,
    data.father_contact,
    data.father_occupation,

    data.mother_name,
    data.mother_contact,
    data.mother_occupation,

    data.guardian_name,
    data.guardian_relation,
    data.guardian_contact,

    data.security_deposit,
    data.emergency_contact,

    tenant_id,
  ]);

  return result;
}

/*===========================================================================
| DELETE TENANT
===========================================================================*/

export async function deleteTenantQuery(tenant_id) {
  const query = `
    DELETE FROM tenants
    WHERE tenant_id = ?
  `;

  const [result] = await db.query(query, [tenant_id]);

  return result;
}