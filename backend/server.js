import express from "express";
import bodyParser from "body-parser";
import reservationsRouter from "./src/routes/reservations.js";

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/api/reservations", reservationsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));