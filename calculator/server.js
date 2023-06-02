const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, '../views'));

//  check for a valid token
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


app.get('/calculator', requireToken, (req, res) => {
    res.render('calculator', { result: undefined });
  });
  
  app.post('/calculator', (req, res) => {
    const num1 = parseFloat(req.body.num1);
    const num2 = parseFloat(req.body.num2);
    const operation = req.body.operation;
  
    let result;
    let error_message;
  
    if (operation === 'add') {
      result = num1 + num2;
    } else if (operation === 'subtract') {
      result = num1 - num2;
    } else if (operation === 'multiply') {
      result = num1 * num2;
    } else if (operation === 'divide') {
      if (num2 !== 0) {
        result = num1 / num2;
      } else {
        error_message = 'Cannot divide by zero';
      }
    }
  
    res.render('calculator', { result, error_message });
  });

  // Add a logout route
app.get('/logout', (req, res) => {
  // Clear the token
  token = null;
  res.redirect('/');
});

const PORT = 8084;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

  module.exports = app;