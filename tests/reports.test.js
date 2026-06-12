jest.mock("../config/db", () => ({
    query: jest.fn()
}));

const db = require("../config/db");

const {
    getStatistics
} = require("../controllers/reportController");

describe("Report Controller", () => {

    let req;
    let res;

    beforeEach(() => {

        req = {};

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test("should return statistics successfully", async () => {

        db.query
            .mockResolvedValueOnce([[{ total: 10 }]])
            .mockResolvedValueOnce([[{ completed: 7 }]])
            .mockResolvedValueOnce([[{ skipped: 2 }]])
            .mockResolvedValueOnce([[{ missed: 1 }]]);

        await getStatistics(req, res);

        expect(res.json).toHaveBeenCalledWith({
            total_logs: 10,
            completed_logs: 7,
            skipped_logs: 2,
            missed_logs: 1,
            completion_rate: "70.00%"
        });
    });
});