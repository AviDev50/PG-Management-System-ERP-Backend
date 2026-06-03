import bcrypt from "bcrypt";

import { findUserByEmail, getBranchesByPropertyId } from "./auth.model.js";

import generateToken from "../../common/utils/generateToken.js";

export const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  /*------------plain password-------------*/

  // const isMatch = password === user.password_hash;

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user);

  let branches = [];

  // sirf admin/property owner ke liye branches lao
  if (user.property_id) {
    branches = await getBranchesByPropertyId(user.property_id);
  }

  delete user.password_hash;

  return {
    token,
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
      role: user.role,
      property_id: user.property_id,
      manager_id: user.manager_id || null,
      branch_id: user.branch_id || null,
      branches,
    },
  };
};
