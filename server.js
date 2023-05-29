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
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const HOST = '0.0.0.0';
const PORT = 8080;

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



app.post('/login', (req, res) => {
    const {username, passowrd: password} = req.body;
    const user = users.find(user => user.username === username &&
        user.password === password);
    
    if(user) {
        const payload = {id: user.id};
        token = jwt.sign(payload, jwtOptions.secretOrKey);
        req.token = token;
        console.log(token);
        res.status(200).json({message:'OK', token: token});
    } else {
        res.status(401).json({message:'Invalid username or password'});
    }
});

// Addidtion. add /add/x/x values together.
app.get('/add/:num1/:num2', (req, res) =>{
    try {
        const number1 = parseFloat(req.params.num1);
        const number2 = parseFloat(req.params.num2);

        const result = number1 + number2;
        res.send(result.toString());
        
    } catch (error) {
        res.send(error);
        
    }
});

app.post('/add', addTokenToHeader, passport.authenticate('jwt', { session: false }), (req, res) => {
    try{
        const {n1, n2} = req.body;
        const num1 = parseFloat(n1);
        const num2 = parseFloat(n2);

        if(isNaN(num1)){
            res.status(500).json({statuscode:500, msg:"N1 is not a valid number"});
        }
        if(isNaN(num2)){
            res.status(500).json({statuscode:500, msg:"N1 is not a valid number"});
        }

        const result = num1 + num2;

        res.status(200).json({statuscode:200, data:result});
        
        
    }
    catch(error){
        res.status(500).json({statuscode:500, msg: error.toString()});
    }

});

// Subtraction. subtact param 2 from param 1 /subtract/x/x values.
app.get('/subtract/:num1/:num2', (req, res) =>{
    try {
        const number1 = parseFloat(req.params.num1);
        const number2 = parseFloat(req.params.num2);

        const result = number1 - number2;
        res.send(result.toString());
        
    } catch (error) {
        res.send(error);
        
    }
});

app.post('/subtract', addTokenToHeader, passport.authenticate('jwt', { session: false }), (req, res) => {
    try{
        const {n1, n2} = req.body;
        const num1 = parseFloat(n1);
        const num2 = parseFloat(n2);

        if(isNaN(num1)){
            res.status(500).json({statuscode:500, msg:"N1 is not a valid number"});
        }
        if(isNaN(num2)){
            res.status(500).json({statuscode:500, msg:"N1 is not a valid number"});
        }

        const result = num1 - num2;

        res.status(200).json({statuscode:200, data:result});
        
        
    }
    catch(error){
        res.status(500).json({statuscode:500, msg: error.toString()});
    }

});

// Multiplication. multiplies /multiply/x/x values together.
app.get('/multiply/:num1/:num2', (req, res) =>{
    try {
        const number1 = parseFloat(req.params.num1);
        const number2 = parseFloat(req.params.num2);

        

        const result = number1 * number2;
        res.send(result.toString());
        
    } catch (error) {
        res.send(error);
        
    }
});

app.post('/multiply', addTokenToHeader, passport.authenticate('jwt', { session: false }), (req, res) => {
    try{
        const {n1, n2} = req.body;
        const num1 = parseFloat(n1);
        const num2 = parseFloat(n2);

        if(isNaN(num1)){
            res.status(500).json({statuscode:500, msg:"N1 is not a valid number"});
        }
        if(isNaN(num2)){
            res.status(500).json({statuscode:500, msg:"N1 is not a valid number"});
        }

        const result = num1 * num2;

        res.status(200).json({statuscode:200, data:result});
        
        
    }
    catch(error){
        res.status(500).json({statuscode:500, msg: error.toString()});
    }

});

// Divide. divides parram 1 by param 2 /divide/x/x values together.
app.get('/divide/:num1/:num2', (req, res) =>{
    try {
        const number1 = parseFloat(req.params.num1);
        const number2 = parseFloat(req.params.num2);

        const result = number1 / number2;
        res.send(result.toString());
        
    } catch (error) {
        res.send(error);
        
    }
});

app.post('/divide', addTokenToHeader, passport.authenticate('jwt', { session: false }), (req, res) => {
    try{
        const {n1, n2} = req.body;
        const num1 = parseFloat(n1);
        const num2 = parseFloat(n2);

        if(isNaN(num1)){
            res.status(500).json({statuscode:500, msg:"N1 is not a valid number"});
        }
        if(isNaN(num2)){
            res.status(500).json({statuscode:500, msg:"N1 is not a valid number"});
        }

        if(num2 == 0){
            res.status(500).json({statuscode:500, msg:"Cannot divide by 0"});
        }

        const result = num1 / num2;

        res.status(200).json({statuscode:200, data:result});
        
        
    }
    catch(error){
        res.status(500).json({statuscode:500, msg: error.toString()});
    }

});

app.listen(PORT, HOST, () => {
    console.log("Calculator API is listenning on http://${HOST}:${PORT} Enjoy");
});