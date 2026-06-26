import * as tenantsService from "./tenants.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";
import cloudinary from "../../common/config/cloudinary.js";

/*===========================================================================
| CREATE TENANT
===========================================================================*/

export async function createTenant(req, res) {
  try {
    if (req.files?.profile_image?.[0]) {
      const profileUpload = await cloudinary.uploader.upload(
        req.files.profile_image[0].path,
        { folder: "pg_erp/profile" },
      );

      req.body.profile_image = profileUpload.secure_url;
    }

    if (req.files?.document_image?.[0]) {
      const documentUpload = await cloudinary.uploader.upload(
        req.files.document_image[0].path,
        { folder: "pg_erp/documents" },
      );

      req.body.document_image = documentUpload.secure_url;
    }

    const data = await tenantsService.createTenant(req.body);

    return successResponse(res, data, "Tenant created successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| GET TENANTS
===========================================================================*/

export async function getTenants(req, res) {
  try {
    const data = await tenantsService.getTenants(req.user);

    return successResponse(res, data, "Tenants fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| VACATE TENANT
===========================================================================*/

export async function vacateTenant(req, res) {
  try {
    const data = await tenantsService.vacateTenant(req.params.id);

    return successResponse(res, data, "Tenant vacated successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| GET TENANT COUNT BY BRANCH
===========================================================================*/

export async function getTenantCountByBranch(req, res) {
  try {
    const { branch_id } = req.params;

    const data = await tenantsService.getTenantCountByBranch(branch_id);

    return successResponse(res, data, "Tenants fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| GET TENANT BY ID
===========================================================================*/

export async function getTenantById(req, res) {
  try {
    const { tenant_id } = req.params;

    const data = await tenantsService.getTenantById(tenant_id);

    return successResponse(res, data, "Tenant fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| GET TENANT DETAILS (TENANT SIDE - own profile only)
===========================================================================*/

export async function getTenantDetailsTenantSide(req, res) {
  try {
    const data = await tenantsService.getTenantDetailsTenantSide(req.user.tenant_id);

    return successResponse(res, data, "Tenant details fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| UPDATE TENANT
===========================================================================*/

export async function updateTenant(req, res) {
  try {
    const { tenant_id } = req.params;

    if (req.files?.profile_image?.[0]) {
      const profileUpload = await cloudinary.uploader.upload(
        req.files.profile_image[0].path,
        { folder: "pg_erp/profile" },
      );

      req.body.profile_image = profileUpload.secure_url;
    }

    if (req.files?.document_image?.[0]) {
      const documentUpload = await cloudinary.uploader.upload(
        req.files.document_image[0].path,
        { folder: "pg_erp/documents" },
      );

      req.body.document_image = documentUpload.secure_url;
    }

    const data = await tenantsService.updateTenant(tenant_id, req.body);

    return successResponse(res, data, "Tenant updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| DELETE TENANT
===========================================================================*/

export async function deleteTenant(req, res) {
  try {
    const { tenant_id } = req.params;

    const data = await tenantsService.deleteTenant(tenant_id);

    return successResponse(res, data, "Tenant deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}