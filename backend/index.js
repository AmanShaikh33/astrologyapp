import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDb } from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import astrologerRoutes from "./routes/astrologerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();
connectDb();

app.use(cors());
app.use(express.json());

// ✅ Serve the uploads folder as static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/astrologers", astrologerRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("AstroTalk Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
