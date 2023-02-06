const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const cors = require("cors");
app.use(express.json());

app.use(cors());
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    } else {
        next(err);   
    }
})
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Invalid input - enter integer instead of string'});
    } else {
        next(err);   
    }
})
app.use((err, req, res, next) => {
    if (err.code === '23502') {
        res.status(400).send({msg: 'Request body is missing required field(s)'});
    } else {
        next(err);   
    }
})
app.use((err, req, res, next) => {
    if (err.code === '23503') {
        res.status(401).send({msg: 'Username does not exist'});
    } else {
        next(err);   
    }
})
app.use((err, req, res, next) => {
    if (err.code === '42601') {
        res.status(400).send({msg: 'Invalid order query'});
    } else {
        next(err);   
    }
})
app.use((err, req, res, next) => {
    if (err.code === '42703') {
        res.status(404).send({msg: 'Column does not exist'});
    } else {
        next(err);   
    }
})
app.use((req, res, next) => {
    res.status(404).send({msg: "Path not found"});
})
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Server Error'});
})

module.exports = app;