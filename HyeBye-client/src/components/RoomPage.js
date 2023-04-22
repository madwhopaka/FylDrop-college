import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../images/avatar.png";
import { useSelector } from "react-redux";
import axios from "axios";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { setLoading } from "../reducers/loading";
import { setCode } from "../reducers/code";
import Loading from "./Loading";
import CreateComp from "./CreateComp.js";

import JoinComp from "./JoinPage.js";
import "../App.css";
// const host = "https://hybye-backend.herokuapp.com";

//change this according to the ip address of localhost for it to work on phones
const host = "http://192.168.0.104:8000";
const url = `${host}/api/room/create`;
function RoomPage() {
  const loaderDispatch = useDispatch();
  const codeDispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [username, setusername] = useState("");
  const [joinPressed, toggleJoinPressed] = useState(false);
  const [createPressed, toggleCreatePressed] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    setusername(user.value.username);
    if (!user.value.username) {
      nav("/", { replace: true });
    }
  }, [user]);

  const handleCreateRoom = async () => {
    loaderDispatch(
      setLoading({
        loadingvalue: true,
        loadingtext: "Creating a new room for you...!",
      })
    );
    const formdata = {
      username: username,
    };
    await axios
      .post(url, formdata)
      .then((response) => {
        console.log(response);
        console.log(response.data);
        codeDispatch(setCode({ code: response.data.code }));
      })
      .catch((err) => {
        loaderDispatch(setLoading({ loadingvalue: false, loadingtext: "" }));
        console.log(err);
        setError("Error from the server. Try Again.");
        setTimeout(() => {
          setError("");
        }, 2000);
      });
    setTimeout(() => {
      loaderDispatch(setLoading({ loadingvalue: false, loadingtext: "" }));
      toggleCreatePressed(true);
    }, 2000);
  };

  const handleJoinRoom = async () => {
    loaderDispatch(
      setLoading({
        loadingvalue: true,
        loadingtext: "Wait while we set you up!",
      })
    );
    setTimeout(() => {
      loaderDispatch(setLoading({ loadingvalue: false, loadingtext: "" }));
      toggleJoinPressed(true);
    }, 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAalign: "center",
        height: "100vh",
      }}
    >
      <div
        className="text-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Avatar
          src={avatar}
          className="avatar"
          sx={{ height: "100px", width: "100px", background: "smokewhite" }}
        />
        <h1 className="simpletext" style={{ margin: 0 }}>
          Hello {username}{" "}
        </h1>
        <p className="sub-title">
          This is a temporary username which is valid only for this session.
        </p>
      </div>
      {createPressed === false && joinPressed === false ? (
        <div
          className="create-join-container"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <button className="create-join-btn" onClick={handleCreateRoom}>
            Create Room
          </button>
          <button className="create-join-btn" onClick={handleJoinRoom}>
            Join Room
          </button>
          <div className="eror-div">{error}</div>
        </div>
      ) : (
        <div>
          {createPressed ? <CreateComp /> : <JoinComp username={username} />}
        </div>
      )}
      <Loading />
    </div>
  );
}

export default RoomPage;
