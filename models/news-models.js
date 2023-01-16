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

module.exports = fetchTopics;