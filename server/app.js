const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const hash = require('object-hash');
const app = express();
//Make sure that you've added a config.js file that exports an object with your api key as a member!
//Name the member 'apiKey' or you'll have to change stuff in this file
const config = require('./config');

var movieId = '';
var cacheObj = {};
var curHash = 0;

//There isn't a max cache size currently so if you're 
//using a free API key like I am then you'll start hitting the daily 
//limit of 1000 api requests much sooner as the cache starts 
//approaching 100's of requests just to refresh its entries every day
function updateCache() {
    console.log('Updating cache');
    //Goes through the cache and updates each entry with data from a fresh axios request to OMDB
    for (let [key, value] of Object.entries(cacheObj)) {
        axios
            .get('http://www.omdbapi.com/' + value[1] + value[0] + '&apikey=' + config.apiKey)
            .then(response => {
                curHash = hash(value[0]);
                cacheObj[curHash] = [value[0], value[1], response.data];
            });
    }
}

//This calls the updateCache function once every 24 hours
setInterval(function () { updateCache(); }, 1000 * 60 * 60 * 24);

app.use(morgan('dev'));
// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter
app.get('/main.js',function(req,res){
    res.sendFile('main.js',{'root' : './app'});
});

app.get('/style.css',function(req,res){
    res.sendFile('style.css',{'root' : './app'});
});

app.get('/', function (req, res) {
    //Check if the GET is asking for a movie by id
    if (req.url.match(/i=[^&]+/) != null) {
        //First extract the movie id from the request object's url
        movieId = req.url.match(/i=[^&]+/)[0].slice(2);
        //Then make a hash key out of the id
        curHash = hash(movieId);
        //Check whether the cache already contains data for the movie, if not then we'll use axios to make a request
        if (cacheObj[curHash] == undefined || cacheObj[curHash][1] == '?t=') {
            //Get the movie data from omdb
            console.log('Asking for movie data from http://www.omdbapi.com/?i=' + movieId);
            axios
                .get('http://www.omdbapi.com/?i=' + movieId + '&apikey=' + config.apiKey)
                .then(response => {
                    //Cache the response using the hash key we generated
                    cacheObj[curHash] = [movieId, '?i=', response.data];
                    //Then lastly send the data
                    res.send(response.data);
                });
        }
        //If the data was already in the cache, then use the cache instead
        else{
            console.log('Sending from cache');
            res.send(cacheObj[curHash][2]);
        }
    }
    //Check if the GET is asking for a movie by title
    else if (req.url.match(/t=[^&]+/) != null) {
        //First extract the movie title from the request object's url
        movieId = req.url.match(/t=[^&]+/)[0].slice(2);
        //Then make a hash key out of the title
        curHash = hash(movieId);
        //Check whether the cache already contains data for the movie, if not then we'll use axios to make a request
        if (cacheObj[curHash] == undefined || cacheObj[curHash][1] == '?i=') {
            //Get the movie data from omdb
            console.log('Asking for movie data from http://www.omdbapi.com/?t=' + movieId);
            axios
                .get('http://www.omdbapi.com/?t=' + movieId + '&apikey=' + config.apiKey)
                .then(response => {
                    //Cache the response using the hash key we generated
                    cacheObj[curHash] = [movieId, '?t=', response.data];
                    //Then lastly send the data
                    res.send(response.data);
                });
        }
        //If the data was already in the cache, then use the cache instead
        else{
            console.log('Sending from cache');
            res.send(cacheObj[curHash][2]);
        }
    }
    //Otherwise assume that this is the default route so send the html
    else res.sendFile('index.html', { 'root': './app' });
});

app.get('*',function(req,res){
    res.status(404).send('404: File not found');
});

module.exports = app;