const endPointsRouter = require("express").Router();
const { getEndPoints } = require("../controllers/news-controllers");

endPointsRouter.get('/', getEndPoints);

module.exports = endPointsRouter;