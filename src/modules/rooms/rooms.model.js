

import db from "../../common/config/db.js";

/*
|--------------------------------------------------------------------------
| Check Property Ownership
|--------------------------------------------------------------------------
*/

export const checkBranchOwnership = async (branch_id, user_id) => {
  const query = `
    SELECT branches.*
    FROM branches

    JOIN properties
      ON properties.property_id =
      branches.property_id

    WHERE branches.branch_id = ?
    AND properties.user_id = ?

    LIMIT 1
  `;

  const [results] = await db.query(query, [branch_id, user_id]);

  return results[0];
};

/*------------------Create Rooms-------------*/

export const createRoomQuery = async (room) => {
  const query = `
    INSERT INTO rooms
    (
      branch_id,
      name,
      floor,
      electricity_type,
      room_type,
      custom_room_type,
      room_ac_type,
      room_monthly_rent
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    room.branch_id,
    room.name,
    room.floor,
    room.electricity_type,
    room.room_type,
    room.custom_room_type,
    room.room_ac_type,
    room.room_monthly_rent,
  ]);

  return result;
};

/*------------------Get Rooms-------------*/

export const getRoomsQuery = async () => {
  const query = `
    SELECT
      rooms.*,

      branches.name AS branch_name,

      COUNT(beds.bed_id) AS total_beds,

      COALESCE(
        SUM(
          CASE
            WHEN beds.status = 'occupied'
            THEN 1
            ELSE 0
          END
        ),
        0
      ) AS occupied_beds,

      COALESCE(
        SUM(
          CASE
            WHEN beds.status = 'vacant'
            THEN 1
            ELSE 0
          END
        ),
        0
      ) AS vacant_beds

    FROM rooms

    JOIN branches
      ON branches.branch_id = rooms.branch_id

    LEFT JOIN beds
      ON beds.room_id = rooms.room_id
      AND beds.deleted_at IS NULL

    WHERE rooms.deleted_at IS NULL

    GROUP BY rooms.room_id

    ORDER BY rooms.room_id DESC
  `;

  const [results] = await db.query(query);

  return results;
};

/*------------------Get Single Room-------------*/

export const getSingleRoomQuery = async (room_id) => {
  const query = `
    SELECT
      rooms.*,

      branches.name AS branch_name,

      COUNT(beds.bed_id) AS total_beds,

      COALESCE(
        SUM(
          CASE
            WHEN beds.status = 'occupied'
            THEN 1
            ELSE 0
          END
        ),
        0
      ) AS occupied_beds,

      COALESCE(
        SUM(
          CASE
            WHEN beds.status = 'vacant'
            THEN 1
            ELSE 0
          END
        ),
        0
      ) AS vacant_beds

    FROM rooms

    JOIN branches
      ON branches.branch_id =
      rooms.branch_id

    LEFT JOIN beds
      ON beds.room_id =
      rooms.room_id
      AND beds.deleted_at IS NULL

    WHERE rooms.room_id = ?

    GROUP BY rooms.room_id

    LIMIT 1
  `;

  const [results] = await db.query(query, [room_id]);

  return results[0];
};

/*------------------Update Room-------------*/

export const updateRoomQuery = async (data, room_id) => {
  const query = `
    UPDATE rooms
    SET
      name = ?,
      floor = ?,
      electricity_type = ?,
      room_type = ?,
      room_ac_type = ?,
      room_monthly_rent = ?
    WHERE room_id = ?
  `;

  const [result] = await db.query(query, [
    data.name,
    data.floor,
    data.electricity_type,
    data.room_type,
    data.room_ac_type,
    data.room_monthly_rent,
    room_id,
  ]);

  return result;
};

/*------------------Delete Room-------------*/
export const deleteRoomQuery = async (room_id) => {
  const query = `
    DELETE FROM rooms
    WHERE room_id = ?
  `;

  const [result] = await db.query(query, [room_id]);

  return result;
};

/*------------------Create Beds-------------*/

export const createBedsQuery = async (
  room_id,
  total_beds,
  room_monthly_rent,
) => {
  const values = [];

  for (let i = 1; i <= total_beds; i++) {
    values.push([room_id, `Bed-${i}`, "single", "vacant", room_monthly_rent]);
  }

  const query = `
    INSERT INTO beds
    (
      room_id,
      label,
      bed_type,
      status,
      bed_monthly_rent
    )
    VALUES ?
  `;

  const [result] = await db.query(query, [values]);

  return result;
};

/*------------------Room Beds-------------*/

export const getRoomBedsQuery = async (room_id) => {
  const query = `
    SELECT
      beds.bed_id,
      beds.room_id,
      beds.label,
      beds.bed_type,
      beds.status,
      beds.bed_monthly_rent,

      CONCAT(
        tenants.first_name,
        ' ',
        tenants.last_name
      ) AS tenant_name

    FROM beds

    LEFT JOIN tenants
      ON tenants.bed_id = beds.bed_id
      AND tenants.status != 'vacated'

    WHERE beds.room_id = ?
    AND beds.deleted_at IS NULL

    ORDER BY beds.bed_id ASC
  `;

  const [results] = await db.query(query, [room_id]);

  return results;
};

/*-----------Get Rooms By Branch----------*/

export const getRoomsByBranchQuery = async (branch_id) => {
  const query = `
    SELECT
      rooms.*,

      branches.name AS branch_name,

      COUNT(beds.bed_id) AS total_beds,

      COALESCE(
        SUM(
          CASE
            WHEN beds.status = 'occupied'
            THEN 1
            ELSE 0
          END
        ),
        0
      ) AS occupied_beds,

      COALESCE(
        SUM(
          CASE
            WHEN beds.status = 'vacant'
            THEN 1
            ELSE 0
          END
        ),
        0
      ) AS vacant_beds

    FROM rooms

    JOIN branches
      ON branches.branch_id =
      rooms.branch_id

    LEFT JOIN beds
      ON beds.room_id =
      rooms.room_id

    WHERE rooms.branch_id = ?
    AND rooms.deleted_at IS NULL

    GROUP BY rooms.room_id

    ORDER BY rooms.room_id DESC
  `;

  const [results] = await db.query(query, [branch_id]);

  return results;
};
