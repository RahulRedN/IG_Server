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
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token is not found" });
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);

  if (!payload) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "No data inside the token" });
  }

  req.user = { _id: payload._id, role: payload.role };
  next();
};

module.exports = auth;
