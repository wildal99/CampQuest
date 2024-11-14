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

console.log("raw list",campsList);

let similarCamps = findSimilar(camp, campsList);
console.log("similarly sorted list",similarCamps);



return(
    <div className="view-camp-container">
      {/* wait until camp details are loaded to display the camp */}
      {(camp)? (
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

          {/*render empty similar campgrounds until similar campgrounds are found (loaded)*/}

          { similarCamps[1] ?
          (  <>
            <div className = "camping-card">{similarCamps[1].campgroundName}</div>
            <div className = "camping-card">{similarCamps[2].campgroundName}</div>
            <div className = "camping-card">{similarCamps[3].campgroundName}</div>
            <div className = "camping-card">{similarCamps[4].campgroundName}</div>
          </>
          ) : (
            <>
            <div className = "camping-card">Loading Camp 1</div>
            <div className = "camping-card">Loading Camp 2</div>
            <div className = "camping-card">Loading Camp 3</div>
            <div className = "camping-card">Loading Camp 4</div>
            </>
          ) }
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


//Find the similarity scores of all campgrounds, sort the camp list based on similarity.
function findSimilar(self, others){

  //map similarity onto the camp list
  let campSimilarity =  others.map( othr=> {
    //find distance between two camps
    let distance = computeDistance(self.latitude, self.longitude, othr.latitude, othr.longitude);
    return {campgroundName: othr.campgroundName, campgroundCode: othr.campgroundCode,longitude: 
      othr.longitude, latitude: othr.latitude, phoneNumber: othr.phoneNumber, campgroundType: othr.campgroundType,
      numSites: othr.numSites, datesOpen: othr.datesOpen, similarity: distance}
  });
  //then sort the camp list by similarity
  console.log("soriting by similarity")
  campSimilarity.sort((a, b) => a.similarity - b.similarity);
  return campSimilarity
}

//compute the distance between two georaphical points.
function computeDistance(latCurr, longCurr, latCamp, longCamp){
  let dist= Math.acos((Math.sin(findRadians(latCurr)) * Math.sin(findRadians(latCamp))) + (Math.cos(findRadians(latCurr)) * Math.cos(findRadians(latCamp))) * (Math.cos(findRadians(longCamp) - findRadians(longCurr)))) * 6371
  return dist
}


// convert degrees to radians.
function findRadians(degrees)
{
  let rads = degrees *(Math.PI/180);
  return rads;
}

