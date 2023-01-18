const express = require("express");
const app = express();
const { getTopics, getArticles, getArticlesById, updateArticleVotes } = require("./controllers/news-controllers");
app.use(express.json());    

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticlesById);

app.patch('/api/articles/:article_id', updateArticleVotes)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    } else if (err.code === '22P02') {
        res.status(400).send({msg: 'Invalid input - enter integer instead of string'});
    } else {
        next(err);   
    }
})
app.use((err, req, res, next) => {
    if (err.code === '23502') {
        res.status(400).send({msg: 'Request body cannot be empty'});
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