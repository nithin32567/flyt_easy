import axios from "axios";
import fs from 'fs';
import path from 'path';

export const getPricer = async (req, res) => {
  console.log('=== BACKEND: FLIGHT GET PRICER REQUEST ===');
  console.log('Flight Get Pricer Payload ===>');
  console.log(JSON.stringify(req.body, null, 2));
  console.log('=== END FLIGHT GET PRICER PAYLOAD ===');
  
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
    
    console.log('=== BACKEND: FLIGHT GET PRICER RESPONSE ===');
    console.log('Flight Get Pricer Response JSON ===>');
    console.log(JSON.stringify(data, null, 2));
    console.log('=== END FLIGHT GET PRICER RESPONSE ===');

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
        
        
        const responseToSend = {
          Code: "200",
          Msg: "Pricer fetched successfully and saved to file",
          data: data,
          savedFile: filename
        };
        
        console.log('=== BACKEND: FLIGHT GET PRICER RESPONSE TO CLIENT ===');
        console.log('Flight Get Pricer Response to Client JSON ===>');
        console.log(JSON.stringify(responseToSend, null, 2));
        console.log('=== END FLIGHT GET PRICER RESPONSE TO CLIENT ===');
        
        return res.status(200).json(responseToSend);
      } catch (fileError) {
        console.error("Error saving file:", fileError);
      }
    }

    const responseToSend = {
      Code: "200",
      Msg: "Pricer fetched successfully",
      data: data
    };
    
    console.log('=== BACKEND: FLIGHT GET PRICER RESPONSE TO CLIENT ===');
    console.log('Flight Get Pricer Response to Client JSON ===>');
    console.log(JSON.stringify(responseToSend, null, 2));
    console.log('=== END FLIGHT GET PRICER RESPONSE TO CLIENT ===');
    
    return res.status(200).json(responseToSend);
  } catch (error) {
    return res.status(400).json({
      Code: "400",
      Msg: "Something went wrong, Please try again!!!",
      data: null
    })
  }
};
