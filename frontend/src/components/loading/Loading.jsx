import React from 'react'
import './Loading.scss'

const Loading = () => {
  return (
    <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '200px' }}
        >
          <div className="loading-circle" />
          <div className="loading-circle" />
          <div className="loading-circle" />
          <div className="loading-circle" />
    </div>
  )
}

export default Loading