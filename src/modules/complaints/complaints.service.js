import * as complaintModel from "./complaints.model.js";

/*===========================================================================
| CREATE COMPLAINT
===========================================================================*/

// export async function createComplaint(payload, user) {
//   const { title, description, category_id } = payload;

//   const tenant_id = user.tenant_id;

//   /*--------------------------------------------------
//   | CHECK TENANT
//   --------------------------------------------------*/

//   const tenant = await complaintModel.getTenantById(tenant_id);

//   if (!tenant) {
//     throw new Error("Tenant not found");
//   }

//   if (!tenant.room_id) {
//     throw new Error("Tenant is not assigned to any room");
//   }

//   /*--------------------------------------------------
//   | CREATE COMPLAINT (status defaults to 'open' via DB)
//   --------------------------------------------------*/

//   const result = await complaintModel.createComplaintQuery({
//     tenant_id,
//     branch_id: tenant.branch_id,
//     room_id: tenant.room_id,
//     title,
//     description,
//     category_id,
//   });

//   /*--------------------------------------------------
//   | FETCH CREATED COMPLAINT
//   --------------------------------------------------*/

//   const complaint = await complaintModel.getComplaintById(result.insertId);

//   return complaint;
// }

export async function createComplaint(payload, user) {
  const { title, description, category_id } = payload;

  const tenant_id = user.tenant_id;

  const tenant = await complaintModel.getTenantById(tenant_id);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  if (!tenant.room_id) {
    throw new Error("Tenant is not assigned to any room");
  }

  if (!category_id) {
    const error = new Error("category_id is required");
    error.statusCode = 400;
    throw error;
  }

  const result = await complaintModel.createComplaintQuery({
    tenant_id,
    branch_id: tenant.branch_id,
    room_id: tenant.room_id,
    title,
    description,
    category_id,
  });

  const complaint = await complaintModel.getComplaintById(result.insertId);

  return complaint;
}

/*===========================================================================
| GET COMPLAINTS
===========================================================================*/

export async function getComplaints(user) {
  if (user.role === "tenant") {
    return await complaintModel.getComplaintsByTenantQuery(user.tenant_id);
  }

  return await complaintModel.getComplaintsQuery();
}

/*===========================================================================
| RESOLVE COMPLAINT
===========================================================================*/

export async function resolveComplaint(complaint_id) {
  const complaint = await complaintModel.getComplaintById(complaint_id);

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  const result = await complaintModel.resolveComplaintQuery(complaint_id);

  if (result.affectedRows === 0) {
    throw new Error("Complaint not resolved");
  }

  return {
    complaint_id,
    status: "resolved",
  };
}

/*===========================================================================
| DELETE COMPLAINT
===========================================================================*/

export async function deleteComplaint(complaint_id) {
  const complaint = await complaintModel.getComplaintById(complaint_id);

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  await complaintModel.deleteComplaintQuery(complaint_id);

  return complaint;
}

/*===========================================================================
| GET COMPLAINTS BY BRANCH ID
===========================================================================*/

export async function getComplaintByBranchId(branch_id) {
  return await complaintModel.getComplaintsByBranchQuery(branch_id);
}
