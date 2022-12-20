const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const port = 3000;

const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/category");
const recipeRoutes = require("./routes/recipe");
const videoRoutes = require("./routes/video");
const commentRoutes = require("./routes/comment");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//use helmet
app.use(helmet());
//use cors
app.use(cors());

// USER
app.use("/users", userRoutes);
// CATEGORY;
app.use("/category", categoryRoutes);
// RECIPE
app.use("/recipe", recipeRoutes);
// VIDEO
app.use("/video", videoRoutes);
// COMMENT
app.use("/comment", commentRoutes);

// run express
app.listen(port, () => {
  console.log(`Example app listening on ${port}`);
});
