import "./App.css";
import react, { useEffect, useState } from "react";
import Ape from "./Ape";
import Login from "./components/Login.js";
import RoomPage from "./components/RoomPage";
import JoinedRoom from "./components/JoinedRoom";
import { Routes, Route } from "react-router-dom";
import giticon from "./images/github.png";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ThemeButton from "./components/ThemeButton";
import Chat from "./Compo/Chat.js";
import { SocketContext, socket } from "./reducers/socket";

function App() {
  const theme = useSelector((state) => state.theme);
  const body = document.body;
  body.style.background = theme.value.color;
  body.style.color = theme.value.bgcolor;
  console.log("Hello", socket);
  const githubLink = "https://github.com/madwhopaka/HyeBye-client";

  return (
    <div
      className="App"
      style={{ backgroundColor: theme.value.color, color: theme.value.bgcolor }}
    >
      <div
        className="github-icon"
        onClick={() => {
          window.open(githubLink, "_blank", "noopener,noreferrer");
        }}
      >
        <img
          src={giticon}
          alt="github link"
          style={{ height: "35px", width: "35px", alignSelf: "center" }}
        />
        Source code
      </div>
      <SocketContext.Provider value={socket}>
        <ThemeButton />
        <Routes>
          <Route path="/" element={<Ape />} />
          <Route path="/room" element={<RoomPage />} />
          <Route path="room/:id" element={<JoinedRoom />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
