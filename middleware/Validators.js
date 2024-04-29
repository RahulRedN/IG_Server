const isJobSeeker = async (req, res, next) => {
  if (req.user.role === "jobseeker" || req.user.role === "Admin") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const isCompany = async (req, res, next) => {
  if (req.user.role === "company" || req.user.role === "Admin") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user.role === "Admin") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { isJobSeeker, isCompany, isAdmin };
