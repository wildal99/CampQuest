import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const CampList = () => {
  const [camps, setCamp] = useState([]); // Initialize as an array
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");  // New state for search
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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

  const campgroundTypeMap = {
    CP: 'County Park',
    COE: 'Corps of Engineers',
    NP: 'National Park',
    NF: 'National Forest',
    SP: 'State Park',
    PP: 'Provincial Park',
    RV: 'RV Park',
    BML: 'Bureau of Land Management'
  };

  const fetchCamps = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/camps/search`, {
        params: {
          q: searchTerm,
          page,
          limit: campsPerPage
        }
      });
      console.log('API response:', response.data); // Debugging line

      const campgrounds = Array.isArray(response.data.campgrounds) ? response.data.campgrounds : [];
      setCamp(campgrounds);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching campgrounds:', error);
      setCamp([]); // Ensure camps is an empty array on error
      setLoading(false);
    }
  };
  
  // Fetch camps on initial load
  useEffect(() => {
    fetchCamps();
  }, [selectedAmenities]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCamps(1); // Reset to first page on new search
  };
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedAmenities((prevSelectedAmenities) => {
      if (checked) {
        // Add the selected amenity if it is checked
        return [...prevSelectedAmenities, value];
      } else {
        // Remove the unselected amenity if it is unchecked
        return prevSelectedAmenities.filter((amenity) => amenity !== value);
      }
    });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchCamps(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchCamps(currentPage - 1);
    }
  };

  return (
    <div className="camp-list">
      <form onSubmit={handleSearchSubmit}>
        <input
          className="searchText"
          type="text"
          placeholder="Search camps by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

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
      
    
      {loading ? (
        <p>Loading camps...</p>
      ) : (
        <div className="camp-cards-container">
          {camps.length > 0 ? (
            camps.map(camp => {
              const decodedType = campgroundTypeMap[camp.campgroundType] || camp.campgroundType;
              return (
                <Link to={"/view/" + camp._id} key={camp._id}>
                  <div className="camp-card">
                    <div className="camp-info">
                      <h2 className="camp-title">{camp.campgroundName}</h2>
                      <h4 className="camp-cord">City: {camp.city} | State: {camp.state} | Type: {decodedType}</h4>
                      <div className="camp-actions">View</div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p>No camps available</p>
          )}
        </div>
      )}

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>&lt;</button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>&gt;</button>
      </div>
    </div>
  );
};

export default CampList;