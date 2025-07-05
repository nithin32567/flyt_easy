import axios from "axios";

export const generateToken = async (req, res) => {
  try {
    const { clientId, clientPassword } = req.body;
    console.log(clientId, clientPassword, "clientId, clientPassword");  
    if (!clientId || !clientPassword) {
      return res.status(400).json({
        success: false,
        message: "Client ID and password are required",
      });
    }
    if (clientId.trim() !== process.env.CLIENT_ID.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client ID is incorrect",
      });
    }
    if (clientPassword.trim() !== process.env.PASSWORD.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Password is incorrect" });
    }

    const payload = {
      MerchantID: process.env.MERCHANT_ID,
      ApiKey: process.env.API_KEY,
      ClientID: clientId?.trim() || process.env.CLIENT_ID.trim(),
      Password: clientPassword?.trim() || process.env.PASSWORD.trim(),
      AgentCode: "",
      BrowserKey: process.env.BROWSER_KEY,
      Key: process.env.KEY,
    };
    console.log(payload, "payload");

const response = await fetch(process.env.SIGNATURE_API, {
  method: "POST",
  body: JSON.stringify(payload),
  headers: { "Content-Type": "application/json" },
});
const data = await response.json();
    console.log(data, "response after gettting the api  ");
    const token = data?.Token;
    console.log(token, "token");
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not received" });
    }

    return res.status(200).json({
      success: true,
      token: token,
      ClientID:data?.ClientID,
      message: "Token generated successfully",
    });
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json({
      success: false,
      message: "Failed to generate token",
      error: err.message,
    });
  }
};
