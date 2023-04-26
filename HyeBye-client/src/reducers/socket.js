import io from "socket.io-client";
import React from "react";

// const CONNECTION_PORT  = 'https://hybye-backend.herokuapp.com/';
// const CONNECTION_PORT = process.env.REACT_APP_BASE_HOST;
const CONNECTION_PORT = "https://fyldrop-college-production.up.railway.app";

export const socket = io.connect(
  "https://fyldrop-college-production.up.railway.app"
);
export const SocketContext = React.createContext();
export { CONNECTION_PORT };
