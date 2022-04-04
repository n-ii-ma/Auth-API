// Inject environment variables
require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";

// Express App
const express = require("express");
const app = express();

// CORS
const cors = require("cors");
const options = {
  credentials: true,
  origin: isProduction ? process.env.ADDRESS : "*",
};
app.use(cors(options));

// Helmet
const helmet = require("helmet");
app.use(helmet());

// Gzip Compression
const compression = require("compression");
app.use(compression());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger with Morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// Rate Limiter
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests
});
app.use(limiter);

// Port
const PORT = process.env.PORT || 3000;

// Import Swagger UI Express and yaml.js
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// Load the yaml file
const swaggerDocument = YAML.load("./openApi.yaml");

// Swagger Docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customSiteTitle: "Auth API" })
);

// Routers
const authRouter = require("./routes/auth/auth");
const usersRouter = require("./routes/users/users");
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

// Error Handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      status,
      message: err.message || "Internal Server Error",
    },
  });
});

// Server Start
app.listen(PORT, () => console.log(`Server Listening on Port ${PORT}`));
