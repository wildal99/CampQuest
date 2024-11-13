import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const CampList = () => {
  const location = useLocation();
  const history = useHistory();

  // Initialize from URL parameters if available
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("search") || "";
  const initialPage = parseInt(queryParams.get("page")) || 1;

  const [camps, setCamp] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
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

  const fetchCamps = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/camps/search`, {
        params: {
          q: search,
          page,
          limit: campsPerPage
        }
      });

      console.log('API response:', response.data);

      const campgrounds = Array.isArray(response.data.campgrounds) ? response.data.campgrounds : [];
      setCamp(campgrounds);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(page);
      setLoading(false);

      // Update URL parameters
      history.push(`?search=${search}&page=${page}`);
    } catch (error) {
      console.log('Error fetching campgrounds:', error);
      setCamp([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps(initialPage, initialSearchTerm);
  }, [initialPage, initialSearchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCamps(1, searchTerm); // Reset to first page on new search
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchCamps(currentPage + 1, searchTerm);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchCamps(currentPage - 1, searchTerm);
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