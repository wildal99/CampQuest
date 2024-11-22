import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useParams, Link } from 'react-router-dom';
import '../App.css';
import '../DetailsPage.css';

const CampView = () => {
  const { id } = useParams();
  const [camp, setCamp] = useState(null);
  const [similarCamps, setSimilarCamps] = useState([]);

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

  // Decode amenities
  const decodeAmenities = (amenities) =>
    amenities
      ?.split(' ')
      .map((code) => amenitiesMap[code] || code)
      .join(', ') || 'N/A';

  // Decode campground type
  const decodeType = (type) => campgroundTypeMap[type] || 'N/A';

  // Compute distance between two geographical points
  const computeDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371; // Earth radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

  // Fetch similar campgrounds
  useEffect(() => {
    if (camp) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/camps`)
        .then((response) => {
          const otherCamps = response.data.filter((other) => other._id !== id);
          const similarities = otherCamps.map((other) => ({
            ...other,
            similarity: computeDistance(
              camp.latitude,
              camp.longitude,
              other.latitude,
              other.longitude
            ),
          }));
          similarities.sort((a, b) => a.similarity - b.similarity);
          setSimilarCamps(similarities.slice(0, 4));
        })
        .catch((error) => console.error('Error fetching similar campgrounds:', error));
    }
  }, [camp, id]);

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
                <p>Loading similar campgrounds...</p>
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
