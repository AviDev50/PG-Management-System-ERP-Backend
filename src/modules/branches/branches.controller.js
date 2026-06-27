import * as branchesService from "./branches.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";
import cloudinary from "../../common/config/cloudinary.js";

//for new flow
export const createBranch = async (req, res) => {
  try {
    let photoUrls = [];

    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(
        req.files.map(async (file) => {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "pg_erp/branches",
          });
          return uploadResult.secure_url;
        }),
      );
    }

    req.body.branch_photos = photoUrls;

    // const data = await branchesService.createBranch(req.body, req.user.user_id);
    const data = await branchesService.createBranch(req.body, req.user);

    return successResponse(res, data, "Branch created successfully");
  } catch (error) {
    console.log(error);
    return errorResponse(res, error.message);
  }
};

/*--------------Get Branches-----------*/

export const getBranches = async (req, res) => {
  try {
    const data = await branchesService.getBranches(req.query.branch_id);

    return successResponse(res, data, "Branches fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Get Single Branch-----------*/

export const getSingleBranch = async (req, res) => {
  try {
    const data = await branchesService.getSingleBranch(req.params.id);

    return successResponse(res, data, "Branch fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Update Branch-----------*/

export const updateBranch = async (req, res) => {
  try {
    const oldBranch = await branchesService.getSingleBranch(req.params.id);

    let photoUrls = oldBranch.branch_photos || [];

    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(
        req.files.map(async (file) => {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "pg_erp/branches",
          });

          return uploadResult.secure_url;
        }),
      );
    }

    req.body.branch_photos = photoUrls;

    const data = await branchesService.updateBranch(req.params.id, req.body);

    return successResponse(res, data, "Branch updated successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Delete Branch-----------*/

export const deleteBranch = async (req, res) => {
  try {
    const data = await branchesService.deleteBranch(req.params.id);

    return successResponse(res, data, "Branch deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*---------Get Branches By Property id-----*/

export const getBranchesByPropertyId = async (req, res) => {
  try {
    const { property_id } = req.params;

    const data = await branchesService.getBranchesByPropertyId(property_id);

    return successResponse(res, data, "Branches fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Approve Branch-----------*/

export const approveBranch = async (req, res) => {
  try {
    const data = await branchesService.approveBranch(req.params.id, req.user);

    return successResponse(res, data, "Branch approved successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
