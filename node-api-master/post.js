const request = require('request');

const json = {
    "name": "Tania",
    "email": "tania@example.com",
    "username": "floppydiskette"
};

request.post({
    url: 'http://localhost:3002/users',
    body: json,
    json: true,
}, function (error, response, body) {
    console.log(body);
});