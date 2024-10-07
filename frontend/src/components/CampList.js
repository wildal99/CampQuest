import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'

const CampList = () => {
  const [camps, setCamp] = useState([]);

  // Fetch campgrounds from backend
  useEffect(() => {
    axios.get('http://localhost:5000/camps/')
      .then(response => {
        setCamp(response.data);
      })
      .catch((error) => {
        console.log('Error fetching campgrounds:', error);
      })
  }, []);


  return (
    <div className="camp-list">
      <h1>Camps</h1>
      {camps.length > 0 ? (
        camps.map(camp => (
          <div key={camp._id} className="camp-card">
            <div className="camp-info">
              <h2 className="camp-title">{camp.name}</h2>
              <h4 className='camp-cord'>City : {camp.city} State: {camp.state} Campground Type: {camp.type}</h4>
              <div className="camp-actions">
                <Link to={"/view/"+camp._id}>View</Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No camps available</p>
      )}
    </div>
  );
}

export default CampList;
