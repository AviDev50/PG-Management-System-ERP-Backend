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

/*------------Create Branch-------------*/

export const createBranch = async (payload) => {
  if (typeof payload.ideal_for === "string") {
    payload.ideal_for = JSON.parse(payload.ideal_for);
  }

  if (typeof payload.amenities === "string") {
    payload.amenities = JSON.parse(payload.amenities);
  }

  const branchId = await createBranchQuery(payload);

  const branch = await getBranchByIdQuery(branchId);

  return branch;
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
