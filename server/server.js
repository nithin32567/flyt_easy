import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/index.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import razorpayRoutes from "./routes/razorpay.routes.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
dotenv.config();
connectDB();
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));



const allowedOrigins = [
  "http://localhost:5173",
  "http://147.93.18.244:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin"));
    }
  },
  credentials: true,
}));

// console.log(path.resolve(__dirname, "../client/dist"));

app.use(express.static(path.resolve(__dirname, "../client/dist")));




app.use("/api", indexRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api", razorpayRoutes);

// const PORT = process.env.PORT || 5000;
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
