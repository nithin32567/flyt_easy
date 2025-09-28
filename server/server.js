import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/index.routes.js";
import hotelBookingRoutes from "./routes/hotelBooking.routes.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import session from 'express-session';
import passport from 'passport'
import GoogleOAuth2Strategy from 'passport-google-oauth20';

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


app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GoogleOAuth2Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
  // You can save user to DB here
  return done(null, profile);
}
));




app.use(express.static(path.resolve(__dirname, "../client/dist")));

app.use("/api", indexRoutes);


passport.use(new GoogleOAuth2Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
  // You can save user to DB here
  return done(null, profile);
}
));


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
