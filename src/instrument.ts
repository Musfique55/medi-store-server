import "dotenv/config";
import * as Sentry from "@sentry/node";
import { AppError } from "./helper/AppError";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    beforeSend(event, hint) {
      const error = hint.originalException;
      
      // If it is an AppError and the status code is client-side (e.g. < 500), do not report it.
      if (error instanceof AppError && error.statusCode < 500) {
        return null;
      }
      
      return event;
    },
  });
  console.log("[Sentry] Initialized successfully.");
} else {
  console.warn("[Sentry] DSN not found. Sentry error tracking is disabled.");
}
