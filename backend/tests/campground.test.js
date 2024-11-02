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
  
    // Test GET all campgrounds
    it('GET /camps should return all campgrounds', async () => {
      const res = await request(app).get('/camps');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
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
        datesOpen: '2024-01-01 to 2024-12-31'
      };
  
      const res = await request(app).post('/camps/add').send(newCampground);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.stringContaining('Campground added!'));
  
      const campground = await Campground.findOne({ campgroundName: 'Test Campground' });
      campgroundId = campground._id;
    });
  
    it('GET /camps/:id should return a specific campground', async () => {
      const res = await request(app).get(`/camps/${campgroundId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', campgroundId.toString());
    });
  
    it('GET /camps/:id should return Eagle City County Park', async () => {
        const res = await request(app).get(`/camps/671e78e5b6d32a2a629bde31`);
        expect(res.status).toBe(200);
        expect(res.body.name).toEqual("Eagle City County Park");
        expect(res.body).toHaveProperty('_id', '671e78e5b6d32a2a629bde31');
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
      expect(res.body).toEqual(expect.stringContaining('Book updated!'));
    });
  
    it('DELETE /camps/:id should delete a campground', async () => {
      const res = await request(app).delete(`/camps/${campgroundId}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.stringContaining('Book deleted.'));
    });
  });