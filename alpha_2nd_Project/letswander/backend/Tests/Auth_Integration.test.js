// const auth = require("./Controllers/authController")
const app = require("../nodeApp")
const mongoose = require('mongoose');
const request = require('supertest');
const User = require("../models/userModel")

const email = "test1@gmail.com"

beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.mongo_connect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  
  afterAll(async () => {
    // Close the database connection
    await User.findOneAndDelete({email: email});
    await mongoose.connection.close();
  });

//   beforeEach(async () => {
//     // Clear user data before each test
//     await User.findOneAndDelete({email: email});

//   });

describe("User authentication", () => {
    test("should register a new user", async () => {
        const res = await request(app).post("/api/v1/users/signup").send({
            name: "test1",
            email: email,
            password: "test1234",
            confirm_password: "test1234"
        }, 10000)

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("token")
    })

    test("should login a user successfully", async () => {
        const res = await request(app).post("/api/v1/users/login").send({
            email: email,
            password: "test1234"
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty("token")
    })

    test("should fail login with incorrect password", async () => {
        const res = await request(app).post("/api/v1/users/login").send({
            email: email,
            password: "incorrect"
        })

        expect(res.statusCode).toEqual(400)
        expect(res.body.status).toEqual("fail")
    })
})