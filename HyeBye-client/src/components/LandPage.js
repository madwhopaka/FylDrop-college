import React, { useState } from "react";
import app_logo from "../images/output.gif";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../reducers/loading.js";
import { userChange } from "../reducers/user.js";
import Loading from "./Loading.js";
import axios from "axios";

function LandPage() {
  const [error, setError] = useState("");
  const theme = useSelector((state) => state.theme);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const host = "http://192.168.0.104:8000";
  const url = `${host}/api/username`;

  const handleClick = async (event) => {
    dispatch(
      setLoading({
        loadingvalue: true,
        loadingtext: "Finding a new name for you...!",
      })
    );
    axios
      .post(url, { username: "", email: "" })
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
  };
  return (
    <div className="center-div">
      <div className="logohead">
        <img
          alt="app-logo"
          className="logo"
          src={app_logo}
          style={{
            border: `2px solid ${theme.value.color}`,
            borderRadius: "50%",
          }}
        />
        <div className="heading">
          <h3 className="title">FylDrop</h3>
          <p className="sub-title" style={{ color: theme.value.bgcolor }}>
            P2P file sharing companion.
          </p>
        </div>
      </div>
      <div className="btn-container">
        <button className="btnn">
          {" "}
          <p style={{ margin: 0, padding: 0 }} onClick={handleClick}>
            Start Sharing{" "}
          </p>
          <ArrowForwardIosIcon
            className="icon"
            sx={{ margin: 0, padding: 0 }}
          />{" "}
        </button>
      </div>
      <Loading />
    </div>
  );
}

export default LandPage;
