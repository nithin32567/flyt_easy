import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.HOTEL_URL, "process.env.HOTEL_URL ========================= hotel search");

export const autosuggest = async (req, res) => {
  console.log(process.env.HOTEL_URL, "process.env.HOTEL_URL ========================= hotel search");
  try {
    const { term } = req.query;
    console.log(req.query, "req.query ========================= hotel search");
    console.log(term, "term ========================= hotel search");

    const response = await axios.get(`${process.env.HOTEL_URL}/api/content/autosuggest`, {
      params: { term },
    });

    const data = response.data;

    console.log(data, "data ========================= hotel search");
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
