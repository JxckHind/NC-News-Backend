const apiRouter = require("express").Router();
const { articlesRouter, commentsRouter, topicsRouter, usersRouter, endPointsRouter } = require("./index");

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/', endPointsRouter)

module.exports = apiRouter;