const { User } = require("../models");
const { validationResult } = require("express-validator");
const { userController } = require("./index");

afterAll(async () => {
  await User.update(
    { username: "Jisoo" },
    {
      where: {
        username: "Kim Jisoo",
      },
    }
  );
});

describe("userController", () => {
  describe("handleUpdateUsername", () => {
    it("should return 500 if there's error in catch block", async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await userController.handleUpdateUsername(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-018",
            message: expect.any(String),
          },
        ],
      });
    });
    it("should return 400 if there's no body", async () => {
      const mockReq = {
        body: {},
      };

      // Validate the request using registerValidator
      const errors = validationResult(mockReq);
      const errorArray = errors.array().map((err) => {
        return { code: err.msg, message: err.msg };
      });

      if (!errors.isEmpty()) {
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn().mockReturnThis(),
        };
        await userController.handleUpdateUsername(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.send).toHaveBeenCalledWith({
          errors: errorArray,
        });
      }
    });
    it("should return 400 if the new username same with the old one", async () => {
      const mockReq = {
        body: {
          username: "Jisoo",
        },
        user: {
          id: "af5c0f27-bae9-42c4-a1e4-0b7b516f40cc",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await userController.handleUpdateUsername(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-020",
            message: "Username baru tidak boleh sama dengan username sebelumnya",
          },
        ],
      });
    });
    it("should return 400 if the new username already taken by other user", async () => {
      const mockReq = {
        body: {
          username: "Rora",
        },
        user: {
          id: "af5c0f27-bae9-42c4-a1e4-0b7b516f40cc",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await userController.handleUpdateUsername(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-019",
            message: "Username telah digunakan",
          },
        ],
      });
    });
    it("should return 404 if user not found", async () => {
      const mockReq = {
        body: {
          username: "test",
        },
        user: {
          id: "17c07df6-91d9-4c6c-bcd5-3380775f7c10",
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await userController.handleUpdateUsername(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-016",
            message: "User tidak ditemukan",
          },
        ],
      });
    });
    it("should return 200 if everything is OK", async () => {
      const mockReq = {
        body: {
          username: "Kim Jisoo",
        },
        user: {
          id: "af5c0f27-bae9-42c4-a1e4-0b7b516f40cc",
        },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await userController.handleUpdateUsername(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Username berhasil diubah",
      });
    });
  });

  describe("handleUpdatePassword", () => {
    it("should return 500 if there's error in catch block", async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };
      await userController.handleUpdatePassword(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-018",
            message: expect.any(String),
          },
        ],
      });
    });
    it("should return 404 if user not found", async () => {
      const mockReq = {
        body: {
          oldPassword: "123456",
          newPassword: "123456",
        },
        user: {
          id: "17c07df6-91d9-4c6c-bcd5-3380775f7c10",
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await userController.handleUpdatePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-016",
            message: "User tidak ditemukan",
          },
        ],
      });
    });
    it("should return 401 if old password didn't match", async () => {
      const mockReq = {
        body: {
          oldPassword: "123456789",
          newPassword: "123456",
        },
        user: {
          id: "af5c0f27-bae9-42c4-a1e4-0b7b516f40cc",
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await userController.handleUpdatePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith({
        errors: [
          {
            code: "E-014",
            message: "Password lama yang anda masukkan salah, silahkan coba lagi",
          },
        ],
      });
    });
    it("should return 200 everything is ok", async () => {
      const mockReq = {
        body: {
          oldPassword: "123456",
          newPassword: "123456",
        },
        user: {
          id: "af5c0f27-bae9-42c4-a1e4-0b7b516f40cc",
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await userController.handleUpdatePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Password berhasil diubah",
      });
    });
  });
});
