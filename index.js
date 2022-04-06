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

// Logger with Morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// Trust first proxy
app.set("trust proxy", 1);

// Express Session
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const db = require("./db/index");

app.use(
  session({
    secret: process.env.SECRET,
    name: "pg.sessionId",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 3600000, // 1 hour
      httpOnly: true,
      secure: isProduction ? true : false,
      sameSite: isProduction ? "none" : "lax",
    },
    store: new pgSession({
      pool: db,
      createTableIfMissing: true,
    }),
  })
);

// Passport
const passport = require("passport");
const initialize = require("./config/passport");

initialize(passport);
app.use(passport.initialize());
app.use(passport.session());

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
