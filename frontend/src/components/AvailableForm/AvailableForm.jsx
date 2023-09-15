import React, { useState } from 'react';
import api from '../../api';
import { getToken, getUser } from '../../util';
import useCheckUserDetails from '../VerifyAuth/useCheckUserDetails';
import ServerMessage from '../serverMessage/ServerMessage';

const AvailabilityForm = ({serviceID}) => {
  const [availability, setAvailability] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [serverMessage, setServerMessage] = useState(null);
  const { shouldNavigate, serverMessage: serverMessageCheckUser } = useCheckUserDetails();
  // const [serviceid, setserviceid] = useState(serviceID);

  const handleChangeStartTime = (event) => {
    setStartTime(event.target.value);
  };

  const handleChangeEndTime = (event) => {
    setEndTime(event.target.value);
  };

  const handleAddAvailability = () => {
    setAvailability([...availability, { start: startTime, end: endTime }]);
    setStartTime('');
    setEndTime('');
  };

  const handleRemoveAvailability = (index) => {
    // Supprime une plage horaire de l'état de disponibilité en fonction de l'index
    const updatedAvailability = availability.filter((_, i) => i !== index);
    setAvailability(updatedAvailability);
  };

  const handleSubmit = async(e) => {
    if (serviceID) {
      await api.updateAvailability({
        availability: availability,
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          id: serviceID
        }
      })
      .then(response => {
        setServerMessageKey(prevKey =>prevKey + 1);
        setServerMessage({
          message: response.data.message,
          type: 'success',
        })
      })
      .catch(async error => {
        const resolvedError = await error.response;
        setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
        setServerMessageKey(prevKey =>prevKey + 1);
      })
    }
  };

  return (
    <div>
      {serverMessage && (
          <ServerMessage
            message={serverMessage.message}
            type={serverMessage.type}
            key={serverMessageKey}
          />
        )}
      <div>
        <label className='es-inputs'>
          Heure de début de la plage horaire :
          <input
            type="time"
            value={startTime}
            onChange={handleChangeStartTime}
            required
          />
        </label>
        <label className='es-inputs'>
          Heure de fin de la plage horaire :
          <input
            type="time"
            value={endTime}
            onChange={handleChangeEndTime}
            required
          />
        </label>
        <button type="button" className='es-button' onClick={handleAddAvailability}>Ajouter</button>
      </div>
      <div>
        <h2 className='es-subtitle text-black'>Disponibilité définie :</h2>
        {availability.map((slot, index) => (
          <div key={index}>
            {`${slot.start} - ${slot.end}`}
            <button type="button" className="es-button es-button-delete " onClick={() => handleRemoveAvailability(index)}>Supprimer</button>
          </div>
        ))}
        {availability.length > 0 && (
          <button type="button" className="es-button mb-3"  onClick={handleSubmit}>Enregistrer la disponibilité</button>
        )}
      </div>
    </div>
  );
};

export default AvailabilityForm;
