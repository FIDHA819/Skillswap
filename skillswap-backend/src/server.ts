import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import authRoutes from './presentation/routes/auth.routes'
import { learnerRoutes } from "./presentation/routes/learner.routes";
import profileRoutes
from "./presentation/routes/profile.routes"
import sessionRoutes from './presentation/routes/session.routes'
import skillRoutes from "./presentation/routes/skill.routes"
import passport from './infrastructure/services/Passport'
import { LearnerDashboardController } from "./presentation/controllers/LearnerDashboard.controller";
import notificationRoutes from "./presentation/routes/notification.routes";
import connectionRoutes from "./presentation/routes/connection.routes";
import teacherPublicRoutes from "./presentation/routes/teacher.routes";
import { connectDB } from "./infrastructure/database/mongoose-client";




const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize())
app.use('/',authRoutes)
// app.use("/learner",learnerRoutes)
app.use("/profile", profileRoutes)
app.use("/session",sessionRoutes)
app.use("/skills",skillRoutes)
app.use("/notifications", notificationRoutes);
app.use("/connections",   connectionRoutes);
app.use("/teacher",       teacherPublicRoutes);



app.use(

"/uploads",

express.static(

path.join(
process.cwd(),
"uploads"
)

)

)




// Connect database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
