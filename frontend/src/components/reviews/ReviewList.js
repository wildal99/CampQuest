import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import './ReviewList.css';

const ReviewList = ({ campgroundId }) => {
  const [reviews, setReviews] = useState([]); // Initialize as an empty array
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/camps/${campgroundId}/reviews?page=${currentPage}&limit=5`)
      .then(response => {
        // Ensure reviews is always an array
        setReviews(response.data.reviews || []);
        setTotalPages(response.data.totalPages || 0);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.response?.data?.message || 'Error fetching updated reviews.');
        setReviews([]); // Set to empty array on error
        setIsLoading(false);
      });
  }, [campgroundId, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleReviewSubmitted = () => {
    setIsLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/camps/${campgroundId}/reviews?page=${currentPage}`)
    .then(response => {
      setReviews(response.data.reviews || []);
      setTotalPages(response.data.totalPages || 0);
      setIsLoading(false);
    })
    .catch(error => {
      setError(error.response?.data?.message || 'Error fetching updated reviews.');
      setReviews([]); // Set to empty array on error
      setIsLoading(false);
    });
  };
  
  return (
    <div className="review-list">
      {error && <p className="error-message">{error}</p>}
      <ReviewForm campgroundId={campgroundId} onReviewSubmitted={handleReviewSubmitted} />
      
      {isLoading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet. Be the first to leave a review!</p>
      ) : (
        <>
          {reviews.map(review => (
            <div key={review._id} className="review">
              <p>{review.content}</p>
            </div>
          ))}
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewList;