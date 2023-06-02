const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const fs = require('fs');
const path = require('path');
const { LOGIN_SERVER_PORT, LANDING_SERVER_PORT } = require('../server');

const filePath = path.join(__dirname, '../shared/users.json');
const usersFile = fs.readFileSync(filePath, { encoding: 'utf8' });
const users = JSON.parse(usersFile);


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const THISPORT = LOGIN_SERVER_PORT;

// Extract token from header
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:'mykey'
};

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, '../views'));


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

  app.get('/', (req, res) => {
    // Get the user's name from your authorization logic
    const userName = 'John Doe'; // Replace with actual username
  
    // Render the landing page template with the user's name
    res.render('login');
  });


app.post('/login', (req, res) => {
    const {username, password: password} = req.body;
console.log('Password:', password);
    const user = users.find(user => user.username === username &&
        user.password === password);
    
    if(user) {
        const payload = {id: user.id};
        token = jwt.sign(payload, jwtOptions.secretOrKey);
        req.token = token;
      let userName = user.username
        res.redirect(LANDING_SERVER_PORT + '/landing');
    } else {
        res.status(401).json({message:'Invalid username or password'});
    }
});


// Add a logout route
app.get('/logout', (req, res) => {
  // Clear the token
  token = null;
  res.redirect(LOGIN_SERVER_PORT + '/');
});



app.listen(THISPORT, () => {
  console.log(`Server is listening on port ${THISPORT}`);
});
module.exports = app;
