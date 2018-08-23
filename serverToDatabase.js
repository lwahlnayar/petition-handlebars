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
                ON user_profiles.user_id = signatures.user_id`
        )
        .then(results => {
            return results.rows;
        });
};

module.exports.getUserEditData = function(idarg) {
    return db
        .query(
            `SELECT
           users.first_name,
           users.last_name,
           users.email,
           users.password,
           user_profiles.homepage,
           user_profiles.city,
           user_profiles.age
           FROM users
           JOIN user_profiles
              ON users.id = user_profiles.user_id
           WHERE user_profiles.user_id = $1`,
            [idarg || null]
        )
        .then(results => {
            return results.rows[0];
        });
};
/////////////////////////////////////////////////////////////
//////////////////////////EDIT QUERY FUNCTIONS /////////////
module.exports.updateUserTable = function(firstname, lastname, email, id) {
    return db.query(
        `UPDATE users
             SET first_name = $1, last_name = $2, email = $3
             WHERE id = $4;
            `,
        [firstname || null, lastname || null, email || null, id || null]
    );
};

module.exports.updateUserTablePw = function(
    firstname,
    lastname,
    email,
    password,
    id
) {
    return db.query(
        `UPDATE users
                 SET first_name = $1, last_name = $2, email = $3, password = $4
                 WHERE id = $5;
            `,
        [
            firstname || null,
            lastname || null,
            email || null,
            password || null,
            id || null
        ]
    );
};

module.exports.upsertUserProfiles = function(homepage, city, age, id) {
    return db.query(
        `INSERT INTO user_profiles (homepage, city, age, user_id)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id)
           DO UPDATE SET homepage = $1, city = $2, age = $3;
          `,
        [homepage || null, city || null, age || null, id]
    );
};

/////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

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

module.exports.getNames = function(idarg) {
    return db.query(`SELECT first_name, last_name FROM users WHERE id = $1`, [
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

module.exports.getCitySigs = function(cityarg) {
    return db
        .query(
            `SELECT
         users.first_name,
         users.last_name,
         user_profiles.age,
         user_profiles.city,
         user_profiles.homepage
         FROM user_profiles
         JOIN users
          ON users.id = user_profiles.user_id
         WHERE user_profiles.city = $1`,
            [cityarg || null]
        )
        .then(results => {
            return results.rows;
        });
};

module.exports.deleteSigRow = function(sigId) {
    return db.query(`DELETE FROM signatures WHERE id = $1;`, [sigId]);
};
