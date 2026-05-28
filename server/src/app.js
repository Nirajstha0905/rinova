import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import leadRoutes from "./routes/lead.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use("/api/leads", leadRoutes);
export default app;