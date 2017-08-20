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

let client = new pg.Client('postgres://postgres@172.17.0.1:9000/postgres');

client.connect(function (err) {
    if (err) throw err;

    client.query('SELECT number_of_votes FROM votes', function (err, res) {
        if (err) throw err;
        votes.sandwitches = res.rows[0].number_of_votes;
        votes.tacos = res.rows[1].number_of_votes;
    });
});

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
        client.query('UPDATE votes set number_of_votes=' + votes.sandwitches + 'WHERE option_name=\'sandwitches\'', function (err, result) {
            if (err) throw err;
        });
    } else if (vote === 'tacos') {
        votes.tacos++;
        client.query('UPDATE votes set number_of_votes=' + votes.tacos + 'WHERE option_name=\'tacos\'', function (err, result) {
            if (err) throw err;
        });
    } else {
        console.log("Something went wrong..." + vote);
    }

    res.redirect('/');
});

const PORT = 8888;
app.listen(PORT);
console.log("Running on http://localhost:" + PORT);