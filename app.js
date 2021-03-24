require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const setMiddleware = require("./middleware/middleware");
const setRoutes = require("./routers/routers");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

setMiddleware(app);

setRoutes(app);

app.use((req, res, next) => {
  let error = new Error("404 Page not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  if (error.status === 404) {
    return res.render("pages/errorPages/404", { flashMessage: {} });
  }
  console.log(error.message);
  return res.render("pages/errorPages/500", { flashMessage: {} });
});


const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@blog-1.zkv8i.mongodb.net/BLOG-1?retryWrites=true&w=majority`

const PORT = process.env.PORT || 8080;
mongoose.set("useFindAndModify", false);
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is runnig on PORT " + PORT);
    });
  })
  .catch((e) => {
    console.log(e);
  });
