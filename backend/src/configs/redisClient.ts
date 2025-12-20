import Redis from "ioredis";

const redis = new Redis(process.env["REDIS_URL"]!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  reconnectOnError: (err) => {
    const targetErrors = ["READONLY", "ECONNRESET", "ETIMEDOUT"];
    return targetErrors.some((e) => err.message.includes(e));
  },
  lazyConnect: false,
});

redis.on("connect", () => {
  console.log("🔗 Redis connected");
});

redis.on("ready", () => {
  console.log("⚡ Redis ready for commands");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

redis.on("close", () => {
  console.error("🔌 Redis connection closed");
});

export default redis;
