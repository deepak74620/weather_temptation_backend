const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const expressWs = require("express-ws");

require("dotenv").config();

const { app } = expressWs(express());
app.use(cors());
app.use(express.json({ limit: "25mb" }));


const usersRouter = require('./components/users/users.router.js');
const friendsRouter = require("./components/friends/friends.router.js");
const tripsRouter = require("./components/trips/trips.router.js");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    
    useNewUrlParser: true,
    useUnifiedTopology: true,

    // added new
    // serverSelectionTimeoutMS: 30000,  // 30 seconds timeout
    // socketTimeoutMS: 45000,           // 45 seconds socket timeout
  })
  .then(() => {
    app.listen(process.env.PORT, async () => {
      console.log("Database Connected");
      console.log("webhook listening");
      console.log("Server is running on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("hello from home server");
});

app.use("/api/v1/", usersRouter);
app.use("/api/v1/", friendsRouter);
app.use("/api/v1/trips", tripsRouter);