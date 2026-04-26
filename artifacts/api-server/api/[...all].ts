import app from "../src/app";

// Vercel's @vercel/node runtime invokes the default export as a standard
// Node `(req, res)` handler. Express apps already match that signature, so
// re-exporting the app here lets Vercel forward every `/api/*` request
// straight into the existing router (`app.use("/api", router)`).
export default app;
