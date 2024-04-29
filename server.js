require("dotenv").config();
const express = require("express");

const bodyParser = require("body-parser");

const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rfs = require("rotating-file-stream");

const router = express.Router();

const connectDB = require("./db/connect");
//Routes
const authRouter = require("./routes/authRoute");
const jobseekerRouter = require("./routes/jobSeekerRoute");
const companyRouter = require("./routes/companyRoute");
const adminRouter = require("./routes/adminRoute");


const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
  credentials: true,
};

const accesslogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: "./logs",
});

app.use(morgan("combined", { stream: accesslogStream }));

//application middleware
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(helmet());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//Inbuilt middleware
app.use(express.static("./public"));


app.use("/api/auth", authRouter);
app.use("/api/jobseeker", jobseekerRouter);
app.use("/api/company", companyRouter);
app.use('/api/admin', adminRouter);

const port = process.env.PORT || 8080;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log("DB is connected.");
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

//Error middleware
router.use((err, req, res, next) => {
  console.log("Error handling middleware called");
  console.log("Path", req.path);
  console.error("Error", err);

  if (err.type === "redirect") {
    res.redirect("/error");
  } else if (err.type === "time-out") {
    res.status(408).send(err);
  } else res.status(500).send(err);
  next();
});


start();
