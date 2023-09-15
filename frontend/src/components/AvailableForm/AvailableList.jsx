import React from 'react';

const AvailabilityList = ({ availabilities}) => {
  return (
    <div >
      <h2 className='h6 es-subtitle'>Liste des disponibilités :</h2>
      {availabilities.length > 0 ? (
        <ul>
          {availabilities.map((availability, index) => (
            <li key={index}>
              {`${availability.start} - ${availability.end}`}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune disponibilité définie.</p>
      )}
    </div>
  );
};

export default AvailabilityList;
