//var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var openAI = require('openai');
var bp = require('body-parser');
var basicAuth = require('express-basic-auth');
require('dotenv').config();

var indexRouter = require('./routes/index');

var app = express();

var { Configuration, OpenAIApi } = require("openai");
var configuration = new Configuration({
  apiKey: process.env.OPENAIAPIKEY,
});
var openai = new OpenAIApi(configuration);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(basicAuth({
    users: { 'admin': process.env.USAGESECRET },
}));


app.use('/', indexRouter);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.post('/sentiment/short/eng', (req, res) => {
  var message = req.body.message;
  openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Perform short sentiment analysis:" + message + "\nSentiment:",
    max_tokens: 3000,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  })
      .then(response => {
        console.log(response);
        res.send(response.data.choices[0]);
      });
});

app.post('/sentiment/long/eng', (req, res) => {
    var message = req.body.message;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Perform sentiment analysis, explain your decision:" + message + "\nSentiment & Explanation:",
        max_tokens: 3000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    })
        .then(response => {
            console.log(response);
            res.send(response.data.choices[0]);
        });
});

app.post('/sentiment/short/ger', (req, res) => {
    var message = req.body.message;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Führe eine kurze Sentimentanalyse durch:" + message + "\nSentiment:",
        max_tokens: 3000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    })
        .then(response => {
            console.log(response);
            res.send(response.data.choices[0]);
        });
});

app.post('/sentiment/long/ger', (req, res) => {
    var message = req.body.message;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Führe eine Sentimentanalyse durch und erkläre deine Entscheidung:" + message + "\nSentiment & Erklärung:",
        max_tokens: 3000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    })
        .then(response => {
            console.log(response);
            res.send(response.data.choices[0]);
        });
});

app.post('/rephrase/eng', (req, res) => {
    var message = req.body.message;
    var tone = req.body.tone;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Rephrase to be more" + tone + ":" + message + "\nRephrased:",
        max_tokens: 3000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    })
        .then(response => {
            console.log(response);
            res.send(response.data.choices[0]);
        });
});


module.exports = app;
