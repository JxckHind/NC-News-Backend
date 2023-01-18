const { fetchTopics, fetchArticles, fetchArticlesById, updateVotesById } = require("../models/news-models");
const { checkArticleExists } = require("./utils");

const getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch((err) => {
        next(err);
    })
}

const getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles});
    })
    .catch((err) => {
        next(err);
    })
}

const getArticlesById = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticlesById(article_id).then((article) => {
        res.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    })
}

const updateArticleVotes = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;
    updateVotesById(article_id, inc_votes).then((article) => {
        res.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {
    getTopics,
    getArticles,
    getArticlesById,
    updateArticleVotes
}