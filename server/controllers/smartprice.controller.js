import axios from "axios";
import { getPricer } from "./getpricer.controller.js";

export const smartPricer = async (req, res) => {
  try {
    const { Trips, ClientID, Mode, Options, Source, TripType, token, TUI } = req.body;
    console.log(TUI, "TUI=========================")
    // Basic schema validation
    if (!Trips || !Array.isArray(Trips) || Trips.length === 0) {
      return res.status(400).json({ Code: "400", Msg: "Invalid or missing Trips array" });
    }

    const payload = {

      Trips: [
        {
          Amount: Trips[0].NetFare,
          Index: Trips[0].Index,
          OrderID: "1",
          TUI: TUI
        },
      ],
      ClientID: "",
      Mode: Mode || "AS",
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
      console.log(response, "response=========================")
      return res.status(200).json(response.data)
    } catch (error) {
      console.log(error, "error=========================")
    }



    // return res.status(200).json(response);
  } catch (error) {
    console.error("[SmartPricer Error]", error);
    return res.status(500).json({ Code: "500", Msg: "Internal Server Error" });
  }
};
