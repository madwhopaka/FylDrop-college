import React, { useState, useContext, useEffect } from "react";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../reducers/loading.js";
import { useNavigate } from "react-router-dom";
import { SocketContext, socket } from "../reducers/socket";
import Peer from "simple-peer";
import UploadContainer from "./UploadContainer";
import TabNavigator from "./TabNavigator";
import RoomDetails from "../Compo/RoomDetails";
import Chat from "../Compo/Chat";
import { setUsers } from "../reducers/users.js";
import avatar from "../images/avatar.png";
import { avtarArr } from "../utilites/arr";

function JoinedRoom() {
  const [userName, setUserName] = useState("");
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const roomcode = useSelector((state) => state.code);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const nav = useNavigate();
  const [peerList, setPeerList] = useState([]);
  const [userCount, setUserCount] = useState(users.value.count);
  const [messageList, setMessagesList] = useState([]);

  //refs
  var peerRef = React.useRef();
  var hiddenFileInput = React.useRef(null);

  // files ;
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files) {
      setFile(e.target.files[0]);
      console.log(file);
    }
  };

  const handleClick = async (event) => {
    console.log("hi");
    await hiddenFileInput.current.click();
  };

  const setPeers = (Users) => {
    const peers = Users.filter((userName) => userName !== user.value.username);
    setPeerList(peers);
  };

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

    // socket.emit("send_message", "Hello whatsup?");

    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesList((messageList) => [...messageList, data]);
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
    } else {
      socket.on("all users", (users) => {
        peerRef.current = createPeer(users[0], socket.id);
      });

      socket.on("user joined", (payload) => {
        peerRef.current = addPeer(payload.signal, payload.callerID);
      });

      socket.on("receiving returned signal", (payload) => {
        peerRef.current.signal(payload.signal);
        // setConnection(true);
      });
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
      nav("/login", { replace: true });
    }, 1500);
  };

  const createPeer = () => {};

  const addPeer = () => {};

  return (
    <div className="normal-container">
      <div style={{ fontWeight: 600 }}>Room : {roomcode.value.code}</div>
      <SendFilePopup
        peerList={peerList}
        setFile={setFile}
        file={file}
        handleClick={handleClick}
        userCount={userCount}
      />
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
                {peerList?.map((p) => {
                  return (
                    <div
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

  const sendFile = () => {
    const stream = file.stream();
    const reader = stream.getReader();
    reader.read().then((obj) => {
      handleReading(obj.done, obj.value);
    });

    const handleReading = (done, value) => {
      if (done) {
        // peer.write(JSON.stringify({done:true, fileName:file.name }))
      }
      // peer.write(value) ;
      reader.read((obj) => {
        handleReading(obj.done, obj.value);
      });
    };
  };
}

export default JoinedRoom;

const SendFilePopup = ({ file, peerList, userCount, handleClick, setFile }) => {
  console.log(file);
  return (
    <div
      style={{
        display: file === null ? "none" : "flex",
        flexDirection: "column",
      }}
      className={file !== null ? "popup" : ""}
    >
      <div style={{ position: "absolute", right: "10px", top: "10px" }}>X</div>
      <div className="center-div">
        <div style={{ marginTop: 15, marginBottom: 25, fontWeight: 600 }}>
          File name: {file?.name}
        </div>
        <div>Peers {`(${userCount - 1})`}</div>
        <div style={{ alignItems: "start" }} className="user-grid">
          {peerList?.map((p) => {
            return (
              <div
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
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around  ",
            alignItems: "center",
          }}
        >
          <button
            style={{ marginRight: 10 }}
            className="create-button"
            onClick={() => setFile(null)}
          >
            Cancel
          </button>
          <button
            style={{ marginLeft: 10 }}
            className="create-button"
            onClick={handleClick}
          >
            Send File
          </button>
        </div>
      </div>
    </div>
  );
};
