// controllers/flightController.js
import axios from "axios";

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
    console.log(Trips,'trips')
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
      Trips: [
        {
          From: Trips[0].From,
          To: Trips[0].To,
          ReturnDate: Trips[0].ReturnDate || "",
          OnwardDate: "",
          TUI: Trips[0].TUI || "",
        },
      ],
      Parameters: {
        Airlines: "",
        GroupType: "",
        Refundable: "",
        IsDirect: false,
        IsStudentFare: false,
        IsNearbyAirport: true,
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
    const data = await response.json();
    // console.log(data, "response.data======================================78");
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
  const { token, TUI } = req.body;
  const pollUntilCompleted = async () => {
    console.log("poll started ================================");
    try {
      const response = await axios.post(
        `${process.env.FLIGHT_URL}/flights/GetExpSearch`,
        {
          TUI,
          token,
        }
      );
      console.log(
        response,
        "response from the backend========================="
      );
    } catch (error) {
      console.log(error, "error from the backend=========================");
    }
  };
  pollUntilCompleted();
  return res.status(200).json({
    success: true,
    message: "Poll started",
  });
};
