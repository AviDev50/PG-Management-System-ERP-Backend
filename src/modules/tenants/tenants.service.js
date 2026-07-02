import bcrypt from "bcryptjs";
import * as tenantModel from "./tenants.model.js";

function toBillingMonth(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
/*===========================================================================
| CREATE TENANT
===========================================================================*/

//old
// export async function createTenant(payload) {
//   const {
//     bed_id,
//     branch_id,
//     room_id,
//     room_number,

//     first_name,
//     last_name,
//     profile_image,

//     phone,
//     email,
//     password,

//     gender,
//     dob,
//     marital_status,
//     profession,

//     document_image,

//     address,
//     state,
//     district,
//     pincode,

//     college_name,

//     registration_date,
//     accommodation_date,

//     father_name,
//     father_contact,
//     father_occupation,

//     mother_name,
//     mother_contact,
//     mother_occupation,

//     guardian_name,
//     guardian_relation,
//     guardian_contact,

//     security_deposit,
//     emergency_contact,
//   } = payload;

//   if (!bed_id || !branch_id || !room_id || !first_name || !last_name || !phone) {
//     const error = new Error("bed_id, branch_id, room_id, first_name, last_name and phone are required");
//     error.statusCode = 400;
//     throw error;
//   }

//   const bed = await tenantModel.getBedByIdQuery(bed_id);

//   if (!bed) {
//     const error = new Error("Bed not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   if (bed.status === "occupied") {
//     const error = new Error("Bed already occupied");
//     error.statusCode = 400;
//     throw error;
//   }

//   const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

//   const result = await tenantModel.createTenantQuery({
//     bed_id,
//     branch_id,
//     room_id,
//     room_number,

//     first_name,
//     last_name,
//     profile_image,

//     phone,
//     email,
//     password_hash: hashedPassword,

//     gender,
//     dob,
//     marital_status,
//     profession,

//     document_image,

//     address,
//     state,
//     district,
//     pincode,

//     college_name,

//     registration_date,
//     accommodation_date,

//     father_name,
//     father_contact,
//     father_occupation,

//     mother_name,
//     mother_contact,
//     mother_occupation,

//     guardian_name,
//     guardian_relation,
//     guardian_contact,

//     security_deposit,
//     emergency_contact,
//   });

//   await tenantModel.updateBedStatusQuery(bed_id, "occupied");

//   return await tenantModel.getTenantByIdQuery(result.insertId);
// }

export async function createTenant(payload) {
  const {
    bed_id, branch_id, room_id, room_number,
    first_name, last_name, profile_image,
    phone, email, password,
    gender, dob, marital_status, profession,
    document_image, address, state, district, pincode,
    college_name, registration_date, accommodation_date,
    father_name, father_contact, father_occupation,
    mother_name, mother_contact, mother_occupation,
    guardian_name, guardian_relation, guardian_contact,
    security_deposit, emergency_contact,
  } = payload;

  if (!bed_id || !branch_id || !room_id || !first_name || !last_name || !phone) {
    const error = new Error("bed_id, branch_id, room_id, first_name, last_name and phone are required");
    error.statusCode = 400;
    throw error;
  }

  const bed = await tenantModel.getBedByIdQuery(bed_id);

  if (!bed) {
    const error = new Error("Bed not found");
    error.statusCode = 404;
    throw error;
  }

  if (bed.status === "occupied") {
    const error = new Error("Bed already occupied");
    error.statusCode = 400;
    throw error;
  }

  const roomRent = await rentDueModel.getRoomMonthlyRent(room_id);
  if (roomRent === null) {
    const error = new Error("Room rent not set, cannot create tenant");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [tenantResult] = await connection.execute(
      `INSERT INTO tenants 
        (bed_id, branch_id, room_id, room_number, first_name, last_name, profile_image,
         phone, email, password_hash, gender, dob, marital_status, profession,
         document_image, address, state, district, pincode, college_name,
         registration_date, accommodation_date, father_name, father_contact, father_occupation,
         mother_name, mother_contact, mother_occupation, guardian_name, guardian_relation,
         guardian_contact, security_deposit, emergency_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bed_id, branch_id, room_id, room_number, first_name, last_name, profile_image,
       phone, email, hashedPassword, gender, dob, marital_status, profession,
       document_image, address, state, district, pincode, college_name,
       registration_date, accommodation_date, father_name, father_contact, father_occupation,
       mother_name, mother_contact, mother_occupation, guardian_name, guardian_relation,
       guardian_contact, security_deposit, emergency_contact]
    );

    const tenant_id = tenantResult.insertId;

    await connection.execute(
      `UPDATE beds SET status = 'occupied' WHERE bed_id = ?`,
      [bed_id]
    );

    const billing_month = toBillingMonth(accommodation_date);

    await connection.execute(
      `INSERT INTO rent_dues (tenant_id, branch_id, room_id, bed_id, billing_month, amount_due, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [tenant_id, branch_id, room_id, bed_id, billing_month, roomRent]
    );

    await connection.commit();

    return await tenantModel.getTenantByIdQuery(tenant_id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/*===========================================================================
| GET TENANTS (scoped to admin's assigned branches)
===========================================================================*/

export async function getTenants(user) {
  const tenants =
    user.role === "super_admin"
      ? await tenantModel.getAllTenantsQuery()
      : await tenantModel.getTenantsByUserBranchesQuery(user.user_id);

  const active = tenants.filter((tenant) => tenant.status === "active");
  const vacated = tenants.filter((tenant) => tenant.status === "vacated");

  return {
    total_tenants: tenants.length,
    active_count: active.length,
    vacated_count: vacated.length,

    active,
    vacated,
  };
}

/*===========================================================================
| VACATE TENANT
===========================================================================*/

export async function vacateTenant(tenant_id) {
  const tenant = await tenantModel.getTenantByIdQuery(tenant_id);

  if (!tenant) {
    const error = new Error("Tenant not found");
    error.statusCode = 404;
    throw error;
  }

  await tenantModel.vacateTenantQuery(tenant_id);
  await tenantModel.updateBedStatusQuery(tenant.bed_id, "vacant");

  return await tenantModel.getTenantByIdQuery(tenant_id);
}

/*===========================================================================
| GET TENANT COUNT/LIST BY BRANCH
===========================================================================*/

export async function getTenantCountByBranch(branch_id) {
  const tenants = await tenantModel.getTenantsByBranchQuery(branch_id);

  const active = tenants.filter((tenant) => tenant.status === "active");
  const vacated = tenants.filter((tenant) => tenant.status === "vacated");

  return {
    total_tenants: tenants.length,
    active_count: active.length,
    vacated_count: vacated.length,

    active,
    vacated,
  };
}

/*===========================================================================
| GET TENANT BY ID
===========================================================================*/

export async function getTenantById(tenant_id) {
  const tenant = await tenantModel.getTenantByIdQuery(tenant_id);

  if (!tenant) {
    const error = new Error("Tenant not found");
    error.statusCode = 404;
    throw error;
  }

  return tenant;
}

/*===========================================================================
| GET TENANT DETAILS (TENANT SIDE - own profile only)
===========================================================================*/

export async function getTenantDetailsTenantSide(tenant_id) {
  const tenant = await tenantModel.getTenantByIdQuery(tenant_id);

  if (!tenant) {
    const error = new Error("Tenant not found");
    error.statusCode = 404;
    throw error;
  }

  const { password_hash, ...safeTenant } = tenant;

  return safeTenant;
}

/*===========================================================================
| UPDATE TENANT
===========================================================================*/

export async function updateTenant(tenant_id, payload) {
  const tenant = await tenantModel.getTenantByIdQuery(tenant_id);

  if (!tenant) {
    const error = new Error("Tenant not found");
    error.statusCode = 404;
    throw error;
  }

  // password_hash / bed_id / branch_id ko yahan se update nahi karne dena -
  // wo alag dedicated flows (password change, transfer) se hone chahiye
  const { password_hash, password, bed_id, branch_id, room_id, ...safePayload } = payload;

  const updatedData = {
    ...tenant,
    ...safePayload,
  };

  await tenantModel.updateTenantQuery(tenant_id, updatedData);

  return await tenantModel.getTenantByIdQuery(tenant_id);
}

/*===========================================================================
| DELETE TENANT
===========================================================================*/

export async function deleteTenant(tenant_id) {
  const tenant = await tenantModel.getTenantByIdQuery(tenant_id);

  if (!tenant) {
    const error = new Error("Tenant not found");
    error.statusCode = 404;
    throw error;
  }

  await tenantModel.deleteTenantQuery(tenant_id);
  await tenantModel.updateBedStatusQuery(tenant.bed_id, "vacant");

  return tenant;
}