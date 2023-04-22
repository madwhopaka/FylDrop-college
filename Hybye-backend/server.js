import express from "express";
import cors from "cors";
// import http from "http";
import { Server } from "socket.io";
import username from "./routes/username.js";
import create from "./routes/create.js";
import validate from "./routes/validate.js";
import connectDb from "./config/db.js";
import { roomState } from "./state.js";
const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: [process.env.ALLOWED_CLIENTS.split(",")],
};

var colorArray = [
  "#c56cf0",
  "#3ae374",
  "#17c0eb",
  "#7158e2",
  "#ff4d4d",
  "#ffaf40",
  "#474787",
  "#ffb142",
];
const leng = colorArray.length;

connectDb();
app.use(cors(corsOptions));
app.use(express.json(corsOptions));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the server </h1>");
});
app.use("/api/room/create", create.router);
app.use("/api/room/validate", validate.router);
app.use("/api/username", username.router);

const server = app.listen(PORT, () => {
  console.log(`Listening to the port on 192.168.0.104: ${PORT}`);
});

var users = [];
var colors = [];
var userroom = [];
var usersCount = [];
var rooms = [];
var roomObj = [];
console.log(process.env.ALLOWED_CLIENTS.split(","));
const io = new Server(server, {
  cors: {
    origin: [process.env.ALLOWED_CLIENTS.split(",")],
    methods: ["GET", "POST"],
  },
});

// function increateCount(code) {
//   if (rooms.indexOf(code) == -1) {
//     rooms.push(code);
//   }

//   var roomNumber = rooms.indexOf(code);
//   console.log(roomNumber);
//   var count = usersCount[roomNumber];
//   if (count == undefined) usersCount[roomNumber] = 1;
//   else usersCount[roomNumber]++;
//   console.log(usersCount[roomNumber]);

//   return usersCount[roomNumber];
// }

// function decreaseCount(code) {
//   if (rooms.indexOf(code) != -1) {
//     var roomNumber = rooms.indexOf(code);
//     var count = usersCount[roomNumber];
//     if (count != undefined) usersCount[roomNumber]--;

//     return usersCount[roomNumber];
//   }
// }

io.on("connection", (socket) => {
  socket.emit("connected", {});

  socket.on("join-room", (data) => {
    users[socket.id] = data.username;
    colors[socket.id] = colorArray[Math.floor(Math.random() * leng)];
    userroom[socket.id] = data.code;
    // check if user already there before increasing count and updating list
    let userList = roomState?.[data.code]?.users;
    if (
      !userList?.includes(data.username) &&
      roomState?.[data.code] != undefined
    ) {
      // update rooms state
      let peopleCount = roomState?.[data.code]?.count;
      roomState[data.code].count = peopleCount += 1;
      userList?.push(data.username);
      roomState[data.code].users = userList;
      console.log("People count", roomState?.[data.code]);
      roomObj = roomState?.[data.code];
      console.log(roomObj);
      socket.join("room" + userroom[socket.id]);
      io.in(`room${userroom[socket.id]}`).emit("updateState", roomObj);
    }

    // console.log(`${users[socket.id]}, joined the room${data.code}`);
    // const returnData = {
    //   message: `${data.username} joined the chat`,
    //   side: "middle",
    //   color: "",
    //   from: "server",
    // };
    // console.log(socket.rooms.has(`room${data.code}`));
    // socket.to(`room${userroom[socket.id]}`).emit("others-joined", returnData);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("send_message", (data) => {
    console.log(colors[socket.id]);
    data.color = colors[socket.id];
    data.from = users[socket.id];
    console.log(data);
    socket.to(`room${data.room}`).emit("receive_message", data);
  });

  socket.on("leaving", (payload) => {
    console.log("Leaving", payload);
    let userList = roomState?.[userroom?.[socket.id]]?.users;
    console.log("UserList before leaving", userList, users[socket.id]);
    if (
      userList?.includes(users[socket.id]) &&
      roomState?.[userroom?.[socket.id]] != undefined
    ) {
      // update rooms state
      let peopleCount = roomState?.[userroom[socket.id]]?.count;
      console.log("People", peopleCount);
      roomState[userroom[socket.id]].count = peopleCount -= 1;
      const index = userList.indexOf(users[socket.id]);
      if (index > -1) {
        // only splice array when item is found
        userList.splice(index, 1); // 2nd parameter means remove one item only
      }
      console.log("userroom[socket.id]", userroom[socket.id]);
      roomState[userroom[socket.id]].users = userList;
      console.log("People count", roomState?.[userroom[socket.id]]);
      roomObj = roomState?.[userroom[socket.id]];
      console.log(roomObj);
      io.in(`room${userroom[socket.id]}`).emit("leave", roomObj);
    }

    // socket.to(`room${userroom[socket.id]}`).emit("leave", data);

    // socket.leave(`room${userroom[socket.id]}`);
  });

  socket.on("disconnect", () => {
    console.log(`room${userroom[socket.id]}`);
    const code = userroom?.[socket.id];
    var userList = roomState?.[code]?.users;
    console.log("UserList before leaving", userList, users[socket.id]);
    const index =
      userList != undefined || userList != null
        ? userList.indexOf(users[socket.id])
        : -1;
    if (index > -1) {
      // only splice array when item is found
      userList.splice(index, 1); // 2nd parameter means remove one item only
    }
    const count = userList?.length;
    if (roomState?.[code]) {
      roomState[code].users = userList;
      roomState[code].count = count;
    }
    io.in(`room${code}`).emit("userLeft", roomState?.[code]);
    socket.leaveAll();
    console.log("Socket left", users[socket.id]);
  });
});
