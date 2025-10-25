import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getWebSettings = async (req, res) => {
  
  try {
    const ClientID = req.body.ClientID;
    const TUI = req.body.TUI;
    const payload = { ClientID, TUI };
    
    console.log("WebSettings Payload:======================", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `${process.env.UTILS_URL}/Utils/WebSettings`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("WebSettings Response:", JSON.stringify(response.data, null, 2));

    const responseData = {
      success: true,
      data: response.data,
    };


    return res.status(200).json(responseData);
  } catch (err) {

    const errorResponse = {
      success: false,
      message: "Failed to fetch web settings",
      error: err.message,
    };


    return res.status(500).json(errorResponse);
  }
};
