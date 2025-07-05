// controllers/flightController.js
import axios from "axios";

export const expressSearchFlights = async (req, res) => {
  // console.log('callingggg ===============================5 express search');


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
    } = req.body;
    // console.log(req.body, "body==========================================24 express search paylod from backend");

    if (!req.clientId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing ClientID or Token",
      });
    }

    // Only send required fields to upstream API
    const payload = {
      ADT: Number(ADT),
      CHD: Number(CHD),
      INF: Number(INF),
      Cabin,
      Source: Source || "CF",
      Mode: Mode || "AS",
      ClientID: ClientID,
      FareType: FareType || "ON",
      Trips,
      Parameters: {
        Airlines: Parameters?.Airlines || "",
        GroupType: Parameters?.GroupType || "",
        Refundable: Parameters?.Refundable || "",
        IsDirect: Parameters?.IsDirect || false,
        IsStudentFare: Parameters?.IsStudentFare || false,
        IsNearbyAirport: Parameters?.IsNearbyAirport || false,
      },
    };

    // console.log('Final payload:', payload);
    // console.log('Upstream URL:', `${process.env.FLIGHT_URL}${process.env.EXPRESS_SEARCH_PATH}`);
    // console.log('Headers: @@@@@@@@@@@@@@@@@@@@@@@@@@@@', {
    //   Authorization: `Bearer ${req.token}`,
    //   ClientID: req.clientId,
    //   "Content-Type": "application/json",
    // });



    // console.log('calling hits=======================================================58');


    const response = await fetch(
      "https://b2bapiflights.benzyinfotech.com/Flights/ExpressSearch" ,
      {
        body: JSON.stringify(payload),
        method: "POST",
        headers: {
          Authorization: `Bearer ${req.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    // console.log(data, "response.data======================================78");

    return res.status(200).json({
      success: true,
      message: "Express Search Results Retrieved",
      data: data
    });
  } catch (error) {
    console.error('=== UPSTREAM API ERROR ===');
    console.error('Status:', error?.response?.status);
    console.error('Status Text:', error?.response?.statusText);
    console.error('Response Data:', error?.response?.data);
    console.error('Request URL:', error?.config?.url);
    console.error('Request Method:', error?.config?.method);
    console.error('Request Headers:', error?.config?.headers);
    console.error('Request Data:', error?.config?.data);

    return res.status(500).json({
      success: false,
      message: "ExpressSearch failed",
      error: error?.response?.data || error.message,
      details: {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        url: error?.config?.url
      }
    });
  }
};

export const getExpSearchFlights = async (req, res) => {
  // console.log('callingggg ===============================5 get exp search');

  const { TUI } = req.body;
  // console.log(TUI, "TUI======================");

  const payload = {
    TUI: TUI,
  };
  // console.log(TUI, "TUI ================================================ 113 getExpSearch");

  try {
    const response = await fetch(
      "https://b2bapiflights.benzyinfotech.com/flights/GetExpSearch",
      {
        body: JSON.stringify(payload),  
        method: "POST",
        headers: {
          Authorization: `Bearer ${req.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    //  console.log(data, "data");
    return res.status(200).json({
      success: true,
      message: "ExpressSearch Results Retrieved",
      data: data,
    });
  } catch (error) {
    console.error(
      "ExpressSearch Error:",
      error?.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "ExpressSearch failed",
      error: error?.response?.data || error.message,
    });
  }
};
