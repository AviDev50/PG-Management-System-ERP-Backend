import * as paymentsService from "./payments.service.js";

import { successResponse, errorResponse } from "../../common/utils/response.js";

/*--------------Create Payment-----------*/

export const createPayment = async (req, res) => {
  try {
    const data = await paymentsService.createPayment(req.body, req.user);

    return successResponse(res, data, "Payment created successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------Get Payments-----------*/

export const getPayments = async (req, res) => {
  try {
    const data = await paymentsService.getPayments(req.user, req.query);

    return successResponse(res, data, "Payments fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------GET PAYMENT BY ID---------------*/

export const getPaymentById = async (req, res) => {
  try {
    const data = await paymentsService.getPaymentById(
      req.params.payment_id,
      req.user,
    );

    return successResponse(res, data, "Payment fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};


/*--------------UPDATE PAYMENT---------------*/

export const updatePayment = async (req, res) => {
  try {
    const data = await paymentsService.updatePayment(
      req.params.payment_id,
      req.body,
      req.user,
    );

    return successResponse(res, data, "Payment updated successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------DELETE PAYMENT---------------*/

export const deletePayment = async (req, res) => {
  try {
    const data = await paymentsService.deletePayment(
      req.params.payment_id,
      req.user,
    );

    return successResponse(res, data, "Payment deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

/*--------------GET TENANT PAYMENT HISTORY---------------*/

export const getTenantPaymentHistory = async (req, res) => {
  try {
    const data = await paymentsService.getTenantPaymentHistory(
      req.params.tenant_id,
      req.user,
    );

    return successResponse(res, data, "Payment history fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};




/*===========================================================================
|
| GET MONTHLY SUMMARY
|
===========================================================================*/

export const getMonthlySummary = async (req, res) => {
  try {
    const data = await paymentsService.getMonthlySummary(
      req.user,
      req.query
    );

    return successResponse(
      res,
      data,
      "Monthly summary fetched successfully"
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};