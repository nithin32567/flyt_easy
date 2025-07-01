import axios from "axios";

export const fetchSignatureToken = async (payload) => {
  try {
    const requestBody = {
      MerchantID: payload.MerchantID,
      ApiKey: payload.ApiKey,
      ClientID: payload.ClientID,
      Password: payload.Password,
      AgentCode: payload.AgentCode,
      BrowserKey: payload.BrowserKey,
    };

    // Replace with your actual signature endpoint URL
    const SIGNATURE_URL = 
      process.env.UTILS_URL ||
      "https://your-signature-service.com/Utils/Signature";

    const { data } = await axios.post(SIGNATURE_URL, requestBody);
    return data;
  } catch (err) {
    console.error("Signature API Error:", err.message);
    throw err;
  }
};
