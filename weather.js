const axios = require("axios");
const cache = require("./cache");

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
    const key = `weather-${lat}-${lon}`;

    if (cache[key] && Date.now() - cache[key].timestamp < 50000) {
      console.log("Cache hit");
      res.json(cache[key]);
      return;
    }

    try {
      let apiWeatherData = await axios.get(
        `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`
      );

      //  Map the weather data to an array of ForeCast objects and send it as the response
      let weatherForDays = apiWeatherData.data.data.map((day) => {
        return new ForeCast(day.valid_date, day.weather.description);
      });

      cache[key] = weatherForDays;
      cache[key].timestamp = Date.now();

      res.json(weatherForDays);
    } catch (error) {
      next(error);
    }
  });
};
