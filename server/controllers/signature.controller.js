// import axios from "axios";

export const generateToken = async (req, res) => {
  console.log("generateToken");
  try {
    const payload = {
      MerchantID: process.env.MERCHANT_ID,
      ApiKey: process.env.API_KEY,
      ClientID: process.env.CLIENT_ID.trim(),
      Password: process.env.PASSWORD.trim() || "SUB@743#92995",
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

    console.log(data, "data signature================================================");
    
    if (token) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      
      return res.status(200).json({
        success: true,
        token: token,
        ClientID: data?.ClientID,
        TUI: data?.TUI,
        message: "Token generated successfully",
      });
    }

    if (data?.Code === "5501" && data?.Msg) {
      return res.status(200).json({
        success: false,
        code: data.Code,
        message: Array.isArray(data.Msg) ? data.Msg.join(" ") : data.Msg,
        requiresOTP: true,
        ClientID: data?.ClientID,
        TUI: data?.TUI,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Token not received",
      data: data,
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
