//var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var openAI = require('openai');
var bp = require('body-parser');
var basicAuth = require('express-basic-auth');
var mariadb = require('mariadb');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');

var app = express();

var pool = mariadb.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 5
});

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
/*app.use(basicAuth({
    users: { 'admin': process.env.USAGESECRET },
}));*/

app.use(cors({
    origin: '*', // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 200
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

app.get('/health', (req, res) => {
    async function connectForHealthEndpoint() {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM `Survey`;") // query database using conn.query
            console.log(rows);
            res.send('OK');
        } catch (err) {
            res.send('ERROR');
            throw err;
        } finally {
            if (conn) await conn.end();
        }
    }
    connectForHealthEndpoint();
});

app.post('/survey/submit', basicAuth({
    users: { 'admin': process.env.USAGESECRET }, challenge: false}
), (req, res) => {
    var survey = req.body.survey;
    var R1 = req.body.survey.R1;
    var R2 = req.body.survey.R2;
    var R3 = req.body.survey.R3;
    var R4 = req.body.survey.R4;
    var R5 = req.body.survey.R5;
    var R6 = req.body.survey.R6;
    var R7 = req.body.survey.R7;
    var R8 = req.body.survey.R8;
    var R9 = req.body.survey.R9;
    var R10 = req.body.survey.R10;
    var R11 = req.body.survey.R11;
    var R12 = req.body.survey.R12;
    var R13 = req.body.survey.R13;
    async function connectForSurveySubmit() {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.query("INSERT INTO `Survey` (`R1`, `R2`, `R3`, `R4`, `R5`, `R6`, `R7`, `R8`, `R9`, `R10`, `R11`, `R12`, `R13`) VALUES ('" + R1 + "', '" + R2 + "', '" + R3 + "', '" + R4 + "', '" + R5 + "', '" + R6 + "', '" + R7 + "', '" + R8 + "', '" + R9 +"', '" + R10 +"', '" + R11 +"', '" + R12 +"', '" + R13 +"');"); // query database using conn.query
            res.send('OK - survey submitted');
        } catch (err) {
            res.send('ERROR');
            console.log(err)
            throw err;
        } finally {
            if (conn) await conn.end();
        }
    }
    connectForSurveySubmit();
});

app.post('/sentiment/short/eng', basicAuth({
    users: { 'admin': process.env.USAGESECRET }, challenge: false}
), (req, res) => {
  var message = req.body.message;
  openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Perform short sentiment analysis:" + message + "\nSentiment:",
    max_tokens: 3500,
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

app.post('/sentiment/long/eng', basicAuth({
    users: { 'admin': process.env.USAGESECRET }, challenge: false}
), (req, res) => {
    var message = req.body.message;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Perform sentiment analysis on the provided message and provide an overall sentiment label as well as a breakdown by specific aspects of the conversation (e.g. tone, core statement, entities). Use a five-point scale to rate sentiment, where very negative, somewhat negative, neutral, somewhat positive, and very positive are the five possible labels. Additionally, provide context for the sentiment and discuss any limitations or biases in the analysis, such as potential misinterpretation of tone. Analyze the key message of the message and possible misunderstandings:" + message,
        max_tokens: 3500,
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

app.post('/sentiment/short/ger', basicAuth({
    users: { 'admin': process.env.USAGESECRET }, challenge: false}
), (req, res) => {
    var message = req.body.message;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Führe eine kurze Sentimentanalyse durch:" + message + "\nSentiment:",
        max_tokens: 3500,
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

app.post('/sentiment/long/ger', basicAuth({
    users: { 'admin': process.env.USAGESECRET }, challenge: false}
), (req, res) => {
    var message = req.body.message;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Führe eine Sentimentanalyse durch und erkläre deine Entscheidung:" + message + "\nSentiment & Erklärung:",
        max_tokens: 3500,
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

app.post('/rephrase/eng', basicAuth({
    users: { 'admin': process.env.USAGESECRET }, challenge: false}
), (req, res) => {
    var message = req.body.message;
    var tone = req.body.tone;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Rephrase the following message to use a more" +tone+ "tone while keeping the core message:" + message,
        max_tokens: 3500,
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

app.post('/rephrase/ger', basicAuth({
    users: { 'admin': process.env.USAGESECRET }, challenge: false}
), (req, res) => {
    var message = req.body.message;
    var tone = req.body.tone;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Formuliere folgendes neu, um" + tone + " zu klingen:" + message + "\nNeu formuliert:",
        max_tokens: 3500,
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
