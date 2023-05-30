const { json } = require('express');
const express = require('express');
const res = require("express/lib/response");
const bodyParser = require('body-parser');

const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const fs = require('fs');
const usersFile = fs.readFileSync('./users.json', 'utf8');
const users = JSON.parse(usersFile);
console.log(users);
var token = null;



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());

const HOST = '0.0.0.0';
const PORT = 8080;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', __dirname + '/views');





// Extract token from header
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:'mykey'
};

// Add token if not null to header
const addTokenToHeader = (req, res, next) => {
    //const token = req.token;
    
    if (token) {
      req.headers.authorization = `Bearer ${token}`;
      console.log("adding token " + token);
    }
    next();
  };

const strategy = new JwtStrategy(jwtOptions, (jwt_paylaod, next) => {
    const user = users.find(user => user.id === jwt_paylaod.id);
    if(user) {
        next(null, user);
    }   else {
        next(null, false);
    }
    
});
passport.use(strategy);

// Apply the addTokenToHeader middleware to specific routes
app.use(['/landing', '/calculator', '/converter'], addTokenToHeader);

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


app.post('/login', (req, res) => {
    const {username, password: password} = req.body;
console.log('Password:', password);
    const user = users.find(user => user.username === username &&
        user.password === password);
    
    if(user) {
        const payload = {id: user.id};
        token = jwt.sign(payload, jwtOptions.secretOrKey);
        req.token = token;
        console.log("token: " + token);
       // res.status(200).json({message:'OK', token: token});
      //  Render the landing page template with the user's name
      let userName = user.username
        res.render('landing_page', { name: userName });
        console.log(token);
    } else {
        res.status(401).json({message:'Invalid username or password'});
    }
});
  

app.get('/signup', (req, res) => {
  // Get the user's name from your authorization logic
  const userName = 'John Doe'; // Replace with actual username

  // Render the landing page template with the user's name
  res.render('signup', { name: userName });
});
  // Signup route
  app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    fs.writeFileSync('./users.json', JSON.stringify(users));
    // Redirect to the login page after successful login
    res.redirect('/');
    return res.status(201).json({ message: 'User created successfully' });

    
  });

  

  // Add a logout route
app.get('/logout', (req, res) => {
  // Clear the token
  token = null;
  res.redirect('/');
});

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
    res.render('landing_page', { name: userName });
  });

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




app.listen(PORT, HOST, () => {
    console.log("Calculator API is listenning on http://${HOST}:${PORT} Enjoy");
});