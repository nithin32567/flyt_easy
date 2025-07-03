import axios from "axios";

export const getWebSettings = async (req, res) => {
  console.log('======================================');
  
  
  try {
    const ClientID = req.ClientID;
    const TUI = req.TUI;
    const Token = req.Token;
    const payload = { ClientID, TUI, Token };
    console.log(payload, "payload");

    const response = await axios.post(
      `${process.env.UTILS_URL}/Utils/WebSettings`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch web settings",
      error: err.message,
    });
  }
};
