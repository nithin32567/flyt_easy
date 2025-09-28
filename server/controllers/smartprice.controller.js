import axios from "axios";
import { getPricer } from "./getpricer.controller.js";

export const smartPricer = async (req, res) => {
  try {
    const { Trips, ClientID, Mode, Options, Source, TripType, token, TUI } = req.body;
    
    if (!Trips || !Array.isArray(Trips) || Trips.length === 0) {
      return res.status(400).json({ Code: "400", Msg: "Invalid or missing Trips array" });
    }

    let tripsArray = [];
    
    if (TripType === "RT") {
      tripsArray = [
        {
          Amount: Trips[0].NetFare,
          Index: Trips[0].Index,
          OrderID: "1",
          TUI: TUI
        },
        {
          Amount: Trips[1].NetFare,
          Index: Trips[1].Index,
          OrderID: "2",
          TUI: TUI
        }
      ];
    } else if (TripType === "MC") {
      tripsArray = Trips.map((trip, index) => ({
        Amount: trip.NetFare,
        Index: trip.Index,
        OrderID: (index + 1).toString(),
        TUI: TUI
      }));
    } else {
      tripsArray = [
        {
          Amount: Trips[0].NetFare,
          Index: Trips[0].Index,
          OrderID: "1",
          TUI: TUI
        }
      ];
    }

    const payload = {
      Trips: tripsArray,
      ClientID: ClientID || "",
      Mode: Mode || "SS",
      Options: Options || "",
      Source: Source || "SF",
      TripType: TripType || "",
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": token
    }


    try {
      console.log("[SmartPricer] Payload:", JSON.stringify(payload, null, 2));
      const response = await axios.post(`${process.env.FLIGHT_URL}/Flights/SmartPricer`, payload, { headers })
      console.log("[SmartPricer] Response.data:", JSON.stringify(response.data, null, 2));
      return res.status(200).json(response.data)
    } catch (error) {
      return res.status(500).json({ 
        Code: "500", 
        Msg: "SmartPricer API Error", 
        error: error.message || "Unknown error occurred" 
      })
    }



  } catch (error) {
    return res.status(500).json({ Code: "500", Msg: "Internal Server Error" });
  }
};
