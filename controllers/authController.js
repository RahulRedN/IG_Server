const Jobseeker = require("../models/Jobseeker");
const Company = require("../models/Company");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const registerJobseeker = async (req, res) => {
  const { email } = req.body;
  const emailExists = await Jobseeker.findOne({ email });
  if (emailExists) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Email already exists!" });
  }

  const user = await Jobseeker.create({
    ...req.body,
    img: req.files["image"][0].path,
    resume: req.files["resume"][0].path,
  });
  const tokenJobseeker = createTokenUser({
    name: user.fname,
    _id: user._id,
    role: "jobseeker",
  });
  const cook = attachCookiesToResponse({ res, user: tokenJobseeker });
  return res
    .status(StatusCodes.CREATED)
    .json({ user: tokenJobseeker, cookie: cook });
};

const registerCompany = async (req, res) => {
  const { email, name, password } = req.body;
  const emailExists = await Company.findOne({ email });
  if (emailExists) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Email already exists!" });
  }

  const user = await Company.create({ name, email, password });
  const tokenCompany = createTokenUser({
    name: user.name,
    _id: user._id,
    role: "company",
  });
  const cook = attachCookiesToResponse({ res, user: tokenCompany });

  return res
    .status(StatusCodes.CREATED)
    .json({ user: tokenCompany, cookie: cook });
};

const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide email and password!" });
  }
  const company = await Company.findOne({ email });
  if (!company) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Email does not exist!" });
  }
  const isPasswordCorrect = await company.comparePassword(password);

  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid password!" });
  }

  if (company.status == "pending") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Your account is pending for approval!" });
  }

  if (company.status == "rejected") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Your account has been been rejected!" });
  }
  const tokenCompany = createTokenUser({
    name: company.name,
    _id: company._id,
    role: "company",
  });
  const cook = attachCookiesToResponse({ res, user: tokenCompany });
  return res
    .status(StatusCodes.OK)
    .json({ Company: tokenCompany, cookie: cook });
};

const loginJobseeker = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide email and password!" });
  }
  const jobseeker = await Jobseeker.findOne({ email });
  if (!jobseeker) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Email does not exist!" });
  }
  const isPasswordCorrect = await jobseeker.comparePassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid password!" });
  }

  const tokenJobseeker = createTokenUser({
    name: jobseeker.fname,
    _id: jobseeker._id,
    role: "jobseeker",
  });

  const cook = attachCookiesToResponse({ res, user: tokenJobseeker });

  return res
    .status(StatusCodes.OK)
    .json({ Jobseeker: tokenJobseeker, cookie: cook });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide email and password!" });
  }
  if (!(email === "Admin@gmail.com") || !(password === "Admin@2021")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "You are not authorized" });
  }
  const tokenAdmin = createTokenUser({
    name: email,
    _id: password,
    role: "Admin",
  });

  const cook = attachCookiesToResponse({ res, user: tokenAdmin });
  return res.status(StatusCodes.OK).json({ Admin: tokenAdmin, cookie: cook });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res.status(StatusCodes.OK).json({ msg: "Logged out!!" });
};

module.exports = {
  registerJobseeker,
  registerCompany,
  loginJobseeker,
  loginCompany,
  logout,
  loginAdmin,
};
