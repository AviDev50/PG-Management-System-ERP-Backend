import * as complaintsService from "./complaints.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";

/*===========================================================================
| CREATE COMPLAINT
===========================================================================*/

export async function createComplaint(req, res) {
  try {
    const data = await complaintsService.createComplaint(req.body, req.user);

    return successResponse(res, data, "Complaint created successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

/*===========================================================================
| GET COMPLAINTS
===========================================================================*/

export async function getComplaints(req, res) {
  try {
    const data = await complaintsService.getComplaints(req.user);

    return successResponse(res, data, "Complaints fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

/*===========================================================================
| RESOLVE COMPLAINT
===========================================================================*/

export async function resolveComplaint(req, res) {
  try {
    const data = await complaintsService.resolveComplaint(req.params.id);

    return successResponse(res, data, "Complaint resolved successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

/*===========================================================================
| DELETE COMPLAINT
===========================================================================*/

export async function deleteComplaint(req, res) {
  try {
    const data = await complaintsService.deleteComplaint(req.params.id);

    return successResponse(res, data, "Complaint deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

/*===========================================================================
| GET COMPLAINTS BY BRANCH ID
===========================================================================*/

export async function getComplaintByBranchId(req, res) {
  try {
    const { branch_id } = req.params;

    const complaints = await complaintsService.getComplaintByBranchId(branch_id);

    return successResponse(
      res,
      {
        total_complaints: complaints.length,
        complaints,
      },
      "Complaints fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
}