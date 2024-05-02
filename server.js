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
const homeRouter = require("./routes/homeRoute");
const corsOptions = {
  origin: process.env.ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const accesslogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: "./logs",
});

const Job = require("./models/Job");
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
app.use("/api/admin", adminRouter);
app.use("/api/home", homeRouter);

//Error middleware
app.use((err, req, res, next) => {
  console.log("Error handling middleware called");
  console.log("Path", req.path);
  console.error("Error", err);

  if (err.type === "redirect") {
    // res.redirect("/error");
  } else if (err.type === "time-out") {
    res.status(408).send(err);
  } else res.status(500).send(err);
  next();
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

//Error middleware
app.use((err, req, res, next) => {
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

// ----------------------------------------------------------------------------------------------------
//                  SWAGGER
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "INSPIRING GO API TESTING SITE",
      version: "1.0.0",
      description: "A simple Express API to perform CRUD operations",
    },
    servers: [
      {
        url: "https://inspiringgo-backend.onrender.com/",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js", "./server.js"],
};

const swaggerspec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerspec));
// ----------------------------------------------------------------------------------------------------
start();
