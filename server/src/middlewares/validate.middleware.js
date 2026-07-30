import { sendError } from "../utils/apiResponse.util.js";

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    console.log(error);

    if (error.name === "ZodError") {
      const formattedErrors = error?.errors?.map((err) => ({
        path: err.path?.join("."),
        message: err.message,
      }));
      return sendError(res, 400, "Validation failed", formattedErrors);
    }
    return sendError(res, 500, "Internal Server Error");
  }
};
