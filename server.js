const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const loginServer = require('./login/server');
const signupServer = require('./signup/server');
const landingServer = require('./landing/server');
const calculatorServer = require('./calculator/server');
const converterServer = require('./converter/server');

const PORT = 8080;
const HOST = '0.0.0.0';
const LOGIN_SERVER_PORT = 'http://localhost:8081';
const SIGNUP_SERVER_PORT = 'http://localhost:8082';
const LANDING_SERVER_PORT = 'http://localhost:8083';
const CALCULATOR_SERVER_PORT = 'http://localhost:8084';
const CONVERTER_SERVER_PORT = 'http://localhost:8085';

//app.use(express.static('public'));
const requireToken = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/'); // Redirect to login page if token is invalid or not provided
    }
    next();
  })(req, res, next);
};

app.use('/', loginServer);
app.use('/login', loginServer);
app.use('/signup', signupServer);
app.use('/landing', landingServer);
app.use('/calculator', calculatorServer);
app.use('/converter', converterServer);



app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, HOST, () => {
  console.log(`Calculator API is listening on http://${HOST}:${PORT}`);
});

module.exports = {
  LOGIN_SERVER_PORT,
  SIGNUP_SERVER_PORT,
  LANDING_SERVER_PORT,
  CALCULATOR_SERVER_PORT,
  CONVERTER_SERVER_PORT
};