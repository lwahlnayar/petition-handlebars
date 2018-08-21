const express = require("express");
const app = express();
const chalkAnimation = require("chalk-animation");
const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
const fs = require("fs");
const csurf = require("csurf");
const {
    getAllData,
    pushSigs,
    createUser,
    getPasswordSql,
    getIdSql,
    getName,
    getIdSig,
    pushProfile,
    getSignature,
    countSignatures,
    getCitySigs
} = require("./serverToDatabase");
const { hashPass, checkPass } = require("./hashFunctions");
const cookieSession = require("cookie-session");
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.use(
    cookieSession({
        secret: `I like turtles.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
//PURPOSE: Vulnerabilities
app.use(csurf()); // use after cookie/body middleware, CSRF attack prevention
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
}); //sets token into html placeholder
app.use(function(req, res, next) {
    res.setHeader("x-frame-options", "DENY");
    next();
});
app.disable("x-powered-by");

//Boilerplate above

app.use(express.static("./public"));
app.use(express.static("./css"));

//PURPOSE: to check if user has USER session when entering that page. if not, send to home page
const checkForUserSession = (req, res, next) => {
    if (!req.session.loggedIn) {
        res.redirect("/register");
    } else {
        next();
    }
};

const checkForSigSession = (req, res, next) => {
    if (!req.session.checked) {
        res.redirect("/petition_home");
    } else {
        next();
    }
};

const checkLoginRegister = (req, res, next) => {
    if (req.session.loggedIn) {
        res.redirect("/petition_home");
    } else {
        next();
    }
};

const checkSignedAlready = (req, res, next) => {
    if (req.session.checked) {
        res.redirect("/thankyou");
    } else {
        next();
    }
};

app.get("/", (req, res) => {
    res.redirect("/petition_home");
});

app.get("/profile", checkForUserSession, (req, res) => {
    res.render("profile.handlebars", {
        layout: "secondary_layout.handlebars"
    });
});

app.post("/profile", (req, res) => {
    pushProfile(
        req.body.age,
        req.body.city,
        req.body.homepage,
        req.session.loggedIn
    )
        .then(pushObj => {
            res.redirect("/petition_home");
        })
        .catch(e => {
            console.log("ERROOOOR", e);
            res.render("profile.handlebars", {
                layout: "secondary_layout.handlebars",
                error: true
            });
        });
});

app.get(
    "/petition_home",
    checkForUserSession,
    checkSignedAlready,
    (req, res) => {
        getName(req.session.loggedIn).then(userName => {
            res.render("body_home.handlebars", {
                layout: "main_layout.handlebars",
                currentUser: userName.rows[0].first_name
            });
        });
    }
);

app.post("/petition_home", (req, res) => {
    pushSigs(req.body.sig, req.session.loggedIn)
        .then(function(idVal) {
            req.session.checked = idVal.rows[0].id; //puts the property of Id into cookie
            res.redirect("/thankyou");
        })
        .catch(function(e) {
            console.log("PETITION POST CATCH ERROR:", e);
            getName(req.session.loggedIn).then(userName => {
                res.render("body_home.handlebars", {
                    layout: "main_layout.handlebars",
                    currentUser: userName.rows[0].first_name,
                    error: true
                });
            });
        });
});

app.get("/register", checkLoginRegister, (req, res) => {
    res.render("register.handlebars", {
        layout: "secondary_layout.handlebars"
    });
});

app.post("/register", (req, res) => {
    if (req.body.password.length > 0) {
        hashPass(req.body.password)
            .then(hashedPassword => {
                return createUser(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    hashedPassword
                );
            })
            .then(idVal => {
                req.session.loggedIn = idVal.rows[0].id;
                res.redirect("/profile");
            })
            .catch(e => {
                res.render("register.handlebars", {
                    layout: "secondary_layout.handlebars",
                    error: true
                });
            });
    } else {
        res.render("register.handlebars", {
            layout: "secondary_layout.handlebars",
            error: true
        });
    }
});

app.get("/login", checkLoginRegister, (req, res) => {
    res.render("login.handlebars", {
        layout: "secondary_layout.handlebars"
    });
});

app.post("/login", (req, res) => {
    getPasswordSql(req.body.email)
        .then(queryResponse => {
            return checkPass(req.body.password, queryResponse.rows[0].password);
        })
        .then(checkPassResult => {
            if (checkPassResult) {
                getIdSql(req.body.email).then(queryResponse => {
                    req.session.loggedIn = queryResponse.rows[0].id;
                    getIdSig(req.session.loggedIn).then(idMatch => {
                        if (idMatch.rows.length == 0) {
                            res.redirect("/petition_home");
                        } else {
                            req.session.checked = idMatch.rows[0].id;
                            res.redirect("/thankyou");
                        }
                    });
                });
            }
        })
        .catch(e => {
            console.log(e);
            res.render("login.handlebars", {
                layout: "secondary_layout.handlebars",
                error: true
            });
        });
});

app.get("/thankyou", checkForUserSession, checkForSigSession, (req, res) => {
    Promise.all([
        getSignature(req.session.checked),
        countSignatures(),
        getName(req.session.loggedIn)
    ])
        .then(([signature, numSigs, userName]) => {
            res.render("thankyou_body.handlebars", {
                layout: "secondary_layout.handlebars",
                currentUser: userName.rows[0].first_name,
                userSignature: signature.rows[0].signature,
                numberSigners: numSigs.rows[0].count
            });
        })
        .catch(e => {
            console.log("ERROR THANKYOU GET ROUTE:", e);
        });
});

app.get("/list_signups", checkForUserSession, (req, res) => {
    getAllData()
        .then(function(signers) {
            res.render("list.handlebars", {
                layout: "secondary_layout.handlebars",
                signers: signers
            });
        })
        .catch(e => console.log("LIST SIGNUP GET ROUTE:", e));
});

app.get("/list_signups/:cityName", checkForUserSession, (req, res) => {
    getCitySigs(req.params.cityName)
        .then(function(signers) {
            res.render("list.handlebars", {
                layout: "secondary_layout.handlebars",
                signers: signers
            });
        })
        .catch(e => console.log("LIST SIGNUP GET ROUTE:", e));
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});

//add logout button

app.listen(8080, chalkAnimation.neon("I'm listening: "));
