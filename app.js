const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const chapterRoutes = require("./routes/chapterRoutes");
const app = express();
const rateLimiter = require('./middleware/rateLimiter');
app.use(rateLimiter); // Apply globally before all routes


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/chapters", chapterRoutes);

app.use((req, res) => res.status(404).send({ error: "Route not found" }));

module.exports = app;
