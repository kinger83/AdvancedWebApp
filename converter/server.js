const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const path = require('path');


// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, '../views'));

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


// Unit conversion functions
function convertDistance(value, fromUnit, toUnit) {
    const conversions = {
      kilometers: {
        miles: value * 0.621371,
        yards: value * 1093.61,
      },
      miles: {
        kilometers: value * 1.60934,
        yards: value * 1760,
      },
      yards: {
        kilometers: value * 0.0009144,
        miles: value * 0.000568182,
      },
    };
  
    return conversions[fromUnit][toUnit];
  }
  
  function convertTemperature(value, fromUnit, toUnit) {
    const conversions = {
      celsius: {
        fahrenheit: (value * 9) / 5 + 32,
        kelvin: value + 273.15,
      },
      fahrenheit: {
        celsius: ((value - 32) * 5) / 9,
        kelvin: ((value - 32) * 5) / 9 + 273.15,
      },
      kelvin: {
        celsius: value - 273.15,
        fahrenheit: (value - 273.15) * (9 / 5) + 32,
      },
    };
  
    return conversions[fromUnit][toUnit];
  }
  
  function convertWeight(value, fromUnit, toUnit) {
    const conversions = {
      kilograms: {
        pounds: value * 2.20462,
        ounces: value * 35.274,
      },
      pounds: {
        kilograms: value * 0.453592,
        ounces: value * 16,
      },
      ounces: {
        kilograms: value * 0.0283495,
        pounds: value * 0.0625,
      },
    };
  
    return conversions[fromUnit][toUnit];
  }
  
  app.get('/converter', requireToken, (req, res) => {
    const type = req.query.type || 'distance'; // Set default type to 'distance'
  
    res.render('converter', { result: null, type }); // Pass the 'type' variable to the template
  });
  
  app.post('/converter', (req, res) => {
    const { value, fromUnit, toUnit, type } = req.body; // Add 'type' to the destructuring assignment
  
    let result;
    let error_message;
  
    if (type === 'distance') {
      // Distance conversion logic
      result = convertDistance(parseFloat(value), fromUnit, toUnit);
    } else if (type === 'temperature') {
      // Temperature conversion logic
      result = convertTemperature(parseFloat(value), fromUnit, toUnit);
    } else if (type === 'weight') {
      // Weight conversion logic
      result = convertWeight(parseFloat(value), fromUnit, toUnit);
    }
  
    res.render('converter', { result, type }); // Pass the 'type' variable to the template
  });

  // Add a logout route
app.get('/logout', (req, res) => {
  // Clear the token
  token = null;
  res.redirect('/');
});

const PORT = 8085;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

  module.exports = app;
