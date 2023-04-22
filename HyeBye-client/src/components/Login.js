import React, { useState } from "react";
import ThemeButton from "./ThemeButton";
import { useSelector } from "react-redux";
import loginlogo from "../images/logincard.png";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../reducers/loading.js";
import { userChange } from "../reducers/user.js";
import { useDispatch } from "react-redux";
import Loading from "./Loading.js";

import axios from "axios";

import "../App.css";

// const host = "https://hybye-backend.herokuapp.com";
const host = "http://192.168.0.104:8000";
const url = `${host}/api/username`;

function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const theme = useSelector((state) => state.theme);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const handleChange = (event) => {
    setEmail(event.target.value);
  };
  const handleClick = async (event) => {
    event.preventDefault();
    if (email == "") {
      setError("You can't proceed with this field empty.");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else if (
      email.search("@") == -1 ||
      email.search("@") == email.length - 1
    ) {
      setError("Please fill in a valid email id. ");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      dispatch(
        setLoading({
          loadingvalue: true,
          loadingtext: "Finding a new name for you...!",
        })
      );
      const data = {
        email: email,
      };

      axios
        .post(url, data)
        .then((res) => {
          const response = res.data;
          dispatch(userChange({ username: response.username }));
          setTimeout(() => {
            dispatch(setLoading({ loadingvalue: false, loadingtext: "" }));
            nav("/room");
          }, 1000);
        })
        .catch((err) => {
          dispatch(setLoading({ loadingvalue: false, loadingtext: "" }));
          console.log(err);
          setError("Error from the server. Try Again.");
          setTimeout(() => {
            setError("");
          }, 3000);
        });
    }
  };
  return (
    <div className="login-card">
      <div className="logospace">
        <img className="login-logo" src={loginlogo}></img>
        <h3 className="title" style={{ color: "white" }}>
          FylDrop
        </h3>
      </div>
      <p
        className="login-subs"
        style={{ textAlign: "center", color: theme.value.bgcolor }}
      >
        Before you go ahead, let us help you choose a new name.
      </p>
      <div className="input-container">
        <input
          className="login-input"
          placeholder="Email"
          type="email"
          onChange={handleChange}
        ></input>
      </div>
      <button className="create-button" onClick={handleClick}>
        Search
      </button>
      <div className="eror-div">{error}</div>
      <Loading />
    </div>
  );
}

export default Login;
