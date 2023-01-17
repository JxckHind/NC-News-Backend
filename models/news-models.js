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

module.exports = {
    fetchTopics,
    fetchArticles
}