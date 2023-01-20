const articlesRouter = require("express").Router();
const { getArticles, getArticlesById, getCommentsById, postNewComment, updateArticleVotes } = require("../controllers/news-controllers");

articlesRouter.get('/', getArticles);

articlesRouter
    .route('/:article_id')
    .get(getArticlesById)
    .patch(updateArticleVotes);

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsById)
    .post(postNewComment);

module.exports = articlesRouter;