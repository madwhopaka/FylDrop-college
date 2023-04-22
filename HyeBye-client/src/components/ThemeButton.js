import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";

import {  useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import mode from "../images/moon.png";
import "../App.css";
import {themeChange} from '../reducers/theme.js' ; 
import {useDispatch} from 'react-redux' ;


function ThemeButton() {
  const black = "#28282B";
  const white = "white" ; 
  const dispatch = useDispatch() ; 
  const [checked, setCheck] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [iconSize, setIconSize] = useState("small");
  useEffect(() => {
    if (matches) {
      setIconSize("medium");
    }
  },[matches]);
  const handleChange = (event) => {
    console.log(event) ; 
    setCheck(event.target.checked) ; 
    console.log(event.target.checked);
    if (checked===false) {
        console.log("this is me") ;     
        dispatch(themeChange({color:black, bgcolor:white}));
    }
    else {
        dispatch(themeChange({color:white, bgcolor:black})) ; 
    }
  };



  return (
    <div className="theme-button">
      <img className="mode-logo" src={mode} alt= 'dark-mode-theme-logo' />
      <Switch
        className="switch"
        size={iconSize}
        checked={checked}
        onChange={handleChange}
        inputProps={{ "aria-label": "controlled" }}
      />
    </div>
  );
}

export default ThemeButton;
