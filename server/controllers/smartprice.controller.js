import axios from "axios";
import { getPricer } from "./getpricer.controller.js";

export const smartPricer = async (req, res) => {
  try {
    const { Trips, ClientID, Mode, Options, Source, TripType, token, TUI } = req.body;
    console.log(TUI, "TUI=========================")
    console.log("TripType received:", TripType, "Trips count:", Trips?.length)
    
    // Basic schema validation
    if (!Trips || !Array.isArray(Trips) || Trips.length === 0) {
      return res.status(400).json({ Code: "400", Msg: "Invalid or missing Trips array" });
    }

    // Build trips array based on trip type
    let tripsArray = [];
    
    if (TripType === "RT") {
      // For Round Trip, we need 2 trips: onward and return
      // The first trip is onward, second trip is return
      tripsArray = [
        {
          Amount: Trips[0].NetFare,
          Index: Trips[0].Index,
          OrderID: "1",
          TUI: TUI
        },
        {
          Amount: Trips[1].NetFare, // Use return flight fare
          Index: Trips[1].Index,    // Use return flight index
          OrderID: "2",
          TUI: TUI
        }
      ];
    } else if (TripType === "MC") {
      // For Multi City, use all provided trips
      tripsArray = Trips.map((trip, index) => ({
        Amount: trip.NetFare,
        Index: trip.Index,
        OrderID: (index + 1).toString(),
        TUI: TUI
      }));
    } else {
      // For One Way (ON) or default, use single trip
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
      ClientID: "",
      Mode: Mode || "SS",
      Options: Options || "",
      Source: Source || "SF",
      TripType: TripType || "",
    }

    console.log(payload, "payload========jaksdfffffffffffffffffffffffffffffffffffffff=================")
    const headers = {
      "Content-Type": "application/json",
      "Authorization": token
    }


    try {
      const response = await axios.post(`${process.env.FLIGHT_URL}/Flights/SmartPricer`, payload, { headers })
      // console.log(response, "response=========================")
      console.log(response.data, "response.data=========================")
      return res.status(200).json(response.data)
    } catch (error) {
      console.log(error, "error=========================")
      return res.status(500).json({ 
        Code: "500", 
        Msg: "SmartPricer API Error", 
        error: error.message || "Unknown error occurred" 
      })
    }



    // return res.status(200).json(response);
  } catch (error) {
    console.error("[SmartPricer Error]", error);
    return res.status(500).json({ Code: "500", Msg: "Internal Server Error" });
  }
};
