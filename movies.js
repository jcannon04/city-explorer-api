const axios = require("axios");

module.exports = function (app) {
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
};
