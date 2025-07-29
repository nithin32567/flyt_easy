import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/index.routes.js";
import hotelBookingRoutes from "./routes/hotelBooking.routes.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();

connectDB();
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://147.93.18.244",
  "https://your-domain.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }

  },
  credentials: true, // enable if using cookies/JWT headers
};

app.use(cors(corsOptions));

app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.use("/api", indexRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
