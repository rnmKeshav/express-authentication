let express = require("express");
// let userRoutes = require("./users");

let router = express.Router();



// router.get("/users", userRoutes);
router.get("/", (req, res) => {
    res.render("welcome");
});

module.exports  = router;
