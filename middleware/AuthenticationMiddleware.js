
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

const auth = (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Authentication invalid" });
  }
  const token = authHeader.split(" ")[1];

  if(!token){
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Authentication invalid" });
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  // attach the user to the job routes
  req.user = { _id: payload._id, role: payload.role };
  next();
};

module.exports = auth;
