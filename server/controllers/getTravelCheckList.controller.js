import axios from "axios";

export const getTravelCheckList = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  try {
    const { ClientID, TUI } = req.body;
    
    if (!TUI) {
      return res.status(400).json({
        success: false,
        message: "TUI is required"
      });
    }

    const payload = {
      ClientID: ClientID,
      TUI: TUI
    };


    const response = await axios.post(
      `${process.env.FLIGHT_URL}/Utils/GetTravelCheckList`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      }
    );

    console.log("[GetTravelCheckList] Payload:==================", JSON.stringify(payload, null, 2));
    console.log("[GetTravelCheckList] Response.data:", JSON.stringify(response.data, null, 2));

    return res.status(200).json({
      success: true,
      data: response.data,
      payload: payload,
      response: response.data,
      message: "Travel checklist retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.response?.data?.Msg?.[0] || error.message || "Failed to retrieve travel checklist"
    });
  }
};

