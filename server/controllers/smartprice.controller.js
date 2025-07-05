import axios from "axios";
import { getPricer } from "./getpricer.controller.js";

export const getSmartPrice = async (req, res) => {
  // console.log("______________________________________________________________________________ get smart price")
  try {



    // console.log(req.body, 'req.body');

    const payload = {
      Trips: [
        {
          Amount: req.body.Trips[0].Amount, 
          Index: req.body.Trips[0].Index,
          OrderID: req.body.Trips[0].OrderID,
          TUI: req.body.Trips[0].TUI,

        },
      ],
      ClientID: req.body.ClientID,
      Mode: req.body.Mode,
      Options: req.body.Options,
      Source: req.body.Source,
      TripType: req.body.TripType,
    };


    // console.log(payload, 'before submit')

    console.log(payload, 'payload');

    const smartPricerResponse = await axios.post(
      `${process.env.FLIGHT_URL}/flights/SmartPricer`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.headers.authorization?.split(" ")[1]}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(smartPricerResponse.data, 'smartPricerResponse');
    // console.log(smartPricerResponse.data, 'smartPricerResponse');
    const smartPriceTUI = smartPricerResponse.data.TUI;
    // console.log(smartPriceTUI, 'smartPriceTUI');

    const pricerData = await getPricer(smartPriceTUI, req.headers.authorization?.split(" ")[1])
    // console.log(pricerData, 'pricerData inside smart price controller__________________________________________________');

    return res.status(200).json({
      success: true,
      message: "SmartPricer executed successfully",
      data: {
        smartPricerResponse: smartPricerResponse.data,
        pricerData: pricerData,
      },
    });

  } catch (error) {
    console.error("SmartPricer Error:", error?.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "Failed to execute SmartPricer",
      error: error?.response?.data || error.message,
    });
  }
};
