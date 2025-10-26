import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import logger from "./middlewares/logger.js";

import authRoutesV1 from "./routes/v1/authRoutes.js";
import userRoutesV1 from "./routes/v1/userRoutes.js";


dotenv.config();
const app = express();

app.use(
    cors({
        // origin: "http://localhost:5173",
        origin: "*",
        credentials: true,
    })
);

app.use(express.json());
app.use(logger);

app.use("/api/v1/auth", authRoutesV1);
app.use("/api/v1/users", userRoutesV1);


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
