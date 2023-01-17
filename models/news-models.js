const db  = require("../db/connection");

const fetchTopics = () => {
    
    const queryString = `
    SELECT * FROM topics
    `;

    return db.query(queryString).then((response) => {
        const result = response.rows;
        return result;
    })
}

const fetchArticles = (sort_by = 'created_at', order = 'DESC') => {

    let queryString = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    `;

    queryString += `ORDER BY ${sort_by} ${order}`;

    return db.query(queryString).then((response) => {
        return response.rows;
    })
}

const fetchArticlesById = (article_id) => {

    let queryString = `
    SELECT * FROM articles
    WHERE articles.article_id=$1
    `;

    return db.query(queryString, [article_id]).then((response) => {
        if (response.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'article_id does not exist'});
        } else {
            return response.rows[0];
        }
    })
}

const addNewComment = (article_id, newComment) => {

    const newCommentData = [
        newComment.body,
        newComment.username,
        Number(article_id),
    ]

    const newCommentQuery = `
    INSERT INTO comments (body, author, article_id) 
    VALUES ($1, $2, $3) 
    RETURNING *
    `;

    return db.query(newCommentQuery, newCommentData).then((response) => {
        const result = response.rows[0];
        if (result.body.length === 0) {
            return Promise.reject({status: 400, msg: 'Body cannot be empty - please enter the body'});
        } else {
            return result;  
        }
    })
}

module.exports = {
    fetchTopics,
    fetchArticles,
    fetchArticlesById,
    addNewComment
}