const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    if (db.end) db.end();
});

describe('app', () => {
    describe('GET /...', () => {
        test('status: 404 when passed an invalid URL', () => {
            return request(app)
                .get('/hello')
                .expect(404);
        })
    })
    describe('GET /api/...', () => {
        test('status: 404 when passed an invalid path', () => {
            return request(app)
                .get('/api/animals')
                .expect(404);
        })
    })
    describe('GET /api/topics', () => {
        test('status: 200', () => {
            return request(app)
                .get('/api/topics')
                .expect(200);
        })
        test('status: 200 and responds with an object', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(typeof result).toBe('object');
            })
        })
        test('status: 200 and responds with an object with a key of topics', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(result).toHaveProperty('topics');
            }) 
        })
        test('status: 200 and responds with a nested array containing all the topic objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const result = response.body.topics;
                expect(Array.isArray(result)).toBe(true);                
                expect(result).toHaveLength(3);
             })
        })
        test('status: 200 and responds with a nested array containing all the topic objects with the correct keys', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const result = response.body.topics;
                result.forEach((topic) => {
                    expect(topic).toHaveProperty("description");
                    expect(topic).toHaveProperty("slug");
                })
             })
        })
    })
    describe('GET /api/articles', () => {
        test('status: 200', () => {
            return request(app)
                .get('/api/articles')
                .expect(200);
        })
        test('status: 200 and responds with an object', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(typeof result).toBe('object');
            })
        })
        test('status: 200 and responds with an object with a key of topics', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(result).toHaveProperty('articles');
            }) 
        })
        test('status: 200 and responds with a nested array containing all the article objects', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const result = response.body.articles;
                expect(Array.isArray(result)).toBe(true);                
                expect(result).toHaveLength(12);
             })
        })
        test('status: 200 and responds with a nested array containing all the article objects with the correct keys', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const result = response.body.articles;
                result.forEach((article) => {
                    expect(article).toHaveProperty("author");
                    expect(article).toHaveProperty("title");
                    expect(article).toHaveProperty("article_id");
                    expect(article).toHaveProperty("topic");
                    expect(article).toHaveProperty("created_at");
                    expect(article).toHaveProperty("votes");
                    expect(article).toHaveProperty("article_img_url");
                    expect(article).toHaveProperty("comment_count");
                })
             })
        })
        test('status: 200 and responds with a nested array containing all the article objects sorted by date in descending order by default', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const result = response.body.articles;
                const dates = result.map((article) => {
                    return article.created_at;
                })
                let isSorted = true;
                for(let i = 1; i < dates.length; i++) {
                    if(dates[i - 1] <= dates[i]) {
                        isSorted = false;
                    }
                }
                expect(isSorted).toBe(true);
            })
        })
    })
})