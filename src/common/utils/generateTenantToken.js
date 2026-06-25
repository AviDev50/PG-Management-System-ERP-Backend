import jwt from "jsonwebtoken";

const generateTenantToken = (tenant) => {
  return jwt.sign(
    {
      tenant_id: tenant.tenant_id,
      role: "tenant",
      branch_id: tenant.branch_id,
      bed_id: tenant.bed_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export default generateTenantToken;