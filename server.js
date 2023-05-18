
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

// Require the routes defined in other files
require("./weather")(app);
require("./movies")(app);


// Start listening for incoming requests
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
