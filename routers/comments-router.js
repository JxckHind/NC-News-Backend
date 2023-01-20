const commentsRouter = require("express").Router();
const { getComments, deleteCommentById } = require("../controllers/news-controllers");

commentsRouter.get('/', getComments);

commentsRouter.delete('/:comment_id', deleteCommentById);

module.exports = commentsRouter;