import axios from "axios";

export const createItenary = async (req, res) => {
  try {
    const payload = req.body;

    const response = await axios.post(
      "https://b2bapiflights.benzyinfotech.com/Flights/CreateItinerary",
      payload,
      {
        headers: {
          "Content-Type": "application/json",   
          "Authorization": `Bearer ${req.headers.authorization?.split(" ")[1]}`,
        },
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Create Itinerary Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create itinerary",
      error: error?.response?.data || error.message,
    });
  }
};
