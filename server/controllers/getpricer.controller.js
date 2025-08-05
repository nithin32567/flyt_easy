import axios from "axios";

export const getPricer = async (req, res) => {
  const { TUI, token } = req.body;
  console.log("______________________________________________________________________________ get pricer function called")


  console.log(TUI, 'TUI get pricer controller*****************');
  // console.log(token, 'token get pricer controller*****************');
  try {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
    const payload = {
      TUI: TUI,
      ClientID: ""
    }

    console.log(payload, "payload get pricer controller");
    const response = await axios.post(`${process.env.FLIGHT_URL}/Flights/GetSPricer`, payload, { headers })


    console.log(response, 'response get pricer controller*****************');
    const data = await response.data;
    console.log(data, '=================  ******************data get pricer controller');
    return res.status(200).json({
      Code: "200",
      Msg: "Pricer fetched successfully",
      data: data
    })
  } catch (error) {
    console.log(error, 'error get pricer controller*****************');
    return res.status(400).json({
      Code: "400",
      Msg: "Something went wrong, Please try again!!!",
      data: null
    })
  }
};
