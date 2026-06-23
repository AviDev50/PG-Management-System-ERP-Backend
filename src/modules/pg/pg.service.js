import {
  createPropertyQuery,
  getApprovedPropertiesQuery,
  getSinglePropertyQuery,
  updatePropertyQuery,
  deletePropertyQuery,
  approvePropertyQuery,
  getUserByEmailQuery,
  createUserQuery,
} from "./pg.model.js";

import bcryptjs from "bcryptjs";

/*------------------Create PG-------------*/

export const createProperty = async (payload) => {
  try {
    const {
      owner_name,
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      gst_number,
    } = payload;

    console.log("PAYLOAD =>", payload);

    const existingUser = await getUserByEmailQuery(email);

    console.log("EXISTING USER =>", existingUser);

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const defaultPassword = "PG@321";

    // password hash
    const password_hash = await bcrypt.hash(defaultPassword, 10);

    const userResult = await createUserQuery({
      role_id: 2,
      name: owner_name,
      email,
      password_hash,
    });

    console.log("USER RESULT =>", userResult);

    const user_id = userResult.insertId;

    console.log("USER ID =>", user_id);

    const propertyResult = await createPropertyQuery({
      user_id,
      owner_name,
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      gst_number,
    });

    console.log("PROPERTY RESULT =>", propertyResult);

    const property = await getSinglePropertyQuery(propertyResult.insertId);

    return {
      ...property,
      login_credentials: {
        email,
        password: defaultPassword,
      },
    };
  } catch (error) {
    console.log("CREATE PROPERTY ERROR =>", error);
    throw error;
  }
};

/*------------------Get Approved PG-------------*/

export const getApprovedProperties = async () => {
  return await getApprovedPropertiesQuery();
};

/*------------------Get Single PG-------------*/

export const getSingleProperty = async (property_id) => {
  const property = await getSinglePropertyQuery(property_id);

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};

/*------------------Update PG-------------*/

export const updateProperty = async (property_id, payload) => {
  const property = await getSinglePropertyQuery(property_id);

  if (!property) {
    throw new Error("Property not found");
  }

  await updatePropertyQuery(payload, property_id);

  return await getSinglePropertyQuery(property_id);
};

/*------------------Delete PG-------------*/

export const deleteProperty = async (property_id) => {
  const property = await getSinglePropertyQuery(property_id);

  if (!property) {
    throw new Error("Property not found");
  }

  await deletePropertyQuery(property_id);

  return null;
};

/*------------------Approve PG-------------*/

export const approveProperty = async (property_id) => {
  const property = await getSinglePropertyQuery(property_id);

  if (!property) {
    throw new Error("Property not found");
  }

  await approvePropertyQuery(property_id);

  return await getSinglePropertyQuery(property_id);
};
