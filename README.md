This project uses an express web server backend to serve a page that can search for movies in Open Movie Database (OMDB).

The server caches data that it has already gotten from previous searches so that it doesn't spam the  OMDB API, and if it's left running it will update the contents of the cache once every 24 hours.

You can clone this from my github with `git clone git@github.com:Z4rkal/Movie-Finder-Express-Server.git`.

To build it, you'll need NodeJS and Node Package Manager (npm) so that you can run `npm install`, and then you'll need to get an api key from `http://www.omdbapi.com/apikey.aspx` (They give away free API keys with a 1000 daily limit if you're just looking to play around with this project) and create a `config.js` file in the `/server` folder that looks like:

`module.exports = {`
`    apiKey : 'YOUR_API_KEY_HERE'`
`};`

After you have that done, you can run the server with `npm start`.

The server will listen on port 3000 (So you can use your browser to access the web page it serves at `http://127.0.0.1:3000/` or `http://localhost:3000/`) and will log to the terminal you use to launch it. Have fun :)