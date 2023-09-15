import React from 'react'
import { Card, Carousel, Image } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'
import { getToken, getUser } from '../../util'
import './profil.scss'


const SmallCommandeCard = ({commande, width, height, shadow}) => {
  const service = commande.serviceId ? commande.serviceId : commande.saveService
  const providerId = service && service.providerId; 
  const token = getToken();
  const header = {
      headers: {
          Authorization: `Bearer ${token}`,
          id: providerId,
      },
  }

  return service && (
    <div className={`${shadow} small-services-content m-2`}>
      <Carousel>
        {service.imgs && service.imgs.length > 0 ? service.imgs.map((image, index) => 
          <Carousel.Item key={index}>
            <img className="d-block w-100 rounded" src={`http://localhost:5000/${image}`} width={width} height={height} alt={`slide ${index}`} />
          </Carousel.Item>
        ) : (
          <div className="no-content" style={{width:width, height:height}}>No Content</div>
        )}
      </Carousel>
      <div className='body p-3'>
          <span>
            {service.name} {service.likers.length} <FaHeart /> 
          </span>
      </div>
      <div className='row customer p-3'>
        <div className="row">
          <div className="col-3">
            {!providerId.img ? 
            <img src="" width="50" height="50" style={{backgroundColor:"gray"}} alt="" srcset="" /> : 
            <Image
                src={`http://localhost:5000/${providerId.img}`}
                roundedCircle
                alt="Profile"
                width="50"
                height="50"
              />}
          </div>
          <div className="col d-flex justify-content-center align-items-center provider-name">
            <span> {providerId.lastname } </span> &nbsp;&nbsp;
            <span> { providerId.firstname} </span>
          </div>

        </div>
        <div className="row status">
          <div className="col d-flex justify-content-between">
              <span>Status</span> 
              <span> {commande.status} </span>  
              <span>{commande.price} <strong style={{color:"rgba(116, 108, 24, 0.446)", fontWeight:"bold"}}>$</strong></span>
          </div> 
        </div>
      </div>

      
    </div>
  )
}

export default SmallCommandeCard