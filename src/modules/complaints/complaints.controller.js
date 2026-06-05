import * as complaintsService from "./complaints.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";

/*===========================================================================
| CREATE COMPLAINT
===========================================================================*/

export const createComplaint = async (req, res) => {
  try {
    const data = await complaintsService.createComplaint(req.body, req.user);

    return successResponse(res, data, "Complaint created successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*===========================================================================

| GET COMPLAINTS

===========================================================================*/

export const getComplaints = async (req, res) => {
  try {
    const data = await complaintsService.getComplaints(req.user);

    return successResponse(res, data, "Complaints fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*===========================================================================

| RESOLVE COMPLAINT

===========================================================================*/

export const resolveComplaint = async (req, res) => {
  try {
    const data = await complaintsService.resolveComplaint(req.params.id);

    return successResponse(res, data, "Complaint resolved successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*===========================================================================

| UPDATE COMPLAINT

===========================================================================*/

export const updateComplaint = async (req, res) => {
  try {
    const data = await complaintsService.updateComplaint(
      req.params.id,
      req.body,
    );

    return successResponse(res, data, "Complaint updated successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*===========================================================================

| DELETE COMPLAINT

===========================================================================*/

export const deleteComplaint = async (req, res) => {
  try {
    const data = await complaintsService.deleteComplaint(req.params.id);

    return successResponse(res, data, "Complaint deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*----------Get complaint by branch----------*/

export const getComplaintCountByBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;

    const complaints =
      await complaintsService.getComplaintsByBranchService(branch_id);

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
};
