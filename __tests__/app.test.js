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
    describe('GET /not-a-path', () => {
        test('status: 404 when passed an invalid path', () => {
            return request(app)
            .get('/hello')
            .expect(404)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Path not found');
            })
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
        test('status: 200 and responds with a nested array containing all of the topic objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const result = response.body.topics;
                expect(Array.isArray(result)).toBe(true);                
                expect(result).toHaveLength(3);
                result.forEach((topic) => {
                    expect(typeof topic).toBe('object');
                })
             })
        })
        test('status: 200 and responds with a nested array containing all of the topic objects with the correct keys', () => {
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
        test('status: 200 and responds with an object with a key of articles', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(result).toHaveProperty('articles');
            }) 
        })
        test('status: 200 and responds with a nested array containing all of the article objects', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const result = response.body.articles;
                expect(Array.isArray(result)).toBe(true);                
                expect(result).toHaveLength(12);
                result.forEach((article) => {
                    expect(typeof article).toBe('object');
                })
             })
        })
        test('status: 200 and responds with a nested array containing all of the article objects with the correct keys', () => {
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
                    expect(article.body).toBe(undefined);
                })
             })
        })
        test('status: 200 and responds with a nested array containing all of the article objects sorted in descending date order by default', () => {
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
    describe('GET /api/articles?queries', () => {
        test('status: 200 and responds with a nested array containing all of the article objects sorted in descending date order and filtered by topic "mitch"', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then((response) => {
                const result = response.body.articles;
                const dates = result.map((comment) => {
                    return comment.created_at;
                })
                expect(dates).toBeSorted({descending: true});
                result.forEach((article) => {
                    expect(article.topic).toBe('mitch');
                })
            })
        })
        test('status: 200 and responds with a nested array containing all of the article objects sorted in descending date order and filtered by topic "cats"', () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then((response) => {
                const result = response.body.articles;
                const dates = result.map((comment) => {
                    return comment.created_at;
                })
                expect(dates).toBeSorted({descending: true});
                result.forEach((article) => {
                    expect(article.topic).toBe('cats');
                })
            })
        })
        test('status: 200 and responds with a nested array containing all of the article objects sorted in descending title order', () => {
            return request(app)
            .get('/api/articles?sort_by=title')
            .expect(200)
            .then((response) => {
                const result = response.body.articles;
                const titles = result.map((article) => {
                    return article.title;
                })
                expect(titles).toBeSorted({descending: true});                
            })
        })
        test('status: 200 and responds with a nested array containing all of the article objects sorted in descending author order', () => {
            return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then((response) => {
                const result = response.body.articles;
                const authors = result.map((article) => {
                    return article.author;
                })
                expect(authors).toBeSorted({descending: true});                
            })
        })
        test('status: 200 and responds with a nested array containing all of the article objects sorted in ascending date order', () => {
            return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then((response) => {
                const result = response.body.articles;
                const dates = result.map((comment) => {
                    return comment.created_at;
                })
                expect(dates).toBeSorted();               
            })
        })
        test('status: 404 when passed an sort_by query that doesnt exist in the database', () => {
            return request(app)
            .get('/api/articles?sort_by=dogs')
            .expect(404)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Column does not exist');
            })
        })
        test('status: 400 when passed a bad order query', () => {
            return request(app)
            .get('/api/articles?order=dogs')
            .expect(400)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Invalid order query');
            })
        })
        test('status: 404 when passed a topic that doesnt exist in the database', () => {
            return request(app)
            .get('/api/articles?topic=dogs')
            .expect(404)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('topic does not exist');
            })
        })
        test('status: 422 when passed a topic that has no articles associated with it', () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(422)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('No articles associated with this topic');
            })
        })
    })
    describe('GET /api/articles/:article_id', () => {
        test('status: 200', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200);
        })
        test('status: 200 and responds with an object', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(typeof result).toBe('object');
            })
        })
        test('status: 200 and responds with an object with a key of article', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(result).toHaveProperty('article');
            }) 
        })
        test('status: 200 and responds with a nested article object', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const result = response.body.article;
                expect(typeof result).toBe('object');
             })
        })
        test('status: 200 and responds with a nested article object with the correct keys', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const result = response.body.article;
                expect(result).toHaveProperty("author");
                expect(result).toHaveProperty("title");
                expect(result).toHaveProperty("article_id");
                expect(result).toHaveProperty("body");
                expect(result).toHaveProperty("topic");
                expect(result).toHaveProperty("created_at");
                expect(result).toHaveProperty("votes");
                expect(result).toHaveProperty("article_img_url");
             })
        })
        test('status: 200 and responds with a nested article object with the correct article_id', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const result = response.body.article;
                expect(result.article_id).toBe(1);
            })
        })
        test('status: 400 when passed a bad article_id', () => {
            return request(app)
            .get('/api/articles/dog')
            .expect(400)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Invalid input - enter integer instead of string');
            })
        })
        test('status: 404 when passed an article_id that doesnt exist in the database', () => {
            return request(app)
            .get('/api/articles/99999')
            .expect(404)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('article_id does not exist');
            })
        })
    })
    describe('GET /api/articles/:article_id/comments', () => {
        test('status: 200', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200);
        })
        test('status: 200 and responds with an object', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(typeof result).toBe('object');
            })
        })
        test('status: 200 and responds with an object with a key of comments', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(result).toHaveProperty('comments');
            }) 
        })
        test('status: 200 and responds with a nested array containing all of the comment objects for a specific article_id', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response) => {
                const result = response.body.comments;
                expect(Array.isArray(result)).toBe(true);                
                expect(result).toHaveLength(11);
                result.forEach((comment) => {
                    expect(typeof comment).toBe('object');
                })
             })
        })
        test('status: 200 and responds with a nested array containing all of the comment objects with the correct keys for a specific article_id', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response) => {
                const result = response.body.comments;
                result.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id");
                    expect(comment).toHaveProperty("votes");
                    expect(comment).toHaveProperty("created_at");
                    expect(comment).toHaveProperty("author");
                    expect(comment).toHaveProperty("body");
                    expect(comment).toHaveProperty("article_id");
                })
             })
        })
        test('status: 200 and responds with a nested array containing all of the comment objects for a specific article_id sorted in descending date order by default', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response) => {
                const result = response.body.comments;
                const dates = result.map((comment) => {
                    return comment.created_at;
                })
                expect(dates).toBeSorted({descending: true});
            })
        })
        test('status: 200 and responds with an empty nested array when there are no comments for a specific article_id', () => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then((response) => {
                const result = response.body.comments;
                expect(Array.isArray(result)).toBe(true);                
                expect(result).toHaveLength(0);
             })
        })
        test('status: 400 when passed a bad article_id', () => {
            return request(app)
            .get('/api/articles/dog/comments')
            .expect(400)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Invalid input - enter integer instead of string');
            })
        })
        test('status: 404 when passed an article_id that doesnt exist in the database', () => {
            return request(app)
            .get('/api/articles/99999/comments')
            .expect(404)
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('article_id does not exist');
            })
        })
    })
    describe('POST /api/articles/:article_id/comments', () => {
        test('status: 201', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .expect(201)
            .send({
                username: "rogersop",
                body: "The Gaviscon is all gone"
            })
        })
        test('status: 201 and responds with an object', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .expect(201)
            .send({
                username: "rogersop",
                body: "The Gaviscon is all gone"
            })
            .then((response) => {
                const result = response.body;
                expect(typeof result).toBe('object');
            })
        })
        test('status: 201 and responds with an object with a key of comment', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .expect(201)
            .send({
                username: "rogersop",
                body: "The Gaviscon is all gone"
            })
            .then((response) => {
                const result = response.body;
                expect(result).toHaveProperty('comment');
            })
        })
        test('status: 201 and responds with a nested comment object with the correct keys', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .expect(201)
            .send({
                username: "rogersop",
                body: "The Gaviscon is all gone"
            })
            .then((response) => {
                const result = response.body.comment;
                expect(result).toHaveProperty("comment_id");
                expect(result).toHaveProperty("body");
                expect(result).toHaveProperty("votes");
                expect(result).toHaveProperty("author");
                expect(result).toHaveProperty("article_id");
                expect(result).toHaveProperty("created_at");
            })
        })
        test('status: 201 and responds with a nested comment object with the correct values', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .expect(201)
            .send({
                username: "rogersop",
                body: "The Gaviscon is all gone"
            })
            .then((response) => {
                const result = response.body.comment;
                expect(result.author).toBe("rogersop")
                expect(result.body).toBe("The Gaviscon is all gone");
                expect(result.votes).toBe(0);
                expect(result.article_id).toBe(1);
            })
        })
        test('status: 201 and responds with a nested comment object with the correct values and ignores any unnessesary properties added to the request', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .expect(201)
            .send({
                username: "rogersop",
                body: "The Gaviscon is all gone",
                votes: 10000,
                article_id: 123
            })
            .then((response) => {
                const result = response.body.comment;
                expect(result.author).toBe("rogersop")
                expect(result.body).toBe("The Gaviscon is all gone");
                expect(result.votes).toBe(0);
                expect(result.article_id).toBe(1);
            })
        })
        test('status: 400 when passed a bad article_id', () => {
            return request(app)
            .post('/api/articles/dog/comments')
            .expect(400)
            .send({
                username: "rogersop",
                body: "The Gaviscon is all gone"
            })
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Invalid input - enter integer instead of string');
            })
        })
        test('status: 404 when passed an article_id that doesnt exist in the database', () => {
            return request(app)
            .post('/api/articles/99999/comments')
            .expect(404)
            .send({
                username: "rogersop",
                body: "The Gaviscon is all gone"
            })
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('article_id does not exist');
            })
        })
        test('status: 400 when the request body is empty or missing a required field', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .expect(400)
            .send({
                username: "rogersop"
            })
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Request body is missing required field(s)');
            })
        })
        test('status: 400 when passed an empty body property', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .expect(400)
            .send({
                username: "rogersop",
                body: ""
            })
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Body property cannot be empty');
            })
        })
        test('status: 401 when passed a username that does not exist in the users database', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .expect(401)
            .send({
                username: "ScottChegg",
                body: "The Gaviscon is all gone"
            })
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Username does not exist');
            })
        })
    })
    describe('PATCH /api/articles/:article_id', () => {
        test('status: 200', () => {
            return request(app)
            .patch('/api/articles/1')
            .expect(200)
            .send({
                inc_votes: 10
            })
        })
        test('status: 200 and responds with an object', () => {
            return request(app)
            .patch('/api/articles/1')
            .expect(200)
            .send({
                inc_votes: 10
            })
            .then((response) => {
                const result = response.body;
                expect(typeof result).toBe('object');
            })
        })
        test('status: 200 and responds with an object with a key of article', () => {
            return request(app)
            .patch('/api/articles/1')
            .expect(200)
            .send({
                inc_votes: 10
            })
            .then((response) => {
                const result = response.body;
                expect(result).toHaveProperty('article');
            })
        })
        test('status: 200 and responds with a nested article object with the correct keys', () => {
            return request(app)
            .patch('/api/articles/1')
            .expect(200)
            .send({
                inc_votes: 10
            })
            .then((response) => {
                const result = response.body.article;
                expect(result).toHaveProperty("article_id");
                expect(result).toHaveProperty("title");
                expect(result).toHaveProperty("topic");
                expect(result).toHaveProperty("author");
                expect(result).toHaveProperty("body");
                expect(result).toHaveProperty("created_at");
                expect(result).toHaveProperty("votes");
                expect(result).toHaveProperty("article_img_url");
            })
        })
        test('status: 200 and responds with a nested article object with the updated votes value when newVote is a positive integer', () => {
            return request(app)
            .patch('/api/articles/1')
            .expect(200)
            .send({
                inc_votes: 10
            })
            .then((response) => {
                const result = response.body.article;
                expect(result.votes).toBe(110);
            })
        })
        test('status: 200 and responds with a nested article object with the updated votes value when newVote is a negative integer', () => {
            return request(app)
            .patch('/api/articles/1')
            .expect(200)
            .send({
                inc_votes: -25
            })
            .then((response) => {
                const result = response.body.article;
                expect(result.votes).toBe(75);
            })
        })
        test('status: 400 when passed a bad article_id', () => {
            return request(app)
            .patch('/api/articles/dog')
            .expect(400)
            .send({
                inc_votes: 10
            })
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Invalid input - enter integer instead of string');
            })
        })
        test('status: 404 when passed an article_id that doesnt exist in the database', () => {
            return request(app)
            .patch('/api/articles/99999')
            .expect(404)
            .send({
                inc_votes: 10
            })
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('article_id does not exist');
            })
        })
        test('status: 400 when the request body is empty', () => {
            return request(app)
            .patch('/api/articles/1')
            .expect(400)
            .send({})
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Request body is missing required field(s)');
            })
        })
        test('status: 400 when inc_votes is invalid', () => {
            return request(app)
            .patch('/api/articles/1')
            .expect(400)
            .send({
                inc_votes: "dog"
            })
            .then((response) => {
                const msg = response.body.msg;
                expect(msg).toBe('Invalid input - enter integer instead of string');
            })
        })
    })
    describe('GET /api/users', () => {
        test('status: 200', () => {
            return request(app)
                .get('/api/users')
                .expect(200);
        })
        test('status: 200 and responds with an object', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(typeof result).toBe('object');
            })
        })
        test('status: 200 and responds with an object with a key of users', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const result = response.body;
                expect(result).toHaveProperty('users');
            }) 
        })
        test('status: 200 and responds with a nested array containing all the user objects', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const result = response.body.users;
                expect(Array.isArray(result)).toBe(true);                
                expect(result).toHaveLength(4);
             })
        })
        test('status: 200 and responds with a nested array containing all the user objects with the correct keys', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const result = response.body.users;
                result.forEach((user) => {
                    expect(user).toHaveProperty("username");
                    expect(user).toHaveProperty("name");
                    expect(user).toHaveProperty("avatar_url");
                })
             })
        })
    })
})