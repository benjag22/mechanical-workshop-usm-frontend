export type FieldError = {
  field: string;
  message: string;
}

export type ParsedError = {
  code?: number;
  message: string;
  fieldErrors?: FieldError[];
}

export function parseApiError(error: unknown, defaultMessage = "Error desconocido"): ParsedError {
  if (!error) {
    return { message: defaultMessage };
  }

  if (typeof error === "string") {
    return { message: error || defaultMessage };
  }

  if (typeof error === "object") {
    if ("code" in error && "message" in error && "errors" in error) {
      const apiError = error as { code: number; message: string; errors: FieldError[] };

      return {
        code: apiError.code,
        message: apiError.message,
        fieldErrors: Array.isArray(apiError.errors) ? apiError.errors : undefined
      };
    }

    if ("detail" in error) {
      if (typeof error.detail === "string") {
        return { message: error.detail };
      }

      if (
        error.detail &&
        typeof error.detail === "object" &&
        "msg" in error.detail &&
        typeof error.detail.msg === "string"
      ) {
        return { message: error.detail.msg };
      }

      if (Array.isArray(error.detail)) {
        const errorMessage = error.detail.map(e => e.msg).join(", ");
        return { message: errorMessage || defaultMessage };
      }
    }

    if ("message" in error && typeof error.message === "string") {
      return { message: error.message };
    }
  }

  return { message: defaultMessage };
}