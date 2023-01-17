const db  = require("../db/connection");
const comments = require("../db/data/test-data/comments");

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
    SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles
    `;

    queryString += `ORDER BY ${sort_by} ${order}`;

    return db.query(queryString).then((response) => {
        const articleArr = response.rows;

        articleArr.forEach((article) => {
            article["comment_count"] = 0;
            comments.forEach((comment) => {
                if(comment.article_id === article.article_id) {
                    article.comment_count++;
                }
            })
        })
        return articleArr;
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

module.exports = {
    fetchTopics,
    fetchArticles,
    fetchArticlesById
}