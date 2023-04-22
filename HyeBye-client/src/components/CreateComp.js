import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../reducers/loading.js";
import copy from "copy-to-clipboard";
import Loading from "./Loading";
import contentCopy from "../images/copy-icon.png";

export default function CreateComp(props) {
  const [copyText, setCopyText] = useState(false);
  const savedCode = useSelector((state) => state.code);
  const nav = useNavigate();
  const loaderDispatch = useDispatch();

  const handleJoinCreatedRoom = () => {
    loaderDispatch(
      setLoading({ loadingvalue: true, loadingtext: "Entering the room..!" })
    );

    setTimeout(() => {
      loaderDispatch(
        setLoading({
          loadingvalue: false,
          loadingtext: "Entering the room...!",
        })
      );
      nav(`/room/${savedCode.value.code}`, { replace: true });
    }, 2000);
  };

  const handleCopyClick = () => {
    const toCopycode = savedCode.value.code;
    copy(toCopycode);
    setCopyText(true);
    setTimeout(() => {
      setCopyText(false);
    }, 2000);
  };
  return (
    <div className="createroom-comp">
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <button className="create-join-btn" onClick={handleJoinCreatedRoom}>
          {savedCode.value.code}
        </button>
        {copyText ? (
          <p className="simpletext" style={{ marginLeft: 10, fontSize: 15 }}>
            Code Copied
          </p>
        ) : (
          <img
            src={contentCopy}
            height="30px"
            width="30px"
            style={{ marginLeft: 10, marginTop: 3 }}
            onClick={handleCopyClick}
          />
        )}
      </div>
      <p className="sub-title">Tap on the button to enter room</p>
      <Loading />
    </div>
  );
}
