import * as complaintModel from "./complaints.model.js";

/*===========================================================================
| CREATE COMPLAINT
===========================================================================*/

export const createComplaint = async (payload, user) => {
  const { title, description, category_id } = payload;

  const tenant_id = user.user_id;

  /*--------------------------------------------------
  | CHECK TENANT
  --------------------------------------------------*/

  const tenant = await complaintModel.getTenantById(tenant_id);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  if (!tenant.room_id) {
    throw new Error("Tenant is not assigned to any room");
  }

  /*--------------------------------------------------
  | CREATE COMPLAINT
  --------------------------------------------------*/

  const result = await complaintModel.createComplaintQuery({
    tenant_id,
    branch_id: tenant.branch_id,
    room_id: tenant.room_id,
    title,
    description,
    category_id,
  });

  /*--------------------------------------------------
  | FETCH CREATED COMPLAINT
  --------------------------------------------------*/

  const complaint = await complaintModel.getComplaintById(result.insertId);

  return complaint;
};

/*===========================================================================
| GET COMPLAINTS
===========================================================================*/

export const getComplaints = async (user) => {
  if (user.role === "tenant") {
    return await complaintModel.getComplaintsByTenantQuery(user.user_id);
  }

  return await complaintModel.getComplaintsQuery();
};

/*===========================================================================
| RESOLVE COMPLAINT
===========================================================================*/

export const resolveComplaint = async (complaint_id) => {
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
};

/*===========================================================================
| UPDATE COMPLAINT
===========================================================================*/

export const updateComplaint = async (complaint_id, payload) => {
  const complaint = await complaintModel.getComplaintById(complaint_id);

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  await complaintModel.updateComplaintQuery(complaint_id, payload);

  return await complaintModel.getComplaintById(complaint_id);
};

/*===========================================================================
| DELETE COMPLAINT
===========================================================================*/

export const deleteComplaint = async (complaint_id) => {
  const complaint = await complaintModel.getComplaintById(complaint_id);

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  await complaintModel.deleteComplaintQuery(complaint_id);

  return complaint;
};
