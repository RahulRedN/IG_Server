const request = require("supertest");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const Routes = require("../routes/Routes");
const mongoose = require("mongoose");

// Create an Express app
const app = express();
beforeAll(async () => {
  const mongoDBUrl =
    "mongodb+srv://jppavan2003:qnvvgzkls1X1abhe@cluster0.h9kxl6h.mongodb.net/InspiringGo?retryWrites=true&w=majority";

  await mongoose.connect(mongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}, 30000);

app.use(express.json());
app.use("/", Routes);

describe("/jobs", () => {
  it("should return all jobs", async () => {
    const res = await request(app).get("/jobs");

    expect(res.statusCode).toEqual(StatusCodes.OK);
  });
});

describe("/companies", () => {
  it("should return all companies", async () => {
    const res = await request(app).get("/companies");

    expect(res.statusCode).toEqual(StatusCodes.OK);
  });
});

describe("/jobseeker", () => {
  it("should return all jobseekers", async () => {
    const res = await request(app).get("/jobseekers");

    expect(res.statusCode).toEqual(StatusCodes.OK);
  });
});

describe("/getApplications", () => {
  it("should return all applications", async () => {
    const res = await request(app).get("/applications");

    expect(res.statusCode).toEqual(StatusCodes.OK);
  });
});

describe("/getQueries", () => {
  it("should return all queries", async () => {
    const res = await request(app).get("/getQueries");

    expect(res.statusCode).toEqual(StatusCodes.OK);
  });
});

describe("/getAllTestimonials", () => {
  it("should return all testimonials", async () => {
    const res = await request(app).get("/getAllTestimonials");

    expect(res.statusCode).toEqual(StatusCodes.OK);
  });
});
