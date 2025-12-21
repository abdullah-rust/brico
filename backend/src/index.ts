import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/routes";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env["PORT"] || 4000;

// Allowed origins list
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173", // Vite dev server
  "http://localhost:8080",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "https://yourdomain.com",
  "https://localhost",
  // Add more production domains here
];

// CORS Configuration with dynamic origin
app.use(
  cors({
    origin: function (origin, callback) {
      // Development mein allow all, production mein check karo
      if (!origin) return callback(null, true); // For mobile apps or server-to-server calls

      if (process.env["NODE_ENV"] === "development") {
        // Development mode - sab ko allow karo
        return callback(null, true);
      }

      // Production mode - sirf allowed origins ko allow karo
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
      "Origin",
    ],
    exposedHeaders: ["Content-Length", "X-Request-Id"],
    credentials: true, // Agar cookies/authentication chahiye to true rakho
    maxAge: 86400, // 24 hours - preflight cache duration
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/", router);

// Basic Route
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Brico Server is Running! (Express + TS)" });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
