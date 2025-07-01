
import mongoose from "mongoose";

const airportSchema = new mongoose.Schema({
  Code: { type: String, required: true },
  Name: { type: String, required: true },
  Alias: { type: String },
  Country: { type: String },
  CityName: { type: String },
  CityCode: { type: String },
  Type: { type: String },
  LogoPath: { type: String },
});

const Airport = mongoose.model("Airport", airportSchema);

export default Airport;
