import db from "../../common/config/db.js";

/*===========================================================================
| CREATE CATEGORY
===========================================================================*/

export async function createCategoryQuery(data) {
  const query = `
    INSERT INTO complaint_categories
      (branch_id, category_name, description)
    VALUES (?, ?, ?)
  `;

  const [result] = await db.query(query, [
    data.branch_id,
    data.category_name,
    data.description,
  ]);

  return result;
}

/*===========================================================================
| GET CATEGORY BY ID
===========================================================================*/

export async function getCategoryByIdQuery(category_id) {
  const query = `
    SELECT category_id, branch_id, category_name, description, created_at, updated_at
    FROM complaint_categories
    WHERE category_id = ?
    LIMIT 1
  `;

  const [rows] = await db.query(query, [category_id]);

  return rows[0];
}

/*===========================================================================
| GET CATEGORIES (scoped to admin's assigned branches)
===========================================================================*/

export async function getCategoriesByUserBranchesQuery(user_id) {
  const query = `
    SELECT cc.category_id, cc.branch_id, cc.category_name, cc.description, cc.created_at, cc.updated_at
    FROM complaint_categories cc
    JOIN user_branches ub
      ON ub.branch_id = cc.branch_id
    WHERE ub.user_id = ?
    ORDER BY cc.category_id DESC
  `;

  const [rows] = await db.query(query, [user_id]);

  return rows;
}

/*===========================================================================
| GET CATEGORIES (scoped to a single branch_id - for branch_manager)
===========================================================================*/

export async function getCategoriesByBranchQuery(branch_id) {
  const query = `
    SELECT category_id, branch_id, category_name, description, created_at, updated_at
    FROM complaint_categories
    WHERE branch_id = ?
    ORDER BY category_id DESC
  `;

  const [rows] = await db.query(query, [branch_id]);

  return rows;
}

/*===========================================================================
| GET ALL CATEGORIES (super_admin - unrestricted)
===========================================================================*/

export async function getAllCategoriesQuery() {
  const query = `
    SELECT category_id, branch_id, category_name, description, created_at, updated_at
    FROM complaint_categories
    ORDER BY category_id DESC
  `;

  const [rows] = await db.query(query);

  return rows;
}

/*===========================================================================
| UPDATE CATEGORY
===========================================================================*/

export async function updateCategoryQuery(category_id, data) {
  const query = `
    UPDATE complaint_categories
    SET
      category_name = ?,
      description = ?,
      updated_at = NOW()
    WHERE category_id = ?
  `;

  const [result] = await db.query(query, [
    data.category_name,
    data.description,
    category_id,
  ]);

  return result;
}

/*===========================================================================
| DELETE CATEGORY (hard delete - project standard)
===========================================================================*/

export async function deleteCategoryQuery(category_id) {
  const query = `DELETE FROM complaint_categories WHERE category_id = ?`;

  const [result] = await db.query(query, [category_id]);

  return result;
}