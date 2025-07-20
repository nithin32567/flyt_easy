// import axios from "axios";

export const generateToken = async (req, res) => {
  try {
    const payload = {
      MerchantID: process.env.MERCHANT_ID,
      ApiKey: process.env.API_KEY,
      ClientID: process.env.CLIENT_ID.trim(),
      Password: process.env.PASSWORD.trim(),
      AgentCode: "",
      BrowserKey: process.env.BROWSER_KEY,
      Key: process.env.KEY,
    };

    const response = await fetch(process.env.SIGNATURE_API, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
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
      ClientID: data?.ClientID,
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
