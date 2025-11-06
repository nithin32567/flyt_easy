import axios from "axios";

export const getTravelCheckList = async (req, res) => {
  console.log('=== BACKEND: FLIGHT GET TRAVEL CHECK LIST REQUEST ===');
  console.log('Flight Get Travel Check List Payload ===>');
  console.log(JSON.stringify(req.body, null, 2));
  console.log('=== END FLIGHT GET TRAVEL CHECK LIST PAYLOAD ===');
  
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

    console.log('=== BACKEND: FLIGHT GET TRAVEL CHECK LIST RESPONSE ===');
    console.log('Flight Get Travel Check List Response JSON ===>');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('=== END FLIGHT GET TRAVEL CHECK LIST RESPONSE ===');

    const responseToSend = {
      success: true,
      data: response.data,
      payload: payload,
      response: response.data,
      message: "Travel checklist retrieved successfully",
    };
    
    console.log('=== BACKEND: FLIGHT GET TRAVEL CHECK LIST RESPONSE TO CLIENT ===');
    console.log('Flight Get Travel Check List Response to Client JSON ===>');
    console.log(JSON.stringify(responseToSend, null, 2));
    console.log('=== END FLIGHT GET TRAVEL CHECK LIST RESPONSE TO CLIENT ===');
    
    return res.status(200).json(responseToSend);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.response?.data?.Msg?.[0] || error.message || "Failed to retrieve travel checklist"
    });
  }
};

