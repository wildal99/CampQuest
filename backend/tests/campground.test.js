const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app'); 
const Campground = require('../models/campground_model');

describe('Campground API', () => {
    beforeAll(async () => {
      const uri = process.env.TEST_MONGO_URI;
      await mongoose.connect(uri);
    });
  
    afterAll(async () => {
      await mongoose.connection.close();
    });
  
    let campgroundId;
  
    it('GET /camps should return campgrounds with pagination info', async () => {
      const res = await request(app).get('/camps').query({ page: 1, limit: 2 });
  
      expect(res.status).toBe(200);
  
      expect(res.body).toHaveProperty('campgrounds');
      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('currentPage');
  
      expect(Array.isArray(res.body.campgrounds)).toBe(true);
  
      expect(res.body.currentPage).toBe(1);
  }, 10000);
  
    // Test POST a campground
    it('POST /camps/add should add a campground', async () => {
      const newCampground = {
        campgroundName: 'Test Campground',
        campgroundCode: 'TC001',
        longitude: 123.45,
        latitude: 67.89,
        phoneNumber: '1234567890',
        campgroundType: 'National Park',
        numSites: 50,
        datesOpen: '2024-01-01 to 2024-12-31',
        reviews : [
          { content: 'Great place!' },
          { content: 'Loved it here.' },
          { content: 'Too crowded for me.' }
        ]
      };
  
      const res = await request(app).post('/camps/add').send(newCampground);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('campground');
      expect(res.body).toHaveProperty('message');
  
      const campground = await Campground.findOne({ campgroundName: 'Test Campground' });
      campgroundId = campground._id;
    });
  
    it('GET /camps/:id should return a specific campground', async () => {
      const res = await request(app).get(`/camps/${campgroundId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', campgroundId.toString());
    });

    it('POST /camps/update/:id should update a campground', async () => {
      const updatedCampground = {
        campgroundName: 'Updated Campground',
        campgroundCode: 'UC001',
        longitude: 98.76,
        latitude: 54.32,
        phoneNumber: '0987654321',
        campgroundType: 'State Park',
        numSites: 100,
        datesOpen: '2024-02-01 to 2024-11-30'
      };
  
      const res = await request(app).post(`/camps/update/${campgroundId}`).send(updatedCampground);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('campground');
      expect(res.body).toHaveProperty('message');
    });

    it('GET /camps/:id/reviews should return paginated reviews', async () => {
      const res = await request(app).get(`/camps/${campgroundId}/reviews`).query({ page: 1, limit: 2 });
  
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('reviews');
      expect(res.body.reviews.length).toBe(2); 
      expect(res.body).toHaveProperty('totalPages', 2); 
    });

    it('GET /camps/:id/reviews should return the correct page of reviews', async () => {
      const res = await request(app).get(`/camps/${campgroundId}/reviews`).query({ page: 2, limit: 2 });
  
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('reviews');
      expect(res.body.reviews.length).toBe(1); 
      expect(res.body.reviews[0].content).toBe('Too crowded for me.');
    });

    it('GET /camps/:id/reviews should return 404 if campground not found', async () => {
      const res = await request(app).get(`/camps/674095c572757bef7f3f65f4/reviews`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Campground not found');
    });

    it('POST /camps/:id/reviews should add a review to the campground', async () => {
      const reviewContent = { content: 'Amazing place!' };
      const res = await request(app).post(`/camps/${campgroundId}/reviews`).send(reviewContent);
  
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Review submitted successfully');
  
      const campground = await Campground.findById(campgroundId);
      expect(campground.reviews.length).toBe(4);
      expect(campground.reviews[3].content).toBe('Amazing place!');
    });
  
    it('POST /camps/:id/reviews should return 404 if campground not found', async () => {
      const reviewContent = { content: 'Amazing place!' };
      const res = await request(app).post('/camps/674095c572757bef7f3f65f4/reviews').send(reviewContent);
  
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Campground not found');
    });
  
    it('DELETE /camps/:id should delete a campground', async () => {
      const res = await request(app).delete(`/camps/${campgroundId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });


  });