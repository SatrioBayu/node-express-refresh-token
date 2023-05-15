const authenticationController = require("./authenticationController");
const { User, InvalidToken } = require("../models");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

afterAll(async () => {
  await User.destroy({
    where: {
      username: "Jabran",
    },
  });
});

describe("authenticationController", () => {
  describe("handleAuth", () => {
    it("should return 401 if the token not provided", async () => {
      const mockReq = {
        headers: {
          authorization: null,
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      const next = jest.fn();

      await authenticationController.handleAuth(mockReq, mockRes, next);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-004",
            message: "Token tidak disediakan",
          },
        ],
      });
    });
    it("should return 401 if the token is invalid, malformed or expired", async () => {
      const mockReq = {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFmNWMwZjI3LWJhZTktNDJjNC1hMWU0LTBiN2I1MTZmNDBjYyIsImlhdCI6MTY4Mzg4MjYzNywiZXhwIjoxNjgzODg0NDM3fQ.sJxtLTu1MLwYEhwuVbJ2CfLYIjSAm5qqwwqX7Wif0xAss",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      const next = jest.fn();

      await authenticationController.handleAuth(mockReq, mockRes, next);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-006",
            message: "Token tidak valid / diubah secara sengaja",
          },
        ],
      });
    });
    it("should return 401 if the server can't find who the token belongs to", async () => {
      const token = jwt.sign({ id: "8d04658b-cf4e-46df-8d6f-1aa4a85f0c36" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
      const mockReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      authenticationController.handleAuth(mockReq, mockRes, next, () => {
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.send).toHaveBeenCalledWith({
          errors: [
            {
              code: "E-008",
              message: "Tidak diotorisasi",
            },
          ],
        });
        done();
      });
    });
    it("should return 403 if the token is blocked", async () => {
      const mockReq = {
        headers: {
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFmNWMwZjI3LWJhZTktNDJjNC1hMWU0LTBiN2I1MTZmNDBjYyIsImlhdCI6MTY4Mzc4ODA4NCwiZXhwIjoxNjgzNzg5ODg0fQ.VZJ6Fc9cfSsXncW1odYEf6tDsEJkxsr52GSKb4F666M",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      const next = jest.fn();

      await authenticationController.handleAuth(mockReq, mockRes, next);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-005",
            message: "Token telah diblokir",
          },
        ],
      });
    });
    it("should return 500 if there's error in try catch block", async () => {
      const mockReq = {
        body: {},
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      const next = jest.fn();

      await authenticationController.handleAuth(mockReq, mockRes, next);

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
    it("should call next if the token is valid", async () => {
      const token = jwt.sign({ id: "2572b205-1439-420e-9f8f-3958bfda88cf" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

      const mockReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis,
        send: jest.fn().mockReturnThis,
      };

      const next = jest.fn();

      authenticationController.handleAuth(mockReq, mockRes, next, () => {
        expect(next).toHaveBeenCalled();
        done();
      });
    });
  });

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
            code: "E-014",
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

  describe("handleLogin", () => {
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
        await authenticationController.handleLogin(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith({
          errors: errorArray,
        });
      }
    });
    it("should return 404 if the username wrong", async () => {
      const mockReq = {
        body: {
          username: "Jabranlay",
          password: "123456",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleLogin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-009",
            message: "Username / Password salah",
          },
        ],
      });
    });
    it("should return 404 if the password wrong", async () => {
      const mockReq = {
        body: {
          username: "Jabran",
          password: "1234567",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleLogin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-009",
            message: "Username / Password salah",
          },
        ],
      });
    });
    it("should return 409 if the user already login again", async () => {
      const mockReq = {
        body: {
          username: "Jabran",
          password: "123456",
        },
        cookies: {
          refreshToken: "coba saja inimah",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleLogin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-010",
            message: "Anda sudah melakukan login",
          },
        ],
      });
    });
    it("should return 500 if there's error in try catch block", async () => {
      const mockReq = {
        body: {
          username: "Jabran",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleLogin(mockReq, mockRes);

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
    it("should return 200 if the user successfully login", async () => {
      const mockReq = {
        body: {
          username: "Jabran",
          password: "123456",
        },
        cookies: {},
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        cookie: jest.fn(),
      };

      await authenticationController.handleLogin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        accessToken: expect.any(String),
      });
      expect(mockRes.cookie).toHaveBeenCalledWith(
        "refreshToken",
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          maxAge: 60 * 1000,
        })
      );
    });
  });

  describe("handleLogout", () => {
    it("should return 400 if there's no username or password in body", async () => {
      const mockReq = {
        body: {
          username: "Jabran",
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
        await authenticationController.handleLogout(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith({
          errors: errorArray,
        });
      }
    });
    it("should return 401 if the token is invalid, malformed or expired", async () => {
      const mockReq = {
        body: {
          username: "Jisoo",
          token:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFmNWMwZjI3LWJhZTktNDJjNC1hMWU0LTBiN2I1MTZmNDBjYyIsImlhdCI6MTY4Mzg4MjYzNywiZXhwIjoxNjgzODg0NDM3fQ.sJxtLTu1MLwYEhwuVbJ2CfLYIjSAm5qqwwqX7Wif0xAss",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleLogout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-006",
            message: "Token tidak valid / diubah secara sengaja",
          },
        ],
      });
    });
    it("should return 401 if the username in body and user fetch from id didn't match", async () => {
      const token = jwt.sign({ id: "2572b205-1439-420e-9f8f-3958bfda88cf" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

      const mockReq = {
        body: {
          username: "Jisoo",
          token,
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      authenticationController.handleLogout(mockReq, mockRes, () => {
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.send).toHaveBeenCalledWith({
          errors: [
            {
              code: "E-007",
              message: "Token tidak valid untuk user ini",
            },
          ],
        });
        done();
      });
    });
    it("should return 404 if the id inside token isn't match any Users", async () => {
      const token = jwt.sign({ id: "8d04658b-cf4e-46df-8d6f-1aa4a85f0c36" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

      const mockReq = {
        body: {
          username: "Jisoo",
          token,
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      authenticationController.handleLogout(mockReq, mockRes, () => {
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith({
          errors: [
            {
              code: "E-011",
              message: "User tidak ditemukan",
            },
          ],
        });
        done();
      });
    });
    it("should return 500 if there's error in catch block", async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleLogout(mockReq, mockRes);

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
    it("should return 200 if the username, token valid and match each other", async () => {
      const token = jwt.sign({ id: "2572b205-1439-420e-9f8f-3958bfda88cf" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

      const mockReq = {
        body: {
          username: "Lisa",
          token,
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      authenticationController.handleLogout(mockReq, mockRes, () => {
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith({
          message: "Berhasil logout",
        });
        done();
      });
    });
  });

  describe("handleWhoAmI", () => {
    it("should return 500 if there's error in try catch block", async () => {
      const mockReq = {
        user: {
          id: "lalala",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleWhoAmI(mockReq, mockRes);

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
    it("should return 200 if there's no error", async () => {
      const mockReq = {
        user: {
          id: "2572b205-1439-420e-9f8f-3958bfda88cf",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await authenticationController.handleWhoAmI(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "User berhasil diambil",
        data: expect.any(Object),
      });
    });
  });
});
