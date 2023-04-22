import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../reducers/loading.js";
import joinRoomApiCall from "../utilites/joinRoomApiCall.js";
import { setCode } from "../reducers/code.js";
import Loading from "./Loading.js";
import { checkAlphanum } from "../utilites/checkAlphanumeric.js";

function JoinComp() {
  const userstate = useSelector((state) => state.user);
  const codeDispatch = useDispatch();
  const nav = useNavigate();
  const [roomcode, setRoomCode] = useState("");
  const [eror, setError] = useState("");
  const loaderDispatch = useDispatch();
  const handleChange = (event) => {
    setRoomCode(event.target.value);
  };
  const JoinRoom = async () => {
    if (roomcode.length != 12) {
      setError("Invalid code: Code must have 12 Chars.");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else if (!checkAlphanum(roomcode)) {
      setError("Invalid Code: Code must be alphanumeric");
    } else {
      loaderDispatch(
        setLoading({ loadingvalue: true, loadingtext: "Validating the room" })
      );
      var response = await joinRoomApiCall(userstate.value.username, roomcode);
      console.log(response);
      setTimeout(() => {
        loaderDispatch(setLoading({ loadingvalue: false, loadingtext: "" }));
        if (response === "Success") {
          loaderDispatch(
            setLoading({ loadingvalue: true, loadingtext: "Joining the room" })
          );
          setTimeout(() => {
            loaderDispatch(
              setLoading({ loadingvalue: false, loadingtext: "" })
            );

            console.log(roomcode);
            codeDispatch(setCode({ code: roomcode }));

            nav(`/room/${roomcode}`, { replace: false });
          }, 1000);
        } else if (typeof response == Object) {
          setError("Couldn't connect to the server.");
          setTimeout(() => {
            setError("");
          }, 2000);
        } else {
          setError("Room not found.");
          setTimeout(() => {
            setError("");
          }, 2000);
        }
      }, 2000);
    }
  };
  return (
    <div className="join-room-component">
      <div className="input-container">
        <p className="sub-title" style={{ marginTop: 0, marginBottom: 10 }}>
          Enter the roomcode, ask your friend for it.
        </p>
        <input
          className="login-input"
          placeholder="Room Code"
          onChange={handleChange}
        ></input>
      </div>
      <div className="join-btn-container">
        <button className="join-button" onClick={JoinRoom}>
          Join
        </button>
      </div>
      <div className="eror-div">{eror}</div>
      <Loading />
    </div>
  );
}

export default JoinComp;
