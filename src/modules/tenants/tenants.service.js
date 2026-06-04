import bcrypt from "bcrypt";
import generateToken from "../../common/utils/generateToken.js";
import {
  checkBedOccupied,
  createTenantQuery,
  updateBedStatusQuery,
  getTenantsQuery,
  getTenantByIdQuery,
  checkTenantOwnership,
  vacateTenantQuery,
  makeBedVacantQuery,
  getTenantsByBranchQuery,
  updateTenantQuery,
  deleteTenantQuery,
  getTenantByPhoneQuery,
} from "./tenants.model.js";

/*--------------Create Tenant-----------*/
export const createTenant = async (payload) => {
  console.log("PAYLOAD =", payload);
  console.log("ROOM ID =", payload.room_id);

  const {
    bed_id,
    branch_id,
    room_id,
    room_number,

    first_name,
    last_name,
    profile_image,

    phone,
    email,
    password,

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
    emergency_contact,
  } = payload;

  // Check Bed Occupied

  const occupiedBed = await checkBedOccupied(bed_id);

  if (occupiedBed) {
    throw new Error("Bed already occupied");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create Tenant

  const result = await createTenantQuery({
    bed_id,
    branch_id,
    room_id,
    room_number,

    first_name,
    last_name,
    profile_image,

    phone,
    email,
    password_hash: hashedPassword,
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
    emergency_contact,
  });
  await updateBedStatusQuery(bed_id);

  const tenant = await getTenantByIdQuery(result.insertId);

  return tenant;
};

/*--------------Get Tenants-----------*/

export const getTenants = async () => {
  const tenants = await getTenantsQuery();

  const active = tenants.filter(
    (tenant) => tenant.status?.toLowerCase() === "active",
  );

  const pending = tenants.filter(
    (tenant) => tenant.status?.toLowerCase() === "pending",
  );

  const release = tenants.filter(
    (tenant) => tenant.status?.toLowerCase() === "release",
  );

  return {
    active_count: active.length,
    pending_count: pending.length,
    release_count: release.length,

    active,
    pending,
    release,
  };
};

/*--------------Vacate Tenant-----------*/

export const vacateTenant = async (tenant_id) => {
  const tenant = await getTenantByIdQuery(tenant_id);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  await vacateTenantQuery(tenant_id);

  await makeBedVacantQuery(tenant.bed_id);

  return null;
};

/*-------get Tenant By branch id------------*/

export const getTenantCountByBranch = async (branch_id) => {
  const tenants = await getTenantsByBranchQuery(branch_id);

  const active = tenants.filter(
    (tenant) => tenant.status?.toLowerCase() === "active",
  );

  const pending = tenants.filter(
    (tenant) => tenant.status?.toLowerCase() === "pending",
  );

  const release = tenants.filter(
    (tenant) =>
      tenant.status?.toLowerCase() === "release" ||
      tenant.status?.toLowerCase() === "vacated",
  );

  return {
    total_tenants: tenants.length,

    active_count: active.length,
    pending_count: pending.length,
    release_count: release.length,

    active,
    pending,
    release,
  };
};

/*-------Get Tenant By ID------------*/

export const getTenantById = async (tenant_id) => {
  const tenant = await getTenantByIdQuery(tenant_id);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant;
};

/*--------------Update Tenant-----------*/

export const updateTenant = async (tenant_id, payload) => {
  const tenant = await getTenantByIdQuery(tenant_id);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  const updatedData = {
    ...tenant,
    ...payload,
  };

  await updateTenantQuery(tenant_id, updatedData);

  return await getTenantByIdQuery(tenant_id);
};

/*--------------Delete Tenant-----------*/

export const deleteTenant = async (tenant_id) => {
  const tenant = await getTenantByIdQuery(tenant_id);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  await deleteTenantQuery(tenant_id);

  return tenant;
};

/*--------------Login Tenant--------------*/

export const loginTenant = async (phone, password) => {
  const tenant = await getTenantByPhoneQuery(phone);

  if (!tenant) {
    throw new Error("Invalid phone number");
  }

  const isMatch = await bcrypt.compare(password, tenant.password_hash);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = generateToken({
    user_id: tenant.tenant_id,
    role: "tenant",
    role_id: null,
    manager_id: null,
    branch_id: tenant.branch_id,
  });

  const { password_hash, ...tenantData } = tenant;

  return {
    token,
    tenant: tenantData,
  };
};
