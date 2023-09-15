import React, { useState } from 'react';
import { FaEdit, FaEye, FaTimesCircle } from 'react-icons/fa';
import "./window.scss"


function WindowForComment({ children, showEditIcon, extractComments, commande }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenWindow = (commande) => {
    extractComments(commande.serviceId._id);
    setIsOpen(true);
  };

  const handleCloseWindow = () => {
    setIsOpen(false);
  };

  const handleMouseOut = () => {
    setIsOpen(false);
  };

  return (
    <>
      
      {
        showEditIcon ? 
        <span className='action-service'> <FaEdit  onClick={() =>handleOpenWindow(commande)}/> </span> :
        <span className='action-service'> <FaEye  onClick={handleOpenWindow}/> </span>
      }
      {isOpen && (
        <div className="window-overlay" >
          <div className="window">
            <div className="window-content ">
              { children }
            </div>
            <div className="row justify-content-end">
             <span  onClick={handleCloseWindow}> <FaTimesCircle className='close-window'/></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WindowForComment;
