import bcrypts from "bcryptjs";
import { findUserByEmail, getBranchesByPropertyId } from "./auth.model.js";
import generateToken from "../../common/utils/generateToken.js";

export async function login({ email, password }) {
  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error("Wrong email");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error("Wrong password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  let branches = [];
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
}