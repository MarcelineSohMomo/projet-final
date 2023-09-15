import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const Notes = ({ initialNotes, onNote }) => {
  const [notes, setNotes] = useState(initialNotes);

  const handleNote = (value) => {
    setNotes([...notes, value]);
    onNote([...notes, value]);
  };

  const averageNote = notes.reduce((acc, note) => acc + note, 0) / notes.length;

  return (
    <div>
      <p>Moyenne des notes : {averageNote.toFixed(1)} / 5</p>
      <div>
        {[1, 2, 3, 4, 5].map((value) => (
          <FaStar
            key={value}
            onClick={() => handleNote(value)}
            color={value <= averageNote ? 'gold' : 'gray'}
          />
        ))}
      </div>
    </div>
  );
};

export default Notes;
