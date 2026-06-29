import * as categoryModel from "./complaintCategory.model.js";

/*===========================================================================
| CREATE CATEGORY
===========================================================================*/

export async function createCategory(payload) {
  const { branch_id, category_name, description } = payload;

  if (!branch_id || !category_name) {
    const error = new Error("branch_id and category_name are required");
    error.statusCode = 400;
    throw error;
  }

  const result = await categoryModel.createCategoryQuery({
    branch_id,
    category_name,
    description,
  });

  return await categoryModel.getCategoryByIdQuery(result.insertId);
}

/*===========================================================================
| GET CATEGORIES (role-based scoping)
===========================================================================*/

export async function getCategories(user) {
  if (user.role === "super_admin") {
    return await categoryModel.getAllCategoriesQuery();
  }

  if (user.role === "admin") {
    return await categoryModel.getCategoriesByUserBranchesQuery(user.user_id);
  }

  if (user.role === "branch_manager") {
    return await categoryModel.getCategoriesByBranchQuery(user.branch_id);
  }

  return [];
}

/*===========================================================================
| GET CATEGORIES (TENANT SIDE - own branch only)
===========================================================================*/

export async function getCategoriesTenantSide(branch_id) {
  return await categoryModel.getCategoriesByBranchQuery(branch_id);
}

/*===========================================================================
| UPDATE CATEGORY
===========================================================================*/

export async function updateCategory(category_id, payload) {
  const category = await categoryModel.getCategoryByIdQuery(category_id);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const category_name = payload.category_name ?? category.category_name;
  const description = payload.description ?? category.description;

  await categoryModel.updateCategoryQuery(category_id, { category_name, description });

  return await categoryModel.getCategoryByIdQuery(category_id);
}

/*===========================================================================
| DELETE CATEGORY
===========================================================================*/

export async function deleteCategory(category_id) {
  const category = await categoryModel.getCategoryByIdQuery(category_id);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  await categoryModel.deleteCategoryQuery(category_id);

  return category;
}