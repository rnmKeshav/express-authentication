let express = require("express");
let bycrypt = require("bcryptjs");

let router = express.Router();

let UserModel = require("../models/User");

router.get("/login", (req, res ) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register", {
        errors: {}
    });
});

router.post("/register", (req, res) => {
    console.log("request.body", req.body);
    let {name, email, password} = req.body;
    let errors = {};

    if (!name) {
        Object.assign(errors, {name: "Name is mandatory"});
    }

    if (!email) {
        Object.assign(errors, {email: "Email is mandatory"});
    }

    if (!password) {
        Object.assign(errors, {password: "Password is mandatory"});
    }

    if (password && password.length < 6) {
        Object.assign(errors, {password: "Password must be of atleast 6 character length"});
    }

    
    if (Object.keys(errors).length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password
        });
    } else {
        let existing_user = UserModel.findOne({email})
            .then(userData => {
                if (userData) {
                    Object.assign(errors, {message: "Email is already registered"});
                    res.render("register", {
                        errors,
                        name,
                        email,
                        password
                    });
                } else {
                    let new_user = new UserModel({
                        name,
                        email,
                        password
                    });

                    bycrypt.genSalt(13, (saltCreationErr, salt) => {
                        if (saltCreationErr) {
                            throw saltCreationErr;
                        }

                        bycrypt.hash(new_user.password, salt, (hashCreationErr, hash) => {
                            if (hashCreationErr) {
                                throw hashCreationErr;
                            }
                            console.log("hased password", hash);
                            // Set user's password to newly created hash
                            new_user.password = hash;

                            // Save user to database
                            new_user.save()
                                .then(user => {
                                    res.redirect("/users/login");
                                })
                                .catch(err => {
                                    throw err
                                })
                        })
                    })

                    // console.log("new user", new_user);
                    // res.send("Hello")
                }
            });
        
    }

})
module.exports = router;
