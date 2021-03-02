import React, { useEffect, useState } from 'react';
import axios from 'axios';
import header from '../../../../config.js';
import SortForm from './SortForm.jsx';
import ReviewsList from './ReviewsList.jsx';
import PostReviewForm from './PostReviewForm.jsx';
import Ratings from './Ratings/Ratings.jsx';

const Reviews = (props) => {
  const [filters, setFilters] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [amountOfReviews, addReviews] = useState(2);
  const [sortParameters] = useState(['relevance', 'newest', 'helpful']);
  const [selectedParameter, updateParam] = useState('relevance');
  const [isPosting, togglePosting] = useState(false);
  const [isDisplayingMoreReviewsButton, setIsdisplayingMoreReviewsButton] = useState(false);
  useEffect(() => {
    if (props.currentProduct) {
      getReviews();
    }
    updateMoreReviewsButton(reviews);
  }, [selectedParameter, amountOfReviews, props.metadata, filters]);

  const addFilters = (filterToAdd) => {
    let updatedFilters = filters.map((element) => element);
    updatedFilters.push(filterToAdd);
    setFilters(updatedFilters);
  };
  const removeFilters = (filterToRemove) => {
    let updatedFilters = [];
    filters.map((element) => {
      if (element !== filterToRemove) {
        updatedFilters.push(element);
      }
    });
    setFilters(updatedFilters);
  };

  const manipulateFilters = (filter) => {
    if (filters.includes(filter)) {
      removeFilters(filter);
    } else {
      addFilters(filter);
    }
  };

  const filterReviews = (untouchedReviews) => {
    let filteredReviews = [];
    untouchedReviews.filter((review) => {
      if (filters.includes(review.rating)) {
        filteredReviews.push(review);
      }
    });
    if (filteredReviews.length === 0) {
      return;
    }
    setReviews(filteredReviews);
  };

  const addMoreReviews = () => {
    addReviews(amountOfReviews + 2);
  };

  const updateParamFunc = (e) => {
    updateParam(e.target.value);
  };

  let getReviews = () => {
    let id = props.currentProduct.id;
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/reviews/?product_id=${id}&count=100&sort=${selectedParameter}`, header)
      .then((data) => {
        setReviews(data.data.results);
        updateMoreReviewsButton(data.data.results);
        filterReviews(data.data.results);
      })
      .catch((err) => console.log(err));
  };


  let lengthOfReviews;
  if (!reviews) {
    lengthOfReviews = 0;
  } else {
    lengthOfReviews = reviews.length;
  }

  let moreReviewsButton;
  if (!isDisplayingMoreReviewsButton) {
    moreReviewsButton = '';
  } else {
    moreReviewsButton = <button onClick={addMoreReviews} >MORE REVIEWS</button>;
  }

  const updateMoreReviewsButton = (arrOfReviews) => {
    if (arrOfReviews.length > 2) {
      setIsdisplayingMoreReviewsButton(true);
    }
    if (amountOfReviews > arrOfReviews.length) {
      setIsdisplayingMoreReviewsButton(false);
    }
  };

  const togglePostForm = () => {
    togglePosting(!isPosting);
  };

  let postForm;
  if (!isPosting) {
    postForm = '';
  } else {
    postForm = <PostReviewForm review_id={props.currentProduct.id} />;
  }

  return (
    <div>
      {postForm}
      <div className="ratings">
        <Ratings
          manipulateFilters={manipulateFilters}
          avgRating={props.avgRating}
          metadata={props.metadata}/>
      </div>
      <span>
        {lengthOfReviews}
        reviews, sorted by
        <SortForm updateParamFunc={updateParamFunc} sortParameters={sortParameters} />
      </span>
      <ReviewsList avgRating={props.avgRating}
        getReviews={getReviews}
        reviews={reviews}
        amountOfReviews={amountOfReviews} />
      <span>
         {moreReviewsButton}
         <button onClick={togglePostForm} >ADD A REVIEW +</button>
      </span>
    </div>
  );
};

export default Reviews;
