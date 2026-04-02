import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import authRoutes from './presentation/routes/auth.routes'

import { connectDB } from "./infrastructure/database/mongoose-client";



const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json()); 
app.use('/',authRoutes)




app.use(express.urlencoded({ extended: true }));




// Connect database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
