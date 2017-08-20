"use strict"

const express = require('express');
const app = express();
let bodyParser = require('body-parser');
let ejs = require('ejs');
let pg = require('pg');

let votes = {
    sandwitches: 0,
    tacos: 0
};

let urlEncodedParser = bodyParser.urlencoded({
    extended: false
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
    res.render('pages/index', {
        votes: votes
    });
});

app.post("/vote", urlEncodedParser, function (req, res) {
    let vote = req.body.yourVote;
    if (vote === 'sandwitches') {
        votes.sandwitches++;
    } else if (vote === 'tacos') {
        votes.tacos++;
    } else {
        console.log("Something went wrong..." + vote);
    }

    res.redirect('/');
});

const PORT = 8888;
app.listen(PORT);
console.log("Running on http://localhost:" + PORT);