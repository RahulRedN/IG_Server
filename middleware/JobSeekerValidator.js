const isJobSeeker = (req, res, next) => {
    console.log(req.user)
    if (req.user.role === "jobseeker" || req.user.role === "admin") {
        next();
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
module.exports = isJobSeeker;