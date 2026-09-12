import rateLimit from "express-rate-limit";

const loginlimt = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

export { loginlimt };
