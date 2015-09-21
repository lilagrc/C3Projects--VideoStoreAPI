var express = require('express');
var router = express.Router();

var movie_exports = require('../controllers/movies');

/* GET home page. */
router.get('/', function(req, res, next) {
  //return list of all movies
  return movie_exports.moviesController.index(req, res);
});

router.get('/one_movie', function(req, res, next) {
  // return one customer based on title
  //return customer_exports.customerController.one_customer(req, res);
});

//movies/:title/current_rentals
router.get('/:movie_title/current_rentals', function(req, res, next) {
  return movie_exports.moviesController.current_rentals(req, res, req.params.movie_title);
});

// movies/name/1
router.get('/:column/:number', function(req, res, next) {
  return movie_exports.moviesController.subset(req, res, req.params.column, req.params.number);
});

// one movies/title/customers will return customer info
// another movie/title will return movie info


module.exports = router;
