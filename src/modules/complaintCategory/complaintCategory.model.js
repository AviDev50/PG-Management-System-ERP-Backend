import db from "../../common/config/db.js";

/*----------------------CREATE CATEGORY---------------*/

export const createCategoryQuery = async (category_name) => {
  const [result] = await db.query(
    `
    INSERT INTO complaint_categories
    (
      category_name
    )
    VALUES (?)
  `,
    [category_name],
  );

  return result;
};

/*--------------------GET ALL CATEGORIES-------------------------------*/

export const getCategoriesQuery = async () => {
  const [rows] = await db.query(`
      SELECT
        category_id,
        category_name,
        created_at,
        updated_at
      FROM complaint_categories
      ORDER BY category_name ASC
    `);

  return rows;
};

/*===========================================================================
| GET CATEGORY BY ID
===========================================================================*/

export const getCategoryByIdQuery = async (category_id) => {
  const [rows] = await db.query(
    `
      SELECT
        category_id,
        category_name,
        created_at,
        updated_at
      FROM complaint_categories
      WHERE category_id = ?
      LIMIT 1
    `,
    [category_id],
  );

  return rows[0];
};

/*===========================================================================
| DELETE CATEGORY
===========================================================================*/

export const deleteCategoryQuery = async (category_id) => {
  const [result] = await db.query(
    `
      DELETE FROM complaint_categories
      WHERE category_id = ?
    `,
    [category_id],
  );

  return result;
};

/*===========================================================================
| UPDATE CATEGORY
===========================================================================*/

export const updateCategoryQuery = async (category_id, category_name) => {
  const [result] = await db.query(
    `
      UPDATE complaint_categories
      SET
        category_name = ?,
        updated_at = NOW()
      WHERE category_id = ?
    `,
    [category_name, category_id],
  );

  return result;
};
