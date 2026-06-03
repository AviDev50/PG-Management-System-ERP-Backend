import * as categoryService from "./complaintCategory.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";

/*===========================================================================
| CREATE CATEGORY
===========================================================================*/

export const createCategory = async (req, res) => {
  try {
    const data = await categoryService.createCategory(req.body);

    return successResponse(res, data, "Category created successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*===========================================================================
| GET ALL CATEGORIES
===========================================================================*/

export const getCategories = async (req, res) => {
  try {
    const data = await categoryService.getCategories();

    return successResponse(res, data, "Categories fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*===========================================================================
| DELETE CATEGORY
===========================================================================*/

export const deleteCategory = async (req, res) => {
  try {
    const data = await categoryService.deleteCategory(req.params.id);

    return successResponse(res, data, "Category deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*===========================================================================
| UPDATE CATEGORY
===========================================================================*/

export const updateCategory = async (req, res) => {
  try {
    const data = await categoryService.updateCategory(req.params.id, req.body);

    return successResponse(res, data, "Category updated successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
