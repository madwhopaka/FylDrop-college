const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

const generateUserName = () => {
  const randomName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
  }); // big_red_donkey
  const shortName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
    length: 2,
  }); // big-donkey
  console.log("big-donkeyn", randomName);
  return randomName;
};
