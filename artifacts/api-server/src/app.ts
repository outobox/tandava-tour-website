import express, { type Express, type ErrorRequestHandler, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import pinoHttp from "pino-http";
import helmet from "helmet";
import router from "./routes";
import { logger } from "./lib/logger";
import { generalApiLimiter } from "./middlewares/rateLimit";
import { getSessionSecret, getAllowedOrigins, isOriginAllowed } from "./lib/security";

const app: Express = express();
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.disable("etag");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Force HTTPS in production (behind Replit's edge proxy which sets X-Forwarded-Proto)
if (isProd) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const proto = (req.headers["x-forwarded-proto"] as string | undefined) ?? req.protocol;
    if (proto !== "https") {
      const host = req.headers.host ?? "";
      res.redirect(308, `https://${host}${req.originalUrl}`);
      return;
    }
    next();
  });
}

// Security headers — Helmet (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, etc.)
app.use(
  helmet({
    contentSecurityPolicy: false, // The frontend is responsible for its own CSP.
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true, preload: false } : false,
    frameguard: { action: "deny" },
  }),
);

// CORS — restrict to allowed origins (same-origin requests have no Origin header and are accepted)
const allowedOrigins = getAllowedOrigins();
app.use(
  cors({
    origin: (origin, cb) => {
      if (isOriginAllowed(origin, allowedOrigins)) {
        cb(null, true);
        return;
      }
      cb(new Error("Origin not allowed by CORS policy"));
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(
  session({
    name: "tandava.sid",
    secret: getSessionSecret(),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

// Apply a general rate limit on the entire API surface
app.use("/api", generalApiLimiter, router);

// 404 for unknown routes — never expose internal stack traces
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralised error handler — never leak stack traces to clients
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  req.log?.error({ err }, "Unhandled error");

  if (res.headersSent) return;

  const status = (err && typeof err === "object" && "status" in err && typeof err.status === "number")
    ? err.status
    : 500;

  res.status(status).json({
    error: status >= 500 || isProd
      ? "Internal server error"
      : (err?.message ?? "Request failed"),
  });
};

app.use(errorHandler);

export default app;
