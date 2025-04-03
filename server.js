import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import noteRoutes  from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js"


const app = express();
app.use(express.json());

app.use('/api/notes', noteRoutes);
app.use("/api/auth", authRoutes)

app.listen(5000, () => console.log(`Server running on PORT: ${5000}`));
