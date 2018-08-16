const spicedPg = require("spiced-pg");

//Makes connection from server to database
const db = spicedPg("postgres:Rodney:postgres@localhost:5432/signaturesDb");

// Runs query from server
module.exports.getSigners = function getSigners() {
    return db.query("SELECT * FROM signatures").then(results => {
        // console.log(results.rows);
        return results.rows;
    });
};

module.exports.pushSigs = function pushSigs(firstnamearg, lastnamearg, sigarg) {
    return db.query(
        `INSERT INTO signatures (first_name, last_name, signature) VALUES ($1, $2, $3) RETURNING id`,
        [firstnamearg, lastnamearg, sigarg]
    );
};
