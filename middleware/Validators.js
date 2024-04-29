const isJobSeeker = async (req, res, next) => {
  if (req.user.role === "jobseeker" || req.user.role === "admin") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const isCompany = async (req, res, next) => {
  if (req.user.role === "company" || req.user.role === "admin") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { isJobSeeker, isCompany };
