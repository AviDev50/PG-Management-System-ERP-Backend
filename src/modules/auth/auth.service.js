// import bcrypt from "bcryptjs";
// import { findUserByEmail, getBranchesByUserId } from "./auth.model.js";
// import generateToken from "../../common/utils/generateToken.js";

// export async function login({ email, password }) {
//   const user = await findUserByEmail(email);

//   if (!user) {
//     const error = new Error("Wrong email");
//     error.statusCode = 401;
//     throw error;
//   }

//   const isMatch = await bcrypt.compare(password, user.password_hash);
//   if (!isMatch) {
//     const error = new Error("Wrong password");
//     error.statusCode = 401;
//     throw error;
//   }

//   const token = generateToken(user);

//   let branches = [];
//   if (user.role === "admin") {
//     branches = await getBranchesByUserId(user.user_id);
//   }

//   delete user.password_hash;

//   return {
//     token,
//     user: {
//       user_id: user.user_id,
//       name: user.name,
//       email: user.email,
//       role_id: user.role_id,
//       role: user.role,
//       manager_id: user.manager_id || null,
//       branch_id: user.branch_id || null,
//       branches,
//     },
//   };
// }


import bcrypt from "bcryptjs";
import { findUserByEmail, getBranchesByUserId } from "./auth.model.js";
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

  if (user.role === "admin" && user.property_status !== "approved") {
  const error = new Error("Your property is pending approval. Please wait until it is approved by the super admin.");
  error.statusCode = 403;
  throw error;
}

  const token = generateToken(user);

  let branches = [];
  if (user.role === "admin") {
    branches = await getBranchesByUserId(user.user_id);
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
      manager_id: user.manager_id || null,
      branch_id: user.branch_id || null,
      property_id: user.property_id || null,
      branches,
    },
  };
}