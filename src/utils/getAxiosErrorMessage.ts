export function getAxiosErrorMessage(error: unknown): string {
  type MaybeAxiosError = {
  response?: {
    data?: unknown;
    statusText?: string;
  };
  message?: string;
};

const maybeError = error as MaybeAxiosError;


  if (maybeError?.response) {
    const { data, statusText } = maybeError.response;

    if (typeof data === "string") return data;

    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string") return message;
    }

    return statusText || maybeError.message || "Error de servidor desconocido";
  }

  if (maybeError?.message && typeof maybeError.message === "string") {
    return maybeError.message;
  }

  return "Ocurrió un error inesperado";
}
