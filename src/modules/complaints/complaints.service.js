// complaints.service.js

import {
  getTenantById,
  createComplaintQuery,
  getComplaintById,
  getComplaintsQuery,
  resolveComplaintQuery,
  updateComplaintQuery,
  deleteComplaintQuery,
} from "./complaints.model.js";

/*===========================================================================

| CREATE COMPLAINT
| Complaint create karta hai

===========================================================================*/

export const createComplaint = async (payload) => {
  const { tenant_id, title, description, category } = payload;

  /*--------------------------------------------------
  | CHECK TENANT
  --------------------------------------------------*/

  const tenant = await getTenantById(tenant_id);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  if (!tenant.room_id) {
    throw new Error("Tenant is not assigned to any room");
  }

  /*--------------------------------------------------
  | CREATE COMPLAINT
  --------------------------------------------------*/

  const result = await createComplaintQuery({
    tenant_id,
    branch_id: tenant.branch_id,
    room_id: tenant.room_id,
    title,
    description,
    category,
  });

  /*--------------------------------------------------
  | FETCH CREATED COMPLAINT
  --------------------------------------------------*/

  const complaint = await getComplaintById(result.insertId);

  return complaint;
};

/*===========================================================================

| GET COMPLAINTS
| Complaints list laata hai

===========================================================================*/

export const getComplaints = async () => {
  return await getComplaintsQuery();
};

/*===========================================================================

| RESOLVE COMPLAINT
| Complaint resolve karta hai

===========================================================================*/

export const resolveComplaint = async (complaint_id) => {
  const complaint = await getComplaintById(complaint_id);

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  const result = await resolveComplaintQuery(complaint_id);

  if (result.affectedRows === 0) {
    throw new Error("Complaint not resolved");
  }

  return {
    complaint_id,
    status: "resolved",
  };
};



/*-------------Update Complain--------------*/

export const updateComplaint = async (
  complaint_id,
  payload
) => {
  const complaint = await getComplaintById(
    complaint_id
  );

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  await updateComplaintQuery(
    complaint_id,
    payload
  );

  return await getComplaintById(
    complaint_id
  );
};


/*-----------Delete Complaint---------------*/
export const deleteComplaint = async (
  complaint_id
) => {
  const complaint = await getComplaintById(
    complaint_id
  );

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  await deleteComplaintQuery(
    complaint_id
  );

  return complaint;
};