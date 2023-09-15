import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart, FaStar } from 'react-icons/fa';
import api from '../../api';
import { getToken, getUser } from '../../util';

const Favorite = ({ service }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  const token = getToken();
  const user = getUser();

  useEffect(() => {
    setIsFavorite(service.likers.includes(user._id));
  }, [service]);

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
  }, [service, user, token]);

  const toggleFavorite = async () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.toggleFavorite(service._id, header);
      setIsFavorite(res.data.isFavorite);
    } catch (error) {
      console.error(error);
    }
  };

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
    <div>
      <Button variant={isFavorite ? 'danger' : 'outline-danger'} onClick={toggleFavorite}>
        <FaHeart /> {isFavorite ? 'Enlever des favoris' : 'Ajouter aux favoris'}
      </Button>
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            style={{ color: star <= Math.round(averageRating) ? 'gold' : 'grey' }}
          />
        ))}

        <span>{averageRating}</span>
        {user && (
          <div>
            Your rating:
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                style={{ color: star <= userRating ? 'gold' : 'grey' }}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorite;
