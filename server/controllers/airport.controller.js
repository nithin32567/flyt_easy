import Airport from "../models/airport.model.js";

export const getAirports = async (req, res) => {
  try {
    const airports = await Airport.find();
    res.status(200).json(airports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

