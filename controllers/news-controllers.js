const { fetchTopics, fetchArticles, fetchArticlesById, checkCommentExists, fetchCommentsById } = require("../models/news-models");
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

const getCommentsById = (req, res, next) => {
    const {article_id} = req.params;
    checkArticleExists(article_id)
    .then((response) => {
        if (response === true) {
            return Promise.reject({status: 404, msg: 'article_id does not exist'});
        } else {
            return fetchCommentsById(article_id);
        }
    })
    .then((comments) => {
        res.status(200).send({comments});
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {
    getTopics,
    getArticles,
    getArticlesById,
    getCommentsById
}