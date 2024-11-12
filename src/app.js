//Based on my previous Project in Advanced Web Applications
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

let apiRouter = require('./routes/api');

//DB connections

const mongoose = require("mongoose");

const mongoDB =  "mongodb://localhost:27017/CompanyA_DB";
mongoose.connect(mongoDB);
mongoose.Promise = Promise; 
const companyA_DB = mongoose.connection; 
companyA_DB.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

module.exports = app;
