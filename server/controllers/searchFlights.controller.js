// controllers/flightController.js
import dotenv from "dotenv";

dotenv.config();
import fs from 'fs';
import path from 'path';


export const expressSearchFlights = async (req, res) => {

  try {
    const {
      ADT,
      CHD,
      INF,
      Cabin,
      Source,
      Mode,
      FareType,
      Trips,
      Parameters,
      ClientID,
      IsMultipleCarrier,
      IsRefundable,
      preferedAirlines,
      TUI,
      token,
    } = req.body;

    if (!ClientID) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing ClientID or Token",
      });
    }

    const payload = {
      FareType: FareType,
      ADT: ADT,
      CHD: CHD,
      INF: INF,
      Cabin: Cabin,
      Source: Source,
      Mode: Mode,
      ClientID: ClientID,
      IsMultipleCarrier: IsMultipleCarrier || false,
      IsRefundable: IsRefundable,
      preferedAirlines: preferedAirlines,
      TUI: TUI,
      SecType: "",
      Trips: FareType === "MC" ? Trips.map(trip => ({
        From: typeof trip.From === 'object' ? trip.From.Code : trip.From,
        To: typeof trip.To === 'object' ? trip.To.Code : trip.To,
        ReturnDate: "",
        OnwardDate: trip.OnwardDate,
        TUI: trip.TUI || "",
      })) : FareType === "RT" ? [
        {
          From: typeof Trips[0].From === 'object' ? Trips[0].From.Code : Trips[0].From,
          To: typeof Trips[0].To === 'object' ? Trips[0].To.Code : Trips[0].To,
          ReturnDate: Trips[0].ReturnDate || "",
          OnwardDate: Trips[0].OnwardDate,
          TUI: Trips[0].TUI || "",
        }
      ] : [
        {
          From: typeof Trips[0].From === 'object' ? Trips[0].From.Code : Trips[0].From,
          To: typeof Trips[0].To === 'object' ? Trips[0].To.Code : Trips[0].To,
          ReturnDate: "",
          OnwardDate: Trips[0].OnwardDate,
          TUI: Trips[0].TUI || "",
        }
      ],
      Parameters: {
        Airlines: "",
        GroupType: "",
        Refundable: "",
        IsDirect: req.body.IsDirect || false,
        IsStudentFare: req.body.IsStudentFare || false,
        IsNearbyAirport: req.body.IsNearbyAirport || false,
        IsExtendedSearch: false,
      },
    };

    console.log(
      "Final payload:",
      payload,
      "express search payload======================="
    );

    const response = await fetch(
      `${process.env.FLIGHT_URL}/flights/ExpressSearch`,
      {
        body: JSON.stringify(payload),
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data, "express search response data=======================");
    return res.status(200).json({
      success: true,
      message: "Express Search Results Retrieved",
      payload: payload,
      response: data,
      data: data,
      TUI: data.TUI,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "ExpressSearch failed",
      error: error?.response?.data || error.message,
      details: {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        url: error?.config?.url,
      },
    });
  }
};

export const getExpSearchFlights = async (req, res) => {
  const { token, TUI, saveToFile, ClientID } = req.body;

  if (!token || !TUI) {
    return res.status(400).json({
      success: false,
      message: "Token and TUI are required",
    });
  }

  const body = {
    ClientID: ClientID || "",
    TUI: TUI
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const maxRetries = 20;      // Total attempts
  const delayMs = 1000;       // 1 second between attempts

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const payload = {
    ClientID: ClientID || "",
    TUI: TUI
  };
  console.log(payload, "get exp search payload=======================");

  try {
    const pollExpSearch = async (retries = 0) => {
      const response = await fetch(`${process.env.FLIGHT_URL}/flights/GetExpSearch`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.Completed === "True") {
        return data;
      }

      if (retries >= maxRetries) {
        throw new Error("Polling timed out: Max retries reached without completion.");
      }

      // Wait and retry
      await sleep(delayMs);
      return pollExpSearch(retries + 1);
    };


    const data = await pollExpSearch();
    console.log(data, "get exp search response data=======================");

    if (saveToFile) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `getExpSearch_${TUI}_${timestamp}.json`;
        const filepath = path.join(process.cwd(), 'api_request_response', filename);
        
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        
        
        return res.status(200).json({
          success: true,
          message: "GETExpSearch fetched successfully and saved to file",
          payload: payload,
          response: data,
          data: data,
          savedFile: filename
        });
      } catch (fileError) {
        console.error("Error saving file:", fileError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "GETExpSearch fetched successfully",
      payload: payload,
      response: data,
      data: data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "ExpSearch fetch failed",
      error: error.message || error,
    });
  }
};
