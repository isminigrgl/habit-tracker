jest.mock("../config/db", () => ({
    query: jest.fn()
}));

const db = require("../config/db");

const {
    getGoals,
    createGoal
} = require("../controllers/goalController");

describe("Goal Controller", () => {

    let req;
    let res;

    beforeEach(() => {

        req = {
            body: {},
            params: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test("should return goals list", async () => {

        db.query.mockResolvedValue([
            [
                {
                    goal_id: 1,
                    title: "Walk 30 Days"
                }
            ]
        ]);

        await getGoals(req, res);

        expect(res.json).toHaveBeenCalledWith([
            {
                goal_id: 1,
                title: "Walk 30 Days"
            }
        ]);
    });

    test("should create goal successfully", async () => {

        req.body = {
            habit_id: 1,
            user_id: 1,
            title: "Walk Goal",
            description: "Daily walk",
            target_value: 30,
            target_period: "monthly",
            start_date: "2026-01-01",
            end_date: "2026-01-31",
            status: "active"
        };

        db.query.mockResolvedValue([
            {
                insertId: 1
            }
        ]);

        await createGoal(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Goal created successfully",
            goalId: 1
        });
    });
});