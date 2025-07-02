export const getPricer = async (req, res) => {
  console.log(req.body, 'req.body');

  const clientId = req.body.clientID;
  const TUI = req.body.TUI;
  const token = req.headers.authorization;

  try {
    const response = await fetch(`https://b2bapiflights.benzyinfotech.com/flights/GetSPricer`, {
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
    const data = await response.json();
    console.log(data, 'data');
    res.status(response.status).json(data);
  } catch (error) {
    console.log(error, 'error');
    res.status(500).json({ message: 'Internal server error' });
  }
};
