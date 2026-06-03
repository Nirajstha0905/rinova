import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import AauthRoutes from './modules/auth/auth.routes.js';
import fileRoutes from './modules/files/files.routes.js';
// import leadRoutes from './modules/leads/lead.route.js';
import noteRoutes from './modules/notes/notes.routes.js';
import taskRoutes from './modules/tasks/tasks.routes.js';
// import userRoutes from './modules/users/users.routes.js';
import errorHandler from './middleware/errorHandler.js';
import ApiError from './utils/ApiError.js';
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import leadFollowupRoutes from "./routes/leadFollowupRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import courseRoutes from "./routes/courseRoutes.js"
import documentRoutes from "./routes/documentRoutes.js"
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'rinova-crm-api',
    timestamp: new Date().toISOString(),
  });
});


app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/lead-followups', leadFollowupRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/institutions', institutionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/documents", documentRoutes);
app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);



export default app;
