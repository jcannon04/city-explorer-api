
const get = require("axios").get;
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const weatherData = require("./data/weather.json");


// Set the port to 8000
const PORT = process.env.PORT || 3001;

// Enable CORS for requests coming from http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Define a Forecast class to store data for each day's forecast
class ForeCast {
  constructor(date, desc) {
    this.date = date;
    this.desc = desc;
  }
}

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
    let movieResponse = await get(
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
// Route for getting weather data
app.get("/weather", async (req, res, next) => {
  const { lat, lon } = req.query;

  try {
    let apiWeatherData = await get(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`
    );

    //  Map the weather data to an array of ForeCast objects and send it as the response
    let weatherForDays = apiWeatherData.data.data.map((day) => {
      return new ForeCast(day.valid_date, day.weather.description);
    });
    res.json(weatherForDays);
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


// Start listening for incoming requests
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

