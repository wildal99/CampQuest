import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const CampList = () => {
  const [camps, setCamp] = useState([]); // Initialize as an array
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const campsPerPage = 12;

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

  useEffect(() => {
    const fetchCamps = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/camps`, {
          params: {
            page: currentPage,
            limit: campsPerPage
          }
        });

        console.log('API response:', response.data); // Debugging line

        // Ensure that camps is always an array
        const campgrounds = Array.isArray(response.data.campgrounds) ? response.data.campgrounds : [];
        setCamp(campgrounds);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching campgrounds:', error);
        setCamp([]); // Ensure camps is an empty array on error
        setLoading(false);
      }
    };
    fetchCamps();
  }, [currentPage]);

  const filteredCamps = Array.isArray(camps) ? camps.filter(camp =>
    camp.campgroundName.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const nextPage = () => {
    if (currentPage < totalPages) {
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
      <input
        className="searchText"
        type="text"
        placeholder="Search camps by name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading camps...</p>
      ) : (
        <div className="camp-cards-container">
          {filteredCamps.length > 0 ? (
            filteredCamps.map(camp => {
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