const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_Secret, {
    expiresIn: "40d",
  });
};
module.exports = generateToken;
