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
})