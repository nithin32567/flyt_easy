export const getPricer = async (req, res) => {
  console.log(req.body, 'req.body');

  const clientId = req.body.clientID;
  const TUI = req.body.TUI;
  const token = req.headers.authorization;

  console.log("=============================================== get pricer controller")

  console.log(clientId, 'clientId');
  console.log(TUI, 'TUI');
  // console.log(token, 'token');

  console.log("=============================================== get pricer controller")

  try {
    const response = await fetch(`https://b2bapiflights.benzyinfotech.com/Flights/GetSPricer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.split(' ')[1]}`
      },
      body: JSON.stringify({
        ClientID: clientId,
        TUI: TUI
      })
    });
    console.log("=============================================== get pricer controller response")
    const data = await response.json();
    console.log(data, 'data');
    console.log("=============================================== get pricer controller response")
    res.status(response.status).json(data);
  } catch (error) {
    console.log(error, 'error');
    res.status(500).json({ message: 'Internal server error' });
  }
};
