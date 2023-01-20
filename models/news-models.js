const db  = require("../db/connection");
const fs = require("fs/promises");

const fetchTopics = () => {
    
    const queryString = `
    SELECT * FROM topics
    `;

    return db.query(queryString).then((response) => {
        return response.rows;
    })
}

const fetchArticles = (sort_by = 'created_at', order = 'DESC', topic) => {

    const sqlQuery = []

    let queryString = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    `;

    if (topic !== undefined) {
        sqlQuery.push(topic);
        queryString += `WHERE articles.topic = $1`;
    }

    queryString += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`;

    return db.query(queryString, sqlQuery).then((response) => {
        return response.rows;
    })
}

const fetchArticlesById = (article_id) => {

    let queryString = `
    SELECT articles.*,
    COUNT(comments.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id=$1
    GROUP BY articles.article_id
    `;

    return db.query(queryString, [article_id]).then((response) => {
        if (response.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'article_id does not exist'});
        } else {
            return response.rows[0];
        }
    })
}

const fetchCommentsById = (article_id) => {

    let queryString = `
    SELECT * FROM comments
    WHERE comments.article_id=$1
    ORDER BY created_at DESC
    `;

    return db.query(queryString, [article_id]).then((response) => {
        return response.rows;
    })
}

const addCommentById = (article_id, newComment) => {

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
            return Promise.reject({status: 400, msg: 'Body property cannot be empty'});
        } else {
            return result;  
        }
    })
}

const updateVotesById = (article_id, inc_votes) => {

    const newVoteData = [
        article_id,
        inc_votes
    ]

    let queryString = `
    UPDATE articles
    SET votes = votes + $2
    WHERE articles.article_id = $1
    RETURNING *
    `;

    return db.query(queryString, newVoteData).then((response) => {
        if (response.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'article_id does not exist'})
        } else {
            return response.rows[0];  
        }
    })
}

const fetchUsers = () => {
    
    const queryString = `
    SELECT * FROM users
    `;

    return db.query(queryString).then((response) => {
        return (response.rows);
    })
}

const fetchComments = () => {
    
    const queryString = `
    SELECT * FROM comments
    `;

    return db.query(queryString).then((response) => {
        return (response.rows);
    })
}

const deleteCommentData = (comment_id) => {

    const queryString = `
    DELETE FROM comments
    WHERE comments.comment_id = $1
    `;

    return db.query(queryString, [comment_id]);
}

const fetchEndPoints = () => {
    return fs.readFile("./endpoints.json", "utf-8");
}

module.exports = {
    fetchTopics,
    fetchArticles,
    fetchArticlesById,
    fetchCommentsById,
    addCommentById,
	  updateVotesById,
    fetchUsers,
    fetchComments,
    deleteCommentData,
    fetchEndPoints
}