const app = require("express")();
const cors = require("cors");
require("dotenv").config();
const weatherData = require("./data/weather.json");

const PORT = process.env.PORT || 8000;

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

// Route for getting weather data
app.get("/weather", (req, res, next) => {
  const { lat, lon, searchQuery } = req.query;
  console.log("req", req.query);

  // Find the weather data for the requested location
  let cityWeather = weatherData.find((cityData) => {
    return (
      cityData.city_name === searchQuery ||
      cityData.lat === lat ||
      cityData.lon === lon
    );
  });

  // If no weather data was found for the requested location, send a 500 error response
  if (!cityWeather) {
    const error = new Error("Internal Server Error");
    error.status = 500;
    next(error);
    return;
  }
  // Map the weather data to an array of ForeCast objects and send it as the response
  let weatherForDays = cityWeather.data.map((day) => {
    return new ForeCast(day.valid_date, day.weather.description);
  });

  console.log(weatherForDays);
  res.json(weatherForDays);
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
  const message = error.message || 'Internal Server Error';

  // Send an error response with the error status and message
  res.status(status).json({ message });
});

// Start listening for incoming requests
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
