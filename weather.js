module.exports = function (app) {
  // Define a Forecast class to store data for each day's forecast
  class ForeCast {
    constructor(date, desc) {
      this.date = date;
      this.desc = desc;
    }
  }
  // Route for getting weather data
  app.get("/weather", async (req, res, next) => {
    const { lat, lon } = req.query;

    try {
      let apiWeatherData = await axios.get(
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
};
