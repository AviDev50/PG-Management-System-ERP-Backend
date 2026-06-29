import * as categoryService from "./complaintCategory.service.js";
import { successResponse, errorResponse } from "../../common/utils/response.js";

/*===========================================================================
| CREATE CATEGORY
===========================================================================*/

export async function createCategory(req, res) {
  try {
    const data = await categoryService.createCategory(req.body);

    return successResponse(res, data, "Category created successfully");
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return errorResponse(res, "Category already exists", 400);
    }

    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| GET ALL CATEGORIES
===========================================================================*/

export async function getCategories(req, res) {
  try {
    const data = await categoryService.getCategories(req.user);

    return successResponse(res, data, "Categories fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| GET CATEGORIES (TENANT SIDE)
===========================================================================*/

export async function getCategoriesTenantSide(req, res) {
  try {
    const data = await categoryService.getCategoriesTenantSide(req.user.branch_id);

    return successResponse(res, data, "Categories fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| UPDATE CATEGORY
===========================================================================*/

export async function updateCategory(req, res) {
  try {
    const data = await categoryService.updateCategory(req.params.id, req.body);

    return successResponse(res, data, "Category updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}

/*===========================================================================
| DELETE CATEGORY
===========================================================================*/

export async function deleteCategory(req, res) {
  try {
    const data = await categoryService.deleteCategory(req.params.id);

    return successResponse(res, data, "Category deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
}