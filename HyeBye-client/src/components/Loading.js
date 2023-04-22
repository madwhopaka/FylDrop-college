import React, { useState, useEffect } from "react";
import loadingLogo from "../images/loader1.gif";
import "../App.css";
import Backdrop from '@mui/material/Backdrop';
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { setLoading } from "../reducers/loading";

function Loading(props) {
  const [open, setOpen] = useState(false);
  const [text, loadinText] = useState('') ; 
  const setloading = useSelector(state=>state.load) ;
   useEffect(() => {
    setOpen(setloading.value.loadingvalue) ; 
    loadinText(setloading.value.loadingtext); 
   }, [setloading]);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className='loading-container'>
      <Backdrop
        className= "backdrop"
        sx={{ display:"flex", flexDirection:"column", justifyContent:"flex-end", alignItems:"center"  ,color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
      <div className= "loading-status">
      <CircularProgress />
       <p className="simpletext">{text}</p>
      </div>
      </Backdrop>
    </div>
  );
}

export default Loading;
