const express = require('express');

const path = require('path');

const app = express();

app.use(express.static('client'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './client/index.html'));
});

//This grabs Heroku port number for your server
const port = process.env.PORT || 4545;

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});