import React from 'react'
import { Card, Carousel } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'
import { toCapitalize } from '../toCapitalize/ToCapitalize'
import './profil.scss'


const SmallServicesCard = ({shadow, service, width, height}) => {
  return (
    <div className={`${shadow} small-services-content`} style={{zIndex:"1"}}>
      <Carousel>
        {service.imgs && service.imgs.length > 0 ? service.imgs.map((image, index) => 
          <Carousel.Item key={index}>
            <img className="d-block w-100 rounded" src={`http://localhost:5000/${image}`} width={width} height={height} alt={`slide ${index}`} />
          </Carousel.Item>
        ) : (
          <div className="no-content" style={{width:`${width}`, height:`${height}`}}>No Content</div>
        )}
      </Carousel>
      <div className='body p-3'>
          <span>
            {service.name} {service.likers.length} <FaHeart /> 
          </span>
      </div>
      {console.log(service.provider)}
    </div>
  )
}

export default SmallServicesCard