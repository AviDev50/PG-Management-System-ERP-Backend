// import {
//   createBranchQuery,
//   getBranchByIdQuery,
//   getBranchesQuery,
//   getSingleBranchQuery,
//   updateBranchQuery,
//   deleteBranchQuery,
//   getBranchesByPropertyIdQuery,
//   approveBranchQuery,
// } from "./branches.model.js";
// import { getSinglePropertyQuery } from "../pg/pg.model.js";

// //for new flow
//  // exact path apne project ke hisaab se confirm kar lena

// export const createBranch = async (payload, requestingUserId) => {
//   if (typeof payload.ideal_for === "string") {
//     payload.ideal_for = JSON.parse(payload.ideal_for);
//   }

//   if (typeof payload.amenities === "string") {
//     payload.amenities = JSON.parse(payload.amenities);
//   }

//   // Ownership verify — ye property requesting admin ki hi hai ya nahi
//   const property = await getSinglePropertyQuery(payload.property_id);

//   if (!property) {
//     throw new Error("Property not found");
//   }

//   if (Number(property.user_id) !== Number(requestingUserId)) {
//   throw new Error("You are not authorized to create a branch under this property");
// }

//   const branchId = await createBranchQuery(payload);

//   // user_branches entry — admin ko is naye branch ka access mil gaya
//   await addUserBranchQuery(requestingUserId, branchId);

//   const branch = await getBranchByIdQuery(branchId);

//   return branch;
// };

// export const addUserBranchQuery = async (userId, branchId) => {
//   const query = `
//     INSERT INTO user_branches (user_id, branch_id)
//     VALUES (?, ?)
//   `;
//   const [result] = await db.query(query, [userId, branchId]);
//   return result.insertId;
// };

// /*--------------Get Branches-----------*/
// export const getBranches = async (branch_id = null) => {
//   let branches = await getBranchesQuery();

//   if (branch_id) {
//     branches = branches.filter((b) => b.branch_id == branch_id);
//   }

//   const active = branches.filter((b) => b.approval_status === "approved");

//   const pending = branches.filter((b) => b.approval_status === "pending");

//   return {
//     active_count: active.length,
//     pending_count: pending.length,
//     active,
//     pending,
//   };
// };
// /*--------------Get Single Branch-----------*/

// export const getSingleBranch = async (branch_id) => {
//   const branch = await getBranchByIdQuery(branch_id);

//   if (!branch) {
//     throw new Error("Branch not found");
//   }

//   return branch;
// };

// /*--------------Update Branch-----------*/

// export const updateBranch = async (branch_id, payload) => {
//   if (typeof payload.ideal_for === "string") {
//     payload.ideal_for = JSON.parse(payload.ideal_for);
//   }

//   if (typeof payload.amenities === "string") {
//     payload.amenities = JSON.parse(payload.amenities);
//   }

//   const branch = await getBranchByIdQuery(branch_id);

//   if (!branch) {
//     throw new Error("Branch not found");
//   }

//   await updateBranchQuery(payload, branch_id);

//   return await getBranchByIdQuery(branch_id);
// };

// /*--------------Delete Branch-----------*/

// export const deleteBranch = async (branch_id) => {
//   const branch = await getBranchByIdQuery(branch_id);

//   if (!branch) {
//     throw new Error("Branch not found");
//   }

//   await deleteBranchQuery(branch_id);

//   return {
//     success: true,
//   };
// };

// /*---------Get Branches By Property id-----*/

// export const getBranchesByPropertyId = async (property_id) => {
//   const branches = await getBranchesByPropertyIdQuery(property_id);

//   const active = branches.filter((b) => b.approval_status === "approved");

//   const pending = branches.filter((b) => b.approval_status === "pending");

//   return {
//     active_count: active.length,
//     pending_count: pending.length,
//     active,
//     pending,
//   };
// };

// /*--------------Approve Branch-----------*/

// export const approveBranch = async (branch_id, user) => {
//   const branch = await getBranchByIdQuery(branch_id);

//   if (!branch) {
//     throw new Error("Branch not found");
//   }

//   await approveBranchQuery(branch_id, user.user_id);

//   return await getBranchByIdQuery(branch_id);
// };

// export async function getPropertyByUserIdQuery(user_id) {
//   const query = `
//     SELECT property_id, user_id, name
//     FROM properties
//     WHERE user_id = ?
//       AND deleted_at IS NULL
//     ORDER BY property_id ASC
//     LIMIT 1
//   `;
 
//   const [rows] = await db.query(query, [user_id]);
 
//   return rows[0];
// }
 


import {
  createBranchQuery,
  getBranchByIdQuery,
  getBranchesQuery,
  updateBranchQuery,
  deleteBranchQuery,
  getBranchesByPropertyIdQuery,
  approveBranchQuery,
  addUserBranchQuery,
} from "./branches.model.js";

/*===========================================================================
| CREATE BRANCH (property_id comes from req.user via token, not body)
===========================================================================*/

export async function createBranch(payload, requestingUser) {
  if (typeof payload.ideal_for === "string") {
    payload.ideal_for = JSON.parse(payload.ideal_for);
  }

  if (typeof payload.amenities === "string") {
    payload.amenities = JSON.parse(payload.amenities);
  }

  if (!requestingUser.property_id) {
    const error = new Error("No property linked to this admin account");
    error.statusCode = 404;
    throw error;
  }

  // property_id ab body se nahi, token se aata hai - tamper-proof
  payload.property_id = requestingUser.property_id;

  const branchId = await createBranchQuery(payload);

  // user_branches entry - admin ko is naye branch ka access mil gaya
  await addUserBranchQuery(requestingUser.user_id, branchId);

  const branch = await getBranchByIdQuery(branchId);

  return branch;
}

/*===========================================================================
| GET BRANCHES
===========================================================================*/

export async function getBranches(branch_id = null) {
  let branches = await getBranchesQuery();

  if (branch_id) {
    branches = branches.filter((b) => b.branch_id == branch_id);
  }

  const active = branches.filter((b) => b.approval_status === "approved");
  const pending = branches.filter((b) => b.approval_status === "pending");

  return {
    active_count: active.length,
    pending_count: pending.length,
    active,
    pending,
  };
}

/*===========================================================================
| GET SINGLE BRANCH
===========================================================================*/

export async function getSingleBranch(branch_id) {
  const branch = await getBranchByIdQuery(branch_id);

  if (!branch) {
    const error = new Error("Branch not found");
    error.statusCode = 404;
    throw error;
  }

  return branch;
}

/*===========================================================================
| UPDATE BRANCH
===========================================================================*/

export async function updateBranch(branch_id, payload) {
  if (typeof payload.ideal_for === "string") {
    payload.ideal_for = JSON.parse(payload.ideal_for);
  }

  if (typeof payload.amenities === "string") {
    payload.amenities = JSON.parse(payload.amenities);
  }

  const branch = await getBranchByIdQuery(branch_id);

  if (!branch) {
    const error = new Error("Branch not found");
    error.statusCode = 404;
    throw error;
  }

  await updateBranchQuery(payload, branch_id);

  return await getBranchByIdQuery(branch_id);
}

/*===========================================================================
| DELETE BRANCH
===========================================================================*/

export async function deleteBranch(branch_id) {
  const branch = await getBranchByIdQuery(branch_id);

  if (!branch) {
    const error = new Error("Branch not found");
    error.statusCode = 404;
    throw error;
  }

  await deleteBranchQuery(branch_id);

  return { success: true };
}

/*===========================================================================
| GET BRANCHES BY PROPERTY ID
===========================================================================*/

export async function getBranchesByPropertyId(property_id) {
  const branches = await getBranchesByPropertyIdQuery(property_id);

  const active = branches.filter((b) => b.approval_status === "approved");
  const pending = branches.filter((b) => b.approval_status === "pending");

  return {
    active_count: active.length,
    pending_count: pending.length,
    active,
    pending,
  };
}

/*===========================================================================
| APPROVE BRANCH
===========================================================================*/

export async function approveBranch(branch_id, user) {
  const branch = await getBranchByIdQuery(branch_id);

  if (!branch) {
    const error = new Error("Branch not found");
    error.statusCode = 404;
    throw error;
  }

  await approveBranchQuery(branch_id, user.user_id);

  return await getBranchByIdQuery(branch_id);
}