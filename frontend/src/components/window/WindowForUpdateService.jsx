import React, { useState } from 'react';
import { FaEdit, FaEye, FaTimesCircle } from 'react-icons/fa';
import "./window.scss"


function WindowForUpdateService({ children, showEditIcon, }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenWindow = () => {
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
        <span className='action-service'> <FaEdit  onClick={() =>handleOpenWindow()}/> </span> :
        <span className='action-service'> <FaEye  onClick={handleOpenWindow}/> </span>
      }
      {isOpen && (
        <div className="window-overlay" >
          <div className="window window-border">
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

export default WindowForUpdateService;
