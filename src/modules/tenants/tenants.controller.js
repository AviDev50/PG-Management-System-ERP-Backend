import * as tenantsService from "./tenants.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";
import cloudinary from "../../common/config/cloudinary.js";

/*--------------Create Tenant-----------*/

export const createTenant = async (req, res) => {
  try {
    if (req.files?.profile_image?.[0]) {
      const profileUpload = await cloudinary.uploader.upload(
        req.files.profile_image[0].path,
        {
          folder: "pg_erp/profile",
        },
      );

      req.body.profile_image = profileUpload.secure_url;
    }

    if (req.files?.document_image?.[0]) {
      const documentUpload = await cloudinary.uploader.upload(
        req.files.document_image[0].path,
        {
          folder: "pg_erp/documents",
        },
      );

      req.body.document_image = documentUpload.secure_url;
    }

    const data = await tenantsService.createTenant(req.body);

    return successResponse(res, data, "Tenant created successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Get Tenants-----------*/

export const getTenants = async (req, res) => {
  try {
    const data = await tenantsService.getTenants(req.user);

    return successResponse(res, data, "Tenants fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Vacate Tenant-----------*/

export const vacateTenant = async (req, res) => {
  try {
    const data = await tenantsService.vacateTenant(req.params.id);

    return successResponse(res, data, "Tenant vacated successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*-------get Tenant By branch id------------*/

export const getTenantCountByBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;

    const data = await tenantsService.getTenantCountByBranch(branch_id);

    return successResponse(res, data, "Tenant fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*-------Get Tenant By ID------------*/

export const getTenantById = async (req, res) => {
  try {
    const { tenant_id } = req.params;

    const data = await tenantsService.getTenantById(tenant_id);

    return successResponse(res, data, "Tenant fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Update Tenant-----------*/


export const updateTenant = async (req, res) => {
  try {
    const { tenant_id } = req.params;

    if (req.files?.profile_image?.[0]) {
      const profileUpload = await cloudinary.uploader.upload(
        req.files.profile_image[0].path,
        {
          folder: "pg_erp/profile",
        }
      );

      req.body.profile_image = profileUpload.secure_url;
    }

    if (req.files?.document_image?.[0]) {
      const documentUpload = await cloudinary.uploader.upload(
        req.files.document_image[0].path,
        {
          folder: "pg_erp/documents",
        }
      );

      req.body.document_image = documentUpload.secure_url;
    }

    const data = await tenantsService.updateTenant(
      tenant_id,
      req.body
    );

    return successResponse(
      res,
      data,
      "Tenant updated successfully"
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, error.message);
  }
};


/*--------------Delete Tenant-----------*/

export const deleteTenant = async (req, res) => {
  try {
    const { tenant_id } = req.params;

    const data = await tenantsService.deleteTenant(tenant_id);

    return successResponse(res, data, "Tenant deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

