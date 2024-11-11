import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const CampList = () => {
  const [camps, setCamp] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCamps, setTotalCamps] = useState(0); // Track total camps for pagination
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

  const fetchCamps = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/camps`, {
        params: {
          page,
          limit: campsPerPage,
          search: searchTerm
        }
      });
      setCamp(response.data.camps); // Update to hold only current page's camps
      setTotalCamps(response.data.totalCamps); // Assuming backend sends total number of camps
      setLoading(false);
    } catch (error) {
      console.log('Error fetching campgrounds:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps(currentPage);
  }, [currentPage, searchTerm]);

  const nextPage = () => {
    if (currentPage < Math.ceil(totalCamps / campsPerPage)) {
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
                      <div className="camp-actions">
                        View
                      </div>
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
        <span> Page {currentPage} of {Math.ceil(totalCamps / campsPerPage)} </span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(totalCamps / campsPerPage)}>&gt;</button>
      </div>
    </div>
  );
};

export default CampList;