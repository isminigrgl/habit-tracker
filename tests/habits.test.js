jest.mock("../config/db", () => ({
    query: jest.fn()
}));

const db = require("../config/db");

const {
    getHabits,
    createHabit,
     getHabitLogs
} = require("../controllers/habitController");

describe("Habit Controller", () => {

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

    test("should return habits list", async () => {

        db.query.mockResolvedValue([
            [
                {
                    habit_id: 1,
                    name: "Drink Water"
                }
            ]
        ]);

        await getHabits(req, res);

        expect(res.json).toHaveBeenCalledWith([
            {
                habit_id: 1,
                name: "Drink Water"
            }
        ]);
    });

    test("should create habit successfully", async () => {

        req.body = {
            user_id: 1,
            category_id: 1,
            name: "Exercise",
            description: "Gym",
            frequency: "daily",
            target_count: 1,
            start_date: "2026-01-01",
            end_date: "2026-12-31"
        };

        db.query.mockResolvedValue([
            {
                insertId: 1
            }
        ]);

        await createHabit(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Habit created successfully",
            habitId: 1
        });
    });

    test("should return habit logs", async () => {

        req.params = {
            id: 1
        };

        db.query.mockResolvedValue([
            [
                {
                    log_id: 1,
                    status: "completed"
                }
            ]
        ]);

        await getHabitLogs(req, res);

        expect(res.json).toHaveBeenCalledWith([
            {
                log_id: 1,
                status: "completed"
            }
        ]);
    });

});