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
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'INSPIRING GO API TESTING SITE',
      version: "1.0.0",
      description: "A simple Express API to perform CRUD operations"
    },
    servers: [
      {
        url: "http://localhost:8080"
      }
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
  apis: ['./routes/*.js','./server.js']
}

const swaggerspec = swaggerJSDoc(options)
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerspec))
// ----------------------------------------------------------------------------------------------------
start();













































// const fileStorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./images");
//   },
//   filename: (req, file, cb) => {
//     cb(false, Date.now() + "--" + file.originalname);
//   },
// });

// var accessLogStream = rfs.createStream("S20210010167.log", {
//   interval: "1h",
//   path: path.join(__dirname, "log"),
// });

// const upload = multer({ storage: fileStorageEngine });

// app.use(morgan("combined", { stream: accessLogStream }));