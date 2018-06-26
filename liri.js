

var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var userInput = process.argv[2];
var Twitter = require('twitter');
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
//console.log(keys.spotify);

switch (userInput) {
    case "my-tweets":
        tweets("{ count: 3 }");
        break;

    case "spotify-this-song":
        spotifySong(process.argv[3]);
        break;

    case "movie-this":
        movieThis(process.argv[3]);
        break;

    case "do-what-it-says":

        fs.readFile("random.txt", "utf8", function (error, data) {

            if (error) {
                return console.log(error);
            }
            var dataArr = data.split(",");
            //console.log(dataArr);
            switch (dataArr[0]) {
                case "my-tweets":
                    tweets("{ count: 3 }");
                    break;

                case "spotify-this-song":
                    spotifySong(dataArr[1]);
                    break;

                case "movie-this":
                    movieThis(dataArr[1]);
                    break;
            };

        });

        break;

    default:
        break;
};

function tweets(params) {
    //var params = { count: 3 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //console.log(tweets);
            for (let i = 0; i < 3; i++) {
                console.log(tweets[i].created_at + " - " + tweets[i].text);
            }

        }
    });
};

function spotifySong(songName) {
    //var songName = process.argv[3];
    spotify.search({ type: 'track', query: songName, limit: 10 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //JSON.stringify([0].items
        //console.log(data.tracks.items.length);
        if (data.tracks.items.length === 0) {
            console.log("No Results For That Search, But Here's A Great Song:" +
                "\nArtist: Ace of Base" +
                "\nSong name: The Sign" +
                "\nPreview: https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE" +
                "\nAlbum: The Sign(US Album)[Remastered]")
        } else {
            for (let i = 0; i < data.tracks.items.length; i++) {
                console.log("Result: " + i);
                console.log("Artist: " + data.tracks.items[i].artists[0].name);
                console.log("Song name: " + data.tracks.items[i].name);
                console.log("Preview: " + data.tracks.items[i].external_urls.spotify);
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("*----------------------------------*");
            }
        }

    });
};

function movieThis(searchMovie) {
    //var searchMovie = process.argv[3];
    request("http://www.omdbapi.com/?t=" + searchMovie.replace(" ", "+") + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Source);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);

        }
    });

}