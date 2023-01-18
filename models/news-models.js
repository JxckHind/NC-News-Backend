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
            return response.rows;
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
        return response.rows[0];
    })
}

module.exports = {
    fetchTopics,
    fetchArticles,
    fetchArticlesById,
    updateVotesById
}