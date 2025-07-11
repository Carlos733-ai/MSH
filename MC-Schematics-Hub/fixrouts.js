const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'assets' folder (or your custom folder)
app.use(express.static(path.join(__dirname, 'assets')));

// Route for the root page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'index.html'));
});

// Route for verify.html page
app.get('/verify.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'verify.html'));
});

// Route for login.html page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'login.html'));
});

// Route for signup.html page
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'signup.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
