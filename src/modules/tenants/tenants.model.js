import db from "../../common/config/db.js";

/*--------------Check Bed Ownership-----------*/

export const checkBedOwnership = async (bed_id, user_id) => {
  const query = `
      SELECT beds.*
      FROM beds

      JOIN rooms
      ON rooms.room_id =
      beds.room_id

      JOIN branches
      ON branches.branch_id =
      rooms.branch_id

      JOIN properties
      ON properties.property_id =
      branches.property_id

      WHERE beds.bed_id = ?
      AND properties.user_id = ?

      LIMIT 1
    `;

  const [results] = await db.query(query, [bed_id, user_id]);

  return results[0];
};

/*--------------Check Bed Occupied-----------*/

export const checkBedOccupied = async (bed_id) => {
  const query = `
      SELECT *
      FROM beds
      WHERE bed_id = ?
      AND status = 'occupied'
      LIMIT 1
    `;

  const [results] = await db.query(query, [bed_id]);

  return results[0];
};



/*--------------Create Tenant-----------*/

export const createTenantQuery = async (data) => {
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
    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
};





/*--------------Update Bed Status-----------*/

export const updateBedStatusQuery = async (bed_id) => {
  const query = `
      UPDATE beds
      SET status = 'occupied'
      WHERE bed_id = ?
    `;

  const [result] = await db.query(query, [bed_id]);

  return result;
};

/*--------------Get Tenants-----------*/

export const getTenantsQuery = async () => {
  const query = `
      SELECT *
      FROM tenants
      WHERE deleted_at IS NULL
      ORDER BY tenant_id DESC
    `;

  const [results] = await db.query(query);

  return results;
};

/*--------------Check Tenant Ownership-----------*/

export const checkTenantOwnership = async (tenant_id, user_id) => {
  const query = `
      SELECT tenants.*
      FROM tenants

      JOIN beds
      ON beds.bed_id =
      tenants.bed_id

      JOIN rooms
      ON rooms.room_id =
      beds.room_id

      JOIN branches
      ON branches.branch_id =
      rooms.branch_id

      JOIN properties
      ON properties.property_id =
      branches.property_id

      WHERE tenants.tenant_id = ?
      AND properties.user_id = ?

      LIMIT 1
    `;

  const [results] = await db.query(query, [tenant_id, user_id]);

  return results[0];
};

/*--------------Vacate Tenant-----------*/

export const vacateTenantQuery = async (tenant_id) => {
  const query = `
      UPDATE tenants
      SET
        status = 'vacated',
        vacated_date = CURDATE()
      WHERE tenant_id = ?
    `;

  const [result] = await db.query(query, [tenant_id]);

  return result;
};

/*--------------Make Bed Vacant-----------*/

export const makeBedVacantQuery = async (bed_id) => {
  const query = `
      UPDATE beds
      SET status = 'vacant'
      WHERE bed_id = ?
    `;

  const [result] = await db.query(query, [bed_id]);

  return result;
};

/*-------------Get data when we create tenant------------*/
export const getTenantByIdQuery = async (tenant_id) => {
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
};

/*-------get Tenant By branch id------------*/
export const getTenantsByBranchQuery = async (branch_id) => {
  const query = `
    SELECT *
    FROM tenants
    WHERE branch_id = ?
    AND deleted_at IS NULL
    ORDER BY tenant_id DESC
  `;

  const [rows] = await db.query(query, [branch_id]);

  return rows;
};

/*--------------Update Tenant Details-----------------*/

export const updateTenantQuery = async (tenant_id, data) => {
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
};

/*--------------Delete Tenant-----------*/

export const deleteTenantQuery = async (tenant_id) => {
  const query = `
    UPDATE tenants
    SET deleted_at = NOW()
    WHERE tenant_id = ?
  `;

  const [result] = await db.query(query, [tenant_id]);

  return result;
};


/*--------------Get Tenant By Phone Number-----------*/
export const getTenantByPhoneQuery = async (phone) => {
  const query = `
    SELECT *
    FROM tenants
    WHERE phone = ?
    AND password_hash IS NOT NULL
    AND deleted_at IS NULL
    ORDER BY tenant_id DESC
    LIMIT 1
  `;

  const [rows] = await db.query(query, [phone]);

  return rows[0];
};