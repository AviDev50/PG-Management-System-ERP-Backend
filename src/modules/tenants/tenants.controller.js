import * as tenantsService from "./tenants.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";

/*--------------Create Tenant-----------*/

export const createTenant = async (req, res) => {
  // console.log("REQ BODY =", req.body);
  try {
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

    return successResponse(
      res,
      data,
      "Tenant fetched successfully"
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};