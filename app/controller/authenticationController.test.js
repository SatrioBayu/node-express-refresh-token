const authenticationController = require("./authenticationController");
const { User, InvalidToken } = require("../models");
const { validationResult } = require("express-validator");

afterAll(async () => {
  await User.destroy({
    where: {
      username: "Jabran",
    },
  });
});

describe("authenticationController", () => {
  describe("handleRegister", () => {
    it("should return 400 if the username already registered", async () => {
      const mockReq = {
        body: {
          username: "jisoo",
          password: "123456",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleRegister(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: expect.any(String),
            message: "Username telah digunakan",
          },
        ],
      });
    });
    it("should return 400 if there's no username or password in body", async () => {
      const mockReq = {
        body: {
          password: "jabran",
        },
      };

      // Validate the request using registerValidator
      const errors = validationResult(mockReq);
      const errorArray = errors.array().map((err) => {
        return { code: err.msg, message: err.msg };
      });

      // Check if there are validation errors
      if (!errors.isEmpty()) {
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn().mockReturnThis(),
        };
        await authenticationController.handleRegister(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith({
          errors: errorArray,
        });
      }
    });
    it("should return 500 if there's error in try catch block", async () => {
      const mockReq = {
        body: {
          username: "jabran",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleRegister(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-013",
            message: expect.any(String),
          },
        ],
      });
    });
    it("should return 201 if the request is success", async () => {
      const mockReq = {
        body: {
          username: "Jabran",
          password: "123456",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleRegister(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "User berhasil dibuat",
      });
    });
  });
});
