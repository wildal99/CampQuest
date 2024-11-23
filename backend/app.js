import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useParams, Link } from 'react-router-dom';
import '../App.css';
import '../DetailsPage.css';
import ReviewList from './reviews/ReviewList';

const CampView = () => {
  const { id } = useParams();
  const [camp, setCamp] = useState(null);
  const [similarCamps, setSimilarCamps] = useState([]);
  const [allCamps, setAllCamps] = useState([]);

  const amenitiesMap = {
    E: 'Electricity',
    DP: 'Dump Station',
    DW: 'Drinking Water',
    SH: 'Showers',
    RS: 'Restrooms',
    PA: 'Pets Allowed',
    NP: 'No Pets',
    PT: 'Pit Toilet',
    NH: 'No Hookups',
    L$: 'Free or under $12',
    ND: 'No Dump Station',
    WE: 'Water Electricity',
    WES: 'Water Electricity Sewer',
  };

  const campgroundTypeMap = {
    CP: 'County Park',
    COE: 'Corps of Engineers',
    NP: 'National Park',
    NF: 'National Forest',
    SP: 'State Park',
    PP: 'Provincial Park',
    RV: 'RV Park',
    BML: 'Bureau of Land Management',
  };

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
  };

  // Helper Functions
  const decodeAmenities = (amenities) =>
    amenities
      ?.split(' ')
      .map((code) => amenitiesMap[code] || code)
      .join(', ') || 'N/A';

  const decodeType = (type) => campgroundTypeMap[type] || 'N/A';

  const computeDistance = (latCurr, longCurr, latCamp, longCamp) => {
    const findRadians = (degrees) => degrees * (Math.PI / 180);
    return Math.acos(
      Math.sin(findRadians(latCurr)) * Math.sin(findRadians(latCamp)) +
      Math.cos(findRadians(latCurr)) * Math.cos(findRadians(latCamp)) *
      Math.cos(findRadians(longCamp) - findRadians(longCurr))
    ) * 6371;
  };

  const computeAmenities = (self, other) => {
    let score = 0;
    if (!self.amenities || !other.amenities) return score;
    
    const campAmenities = self.amenities.split(" ");
    const otherAmenities = other.amenities.split(" ");

    campAmenities.forEach(amenity => {
      if (!otherAmenities.includes(amenity)) {
        score += 1;
      }
    });

    return score;
  };

  const findSimilar = (self, others) => {
    if (!self || !others) return [];
    
    return others
      .map(other => ({
        ...other,
        similarity: computeDistance(
          self.latitude,
          self.longitude,
          other.latitude,
          other.longitude
        ) + computeAmenities(self, other) * 7.5
      }))
      .sort((a, b) => a.similarity - b.similarity)
      .slice(0, 5); // Get top 5 similar camps
  };

  // Fetch camp details
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/camps/${id}`)
      .then((response) => {
        setCamp(response.data);
      })
      .catch((error) => console.error('Error fetching campground details:', error));
  }, [id]);

  // Fetch all camps for similarity comparison
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/camps`)
      .then((response) => {
        setAllCamps(response.data);
      })
      .catch((error) => console.error('Error fetching all camps:', error));
  }, []);

  // Calculate similar camps whenever camp or allCamps changes
  useEffect(() => {
    if (camp && allCamps.length > 0) {
      const filteredCamps = allCamps.filter(c => c._id !== camp._id);
      const similar = findSimilar(camp, filteredCamps);
      setSimilarCamps(similar);
    }
  }, [camp, allCamps]);

  const center = camp
    ? {
        lat: parseFloat(camp.latitude),
        lng: parseFloat(camp.longitude),
      }
    : { lat: 0, lng: 0 };

  return (
    <div className="view-camp-container">
      {camp ? (
        <>
          {/* Map and Camp Details */}
          <div className="map-camp-section">
            <div className="map-container">
              <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
            </div>
            <div className="camp-details">
              <h1>{camp.campgroundName}</h1>
              <p><strong>Location:</strong> {camp.latitude || 'N/A'}, {camp.longitude || 'N/A'}</p>
              <p><strong>City:</strong> {camp.city || 'N/A'}</p>
              <p><strong>State:</strong> {camp.state || 'N/A'}</p>
              <p><strong>Campground Type:</strong> {decodeType(camp.campgroundType)}</p>
              <p><strong>Campground Amenities:</strong> {decodeAmenities(camp.amenities)}</p>
              <p><strong>Phone:</strong> {camp.phoneNumber || 'N/A'}</p>
              <p><strong>Number of Sites:</strong> {camp.numSites || 'N/A'}</p>
              <p><strong>Dates Open:</strong> {camp.datesOpen || 'N/A'}</p>
              <Link to="/">Back</Link>
            </div>
          </div>

          <div className="review-section">
            <h2>Leave a Review</h2>
            <ReviewList campgroundId={id} />
          </div>

          {/* Similar Campgrounds */}
          <div className="similar-campgrounds">
            <h2>Similar Campgrounds</h2>
            <div className="campgrounds">
              {similarCamps.length > 0 ? (
                similarCamps.map((similarCamp) => (
                  <Link to={`/view/${similarCamp._id}`} key={similarCamp._id}>
                    <div className="camping-card">{similarCamp.campgroundName}</div>
                  </Link>
                ))
              ) : (
                <>
                  <div className="camping-card">Loading Camp 1</div>
                  <div className="camping-card">Loading Camp 2</div>
                  <div className="camping-card">Loading Camp 3</div>
                  <div className="camping-card">Loading Camp 4</div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Loading camp details...</p>
      )}
    </div>
  );
};

export default CampView;