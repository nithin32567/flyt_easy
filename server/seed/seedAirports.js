import mongoose from "mongoose";
import dotenv from "dotenv";
import Airport from "../models/airport.model.js";
import fs from "fs";

dotenv.config();

const seedAirports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    await Airport.deleteMany({});
    console.log("Old airport data deleted");

    const rawData = fs.readFileSync("./data/airports.json", "utf-8");
    const jsonData = JSON.parse(rawData);

    const airports = jsonData.Airports;
    
    await Airport.insertMany(airports);
    console.log("New airport data inserted successfully");

    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedAirports();
