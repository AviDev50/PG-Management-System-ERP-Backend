import * as categoryModel from "./complaintCategory.model.js";

/*===========================================================================
| CREATE CATEGORY
===========================================================================*/

export const createCategory = async (payload) => {
  const { category_name } = payload;

  if (!category_name) {
    throw new Error("Category name is required");
  }

  const result = await categoryModel.createCategoryQuery(category_name);

  return await categoryModel.getCategoryByIdQuery(result.insertId);
};

/*===========================================================================
| GET ALL CATEGORIES
===========================================================================*/

export const getCategories = async () => {
  return await categoryModel.getCategoriesQuery();
};

/*===========================================================================
| DELETE CATEGORY
===========================================================================*/

export const deleteCategory = async (category_id) => {
  const category = await categoryModel.getCategoryByIdQuery(category_id);

  if (!category) {
    throw new Error("Category not found");
  }

  await categoryModel.deleteCategoryQuery(category_id);

  return category;
};

/*===========================================================================
| UPDATE CATEGORY
===========================================================================*/

export const updateCategory = async (category_id, payload) => {
  const { category_name } = payload;

  const category = await categoryModel.getCategoryByIdQuery(category_id);

  if (!category) {
    throw new Error("Category not found");
  }

  await categoryModel.updateCategoryQuery(category_id, category_name);

  return await categoryModel.getCategoryByIdQuery(category_id);
};
