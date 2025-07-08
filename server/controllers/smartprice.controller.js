import axios from "axios";
import { getPricer } from "./getpricer.controller.js";

export const getSmartPrice = async (req, res) => {
  console.log("______________________________________________________________________________ get smart price")
  try {

    const { Amount, Index, OrderID, TUI, ClientID, Mode, Options, Source, TripType } = req.body
    const payload = {
      Trips: [
        {
          Amount,
          Index,
          OrderID,
          TUI
        }
      ],
      ClientID,
      Mode,
      Options,
      Source,
      TripType
    }


    console.log(payload, 'before submit ================================================ smart price payload')

    //  send response all the functions completed using se


    const smartPricerResponse = await axios.post(
      `${process.env.FLIGHT_URL}/Flights/SmartPricer`,
      payload,
      {
        headers: {
          Authorization: `${req.headers.authorization?.split(" ")[1]}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(smartPricerResponse.data, 'smartPricerResponse');
    // console.log(smartPricerResponse.data, 'smartPricerResponse');
    const smartPriceTUI = smartPricerResponse.data.TUI;
    console.log(smartPriceTUI, 'smartPriceTUI inside smart price controller');

    const pricerData = await getPricer(smartPriceTUI, req.headers.authorization?.split(" ")[1])
    // console.log(pricerData, 'pricerData inside smart price controller__________________________________________________');

    if (pricerData) {
      return res.status(200).json({
        success: true,
        message: "SmartPricer executed successfully",
        data: {
          smartPricerResponse: smartPricerResponse.data,
          pricerData: pricerData,
          // pricerData: pricerData,  
        },
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Failed to execute SmartPricer",
        error: "Failed to execute SmartPricer",
      });
    }

  } catch (error) {
    console.error("SmartPricer Error:", error?.response?.data || error);
    return res.status(500).json({
      success: false,
      message: "Failed to execute SmartPricer",
      error: error?.response?.data || error.message,
    });
  }
};
