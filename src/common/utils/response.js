export const successResponse = (res, data = null, message = "Success") => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res,
  message,
  statusCode = 400
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};