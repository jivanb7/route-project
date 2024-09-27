const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// Create a variable called isProduction that will be true if the environment is in production or not by checking the environment key in the configuration file (backend/config/index.js):
const { environment } = require("./config");
const isProduction = environment === "production";

const app = express();

// Connect the morgan middleware for logging information about requests and responses:
app.use(morgan("dev"));

// Add the cookie-parser middleware for parsing cookies and the express.json middleware for parsing JSON bodies of requests with Content-Type of "application/json".
app.use(cookieParser());
app.use(express.json()); // taking json and parsing it into a usable POJO

// Add several security middlewares:

// 1. Only allow CORS (Cross-Origin Resource Sharing) in development using the cors middleware because the React frontend will be served from a different server than the Express server. CORS isn't needed in production since all of our React and Express resources will come from the same origin.
// 2. Enable better overall security with the helmet middleware (for more on what helmet is doing, see helmet on the npm registry). React is generally safe at mitigating XSS (i.e., Cross-Site Scripting) attacks, but do be sure to research how to protect your users from such attacks in React when deploying a large production application. Now add the crossOriginResourcePolicy to the helmet middleware with a policy of cross-origin. This will allow images with URLs to render in deployment.
// 3. Add the csurf middleware and configure it to use cookies.

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

const routes = require("./routes");

app.use(routes); // Connect all the routes

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err); // implies that there's another middleware that's meant to handle errors
});

// Error handling routes

const { ValidationError } = require("sequelize");

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.message = "Validation error";
    err.errors = errors;
  }
  next(err); // pass this modified err object to the next error handler
});

// Error formatter
app.use((err, req, res, _next) => {
  const { title, stack, status, message, errors } = err;
  res.status(status || 500);

  if (isProduction) {
    // production error formatting
    const responseError = {
      message,
    };

    if (
      message !== "Invalid credentials" &&
      message !== "Forbidden" &&
      message !== "Authentication required" &&
      message !== "The requested resource couldn't be found."
    ) {
      responseError.errors = errors;
    }

    res.json(responseError);
  } else {
    // development error formatting

    res.json({
      title: title || "Server Error",
      message: err.message,
      errors: err.errors,
      stack,
    });
  }
});

module.exports = app;
