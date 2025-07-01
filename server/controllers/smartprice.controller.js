import axios from "axios";

export const getSmartPrice = async (req, res) => {
  try {
    const {
      amount,
      index,
      orderID,
      TUI,
      mode,
      options,
      source,
      tripType,
      clientID,
    } = req.body;
    console.log(amount, index, orderID, TUI, mode, options, source, tripType, clientID, 'req.body');

    console.log(req.body, 'req.body');

    const payload = {
      Trips: [
        {
          Amount: amount,
          Index: index,
          OrderID: orderID,
          TUI: TUI,
        },
      ],
      ClientID: clientID,
      Mode: mode,
      Options: options,
      Source: source,
      TripType: tripType,
    };

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

    return res.status(200).json({
      success: true,
      message: "SmartPricer executed successfully",
      data: smartPricerResponse.data,
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
