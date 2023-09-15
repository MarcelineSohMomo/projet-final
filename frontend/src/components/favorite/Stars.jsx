import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart, FaStar } from 'react-icons/fa';
import api from '../../api';
import { getToken, getUser } from '../../util';

const Stars = ({ service }) => {
  // const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  const token = getToken();
  const user = getUser();
  const calculateAverageRating = async () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.getRatings(service._id, header);
      const total = res.data.reduce((acc, rating) => acc + rating.value, 0);
      const avg = total / res.data.length;
      setAverageRating(avg.toFixed(2));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    calculateAverageRating();
  }, [service, token]);

  const handleRating = async (newRating) => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.updateRating({
        serviceId: service._id,
        userId: user._id,
        value: newRating
      }, header);
      setUserRating(newRating);
      calculateAverageRating();
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            style={{ color: star <= Math.round(averageRating) ? 'gold' : 'grey' }}
          />
        ))}

        <span>{typeof averageRating ==="number"  ? averageRating : ""}</span>
      </>
  );
};

export default Stars;
