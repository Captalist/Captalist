const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db_file_loc = path.join(__dirname, "client.db")
const users_signed_in = (callback) => {
    // open the database
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    let query = `SELECT server_id, name, password FROM users WHERE signed_in=?`;
    db.get(query, [1], (err, row) => {
        if (err) {
          console.log("WE ARE IN USERS SIGNED IN")
          return console.log(err.message);
        }
        callback(row)
    });
    db.close();
}

const user_exist = (id, callback)=> {
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    let query = `select id from users where server_id=?`
    db.get(query, [id], (err, row) => {
        if (err){
            console.log("WE ARE IN USER EXIST")
            return console.log(err.message);
        }
        if (row){
            callback(true);
        }else {
            callback(false);
        }
    })
}

const create_user = (id, name, password, callback) => {
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    db.run(`insert into users (server_id, name, password, signed_in) values (?,?,?, 0)`, [id, name, password], (err)=>{
        if (err){
            console.log("WE ARE IN CREATE USER")
            console.log(err.message);
        }

        callback()
    })
}

const sign_out =  (callback) => {
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    db.run(`update users set signed_in=? where signed_in=?`, [0, 1], function(err) {
        if (err) {
          console.log("WE ARE IN SIGNOUT")
          return console.log(err.message);
        }

        callback();
    });
    db.close()
}

const sign_in = (name, password, callback) => {
    let db = new sqlite3.Database(db_file_loc, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    db.run(`update users set signed_in=? where name=? and password=?`,[1, name, password], function(err){
        if (err) {
            console.log("We ARE IN SIGNIN")
            return console.log(err.message);
        }
        callback();
    })
}

module.exports = {
    users_signed_in: users_signed_in,
    sign_out: sign_out,
    sign_in: sign_in,
    user_exist: user_exist, 
    create_user: create_user
}