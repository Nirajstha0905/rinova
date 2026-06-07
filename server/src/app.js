import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import AauthRoutes from './modules/auth/auth.routes.js';
import fileRoutes from './modules/files/files.routes.js';
// import leadRoutes from './modules/leads/lead.route.js';
// import noteRoutes from './modules/notes/notes.routes.js';
// import taskRoutes from './modules/tasks/tasks.routes.js';
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
import courseRoutes from "./routes/courseRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import applicationStageRoutes from "./routes/applicationStageRoutes.js";
import applicationHistoryRoutes from "./routes/applicationHistoryRoutes.js";
import academicRecordRoutes from "./routes/academicRecordRoutes.js";
import testScoreRoutes from "./routes/testScoreRoutes.js";
import workExperienceRoutes from './routes/workExperienceRoutes.js';
import dashboardRoutes from "./routes/dashboardRoutes.js";
import visaApplicationRoutes from "./routes/visaApplicationRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import DocumentChecklistRoutes from "./routes/documentChecklistRoutes.js";
import followupRoutes from "./routes/followupRoutes.js";
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
app.use("/api/activities", activityRoutes);
app.use("/api/application-stages", applicationStageRoutes);
app.use("/api/application-history", applicationHistoryRoutes);
app.use("/api/academic-records",academicRecordRoutes);
app.use("/api/test-scores", testScoreRoutes);
app.use("/api/work-experiences",workExperienceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/visa-applications",visaApplicationRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/students",studentProfileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/reports",reportRoutes);
app.use("/api/students", DocumentChecklistRoutes);
app.use("/api/followups", followupRoutes);

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
