# Northcoders Backend Project - NC News API

This project is an API for accessing a variety of news articles. You can filter these articles by topic and sort by date, comment count or number of votes in ascending or descending order. You can also vote on an article and place/delete comments.

The project is built using Node.js, with Express.js for the server and PostgreSQL for the database. The database has three seed options when run: Test, Development and Production and has multiple accessible endpoints for every database.

## Link To Hosted Version: https://jack-nc-news-ap.onrender.com

### Available Routes

| Endpoint                                    | Description                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| **GET** /api                                | Serves up a json representation of all the available endpoints of the API |
| **GET** /api/topics                         | Serves an array of all the topics                                         |
| **GET** /api/users                          | Serves an array of all the users                                          |
| **GET** /api/articles                       | Serves an array of all the articles                                       |
| **GET** /api/articles/:article_id           | Serves an object of a specific article                                    |
| **GET** /api/articles/:article_id/comments  | Serves an array of all the comments for a specific article                |
| **PATCH** /api/articles/:article_id         | Updates the number of votes in the database for a specific article        |
| **POST** /api/articles/:article_id/comments | Adds a comment to the database about a specific article                   |
| **DELETE** /api/comments/:comment_id        | Deletes a specific comment from the database                              |

### **GET** /api/articles query parameters

| Query   | Options                          | Default    |
| ------- | -------------------------------- | ---------- |
| sort_by | created_at, comment_count, votes | created_at |
| order   | asc, desc                        | desc       |
| topic   | coding, football, cooking        | all topics |

# Setup

## Installation requirements:

- Node.js - version 19.x
- PostgreSQL - version 14.x

## Cloning the repositry:

- In the teminal please enter:

  ```
  $ git clone https://github.com/JxckHind/NC-News-Backend.git
  $ cd NC-News
  ```

## Installing dependencies:

- The required dependencies will be pulled from the package.json file. In the teminal please enter:

  ```
  $ npm install
  ```

## Accessing the databases:

- Once the repo has been sucessfully cloned, in order to connect to the two databases involved in this project on your local machine you must first create the environment variables yourself.
- You will need to create two `.env files`, one named `.env.test` and another `.env.development`:

  ```
  .env.test --->
  PGDATABASE=nc_news_test

  .env.development --->
  PGDATABASE=nc_news
  ```

- In `.env.test` you should add `PGDATABASE=nc_news_test` and in the `.env.development` you should add `PGDATABASE=nc_news`.
- You will now be able to access the two databases on your local machine when the application is run.

## Database set-up and seeding:

- Before using or testing the application, you will need to set up the database and then seed it with the data. In the teminal please enter:

  ```
  $ npm run setup-dbs
  $ npm run seed
  ```

## Testing:

- Jest is the framework used to test this application.
- To run the tests, in the teminal please enter:

  ```
  $ npm test
  ```

- The database must be re-seeded before every test. This is built into the 'app.test' file and so this should be done automatically everytime the test command is ran.

## Development mode:

- To run the application in development mode, in the teminal please enter:

  ```
  $ node app.listen.js
  ```

- This will start a server. You can now make requests to your localhost on the specified port and view all of the accessible endpoints.
