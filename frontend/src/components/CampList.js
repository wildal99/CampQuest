import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const CampList = () => {
  const [camps, setCamp] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/camps`)
      .then(response => {
        setCamp(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching campgrounds:', error);
        setLoading(false);
      });
  }, []);

  const filteredCamps = camps.filter(camp =>
    camp.campgroundName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCamp = currentPage * campsPerPage;
  const indexOfFirstCamp = indexOfLastCamp - campsPerPage;
  const currentCamps = filteredCamps.slice(indexOfFirstCamp, indexOfLastCamp);

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
          {currentCamps.length > 0 ? (
            currentCamps.map(camp => {
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
        <span> Page {currentPage} of {Math.ceil(filteredCamps.length / campsPerPage)} </span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredCamps.length / campsPerPage)}>&gt;</button>
      </div>
    </div>
  );
};

export default CampList;
