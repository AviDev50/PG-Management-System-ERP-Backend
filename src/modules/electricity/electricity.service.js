import {
  createElectricityReading,
  getElectricityReadingsModel,
  generateTenantBillsModel,
  getTenantBillsModel,
  markBillPaidModel,
} from "./electricity.model.js";

/*===========================================================================
| ADD ELECTRICITY READING
===========================================================================*/

export const addElectricityReadingService = async (data) => {
  const { room_id, start_reading, end_reading, unit_price, bill_month } = data;

  if (!room_id) {
    throw new Error("Room is required");
  }

  if (start_reading == null) {
    throw new Error("Start reading is required");
  }

  if (end_reading == null) {
    throw new Error("End reading is required");
  }

  if (!unit_price) {
    throw new Error("Unit price is required");
  }

  if (!bill_month) {
    throw new Error("Bill month is required");
  }

  /*---------------------------------------------------------
  | Reading Validation
  ---------------------------------------------------------*/
  if (Number(end_reading) <= Number(start_reading)) {
    throw new Error("End reading must be greater than start reading");
  }

  return await createElectricityReading(data);
};

/*===========================================================================
|
| GET ALL ELECTRICITY READINGS
|
===========================================================================*/
export const getElectricityReadingsService = async () => {
  return await getElectricityReadingsModel();
};


/*===========================================================================
|
| GENERATE TENANT BILLS
|
===========================================================================*/
export const generateTenantBillsService = async (reading_id) => {
  if (!reading_id) {
    throw new Error("Reading ID is required");
  }

  return await generateTenantBillsModel(reading_id);
};


/*===========================================================================
|
| GET ALL TENANT ELECTRICITY BILLS
|
===========================================================================*/
export const getTenantBillsService = async () => {
  return await getTenantBillsModel();
};

/*===========================================================================
|
| MARK BILL AS PAID
|
===========================================================================*/
export const markBillPaidService = async (bill_id) => {
  if (!bill_id) {
    throw new Error("Bill ID is required");
  }

  return await markBillPaidModel(bill_id);
};
