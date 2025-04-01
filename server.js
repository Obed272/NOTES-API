import express from 'express';
import dotenv from "dotenv";
import noteRoutes  from "./routes/noteRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/notes', noteRoutes)

app.listen(5000, () => console.log(`Server running on PORT: ${5000}`));
