require("dotenv").config();
const express = require("express");

const bodyParser = require("body-parser");

const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rfs = require("rotating-file-stream");



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

//app middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(helmet());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));




app.use("/api/auth", authRouter);
app.use("/api/jobseeker", jobseekerRouter);
app.use("/api/company", companyRouter);
app.use('/api/admin', adminRouter);

app.get('/test', async (req, res) => {

  try {
    const data = Company.find({ email: "email@gmail.com" });
    console.log("Created At:", data.createdAt);
    console.log("Updated At:", data.updatedAt);
    res.json({ data });

  } catch (error) {

  }

})

app.get("/test", async (req, res) => {
  try {
    const data = await Company.find({});
    res.json(data);
    console.log(data[0]);
  } catch (error) {
    console.log(error);
  }
});


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

start();
