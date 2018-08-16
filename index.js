const express = require("express");
const app = express();
const chalkAnimation = require("chalk-animation");
const hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
const fs = require("fs");
const serverToDatabase = require("./serverToDatabase");
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

//Boilerplate above

app.use(express.static("./public"));
app.use(express.static("./css"));

//cookiechecker at beginning
// app.use((req, res, next) => {
//     if (!req.cookies.confirmCookies && req.url != "/cookie") {
//         res.cookie("originalUrl", req.url);
//         res.redirect("/cookie");
//     } else {
//         next();
//     }
// });

//PURPOSE: to check if user has session when entering that page. if not, send to home page
const checkForSession = (req, res, next) => {
    if (!req.session.checked) {
        res.redirect("/petition_home");
    } else {
        next();
    }
};

app.get("/", (req, res) => {
    res.redirect("/petition_home");
});

app.get("/petition_home", (req, res) => {
    res.render("body_home.handlebars", {
        layout: "main_layout.handlebars"
    });
});

app.post("/petition_home", (req, res) => {
    // console.log("post done!", req.body);
    if (req.body.firstname && req.body.lastname && req.body.sig) {
        serverToDatabase
            .pushSigs(req.body.firstname, req.body.lastname, req.body.sig)
            .then(function(idVal) {
                console.log("success! val of id:", idVal.rows[0].id);
                req.session.checked = idVal.rows[0].id; //puts the property of Id into cookie
                res.redirect("/thankyou");
            })
            .catch(function(e) {
                console.log(e);
            });
    } else {
        res.render("body_home.handlebars", {
            layout: "main_layout.handlebars",
            randomerrormessage: true
        });
    }
});

app.get("/thankyou", checkForSession, (req, res) => {
    serverToDatabase
        .getSigners()
        .then(function(signers) {
            let match = 0;
            for (let eachSig = 0; eachSig < signers.length; eachSig++) {
                if (signers[eachSig].id == req.session.checked) {
                    match = signers[eachSig].signature;
                }
            }
            res.render("thankyou_body.handlebars", {
                layout: "secondary_layout.handlebars",
                numberSigners: signers.length,
                userSignature: match
            });
        })
        .catch(function(e) {
            console.log(e);
        });
});

app.get("/list_signups", (req, res) => {
    serverToDatabase
        .getSigners()
        .then(function(signers) {
            res.render("list.handlebars", {
                layout: "secondary_layout.handlebars",
                signers: signers
            });
        })
        .catch(e => console.log(e));
});

app.listen(8080, chalkAnimation.neon("I'm listening: "));
