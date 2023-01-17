const express = require("express");
const app = express();
const { getTopics, getArticles } = require("./controllers/news-controllers");

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Server Error'});
})

module.exports = app;