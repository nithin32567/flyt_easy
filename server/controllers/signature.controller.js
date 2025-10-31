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

    console.log(process.env.SIGNATURE_API, "signature api");
    console.log(process.env.MERCHANT_ID, "merchant id");
    console.log(process.env.API_KEY, "api key");
    console.log(process.env.CLIENT_ID, "client id");
    console.log(process.env.PASSWORD, "password");
  
    console.log(process.env.BROWSER_KEY, "browser key");
    console.log(process.env.KEY, "key");

    console.log(payload, "payload");
    
    

    // console.log(payload, "payload signature");
    const response = await fetch(process.env.SIGNATURE_API, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    // console.log(response, "response");
    const data = await response.json();
    console.log(data, "data");
    const token = data?.Token;
    console.log(token, "token");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not received" });
    }

    return res.status(200).json({
      success: true,
      token: token,
      ClientID: data?.ClientID,
      TUI: data?.TUI, // Include TUI from signature response
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
