// controllers/flightController.js
// import dotenv from "dotenv";

// dotenv.config();
import fs from 'fs';
import path from 'path';


export const expressSearchFlights = async (req, res) => {
  console.log("callingggg ===============================5 express search");

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
    console.log(Trips, 'trips')
    console.log(token, "token========================= 221");
    // console.log(req.body, "body==========================================24 express search paylod from backend");

    if (!ClientID) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing ClientID or Token",
      });
    }

    // Only send required fields to upstream API
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
      Trips: FareType === "RT" ? [
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
      "https://b2bapiflights.benzyinfotech.com/flights/ExpressSearch",
      {
        body: JSON.stringify(payload),
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      }
    );
    console.log(response, "response from the backend========================= poll");
    const data = await response.json();
    console.log(data, "response.data======================================78");
    console.log(
      data.TUI,
      "data.TUI=======================inside the express search"
    );
    return res.status(200).json({
      success: true,
      message: "Express Search Results Retrieved",
      data: data,
      TUI: data.TUI,
    });
  } catch (error) {
    console.error("=== UPSTREAM API ERROR ===");
    console.error("Status:", error?.response?.status);
    console.error("Status Text:", error?.response?.statusText);
    console.error("Response Data:", error?.response?.data);
    console.error("Request URL:", error?.config?.url);
    console.error("Request Method:", error?.config?.method);
    console.error("Request Headers:", error?.config?.headers);
    console.error("Request Data:", error?.config?.data);

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
  const { token, TUI, saveToFile } = req.body;

  if (!token || !TUI) {
    return res.status(400).json({
      success: false,
      message: "Token and TUI are required",
    });
  }

  const body = {
    ClientID: "", // Ensure this is dynamically set or configured as needed
    TUI: TUI
  };

  console.log(body, "body getExpSearchFlights");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const maxRetries = 20;      // Total attempts
  const delayMs = 1000;       // 1 second between attempts

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    const pollExpSearch = async (retries = 0) => {
      console.log(body, "body from the backend========================= poll");
      console.log(headers, "headers from the backend========================= poll");
      const response = await fetch(`${process.env.FLIGHT_URL}/flights/GetExpSearch`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
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

    console.log(pollExpSearch, "pollExpSearch from the backend========================= poll");

    const data = await pollExpSearch();

    console.log(data, "data from the backend========================= poll");

    // Save to file if requested
    if (saveToFile) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `getExpSearch_${TUI}_${timestamp}.json`;
        const filepath = path.join(process.cwd(), 'api_request_response', filename);
        
        // Ensure directory exists
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Save the complete response data
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        
        console.log(`Complete getExpSearch data saved to: ${filepath}`);
        
        return res.status(200).json({
          success: true,
          message: "GETExpSearch fetched successfully and saved to file",
          data: data,
          savedFile: filename
        });
      } catch (fileError) {
        console.error("Error saving file:", fileError);
        // Continue with normal response even if file save fails
      }
    }

    return res.status(200).json({
      success: true,
      message: "GETExpSearch fetched successfully",
      data: data,
    });

  } catch (error) {
    console.error(error, "error from the backend========================= poll");
    return res.status(500).json({
      success: false,
      message: "ExpSearch fetch failed",
      error: error.message || error,
    });
  }
};
