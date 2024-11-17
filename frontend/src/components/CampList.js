import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const CampList = () => {
  const [camps, setCamp] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");  // New state for search
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const campsPerPage = 12;
  
  /* Amenities List */
  const amenitiesList = [ 
    { code: 'NH', label: 'No Hookups'},
    { code: 'E', label: 'Electric'},
    { code: 'WE', label: 'Water & Electric'},
    { code: 'WES', label: 'Water, Electric & Sewer'},
    { code: 'DP', label: 'Dump'},
    { code: 'ND', label: 'No Dump'},
    { code: 'FT', label: 'Flush'},
    { code: 'VT', label: 'Vault'},
    { code: 'PT', label: 'Pit'},
    { code: 'NT', label: 'No Toilets'},
    { code: 'DW', label: 'Drinking Water'},
    { code: 'NW', label: 'No Drinkng Water'},
    { code: 'SH', label: 'Showers'},
    { code: 'NS', label: 'No Showers'},
    { code: 'RS', label: 'Accepts Reservations'},
    { code: 'NR', label: 'No Reservations'},
    { code: 'PA', label: 'Pets Allowed'},
    { code: 'NP', label: 'No Pets Allowed'},
    { code: 'L$', label: 'Free or Under $12'}

  ]

  // Fetch campgrounds from backend
  useEffect(() => {
    axios.get('http://localhost:5000/camps/')
      .then(response => {
        setCamp(response.data);
      })
      .catch((error) => {
        console.log('Error fetching campgrounds:', error);
      });
  }, [selectedAmenities]);

  //Function to handle the amenity change toggle
  const handleFilterChange = (e) => {
    const amenity = e.target.value;
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(item => item !== amenity);
      }
      else{
        return [...prev, amenity];
      }
    });
  };

  //Filter by the selected amenities
  const filterByAmenities = (camps) => {
    return camps.filter(camp => 
      selectedAmenities.every(amenity => camp.amenities.includes(amenity))
      );
  };

  // Filter camps based on search term
  const filteredCamps = camps.filter(camp =>
    camp.campgroundName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastCamp = currentPage * campsPerPage;
  const indexOfFirstCamp = indexOfLastCamp - campsPerPage;
  const currentCamps = filteredCamps.slice(indexOfFirstCamp, indexOfLastCamp);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCamps.length / campsPerPage)) {
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

      {/*  Amenity Filters */}
      <div className="amenities-filter">
        <h4>Filter By Amenities</h4>
        {amenitiesList.map((amenity) => (
          <label key ={amenity.code}>
            <input 
            type = "checkbox"
            value = {amenity.code}
            checked = {selectedAmenities.includes(amenity.code)}
            onChange = {handleFilterChange} 
            />
            {amenity.label}
          </label>
        ))}
      </div>

      {/* Search input */}
      <input className="searchText"
        type="text"
        placeholder="Search camps by name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      
      <div className="camp-cards-container">
        {currentCamps.length > 0 ? (
          currentCamps.map(camp => (
            <Link to = {"/view/" + camp._id} >
            <div key={camp._id} className="camp-card">
              <div className="camp-info">
                <h2 className="camp-title">{camp.campgroundName}</h2>
                <h4 className="camp-cord">City: {camp.city} | State: {camp.state} | Type: {camp.campgroundType}</h4>
                <div className="camp-actions">
                  View
                </div>
              </div>
            </div>
            </Link>
          ))
        ) : (
          <p>No camps available</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>&lt;</button>
        <span> Page {currentPage} of {Math.ceil(filteredCamps.length / campsPerPage)} </span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredCamps.length / campsPerPage)}>&gt;</button>
      </div>
    </div>
  );
}

export default CampList;