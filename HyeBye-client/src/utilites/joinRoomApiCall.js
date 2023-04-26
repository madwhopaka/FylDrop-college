import axios from "axios";

const host = "https://fyldrop-college-production.up.railway.app";
// const host = "http://192.168.0.104:8000";
const url = `${host}/api/room/validate`;

export default async function joinRoomApiCall(username, code) {
  const formdata = {
    username: username,
    code: code,
  };
  var returnState;
  try {
    await axios.post(url, formdata).then((res) => {
      console.log(res);
      console.log(res.data.error);
      const error = res.data.error;
      if (res.data.error != "") {
        returnState = error;
      } else {
        const success = "Success";
        returnState = success;
      }
    });
  } catch (err) {
    console.log(err);
    returnState = err;
  }

  return returnState;
}
