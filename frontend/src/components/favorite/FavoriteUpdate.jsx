import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart, FaStar } from 'react-icons/fa';
import api from '../../api';
import { getToken, getUser } from '../../util';
import './favorite.scss'

const FavoriteUpdate = ({dontModifyFavorite, service, setNoteHasChanged, noteHasChanged }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  const token = getToken();
  const user = getUser();

  const inFavorite = (serviceId) =>{
      return user.favoriteservice.includes(serviceId)
  }
  useEffect(() => {
    calculateAverageRating();
    setIsFavorite(service.likers.includes(user._id));
  }, [userRating, token]);

  const calculateAverageRating = async () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.getRatings(service._id, header);
      setNoteHasChanged(!noteHasChanged)
      const total = res.data.reduce((acc, rating) => acc + rating.value, 0);
      const avg = total / res.data.length;
      setAverageRating(avg.toFixed(2));
    } catch (error) {
      console.error(error);
    }
  };


  const toggleFavorite = async () => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.toggleFavorite(service._id, header);
      console.log("response : ", res)
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
      console.log("res ", res)
      setUserRating(res.data.rating);
      calculateAverageRating();
      setNoteHasChanged(!noteHasChanged)
    } catch (error) {
      console.error(error);
    }
  };

  console.log(isFavorite)
  return (
    <div className='row note-favorite'>
      <div className='col-3 add '>
        {user && (
          <div className='add-note'>
            <span className='p-2'>Noté le service :</span>
            <span>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  style={{ color: star <= userRating ? 'gold' : 'grey' }}
                  onClick={() => handleRating(star)}
                />
              ))}
            </span>
          </div>
        )}
      </div>
      <div className="col-3 my-3 add add-favorite">
        {
          !dontModifyFavorite ? 
          <button className={isFavorite || inFavorite(service._id) ? 'selected' : 'not-selected'} onClick={toggleFavorite}>
            <span><FaHeart/></span> {isFavorite || inFavorite(service._id)  ? 'Enlever des favoris' : 'Ajouter aux favoris'}
          </button> :
          <button className='selected'>
            <span><FaHeart/></span> Enlever des favoris
          </button>
        }
      </div>
    </div>
  );
};

export default FavoriteUpdate;
