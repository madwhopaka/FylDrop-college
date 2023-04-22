import io from "socket.io-client";
import React from "react";

// const CONNECTION_PORT  = 'https://hybye-backend.herokuapp.com/';
// const CONNECTION_PORT = process.env.REACT_APP_BASE_HOST;
const CONNECTION_PORT = "http://192.168.104:8000";

export const socket = io.connect("http://192.168.104:8000");
export const SocketContext = React.createContext();
export { CONNECTION_PORT };
