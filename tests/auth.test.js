const bcrypt = require("bcrypt");

jest.mock("../config/db", () => ({
    query: jest.fn()
}));

const db = require("../config/db");
const { registerUser, loginUser } = require("../controllers/authController");

describe("Auth Controller", () => {

    let req;
    let res;

    beforeEach(() => {

        req = {
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test("should register user successfully", async () => {

        req.body = {
            username: "testuser",
            email: "test@test.com",
            password: "123456"
        };

        db.query.mockResolvedValue([
            {
                insertId: 1
            }
        ]);

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "User registered successfully",
            userId: 1
        });
    });

    test("should login user successfully", async () => {

        const hashedPassword = await bcrypt.hash("123456", 10);

        req.body = {
            email: "test@test.com",
            password: "123456"
        };

        db.query.mockResolvedValue([
            [
                {
                    user_id: 1,
                    username: "testuser",
                    email: "test@test.com",
                    password_hash: hashedPassword
                }
            ]
        ]);

        await loginUser(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Login successful"
            })
        );
    });
});