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

module.exports.pushSigs = function pushSigs(
    firstnamearg,
    lastnamearg,
    sigarg,
    idarg
) {
    return db.query(
        `INSERT INTO signatures (first_name, last_name, signature, user_id) VALUES ($1, $2, $3, $4) RETURNING id`,
        [
            firstnamearg || null,
            lastnamearg || null,
            sigarg || null,
            idarg || null
        ]
    );
};

module.exports.createUser = function createUser(
    firstnamearg,
    lastnamearg,
    emailarg,
    passwordarg
) {
    return db.query(
        `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [
            firstnamearg || null,
            lastnamearg || null,
            emailarg || null,
            passwordarg || null
        ]
    );
};

module.exports.getPasswordSql = function(emailarg) {
    return db.query(`SELECT password FROM users WHERE email = $1`, [
        emailarg || null
    ]);
};

module.exports.getIdSql = function(emailarg) {
    return db.query(`SELECT id FROM users WHERE email = $1`, [
        emailarg || null
    ]);
};

module.exports.getName = function(idarg) {
    return db.query(`SELECT first_name FROM users WHERE id = $1`, [
        idarg || null
    ]);
};

module.exports.getIdSig = function(idarg) {
    return db.query(`SELECT id FROM signatures WHERE user_id = $1`, [
        idarg || null
    ]);
};
