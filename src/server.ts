import dotenv from "dotenv";
dotenv.config();

import express, { Application } from 'express';
import noteRoutes  from "./routes/notesRoutes";
import authRoutes from "./routes/authRoutes";


const app:Application = express();
app.use(express.json());

app.use('/api/notes', noteRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log(`Server running on PORT: ${5000}`));
