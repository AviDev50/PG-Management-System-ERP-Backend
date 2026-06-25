import {
  createBranchQuery,
  getBranchByIdQuery,
  getBranchesQuery,
  getSingleBranchQuery,
  updateBranchQuery,
  deleteBranchQuery,
  getBranchesByPropertyIdQuery,
  approveBranchQuery,
} from "./branches.model.js";
import { getSinglePropertyQuery } from "../pg/pg.model.js";

/*------------Create Branch-------------*/

// export const createBranch = async (payload) => {
//   if (typeof payload.ideal_for === "string") {
//     payload.ideal_for = JSON.parse(payload.ideal_for);
//   }

//   if (typeof payload.amenities === "string") {
//     payload.amenities = JSON.parse(payload.amenities);
//   }

//   const branchId = await createBranchQuery(payload);

//   const branch = await getBranchByIdQuery(branchId);

//   return branch;
// };

//for new flow
 // exact path apne project ke hisaab se confirm kar lena

export const createBranch = async (payload, requestingUserId) => {
  if (typeof payload.ideal_for === "string") {
    payload.ideal_for = JSON.parse(payload.ideal_for);
  }

  if (typeof payload.amenities === "string") {
    payload.amenities = JSON.parse(payload.amenities);
  }

  // Ownership verify — ye property requesting admin ki hi hai ya nahi
  const property = await getSinglePropertyQuery(payload.property_id);

  if (!property) {
    throw new Error("Property not found");
  }

  if (Number(property.user_id) !== Number(requestingUserId)) {
  throw new Error("You are not authorized to create a branch under this property");
}

  const branchId = await createBranchQuery(payload);

  // user_branches entry — admin ko is naye branch ka access mil gaya
  await addUserBranchQuery(requestingUserId, branchId);

  const branch = await getBranchByIdQuery(branchId);

  return branch;
};

export const addUserBranchQuery = async (userId, branchId) => {
  const query = `
    INSERT INTO user_branches (user_id, branch_id)
    VALUES (?, ?)
  `;
  const [result] = await db.query(query, [userId, branchId]);
  return result.insertId;
};

/*--------------Get Branches-----------*/
export const getBranches = async (branch_id = null) => {
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
};
/*--------------Get Single Branch-----------*/

export const getSingleBranch = async (branch_id) => {
  const branch = await getBranchByIdQuery(branch_id);

  if (!branch) {
    throw new Error("Branch not found");
  }

  return branch;
};

/*--------------Update Branch-----------*/

export const updateBranch = async (branch_id, payload) => {
  if (typeof payload.ideal_for === "string") {
    payload.ideal_for = JSON.parse(payload.ideal_for);
  }

  if (typeof payload.amenities === "string") {
    payload.amenities = JSON.parse(payload.amenities);
  }

  const branch = await getBranchByIdQuery(branch_id);

  if (!branch) {
    throw new Error("Branch not found");
  }

  await updateBranchQuery(payload, branch_id);

  return await getBranchByIdQuery(branch_id);
};

/*--------------Delete Branch-----------*/

export const deleteBranch = async (branch_id) => {
  const branch = await getBranchByIdQuery(branch_id);

  if (!branch) {
    throw new Error("Branch not found");
  }

  await deleteBranchQuery(branch_id);

  return {
    success: true,
  };
};

/*---------Get Branches By Property id-----*/

export const getBranchesByPropertyId = async (property_id) => {
  const branches = await getBranchesByPropertyIdQuery(property_id);

  const active = branches.filter((b) => b.approval_status === "approved");

  const pending = branches.filter((b) => b.approval_status === "pending");

  return {
    active_count: active.length,
    pending_count: pending.length,
    active,
    pending,
  };
};

/*--------------Approve Branch-----------*/

export const approveBranch = async (branch_id, user) => {
  const branch = await getBranchByIdQuery(branch_id);

  if (!branch) {
    throw new Error("Branch not found");
  }

  await approveBranchQuery(branch_id, user.user_id);

  return await getBranchByIdQuery(branch_id);
};
