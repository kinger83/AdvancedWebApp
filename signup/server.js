const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../shared/users.json');
const usersFile = fs.readFileSync(filePath, { encoding: 'utf8' });
const users = JSON.parse(usersFile);


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, '../views'));

app.get('/signup', (req, res) => {
    
    const userName = 'John Doe'; // Replace with actual username
  
    // Render the landing page template with the user's name
    res.render('signup', { name: userName });
  })
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

    const PORT = 8082;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

    module.exports = app;