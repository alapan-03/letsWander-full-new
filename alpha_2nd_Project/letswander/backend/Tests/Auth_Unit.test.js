const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { signup, login } = require("./../controllers/authController");

jest.mock("./../models/userModel");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

let req, res;

describe("Authentication unit test", () => {
  describe("Signup", () => {
    beforeEach(() => {
      req = {
        body: {
          name: "test1",
          email: "testN1@gmail.com",
          password: "alap1234",
          confirm_password: "alap1234",
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
    test("should register a user and return a token", async () => {
      let hashedPassword = "hashed1234";
      const data = {
        _id: "userId",
        name: "test1",
        email: "testN1@gmail.com",
        password: hashedPassword,
      };
      let token = "token";

      User.create.mockResolvedValue(data);
      // bcrypt.hash.mockResolvedValue(hashedPassword);
      jwt.sign.mockReturnValue(token);

      const result = await signup(req, res);

      // expect(bcrypt.hash).toHaveBeenCalledWith('test1234', 12);
      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: data._id },
        "my-very-naughty-monkey-just-swallowed-pumkin-nuts"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        token,
      });
    });
  });

  describe("Login", () => {
    beforeEach(() => {
      req = {
        body: {
          // name: "test1",
          email: "testN1@gmail.com",
          password: "alap1234",
          // confirm_password: "alap1234"
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
    test("should return 400 if email or password is not provided", async () => {
      req.body = {};

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Invalid or unentered credentials",
      });
    });

    test("should return 400 if email or password is incorrect", async () => {
      req.body = { email: "test1@gmail.com", password: "test1234" };

      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "fail",
        message: "Invalid or unentered credentials",
      });
    });

    it("should return 200 and a token if login is successful", async () => {
      const user = {
        _id: "userId",
        email: "test1@gmail.com",
        password: "hashedpassword",
        correctPassword: jest.fn().mockResolvedValue(true),
      };
      const token = "fake-jwt-token";

      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue(token);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(user.correctPassword).toHaveBeenCalledWith(
        req.body.password,
        user.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user._id },
        "my-very-naughty-monkey-just-swallowed-pumkin-nuts"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        token,
        //   name: undefined // Since name is not set in this function
      });
    });
    
    it('should return 400 if an error occurs', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));
    
        await login(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          status: 'fail',
          message: 'Invalid or unentered credentials',
        });
      });
  });
});
