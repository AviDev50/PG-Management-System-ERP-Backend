import {
  addElectricityReadingService,
  getElectricityReadingsService,
  generateTenantBillsService,
  getTenantBillsService,
  markBillPaidService,
} from "./electricity.service.js";

/*===========================================================================
| ADD ELECTRICITY READING
===========================================================================*/
export const addElectricityReading = async (req, res) => {
  try {
    const result = await addElectricityReadingService(req.body);

    return res.status(201).json({
      success: true,
      message: "Electricity reading added successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*===========================================================================
|
| GET ALL ELECTRICITY READINGS
|
===========================================================================*/
export const getElectricityReadings = async (req, res) => {
  try {
    const result = await getElectricityReadingsService();

    return res.status(200).json({
      success: true,
      message: "Electricity readings fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*===========================================================================
|
| GENERATE TENANT ELECTRICITY BILLS
| Splits room bill equally among active tenants.
===========================================================================*/
export const generateTenantBills = async (req, res) => {
  try {
    const { reading_id } = req.params;

    const result = await generateTenantBillsService(reading_id);

    return res.status(201).json({
      success: true,
      message: "Tenant electricity bills generated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*===========================================================================
|
| GET ALL TENANT ELECTRICITY BILLS
| Returns tenant-wise electricity bills.
===========================================================================*/
export const getTenantBills = async (req, res) => {
  try {
    const result = await getTenantBillsService();

    return res.status(200).json({
      success: true,
      message: "Tenant electricity bills fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*===========================================================================
|
| MARK ELECTRICITY BILL AS PAID
| Updates bill status to paid.
===========================================================================*/
export const markBillPaid = async (req, res) => {
  try {
    const { bill_id } = req.params;

    const result = await markBillPaidService(bill_id);

    return res.status(200).json({
      success: true,
      message: "Bill marked as paid",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
