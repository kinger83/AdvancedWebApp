const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { LANDING_SERVER_PORT } = require('../server');

const THISPORT = LANDING_SERVER_PORT;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', __dirname + '/views');

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


app.get('/', (req, res) => {
    // Get the user's name from your authorization logic
    const userName = 'John Doe'; // Replace with actual username
  
    // Render the landing page template with the user's name
    res.render('login');
  });

  app.get('/landing', requireToken, (req, res) => {
    // Get the user's name from your authorization logic
    const userName = 'John Doe'; // Replace with actual username
  
    // Render the landing page template with the user's name
    res.render('landing_page');
  });

  // Add a logout route
app.get('/logout', (req, res) => {
  // Clear the token
  token = null;
  res.redirect('/');
});


app.listen(THISPORT, () => {
  console.log(`Server is listening on port ${THISPORT}`);
});
  module.exports = app;