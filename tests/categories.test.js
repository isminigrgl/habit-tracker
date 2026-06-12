jest.mock("../config/db", () => ({
    query: jest.fn()
}));

const db = require("../config/db");

const {
    getCategories,
    createCategory
} = require("../controllers/categoryController");

describe("Category Controller", () => {

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

    test("should return categories list", async () => {

        db.query.mockResolvedValue([
            [
                {
                    category_id: 1,
                    name: "Health"
                }
            ]
        ]);

        await getCategories(req, res);

        expect(res.json).toHaveBeenCalledWith([
            {
                category_id: 1,
                name: "Health"
            }
        ]);
    });

    test("should create category successfully", async () => {

        req.body = {
            user_id: 1,
            name: "Health",
            color: "#00FF00",
            icon: "heart"
        };

        db.query.mockResolvedValue([
            {
                insertId: 1
            }
        ]);

        await createCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Category created successfully",
            categoryId: 1
        });
    });
});