import * as electricityService from "./electricity.service.js";

/*===========================================================================
| ADD ELECTRICITY READING
===========================================================================*/
export const addElectricityReading = async (req, res) => {
  try {
    const result = await electricityService.addElectricityReadingService(
      req.body
    );

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
| GET ALL ELECTRICITY READINGS
===========================================================================*/
export const getElectricityReadings = async (req, res) => {
  try {
    const result =
      await electricityService.getElectricityReadingsService(req.query);

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
| GENERATE TENANT ELECTRICITY BILLS
===========================================================================*/
export const generateTenantBills = async (req, res) => {
  try {
    const { reading_id } = req.params;

    const result =
      await electricityService.generateTenantBillsService(reading_id);

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
| GET TENANT ELECTRICITY BILLS
===========================================================================*/
export const getTenantBills = async (req, res) => {
  try {
    const result =
      await electricityService.getTenantBillsService(req.query);

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
| MARK BILL AS PAID
===========================================================================*/
export const markBillPaid = async (req, res) => {
  try {
    const { bill_id } = req.params;

    const result =
      await electricityService.markBillPaidService(bill_id);

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