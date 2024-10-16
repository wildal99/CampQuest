import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const CampList = () => {
  const [camps, setCamp] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const campsPerPage = 20;

  // Fetch campgrounds from backend
  useEffect(() => {
    axios.get('http://34.237.102.85:5000/camps/')
      .then(response => {
        setCamp(response.data);
      })
      .catch((error) => {
        console.log('Error fetching campgrounds:', error);
      });
  }, []);

  // Get current camps
  const indexOfLastCamp = currentPage * campsPerPage;
  const indexOfFirstCamp = indexOfLastCamp - campsPerPage;
  const currentCamps = camps.slice(indexOfFirstCamp, indexOfLastCamp);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(camps.length / campsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="camp-list">
      <h1>Camps</h1>
      <div className="camp-cards-container">
        {currentCamps.length > 0 ? (
          currentCamps.map(camp => (
            <div key={camp._id} className="camp-card">
              <div className="camp-info">
                <h2 className="camp-title">{camp.name}</h2>
                <h4 className="camp-cord">City: {camp.city} | State: {camp.state} | Type: {camp.type}</h4>
                <div className="camp-actions">
                  <Link to={"/view/" + camp._id}>View</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No camps available</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>&lt;</button>
        <span> Page {currentPage} of {Math.ceil(camps.length / campsPerPage)} </span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(camps.length / campsPerPage)}>&gt;</button>
      </div>
    </div>
  );
}

export default CampList;
