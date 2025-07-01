// decode the token and get the clientId
// i dont have the jwt secret key just decode the clientid without secret key

// {
//     "unique_name": "300",
//     "AgentInfo": "/LFWcTCUCydYPcTcnhWKij4QxaqsvxPHqetkJlc... (truncated)",
//     "pwd": "L2Et4G/Xq4lLXA... (encrypted)",
//     "agentCode": "/KfdYwesqPw=",
//     "clientId": "2fzXEkMxVDU=",
//     "BrowserKey": "+6X9JUoM+m4OUtTA1Z1jiZNUbDxB1b0cEKGmnwbrNepdDowLGyUsOg==",
//     "nbf": 1750335391,
//     "exp": 1758975391,
//     "iat": 1750335391,
//     "iss": "webconnect",
//     "aud": "client"
//   }

import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);
    console.log(decoded, "decoded=========================");
    req.clientId = decoded.clientId;
    req.agentCode = decoded.agentCode;
    req.agentInfo = decoded.AgentInfo;
    req.unique_name = decoded.unique_name;
    req.pwd = decoded.pwd;
    req.BrowserKey = decoded.BrowserKey;
    req.nbf = decoded.nbf;
    req.token = token;

    console.log(req.headers, "req.headers=========================");

    console.log(req.clientId, "req.clientId=========================");
    console.log(req.agentCode, "req.agentCode=========================");
    console.log(req.agentInfo, "req.agentInfo=========================");
    console.log(req.unique_name, "req.unique_name=========================");
    console.log(req.pwd, "req.pwd=========================");
    console.log(req.BrowserKey, "req.BrowserKey=========================");
    console.log(req.nbf, "req.nbf=========================");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
