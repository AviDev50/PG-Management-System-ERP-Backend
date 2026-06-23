import {
  createRoomQuery,
  createBedsQuery,
  getRoomsQuery,
  getSingleRoomQuery,
  updateRoomQuery,
  deleteRoomQuery,
  getRoomBedsQuery,
  getRoomsByBranchQuery,
} from "./rooms.model.js";

/*------------------Create Rooms-------------*/

export const createRoom = async (payload) => {
  const {
    branch_id,
    name,
    floor,
    electricity_type,
    room_type,
    custom_room_type,
    custom_beds,
    room_ac_type,
    room_monthly_rent,
  } = payload;

  if (!branch_id) {
    throw new Error("Branch id is required");
  }

  if (!name) {
    throw new Error("Room name is required");
  }

  if (!room_type) {
    throw new Error("Room type is required");
  }

  const roomResult = await createRoomQuery({
    branch_id,
    name,
    floor,
    electricity_type,
    room_type,
    custom_room_type,
    room_ac_type,
    room_monthly_rent,
  });

  const room_id = roomResult.insertId;

  let totalBeds = 0;

  switch (room_type) {
    case "single":
      totalBeds = 1;
      break;

    case "double":
      totalBeds = 2;
      break;

    case "triple":
      totalBeds = 3;
      break;

    case "custom":
      totalBeds = Number(custom_beds);

      if (!totalBeds || totalBeds < 1) {
        throw new Error("Custom beds count is required");
      }
      break;

    default:
      throw new Error("Invalid room type");
  }

  await createBedsQuery(room_id, totalBeds, room_monthly_rent);

  const room = await getSingleRoomQuery(room_id);

  const beds = await getRoomBedsQuery(room_id);

  return {
    room_id,
    branch_id,
    name,
    floor,
    electricity_type,
    room_type,
    custom_room_type,
    room_ac_type,
    room_monthly_rent,

    total_beds: totalBeds,
    occupied_beds: 0,
    vacant_beds: totalBeds,

    beds,
  };
};

/*------------------Get Rooms-------------*/

export const getRooms = async () => {
  return await getRoomsQuery();
};

/*------------------Get Single Room-------------*/

export const getSingleRoom = async (room_id) => {
  const room = await getSingleRoomQuery(room_id);

  if (!room) {
    throw new Error("Room not found");
  }

  const beds = await getRoomBedsQuery(room_id);

  return {
    ...room,
    beds,
  };
};

/*------------------Update Room-------------*/

export const updateRoom = async (room_id, payload) => {
  const room = await getSingleRoomQuery(room_id);

  if (!room) {
    throw new Error("Room not found");
  }

  await updateRoomQuery(payload, room_id);

  const updatedRoom = await getSingleRoomQuery(room_id);

  const beds = await getRoomBedsQuery(room_id);

  return {
    ...updatedRoom,
    beds,
  };
};

/*------------------Delete Room-------------*/

export const deleteRoom = async (room_id) => {
  const room = await getSingleRoomQuery(room_id);

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.occupied_beds > 0) {
    throw new Error(
      "Cannot delete room: this room has occupied beds. Please vacate or transfer tenants first."
    );
  }

  await deleteRoomQuery(room_id);

  return {
    room_id,
  };
};
/*----------get data behalf of branch id-----*/
export const getRoomsByBranch = async (branch_id) => {
  return await getRoomsByBranchQuery(branch_id);
};
