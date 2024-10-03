//Need to update route, fields ,"id" to be consistant across the web app

const router = require('express').Router();
let Campground = require('../models/campground.model');

//GET all campgrounds
router.route('/').get((req, res) =>{ 
    Campground.find()
        .then(campgrounds => res.json(campgrounds))
        .catch(err => res.status(400).json('Error: ' + err));
})

//POST a campground
router.route('/add').post((req, res) => {
    const{latitude, longitude, code, name, type, phone, dates_open, comments, num_sites, elevation, ammenities, state, nearest_town_distance, nearest_town_bearing, city} = req.body;

    const newCampground = new Campground({
        latitude,
        longitude,
        code,
        name,
        type,
        phone, 
        dates_open,
        comments,
        num_sites,
        elevation,
        ammenities,
        state,
        nearest_town_distance,
        nearest_town_bearing,
        city
    });

    newCampground.save()
        .then(() => res.json('Campground added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

//GET a specific campground details
router.route('/:id').get((req, res) => {
    Campground.findById(req.params.id)
      .then(campground => res.json(campground))
      .catch(err => res.status(400).json('Error: ' + err));
  })

  //DELETE a campground
  router.route('/:id').delete((req,res ) => {
  Campground.findByIdAndDelete(req.params.id)
    .then(() => res.json('Book deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
    });

// UPDATE a Campground
router.route('/update/:id').post((req, res) => {
    Campground.findById(req.params.id)
      .then(campground => {
        campground.latitude = Number(req.body.latitude);
        campground.longitude = Number(req.body.author);
        campground.code = req.body.code;
        campground.name = req.body.code;
        campground.type = req.body.type;
        campground.phone = req.body.phone;
        campground.dates_open = req.body.dates_open;
        campground.comments = req.body.comments;
        campground.num_sites = Number(req.body.num_sites);
        campground.elevation = Number(req.body.elevation);
        campground.ammenities = req.body.ammenities;
        campground.state = req.body.state;
        campground.nearest_town_distance = Number(req.body.nearest_town_distance);
        campground.nearest_town_bearing = Number(req.body.nearest_town_bearing);
        campground.city = req.body.city;
  
        campground.save()
          .then(() => res.json('Book updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });

module.exports = router;