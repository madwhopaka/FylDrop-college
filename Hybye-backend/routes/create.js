import express from "express";
import roomModel from "../models/room.js";
import { roomState } from "../state.js";

const router = express.Router();
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateRoomCode(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  result += Math.floor(Math.random() * 100);
  if (result.length < 12) {
    const randomnumber = Math.floor(Math.random() * 10);
    result += randomnumber;
  }

  return result;
}

router.post("/", async (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const code = generateRoomCode(12);
  try {
    const room = await new roomModel({
      roomId: code,
      host: username,
      activeMembers: 0,
    });
    // Save
    const response = await room.save();
    // Update the state
    roomState[code] = {
      users: [],
      host: username,
      count: 0,
    };
    console.log(roomState);
    res.send({ code: code });
  } catch (err) {
    res.send(err);
  }
});

export default { router };
