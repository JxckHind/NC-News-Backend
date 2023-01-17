const express = require("express");
const app = express();
const { getTopics, getArticles, getArticlesById } = require("./controllers/news-controllers");

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticlesById);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    } else if (err.code === '22P02') {
        res.status(400).send({msg: 'Invalid article_id'});
    } else {
        next(err);   
    }
})
app.use((req, res, next) => {
    res.status(404).send({msg: "Path not found"});
})
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Server Error'});
})

module.exports = app;