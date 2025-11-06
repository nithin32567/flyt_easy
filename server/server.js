import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/index.routes.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";

// import passport from "passport";


dotenv.config();

connectDB();
const __dirname = path.resolve();

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:3000",
  "http://147.93.18.244",
  "http://preview.flyteasy.com",

  "https://flyteasy.com",
  "https://www.flyteasy.com",
  "https://www.preview.flyteasy.com",
  "https://preview.flyteasy.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS Error: Origin not allowed:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'search-tracing-key',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  const origin = req.headers.origin || 'same-origin';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`Origin: ${origin}`);
  next();
});

app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.use("/api", indexRoutes);




const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
