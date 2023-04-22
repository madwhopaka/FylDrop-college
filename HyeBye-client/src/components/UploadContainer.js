import React from "react";
import { Container } from "@mui/material";
import upload from "../images/upload.png";
import { useState, useEffect } from "react";
import "../uploadcont.css";

const host = "https://cloud-share-server.herokuapp.com";
const uploadUrl = `${host}/api/files`;

const UploadContainer = () => {
  var uploadcont = document.querySelector(".upload-container");
  var dropzone = document.querySelector(".dropzone");
  var img1 = document.querySelector(".image");
  var documentation = document.querySelector("#documentation");
  var hiddenFileInput = React.useRef(null);
  const [progressPercent, setProgressPercent] = useState(null);
  const [showProgressBar, ToggleProgressBar] = useState(false);
  const [fileLink, setFileLink] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [eror, setEror] = useState(null);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    // if (window.navigator.onLine == false && showProgressBar) {
    //   console.log(eror);
    //   console.log(window.navigator.onLine);
    //   ToggleProgressBar(false);
    //   setProgressPercent(0);
    //   setFileLink(null);
    //   setEror("Internet Disconnected");
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    documentation = document.querySelector("#documentation");
    img1 = document.querySelector(".image");
    dropzone = document.querySelector(".dropzone");
    uploadcont = document.querySelector(".upload-container");
    console.log(hiddenFileInput.files);
  }, [hiddenFileInput.files]);

  const maxAllowedSize = 1024 * 1024 * 100;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!img1.classList.contains("iimmg")) {
      img1.classList.add("iimmg");
    }
    console.log(dropzone);
    if (!dropzone.classList.contains("droppzone")) {
      dropzone.classList.add("droppzone");
    }
    if (!uploadcont.classList.contains("uploadcont")) {
      uploadcont.classList.add("uploadcont");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (img1.classList.contains("iimmg")) {
      img1.classList.remove("iimmg");
    }

    if (dropzone.classList.contains("droppzone")) {
      dropzone.classList.remove("droppzone");
    }

    if (uploadcont.classList.contains("uploadcont")) {
      uploadcont.classList.remove("uploadcont");
    }

    if (e.dataTransfer.files.length != undefined) {
      console.log(e.dataTransfer.files.length);
      var files = e.dataTransfer.files;
      if (window.navigator.onLine) {
        const file = files[0];

        if (file.size <= maxAllowedSize) {
          console.log(file.size);

          //  uploadFile(file);
        } else {
          console.log(file.size);
          setEror("Max size limit : 100MB");
          console.log(eror);
        }
      } else {
        setEror("No internet");
        console.log(eror);
      }
    }
  };

  function uploadFile(file) {
    documentation.style.display = "none";

    setFileName(file.name);
    const formData = new FormData();
    formData.append("myfile", file);
    ToggleProgressBar(true);
    try {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          console.log(xhr.response);
          const link = JSON.parse(xhr.response);
          console.log(link);
          setFileLink(link.file);
          setTimeout(() => {
            ToggleProgressBar(false);
          }, 3000);
        }
        if (
          xhr.readyState == XMLHttpRequest.LOADING &&
          !window.navigator.onLine
        ) {
          ToggleProgressBar(false);
          setProgressPercent(0);
          setFileLink(null);
          setEror(`Upload Error: ${xhr.statusText}`);
        }
      };
      xhr.upload.onprogress = updateProgress;
      xhr.upload.onerror = () => {
        ToggleProgressBar(false);
        setProgressPercent(0);
        setFileLink(null);
        setEror(`Upload Error: ${xhr.statusText}`);
      };
      setloading(true);
      xhr.open("POST", uploadUrl);
      xhr.send(formData);
    } catch (err) {
      setEror(`Upload Error: ConnectionError `);
      console.log(err);
    }
  }

  console.log(fileName);

  const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    if (percent > 0) {
      setloading(false);
    }
    setProgressPercent(percent);
  };

  const handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFileName(e.target.files[0]);
    if (e.target.files) {
      var file = e.target.files[0];
      setFileLink(file);
      if (file.size <= maxAllowedSize) {
        console.log(file.size);

        uploadFile(file);
      } else {
        setEror("File size exceded");
      }
    }
  };

  const handleClick = async (event) => {
    console.log("hi");
    await hiddenFileInput.current.click();
  };

  return (
    <div className="upload-container">
      <div className="lower-cont">
        <Container
          onDrop={(e) => handleDrop(e)}
          onDragOver={(e) => handleDragOver(e)}
          className="dropzone"
          sx={{
            margin: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {fileName ? (
            <div>
              <div>File name: {fileName?.name}</div>
              <button className="share-button">Share</button>
            </div>
          ) : (
            <div>
              {" "}
              <img
                width="120px"
                height="110px"
                src={upload}
                alt="filshare"
                className="image"
              />
              <input
                ref={hiddenFileInput}
                onChange={(e) => {
                  handleChange(e);
                }}
                style={{ display: "none" }}
                type="file"
              ></input>
              <p
                className="simpletext"
                style={{ color: "white", textAlign: "center" }}
              >
                Drop your files here or{" "}
                <span id="browse-button" onClick={handleClick}>
                  browse
                </span>
              </p>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default UploadContainer;
