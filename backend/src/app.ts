import express from "express";
import cors from "cors";
import errorMiddleware from "./middleware/errorMiddlware";
import authRoutes from "./routes/authRoutes";

const app = express();
const allowedOrigin = process.env.FRONTEND_URL;

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigin || true,
  }),
);
app.get("/", (req, res) => {
  return res.send("Server is running");
});
app.use("/api/auth", authRoutes);
app.use(errorMiddleware);
export default app;
