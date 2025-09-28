import axios from "axios";
import fs from 'fs';
import path from 'path';

export const getPricer = async (req, res) => {
  const { TUI, token, saveToFile, ClientID } = req.body;

  try {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
    const payload = {
      TUI: TUI,
      ClientID: ClientID || ""
    }

    const response = await axios.post(`${process.env.FLIGHT_URL}/Flights/GetSPricer`, payload, { headers })

    const data = await response.data;
    console.log("[GetSPricer] Payload:", JSON.stringify(payload, null, 2));
    console.log("[GetSPricer] Response.data:", JSON.stringify(data, null, 2));

    if (saveToFile) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `getPricer_${TUI}_${timestamp}.json`;
        const filepath = path.join(process.cwd(), 'api_request_response', filename);
        
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        
        
        return res.status(200).json({
          Code: "200",
          Msg: "Pricer fetched successfully and saved to file",
          data: data,
          savedFile: filename
        });
      } catch (fileError) {
        console.error("Error saving file:", fileError);
      }
    }

    return res.status(200).json({
      Code: "200",
      Msg: "Pricer fetched successfully",
      data: data
    })
  } catch (error) {
    return res.status(400).json({
      Code: "400",
      Msg: "Something went wrong, Please try again!!!",
      data: null
    })
  }
};
