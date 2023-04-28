import React, { useState, useContext, useEffect } from "react";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../reducers/loading.js";
import { useNavigate } from "react-router-dom";
import copy from "copy-to-clipboard";
import { SocketContext, socket } from "../reducers/socket";
// import UploadContainer from "./UploadContainer";
// import TabNavigator from "./TabNavigator";
// import Chat from "../Compo/Chat";
import { setUsers } from "../reducers/users.js";
import { avtarArr } from "../utilites/arr";
import streamSaver from "streamsaver";
import Peer from "simple-peer";
import avatar from "../images/avatar.png";
import plane from "../images/plane.png";
import cancel from "../images/cancel.png";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import { colorSelect } from "../Compo/color";

function JoinedRoom() {
  const worker = new Worker("../worker.js");
  const [userName, setUserName] = useState("");
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const roomcode = useSelector((state) => state.code);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const nav = useNavigate();
  const [peerList, setPeerList] = useState([]);
  const [userCount, setUserCount] = useState(users.value.count);

  // THis messageList is for maintaining the state of all messages
  const [messageList, setMessagesList] = useState([]);

  // This mess is the state of the message input field
  const [mess, setMess] = useState("");

  // This message variable is for state of short message that we are gonna send during sending file
  const [message, setMessage] = useState("");

  // This is for state of short message received with the file
  const [short, setShort] = useState({});

  //
  const [chatInput, setChatInput] = useState(false);

  const [open, setOpen] = useState(true);

  //refs
  var peerRef = React.useRef();
  var hiddenFileInput = React.useRef(null);
  const messagebox = React.createRef();

  // const peersRef = React.useRef([]);
  const fileNameRef = React.useRef("");

  // files ;
  const [connectionEstablished, setConnection] = useState(false);
  const [file, setFile] = useState(null);
  const [receivedFile, setReceived] = useState({});
  const [gotFile, setGotFile] = useState(false);
  const [desc, setDesc] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (event) => {
    setDesc(event.target.value);
  };

  const handleClick = async (event) => {
    if (gotFile === false) {
      console.log("hi");
      await hiddenFileInput.current.click();
    }
  };

  const bagcolor = colorSelect();

  const sendMessage = () => {
    if (mess !== "") {
      const messageData = {
        message: mess,
        side: "right",
        from: "you",
        color: bagcolor,
      };

      console.log("message data", messageData);

      const senderData = {
        message: mess,
        side: "left",
        from: user.value.username,
        color: "",
        room: roomcode.value.code,
      };
      console.log(senderData);
      socket.emit("send_message", senderData);
      setMessagesList([...messageList, messageData]);
      // messagebox.current.scrollIntoView({ behaviour: "smooth" });
      setMess("");
    }
  };

  const setPeers = (Users) => {
    const peers = Users.filter((userName) => userName !== user.value.username);
    setPeerList(peers);
  };

  // useEffect(() => {
  //   socket.on("all users", (users) => {
  //     peerRef.current = createPeer(users[0], socket.id);
  //   });

  //   socket.on("user joined", (payload) => {
  //     peerRef.current = addPeer(payload.signal, payload.callerID);
  //   });

  //   socket.on("receiving returned signal", (payload) => {
  //     peerRef.current.signal(payload.signal);
  //     setConnection(true);
  //   });
  // }, []);

  useEffect(() => {
    const data = {
      username: user.value.username,
      code: roomcode.value.code,
    };
    socket.emit("join-room", data);
    socket.on("updateState", (payload) => {
      console.log("UpdateState", payload);
      dispatch(setUsers, { count: payload.count, list: payload.users });
      setUserCount(payload.count);
      setPeers(payload.users);
    });

    socket.on("receive-file", (data) => {
      setFile(null);
      setGotFile(true);
      console.log("Do you want to receive the file", data);
      setShort(data.message);
      setReceived({ file: data.file, fileName: data.fileName });
    });

    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesList((messageList) => [...messageList, data]);
      // messagebox.current.scrollIntoView({ behaviour: "smooth" });
    });

    socket.on("others-joined", (data) => {
      const realdata = JSON.stringify(data);
      console.log(data.side);
      console.log(realdata);
      setMessagesList((messageList) => [...messageList, data]);
    });

    socket.on("leave", (payload) => {
      console.log("leave", payload);
      dispatch(setUsers, { count: payload.count, list: payload.users });
      setUserCount(payload.count);
      setPeers(payload.users);
    });

    socket.on("disconnect", () => {
      dispatch(
        setLoading({ loadingvalue: true, loadingtext: "Leaving the rooom" })
      );
      setTimeout(() => {
        dispatch(setLoading({ loadingvalue: false }));
        nav("/", { replace: true });
      }, 1500);
    });

    socket.on("userLeft", (payload) => {
      console.log("UserLeft", payload);
      console.log("UpdateState", payload);
      dispatch(setUsers, { count: payload.count, list: payload.users });
      setUserCount(payload.count);
      setPeers(payload.users);
    });
  }, []);

  useEffect(() => {
    setUserName(user.value.username);
    if (!user.value.username && !roomcode.value.code) {
      nav("/", { replace: true });
    }
  }, []);

  //leaving the room --->
  const leaveRoom = () => {
    dispatch(
      setLoading({ loadingvalue: true, loadingtext: "Leaving the rooom" })
    );
    setTimeout(() => {
      dispatch(setLoading({ loadingvalue: false }));
      socket.emit("leaving", {
        username: user.value.username,
        code: roomcode.value.code,
      });
      nav("/", { replace: true });
    }, 1500);
  };

  // function createPeer(userToSignal, callerID) {
  //   const peer = new Peer({
  //     initiator: true,
  //     config: {
  //       iceServers: [
  //         { urls: "stun:stun.l.google.com:19302" },
  //         { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
  //         { urls: "stun:stun.services.mozilla.com" },
  //       ],
  //     },
  //     trickle: false,
  //   });

  //   peer.on("signal", (signal) => {
  //     socket.emit("sending signal", {
  //       userToSignal,
  //       callerID,
  //       signal,
  //     });
  //   });

  //   peer.on("data", handleReceivingData);

  //   return peer;
  // }

  // function addPeer(incomingSignal, callerID) {
  //   const peer = new Peer({
  //     initiator: true,
  //     config: {
  //       iceServers: [
  //         { urls: "stun:stun.l.google.com:19302" },
  //         { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
  //         { urls: "stun:stun.services.mozilla.com" },
  //       ],
  //     },
  //     trickle: false,
  //   });

  //   peer.on("signal", (signal) => {
  //     socket.emit("returning signal", { signal, callerID });
  //   });

  //   peer.on("data", handleReceivingData);

  //   peer.signal(incomingSignal);
  //   setConnection(true);
  //   return peer;
  // }

  // function handleReceivingData(data) {
  //   if (data.toString().includes("done")) {
  //     setGotFile(true);
  //     const parsed = JSON.parse(data);
  //     fileNameRef.current = parsed.fileName;
  //   } else {
  //     worker.postMessage(data);
  //   }
  // }

  // function download() {
  //   setGotFile(false);
  //   worker.postMessage("download");
  //   worker.addEventListener("message", (event) => {
  //     const stream = event.data.stream();
  //     const fileStream = streamSaver.createWriteStream(fileNameRef.current);
  //     stream.pipeTo(fileStream);
  //   });
  // }

  const uploadFile = async () => {
    dispatch(
      setLoading({ loadingvalue: true, loadingtext: "Sending File..." })
    );
    console.log("upload file", file, desc);
    const message = { desc: desc, sender: userName };
    socket.emit("upload", file, file.name, message, (status) => {
      alert(` ${file.name} File Sent successfully`);
      console.log(status);
      setFile(null);
      dispatch(setLoading({ loadingvalue: false, loadingtext: "" }));
    });
  };

  //  download() ;
  // function sendFile() {
  //   const peer = peerRef.current;
  //   const stream = file.stream();
  //   const reader = stream.getReader();

  //   reader.read().then((obj) => {
  //     handlereading(obj.done, obj.value);
  //   });

  //   function handlereading(done, value) {
  //     if (done) {
  //       peer.write(JSON.stringify({ done: true, fileName: file.name }));
  //       return;
  //     }

  //     peer.write(value);
  //     reader.read().then((obj) => {
  //       handlereading(obj.done, obj.value);
  //     });
  //   }
  // }

  // sendFile() ;

  const downloadFile = () => {
    const fileBlob = new Blob([receivedFile.file], {
      type: "application/octet-stream",
    });
    const fileUrl = URL.createObjectURL(fileBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = fileUrl;
    downloadLink.download = receivedFile.fileName;
    downloadLink.click();
    alert(` ${receivedFile}} File received successfully`);
    setGotFile(false);
    setReceived({});
  };

  return (
    <div className="normal-container">
      {userCount > 1 ? (
        <>
          <MessageArea
            open={open}
            setOpen={setOpen}
            messageList={messageList}
            messagebox={messagebox}
            chatInput={chatInput}
            setChatInput={setChatInput}
          />
          <ChatButton
            mess={mess}
            open={open}
            setOpen={setOpen}
            setMess={setMess}
            sendMessage={sendMessage}
            chatInput={chatInput}
            setChatInput={setChatInput}
          />
        </>
      ) : (
        <div></div>
      )}
      <RoomDetails roomcode={roomcode} copy={copy} />
      {
        <div
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 25,
            paddingRight: 25,
            paddingTop: 40,
            paddingBottom: 15,
            borderRadius: 15,
            display: gotFile === false ? "none" : "flex",
            boxShadow: "3px 5px slateblue",
            color: theme.value.bgColor,
            background: theme.value.color,
            border: "1px solid slateblue",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              cursor: "pointer",
            }}
            onClick={() => {
              setGotFile(false);
              setReceived({});
            }}
          >
            <img src={cancel} height={25} width={25} alt="cancel icon" />
          </div>
          <div>You have an incoming file request?</div>
          <div
            className="center-div"
            style={{ textAlign: "center", color: "slateblue", fontWeight: 600 }}
          >
            File: {receivedFile.fileName}
          </div>
          <div style={{ textAlign: "center", paddingTop: 15, fontSize: 12 }}>
            {short?.sender} said
          </div>
          <div
            style={{
              textAlign: "center",
              margin: 0,
              fontSize: 12,
              color: "slateblue",
              fontWeight: 600,
            }}
          >
            {short?.desc}
          </div>
          <button
            style={{ marginTop: 20, fontSize: 14, paddingLeft: 10 }}
            className="create-join-btn"
            onClick={downloadFile}
          >
            Accept
          </button>
        </div>
      }
      {file != null ? (
        <SendFilePopup
          peerList={peerList}
          setFile={setFile}
          file={file}
          uploadFile={uploadFile}
          handleClick={handleClick}
          handleInputChange={handleInputChange}
          desc={desc}
          userCount={userCount}
          theme={theme}
        />
      ) : (
        <div></div>
      )}
      {userCount > 1 ? (
        <>
          <div
            className="center-div"
            style={{
              margin: 10,
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 30,
                marginBottom: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>You</div>
              <div className="outer-avatar">
                <div className="inner-avatar">
                  <img
                    alt={"user"}
                    height={"100%"}
                    width={"100%"}
                    src={avtarArr[userName.charCodeAt(0) % 8]}
                  />
                </div>
              </div>
              <div>{userName}</div>
            </div>
            <div className="center-div" style={{ marginTop: 30 }}>
              <div>Peers {`(${userCount - 1})`}</div>
              <div className="user-grid">
                {peerList?.map((p, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{ height: 30, width: 30, margin: 4 }}
                        className="outer-avatar"
                      >
                        <div className="inner-avatar">
                          <img
                            alt={"user"}
                            height={"100%"}
                            width={"100%"}
                            src={avtarArr[p.charCodeAt(0) % 8]}
                          />
                        </div>
                      </div>
                      <div style={{ marginLeft: 10 }}>{p}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="center-div">
            <input
              ref={hiddenFileInput}
              onChange={(e) => {
                handleChange(e);
              }}
              style={{ display: "none" }}
              type="file"
            />
            {file === null ? (
              <button
                style={{ margin: "10px 20px" }}
                className="create-button"
                onClick={handleClick}
              >
                Send File
              </button>
            ) : (
              <div></div>
            )}
          </div>

          {/* <RoomDetails userCount={userCount} peerList={peerList} /> */}
          {/* <TabNavigator tab={tab} setTab={setTab} /> */}
          {/* {tab == "Files" ? <UploadContainer /> : <Chat />} */}
          {/* <UploadContainer /> */}
          {/* <Chat /> */}
        </>
      ) : (
        <div className="center-div">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 30,
              marginBottom: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>You</div>
            <div className="outer-avatar">
              <div className="inner-avatar">
                <img alt={"user"} height={"100%"} width={"100%"} src={avatar} />
              </div>
            </div>
            <div>{userName}</div>
          </div>
          <div>Peer Count : {userCount <= 0 ? 0 : userCount}</div>
          <p style={{ textAlign: "center", padding: 10 }}>
            You are alone in this room. Share this link to your friends so that
            you can share files.{" "}
          </p>
        </div>
      )}
      {file === null ? (
        <button className="create-join-btn" onClick={leaveRoom}>
          Leave
        </button>
      ) : (
        <div></div>
      )}
      <Loading />
    </div>
  );
}

export default JoinedRoom;

const MessageArea = ({ messageList, messagebox, chatInput, setChatInput }) => {
  return chatInput === false ? (
    <div></div>
  ) : (
    <div className="message-area">
      <div onClick={() => setChatInput(false)} className="close-popup">
        X
      </div>
      <div style={{ padding: 10, textAlign: "center" }}>Message Box</div>
      {messageList.map(function (message, idx) {
        return (
          <div
            style={{ marginRight: "10px" }}
            key={idx}
            className={message.side}
          >
            {message.side === "middle" ? (
              <div>{message.message}</div>
            ) : (
              <div
                className="messageBox"
                style={{ backgroundColor: message.color }}
              >
                {message.message}
              </div>
            )}
            <p style={{ color: "grey", fontWeight: "bold" }}>{message.from}</p>
          </div>
        );
      })}
      <div ref={messagebox}></div>
    </div>
  );
};

const ChatButton = ({
  mess,
  setMess,
  sendMessage,
  chatInput,
  setChatInput,
  open,
  setOpen,
}) => {
  return (
    <div
      className={chatInput === false ? "float-button" : "float-button-active"}
    >
      <input
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            sendMessage();
          }
        }}
        value={mess}
        onChange={(event) => setMess(event.target.value)}
        placeholder="Message"
        style={{
          display: chatInput === true ? "flex" : "none",
          flexDirection: "column",
          width: "80%",
          height: "90%",
          cursor: "pointer",
          fontSize: 16,
          outline: "none",
          border: "none",
        }}
      />
      <img
        id="plane"
        src={plane}
        height={30}
        width={30}
        onClick={() => {
          if (chatInput === true) {
            console.log(mess);
            sendMessage();
            setChatInput(false);
          } else {
            setChatInput(true);
            if (open === false) setOpen(true);
          }
        }}
        alt="chat-button"
      />
    </div>
  );
};

const SendFilePopup = ({
  file,
  peerList,
  userCount,
  uploadFile,
  setFile,
  handleInputChange,
  desc,
  theme,
}) => {
  return (
    <div
      style={{
        display: file === null ? "none" : "flex",
        flexDirection: "column",
        color: theme.value.bgColor,
        background: theme.value.color,
      }}
      className={file !== null ? "popup" : ""}
    >
      <div style={{ position: "absolute", right: "10px", top: "10px" }}>X</div>
      <div className="center-div">
        <div
          style={{
            marginTop: 15,
            marginBottom: 25,
            fontWeight: 600,
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          File name: {file?.name}
        </div>
        <div>Peers {`(${userCount - 1})`}</div>
        <div style={{ alignItems: "start" }} className="user-grid">
          {peerList?.map((p, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ height: 30, width: 30, margin: 4 }}
                  className="outer-avatar"
                >
                  <div className="inner-avatar">
                    <img
                      alt={"user"}
                      height={"100%"}
                      width={"100%"}
                      src={avtarArr[p.charCodeAt(0) % 8]}
                    />
                  </div>
                </div>
                <div style={{ marginLeft: 10 }}>{p}</div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "left" }} className="input-container">
          <textarea
            type="text"
            className="desc-input"
            placeholder="Short Message"
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around  ",
            alignItems: "center",
          }}
        >
          <button
            style={{ marginRight: 10, marginTop: 10 }}
            className="create-button"
            onClick={() => setFile(null)}
          >
            Cancel
          </button>
          <button
            style={{ marginLeft: 10, marginTop: 10 }}
            className="create-button"
            onClick={() => {
              console.log("hello");
              uploadFile();
            }}
          >
            Send File
          </button>
        </div>
      </div>
    </div>
  );
};

const RoomDetails = ({ roomcode, copy }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ fontWeight: 600 }}>Room : {roomcode.value.code}</div>
      <WhatsappShareButton
        url={`${roomcode.value.code}`}
        style={{ borderRadius: 30 }}
      >
        <WhatsappIcon
          onClick={() => {
            copy(roomcode.value.code);
          }}
          style={{ borderRadius: 30, marginLeft: 5, marginTop: 5 }}
          size={25}
        />
      </WhatsappShareButton>
    </div>
  );
};
