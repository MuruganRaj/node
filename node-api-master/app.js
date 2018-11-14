// Require packages
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes')
var fs=require('fs');

const app = express();
var publicDir = require('path').join(__dirname,'/Images');
app.use(express.static(publicDir));

// Set the port
const port = 3000;

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));


// Route the API
routes(app);

app.get('/images/:file', function (req, res) {
        file = req.params.file;
        var img = fs.readFileSync(__dirname + "/Images/" + file);
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(img, 'binary');

    })


// Start the server
const server = app.listen(port, () => {
    console.log(`App running on port ${server.address().port}`);
});