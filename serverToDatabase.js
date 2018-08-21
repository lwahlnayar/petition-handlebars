const spicedPg = require("spiced-pg");

//Makes connection from server to database
const db = spicedPg("postgres:Rodney:postgres@localhost:5432/signaturesDb");

module.exports.getAllData = function() {
    return db
        .query(
            `SELECT
           users.id,
           users.first_name,
           users.last_name,
           user_profiles.homepage,
           user_profiles.city,
           user_profiles.age,
           signatures.signature
           FROM users
           JOIN user_profiles
              ON users.id = user_profiles.user_id
           JOIN signatures
              ON user_profiles.user_id = signatures.user_id `
        )
        .then(results => {
            // console.log("getSigners returns-> ____", results.rows);
            return results.rows;
        });
};

module.exports.pushSigs = function(sigarg, idarg) {
    return db.query(
        `INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING id`,
        [sigarg || null, idarg || null]
    );
};

module.exports.pushProfile = function(age, city, homepage, idarg) {
    return db.query(
        `INSERT INTO user_profiles (age, city, homepage, user_id) VALUES ($1, $2, $3, $4) RETURNING id`,
        [age || null, city || null, homepage || null, idarg]
    );
};

module.exports.createUser = function(
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

module.exports.getSignature = function(idarg) {
    return db.query(`SELECT signature FROM signatures WHERE id = $1`, [idarg]);
};

module.exports.countSignatures = function() {
    return db.query(`SELECT count(*) FROM signatures`);
};

module.exports.getIdSig = function(idarg) {
    return db.query(`SELECT id FROM signatures WHERE user_id = $1`, [
        idarg || null
    ]);
};
