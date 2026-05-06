import status from "http-status";
import { Prisma } from "../generated/prisma/client";

const handleStatusCode = (code: string) => {
  if (code === "2002") {
    return status.CONFLICT;
  }

  if (["2025", "2001", "2015", "2018"].includes(code)) {
    return status.NOT_FOUND;
  }

  if (["1000", "6002"].includes(code)) {
    return status.UNAUTHORIZED;
  }

  if (["1010", "6010"].includes(code)) {
    return status.FORBIDDEN;
  }

  if (code === "6003") {
    return status.PAYMENT_REQUIRED;
  }

  if (["1008", "2004", "6004"].includes(code)) {
    return status.GATEWAY_TIMEOUT;
  }

  if (code === "5011") {
    return status.TOO_MANY_REQUESTS;
  }

  if (code === "6009") {
    return 413;
  }

  if (code.startsWith("P1") || ["2024", "2037", "6008"].includes(code)) {
    return status.SERVICE_UNAVAILABLE;
  }

  if (code.startsWith("P2")) {
    return status.BAD_REQUEST;
  }

  if (code.startsWith("P3") || code.startsWith("P4")) {
    return status.INTERNAL_SERVER_ERROR;
  }
};

const handleMeta = (meta: Record<string, unknown>): string | undefined => {
  if (!meta) return;

  const parts: string[] = [];

  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }

  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }

  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }

  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }

  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }

  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }

  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }

  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }

  return parts.length > 0 ? parts.join(" |") : "";
};

export const handlePrismaClientKnownRequestError = (
  error: Prisma.PrismaClientKnownRequestError,
) => {
  const statusCode = handleStatusCode(error.code);
  const metaInfo = handleMeta(error.meta!);

  let cleanMessage = error.message;

  // Remove the "Invalid `prisma.user.create()` invocation: " part from the message for better readability
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");

  // split by new line and take the first line as the main message, rest can be added to error sources

  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage =
    lines[0] || "An error occurred with the database operation.";

  const errorSources: { path: string; message: string }[] = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage,
    },
  ];

  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause),
    });
  }

  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources,
  };
};

export const handlePrismaClientUnknownRequestError = (
  error: Prisma.PrismaClientUnknownRequestError,
) => {
  let cleanMessage = error.message;

  // Remove the "Invalid `prisma.user.create()` invocation: " part from the message for better readability
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");

  const lines = cleanMessage.split("\n").filter((line) => line.trim());

  const errorSources: { path: string; message: string }[] = [];

  // extract field name for field-specific validation errors
  // Example message: "Argument `data.email`: Got invalid value `invalid-email` on prisma.user.create()"
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";

  //main message

  const mainMessage =
    lines.find(
      (line) =>
        !line.includes("Argument") && !line.includes("→") && line.length > 10,
    ) ||
    lines[0] ||
    "Invalid query parameters provided to the database operation.";

  errorSources.push({
    path: fieldName as string,
    message: mainMessage,
  });

  return {
    success: false,
    statusCode: status.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources,
  };
};

export const handlePrismaClientValidationError = (
  error: Prisma.PrismaClientValidationError,
) => {
  let cleanMessage = error.message;

  // Remove the "Invalid `prisma.user.create()` invocation: " part from the message for better readability
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");

  const lines = cleanMessage.split("\n").filter((line) => line.trim());

  const errorSources: { path: string; message: string }[] = [];

  // extract field name for field-specific validation errors
  // Example message: "Argument `data.email`: Got invalid value `invalid-email` on prisma.user.create()"
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";

  //main message

  const mainMessage =
    lines.find(
      (line) =>
        !line.includes("Argument") && !line.includes("→") && line.length > 10,
    ) ||
    lines[0] ||
    "Invalid query parameters provided to the database operation.";

  errorSources.push({
    path: fieldName as string,
    message: mainMessage,
  });

  return {
    success: false,
    statusCode: status.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources,
  };
};

export const handlePrismaClientInitializationError = (
  error: Prisma.PrismaClientInitializationError,
) => {
  return {
    success: false,
    statusCode: status.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Initialization Error: ${error.message}`,
    errorSources: [
      {
        path: "",
        message: error.message,
      },
    ],
  };
};

export const handlePrismaClientUnknownError = (
  error: Prisma.PrismaClientUnknownRequestError,
) => {
  let cleanMessage = error.message;

  // Remove the "Invalid `prisma.user.create()` invocation: " part from the message for better readability
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");

  const lines = cleanMessage.split("\n").filter((line) => line.trim());

  const mainMessage =
    lines[0] || "An unknown error occurred with the database operation.";

  const errorSources: { path: string; message: string }[] = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage,
    },
  ];

  return {
    success: false,
    statusCode: status.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Error: ${mainMessage}`,
    errorSources,
  };
};

export const handlePrismaClientRustPanicError = (
  error: Prisma.PrismaClientRustPanicError,
) => {
  return {
    success: false,
    statusCode: status.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Rust Panic Error: ${error.message}`,
    errorSources: [
      {
        path: "",
        message: error.message,
      },
    ],
  };
};
