let express = require("express");
let expressLayout = require("express-ejs-layouts");
let mongoose = require("mongoose");


let routes = require("./routes");
let userRoutes = require("./routes/users");
let configKeys = require("./config/keys");

let server = express();

//Connect to mongoDB
mongoose.connect(configKeys.mongoURI, {
    useNewUrlParser: true   // This is to hide error in console
}).then(() => console.log("MongoDb connected")).catch(err => console.log(err));

// Bodyparser
server.use(express.urlencoded({extended: false}));

//EJS
server.use(expressLayout);
server.set("view engine", "ejs");

// Routes
server.use("/", routes);
server.use("/users", userRoutes);


server.listen(3000, () => {
    console.log("Server running on port 3000")
})