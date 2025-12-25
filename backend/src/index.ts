import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/routes";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env["PORT"] || 4000;

// CORS Configuration with dynamic origin
app.use(
  cors({
    // 'true' ka matlab hai ke jo bhi request bhej raha hai usay allow karo (Dynamic Origin)
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
      "Origin",
    ],
    credentials: true, // Cookies aur Auth headers ke liye zaroori hai
    optionsSuccessStatus: 200, // Legacy browsers ke liye
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
