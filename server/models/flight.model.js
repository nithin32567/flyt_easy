import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  flightNumber: String,
  from: String,
  to: String,
  date: Date,
  class: String,
  price: Number,
  airline: String,
});

export default mongoose.model("Flight", flightSchema);
