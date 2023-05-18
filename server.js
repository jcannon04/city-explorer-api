
const axios = require("axios");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const weatherData = require("./data/apiWeather.json");


// Set the port to 8000
const PORT = process.env.PORT || 3001;

// Enable CORS for requests coming from http://localhost:3000
app.use(
  cors({
    origin: "https://cityexplorer-codefellow.netlify.app",
  })
);

// Define a Movie class to store data for each movie
class Movie {
  constructor(
    title,
    overview,
    average_votes,
    total_votes,
    popularity,
    released_on
  ) {
    this.title = title;
    this.overview = overview;
    this.average_votes = average_votes;
    this.total_votes = total_votes;
    this.popularity = popularity;
    this.released_on = released_on;
  }
}
// Route for getting movie data
app.get("/movies", async (req, res, next) => {
  const { city_name } = req.query;
  try {
    let movieResponse = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${city_name}&page=1&include_adult=false`
    );
    let movieData = movieResponse.data;

    let sortedMovieData = movieData.results
      .sort((a, b) => {
        return b.popularity - a.popularity;
      })
      .slice(0, 20)
      .map((movie) => {
        return new Movie(
          movie.title,
          movie.overview,
          movie.vote_average,
          movie.votes_count,
          movie.popularity,
          movie.release_date
        );
      });

    res.json(sortedMovieData);
  } catch (error) {
    next(error);
  }
});

// Route for getting all weather data
app.get("/", (req, res, next) => {
  if (!weatherData) {
    const error = new Error("Internal Server Error");
    error.status = 500;
    next(error);
    return;
  }
  // Send all weather data as the response
  return res.json(weatherData);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";

  // Send an error response with the error status and message
  res.status(status).json({ message });
});

// Import the weather module and call it with our app instance
require("./weather")(app);

// Start listening for incoming requests
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
