const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Campground = require('../models/campground_model');

describe('Campground API', () => {
    beforeAll(async () => {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);
    })
    afterAll(async () => {
        await mongoose.connection.close();
    })

    it('should return all campgrounds with no filters selected', async () => {
        const res = await request(app).get('/camps');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    })

    it('should return campgrounds with one filter selected', async () => {
        const res = await request(app).get('/camps?amenities=DW');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);


        const matchingCampground = res.body.every(campground => campground.amenities.includes('DW'));
        expect(matchingCampground).toBe(true);
    });

    it('should return campgrounds with multiple filters', async () => {
        const res = await request(app).get('/camps?amenities=SH,E');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

        
        const matchingCampgrounds = res.body.every(campground => 
            campground.amenities.includes('SH') && campground.amenities.includes('E'));
        expect(matchingCampgrounds).toBe(true);
    })

    it('should return "No matching campgrounds', async () => {
        const res = await request(app).get('/camps?amenities=ZZ,GB');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('No matching campgrounds.');

    }) 
});
