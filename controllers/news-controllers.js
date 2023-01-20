const { fetchTopics, fetchArticles, fetchArticlesById, fetchCommentsById, addCommentById, updateVotesById, fetchUsers, fetchComments, deleteCommentData, fetchEndPoints } = require("../models/news-models");
const { checkArticleExists, checkTopicExists, checkCommentExists } = require("./utils");

const getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch((err) => {
        next(err);
    })
}

const getArticles = (req, res, next) => {
    const {sort_by, order, topic} = req.query;
    checkTopicExists(topic)
    .then((response) => {
        if (response === false && topic !== undefined) {
            return Promise.reject({status: 404, msg: 'topic does not exist'});
        } else {
            return fetchArticles(sort_by, order, topic);
        }
    })
    .then((articles) => {
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
        if (response === false) {
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

const postNewComment = (req, res, next) => {
    const {article_id} = req.params;
    const newComment = req.body;
    checkArticleExists(article_id)
    .then((response) => {
        if (response === false) {
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

const getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users});
    })
    .catch((err) => {
        next(err);
    })
}

const getComments = (req, res, next) => {
    fetchComments().then((comments) => {
        res.status(200).send({comments});
    })
    .catch((err) => {
        next(err);
    })
}

const deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    checkCommentExists(comment_id)
    .then((response) => {
        if (response === false) {
            return Promise.reject({status: 404, msg: 'comment_id does not exist'})
        } else {
            return deleteCommentData(comment_id);
        }
    })
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        next(err);
    })
}

const getEndPoints = (req, res, next) => {
    fetchEndPoints().then((endpoints) => {
        const result = JSON.parse(endpoints);
        res.status(200).send({endpoints : result});
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {
    getTopics,
    getArticles,
    getArticlesById,
    getCommentsById,
    postNewComment,
    updateArticleVotes,
    getUsers,
    getComments,
    deleteCommentById,
    getEndPoints
}