import bcrypt from "bcryptjs";
import { findTenantByEmail } from "./tenantAuth.model.js";
import generateTenantToken from "../../common/utils/generateTenantToken.js";

export async function login({ email, password }) {
  const tenant = await findTenantByEmail(email);

  if (!tenant) {
    const error = new Error("Wrong email");
    error.statusCode = 401;
    throw error;
  }

  if (!tenant.password_hash) {
    const error = new Error("Account not activated. Please contact your PG admin.");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, tenant.password_hash);
  if (!isMatch) {
    const error = new Error("Wrong password");
    error.statusCode = 401;
    throw error;
  }

  if (tenant.status === "vacated") {
    const error = new Error("Your tenancy has ended. Access is no longer available.");
    error.statusCode = 403;
    throw error;
  }

  const token = generateTenantToken(tenant);

  delete tenant.password_hash;

  return {
    token,
    tenant: {
      tenant_id: tenant.tenant_id,
      first_name: tenant.first_name,
      last_name: tenant.last_name,
      email: tenant.email,
      phone: tenant.phone,
      bed_id: tenant.bed_id,
      room_id: tenant.room_id,
      branch_id: tenant.branch_id,
      status: tenant.status,
    },
  };
}