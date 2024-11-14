import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../App.css';
import '../DetailsPage.css';

const CampView = () => {
  console.log("hello from campview.")

  const { id } = useParams(); // Get the campground ID from the URL
  const [camp, setCamp] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [campsList, setCampList] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/camps/${id}`)
      .then(response => {
        setCamp(response.data);
      })
      .catch((error) => {
        console.log('Error fetching campground details:', error);
      });
  }, [id]);

  useEffect(() => {
    axios.get('http://localhost:5000/camps/')
      .then(response => {
        setCampList(response.data);
      })
      .catch((error) => {
        console.log('Error fetching similar campgrounds:', error);
      });
  }, []);  

console.log(campsList);


return(
    <div className="view-camp-container">
      {camp ? (
        <>
        {/* Section for Map and Camp Details */}
        <div className = "map-camp-section" >
        <div className = "map-container">
          <div className = "map-placeholder">
          </div>
          </div>

        <div className="camp-details">
          <h1>{camp.campgroundName}</h1>
          <p><strong>Location:</strong> {camp.latitude}, {camp.longitude}</p>
          <p><strong>City:</strong> {camp.city}</p>
          <p><strong>State:</strong> {camp.state}</p>
          <p><strong>Campground Type:</strong> {camp.campgroundType}</p>
          <p><strong>Phone:</strong> {camp.phoneNumber}</p>
          <p><strong>Number of Sites:</strong> {camp.numSites}</p>
          <p><strong>Dates Open:</strong> {camp.datesOpen || 'N/A'}</p>
          <Link to={"/"}>Back</Link>
        </div>
        </div>

        {/* Review Section */}
        <div className = "review-section">
          <h2> Leave a Review </h2>
          <textarea placeholder = "Leave a review..." />
          <button> Submit </button>
        </div>


        {/* Similar Campgrounds */}
        <div className = "similar-campgrounds">
          <h2> Similar Campgrounds </h2>
          <div className = "campgrounds">


            <div className = "camping-card"></div>
            <div className = "camping-card">Campground 2</div>
            <div className = "camping-card">Campground 3</div>
            <div className = "camping-card">Campground 4</div>
          </div>
        </div> 
        </> 
      ) : (
        <p>Loading camp details...</p>
      )}
      
    </div>
    );

  }

export default CampView;

function findSimilarity(self, others){
  return others.map( othr=> {
    const distance = computeDistance(self.latitude, self.longitude, othr.latitude, othr.longitude);
    return {campgroundName: othr.campgroundName, campgroundCode: othr.campgroundCode,longitude: 
      othr.longitude, latitude: othr.latitude, phoneNumber: othr.phoneNumber, campgroundType: othr.campgroundType,
      numSites: othr.numSites, datesOpen: othr.datesOpen, similarity: distance}
  });
}

function computeDistance(latCurr, longCurr, latCamp, longCamp){
  let dist= Math.acos((Math.sin(findRadians(latCurr)) * Math.sin(findRadians(latCamp))) + (Math.cos(findRadians(latCurr)) * Math.cos(findRadians(latCamp))) * (Math.cos(findRadians(longCamp) - findRadians(longCurr)))) * 6371;

  return dist
}


// convert degrees to radians.
function findRadians(degrees)
{
  return degrees * (Math.pi/180);
}

