/** @type {import("./error-handling.js").HttpError} */
export class HttpError extends Error {
  constructor(message, statusCode, errorBody) {
    super(message);
    this.statusCode = statusCode;
    this.errorBody = errorBody;
  }
}

/** @type {import("./error-handling.js").ensureErrorType} */
export function ensureErrorType(error, fallbackMessage) {
  return error instanceof Error
    ? error
    : new Error(fallbackMessage, { cause: error });
}

/** @type {import("./error-handling.js").addErrorContext} */
export function addErrorContext(err, fallbackMessageOrContext, context) {
  let fallbackMessage = "Non-Error Type thrown!";

  if (typeof fallbackMessageOrContext === "string") {
    fallbackMessage = fallbackMessageOrContext;
  }
  else {
    context = fallbackMessageOrContext;
  }

  return Object.assign(ensureErrorType(err, fallbackMessage), context);
}

/** @type {import("./error-handling.js").safeTry} */
export function safeTry(fn, fallbackMessage) {
  try {
    const data = fn();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: ensureErrorType(err, fallbackMessage) };
  }
}
