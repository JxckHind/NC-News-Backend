const db  = require("../db/connection");

exports.checkArticleExists = (article_id) => {

    let queryString = `
    SELECT article_id FROM articles
    WHERE articles.article_id=$1
    `;

    return db.query(queryString, [article_id]).then((response) => {
        if (response.rowCount === 0) {
            return false;
        }
    })
}

exports.checkCommentExists = (comment_id) => {
    let queryString = `
    SELECT comment_id FROM comments
    WHERE comments.comment_id=$1
    `;

    return db.query(queryString, [comment_id]).then((response) => {
        if (response.rowCount === 0) {
            return false;
        }
    })
}