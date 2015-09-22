"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development';

module.exports = {
  find_all: function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + ";";

     db.all(statement, function(err, record) {
      if (callback) callback(err, record);
      db.close();
    });
  },

  find_subset: function(column, limit, offset, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " ORDER BY " + column + " LIMIT " + limit + " OFFSET " + offset + ";";

    db.all(statement, function(err, record) {
      if (callback) callback(err, record);
      db.close();
    });
  },

  find_by: function(column, value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM " + this.table_name + " WHERE " + column + "= ?;";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  customer_rentals: function(value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');

    var statement = "SELECT 'movies'.* FROM 'movies' INNER JOIN 'rentals' ON 'movies'.'id' = 'rentals'.'movie_id' WHERE 'rentals'.'customer_id' = ? AND 'rentals'.'returned_date' = '';";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  customer_history: function(value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');

    var statement = "SELECT 'movies'.'title' FROM 'movies' INNER JOIN 'rentals' ON 'movies'.'id' = 'rentals'.'movie_id' WHERE 'rentals'.'customer_id' = ? AND 'rentals'.'returned_date' != '';";
    var statement2 = "SELECT 'rentals'.'returned_date' FROM 'rentals' INNER JOIN 'customers' ON 'customers'.'id' = 'rentals'.'customer_id' WHERE 'rentals'.'customer_id' = ? AND 'rentals'.'returned_date' != '';";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      console.log(res);
      db.close();
    });
  },

  movie_current_customers: function(value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');

    var statement = "SELECT 'customers'.* FROM 'customers' INNER JOIN 'rentals' ON 'customers'.'id' = 'rentals'.'customer_id' WHERE 'rentals'.'movie_id' = (SELECT 'movies'.'id' FROM 'movies' WHERE 'movies'.'title' = ? COLLATE NOCASE LIMIT 1) AND 'rentals'.'returned_date' = '';";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  movie_past_customers: function(value, column, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT 'customers'.* FROM 'customers' INNER JOIN 'rentals' ON 'customers'.'id' = 'rentals'.'customer_id' WHERE 'rentals'.'movie_id' = (SELECT 'movies'.'id' FROM 'movies' WHERE 'movies'.'title' = ? COLLATE NOCASE LIMIT 1) AND 'rentals'.'returned_date' != '' ORDER BY " + column + ";";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  movie_details: function(value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT * FROM movies WHERE title = ? COLLATE NOCASE;";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  customers: function(value, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    var statement = "SELECT 'customers'.* FROM 'customers' INNER JOIN 'rentals' ON 'customers'.'id' = 'rentals'.'customer_id' WHERE 'rentals'.'movie_id' = (SELECT 'movies'.'id' FROM 'movies' WHERE 'movies'.'title' = ? COLLATE NOCASE LIMIT 1) AND 'rentals'.'returned_date' = '';";

    db.all(statement, value, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  },

  overdue: function(callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');

    //var today = new Date().toISOString().slice(0, 10); //gets date in SQL format for comparison
    var today = new Date(); // sets today to today

    var date_conversion = today.setDate(today.getDate() - 10); //

    var overdue_date = new Date(date_conversion).toISOString().slice(0, 10);
    console.log(overdue_date);

    var statement = "SELECT 'customers'.* FROM 'customers' INNER JOIN 'rentals' ON 'customers'.'id' = 'rentals'.'customer_id' WHERE 'rentals'.'returned_date' = '' AND 'rentals'.'checked_out' < '" + overdue_date + "';";

    db.all(statement, function(err, res) {
      if (callback) callback(err, res);
      db.close();
    });
  }
}
