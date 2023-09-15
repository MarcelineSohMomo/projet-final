import React from 'react'
import { Card, Carousel, Image } from 'react-bootstrap'
import { FaHeart, FaStar } from 'react-icons/fa'
import { getToken, getUser } from '../../util'
import { toCapitalize } from '../toCapitalize/ToCapitalize'
import './profil.scss'


const SmallNoteCard = ({showservice, note,user, width, height, shadow}) => {
  console.log("note ", note)
  console.log("user ", user)
  const service = note.serviceId
  if(!user) return null;
  return (
    <div className={`small-services-content ${shadow}`}>
      {
          showservice &&
          <>
            <Carousel>
              {service.imgs && service.imgs.length > 0 ? service.imgs.map((image, index) => 
                <Carousel.Item key={index}>
                  <img className="d-block w-100 rounded" src={`http://localhost:5000/${image}`} width={`${width}`} height={`${height}`} alt={`slide ${index}`} />
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
          </>
          
      }
      <div className='row customer p-3'>
        <div className="row justify-content-between">
          <div className="col-4">
            {!user.img ? 
            <img src="" width="40" height="40" style={{backgroundColor:"gray"}} alt="" srcset="" /> : 
            <Image
                src={`http://localhost:5000/${user.img}`}
                roundedCircle
                alt="Profile"
                width="40"
                height="40"
              />}
          </div>
          <div className="col-4 provider-name ">
            <span> {user.lastname} </span>
            <span> {user.firstname} </span>
          </div>
          <div className="col-4 note d-flex justify-content-start">
              <span> {note.value} </span>   <FaStar style={{fontSize:"2rem", color:"#FFEA0186"}}/>
          </div>
        </div>
        
      </div>

      
    </div>
  )
}

export default SmallNoteCard