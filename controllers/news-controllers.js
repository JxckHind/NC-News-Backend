const e = require("express");
const { fetchTopics, fetchArticles, fetchArticlesById, addCommentById } = require("../models/news-models");
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

const postNewComment = (req, res, next) => {
    const {article_id} = req.params;
    const newComment = req.body;
    checkArticleExists(article_id)
    .then((response) => {
        if (response === true) {
            return Promise.reject({status: 404, msg: 'article_id does not exist'})
        } else {
            return addCommentById(article_id, newComment); 
        }
    })
    .then((comment) => {
        res.status(201).send({comment});
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {
    getTopics,
    getArticles,
    getArticlesById,
    postNewComment
}