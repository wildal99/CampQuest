const router = require('express').Router();
const Campground = require('../models/campground_model');

// Utility function to construct queries
const buildQuery = ({ amenities, types, states }) => {
  const query = {};

  if (amenities?.length) {
    query.amenities = {
      $in: amenities.map((amenity) => new RegExp(amenity, 'i')),
    };
  }

  if (types?.length) {
    query.campgroundType = { $in: types };
  }

  if (states?.length) {
    query.state = { $in: states };
  }

  return query;
};

// Utility function for pagination parameters
const getPaginationParams = (req) => ({
  page: parseInt(req.query.page) || 1,
  limit: parseInt(req.query.limit) || 12,
});

// GET all campgrounds with filters and pagination
router.get('/', async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req);
    const query = buildQuery({
      amenities: req.query.amenities?.split(','),
      types: req.query.types?.split(','),
      states: req.query.states?.split(','),
    });

    const campgrounds = await Campground.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCampgrounds = await Campground.countDocuments(query);

    res.json({
      campgrounds,
      totalPages: Math.ceil(totalCampgrounds / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching campgrounds', error: err });
  }
});

// SEARCH campgrounds by name with pagination
router.get('/search', async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req);
    const searchTerm = req.query.q || '';

    const query = searchTerm
      ? { campgroundName: { $regex: searchTerm, $options: 'i' } }
      : {};

    const campgrounds = await Campground.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalResults = await Campground.countDocuments(query);

    res.json({
      campgrounds,
      totalPages: Math.ceil(totalResults / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(400).json({ message: 'Error searching campgrounds', error: err });
  }
});

// POST a new campground
router.post('/add', async (req, res) => {
  try {
    const newCampground = new Campground(req.body);
    await newCampground.save();
    res.status(201).json({ message: 'Campground added!', campground: newCampground });
  } catch (err) {
    res.status(400).json({ message: 'Error adding campground', error: err });
  }
});

// GET a specific campground's details
router.get('/:id', async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res.status(404).json({ message: 'Campground not found' });
    }
    res.json(campground);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching campground details', error: err });
  }
});

// DELETE a campground
router.delete('/:id', async (req, res) => {
  try {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    if (!campground) {
      return res.status(404).json({ message: 'Campground not found' });
    }
    res.json({ message: 'Campground deleted.' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting campground', error: err });
  }
});

// UPDATE a campground
router.post('/update/:id', async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      return res.status(404).json({ message: 'Campground not found' });
    }

    Object.assign(campground, req.body);

    await campground.save();
    res.json({ message: 'Campground updated!', campground });
  } catch (err) {
    res.status(400).json({ message: 'Error updating campground', error: err });
  }
});

// GET reviews for a specific campground with pagination
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req);
    const campground = await Campground.findById(req.params.id).select('reviews');

    if (!campground) {
      return res.status(404).json({ message: 'Campground not found' });
    }

    const startIndex = (page - 1) * limit;
    const paginatedReviews = campground.reviews.slice(startIndex, startIndex + limit);

    res.json({
      reviews: paginatedReviews,
      totalPages: Math.ceil(campground.reviews.length / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err });
  }
});

// POST a review for a specific campground
router.post('/:id/reviews', async (req, res) => {
  try {
    const { content } = req.body;
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
      return res.status(404).json({ message: 'Campground not found' });
    }

    campground.reviews.push({ content });
    await campground.save();

    res.status(201).json({ message: 'Review submitted successfully', review: { content } });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting review', error: err });
  }
});

module.exports = router;
