import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import hooksRouter from "./routes/hooks.routes";
import engagementRoutes from "./routes/engagement.routes";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use("/api/hooks", hooksRouter);
app.use("/api/hooks", engagementRoutes);
app.get("/health", (req, res) => {
  res.send("Music Reel Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
