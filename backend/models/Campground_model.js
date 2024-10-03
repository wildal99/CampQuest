const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    campgroundName: {
        type: String,
        required: true
    },
    campgroundCode: {
        type: String,
        requried: false
    },
    longitude: {
        type: Decimal128,
        required: true
    },
    latitude: {
        type: Decimal128,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    campgroundType: {
        type: String,
        required: false
    },
    numSites: {
        type: Int32,
        required: false
    },
    datesOpen: {
        type: String,
        required: false
    }
    

});

const Campground = mongoose.model('Campground', campgroundSchema);
module.exports = Campground;