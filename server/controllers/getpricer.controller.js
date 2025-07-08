export const getPricer = async (TUI, token) => {
  console.log("______________________________________________________________________________ get pricer function called")


  console.log(TUI, 'TUI get pricer controller*****************');
  // console.log(token, 'token get pricer controller*****************');
  try {
    const response = await fetch(`${process.env.FLIGHT_URL}/Flights/GetSPricer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      },
      body: JSON.stringify({ 
        TUI,
        ClientID: ""
      })
    });


    // console.log(response, 'response get pricer controller*****************');
    const data = await response.json();
    console.log(data, '=================  ******************data get pricer controller');
    return data;
  } catch (error) {
    console.log(error, 'error get pricer controller*****************');
    return null;
  }
};
