import express from "express";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

const router = express.Router();

router.post("/", (req, res) => {
  const randomName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
  });
  // big_red_donkey
  const shortName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
    length: 2,
  }); // big-donkey
  res.json({ username: randomName });
});

export default { router };
