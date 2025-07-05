export const getPricer = async (TUI, token) => {
  console.log("______________________________________________________________________________ get pricer")


  // console.log(TUI, 'TUI get pricer controller*****************');
  // console.log(token, 'token get pricer controller*****************');
  try {
    const response = await fetch(`https://b2bapiflights.benzyinfotech.com/Flights/GetSPricer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        TUI
      })
    });


    console.log(response, 'response get pricer controller*****************');
    const data = await response.json();
    console.log(data, '=================  ******************data get pricer controller');
    return data;
  } catch (error) {
    console.log(error, 'error get pricer controller*****************');
    return null;
  }
};
