import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaHeart, FaHistory, FaPhone, FaRegComment, FaStar, FaTheRedYeti } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { extractDate, getToken, getUser } from '../../util';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import Loading from '../loading/Loading';
import ServiceCard from '../service/ServiceCard';
import VerifyAuth from '../VerifyAuth/VerifyAuth';
import './profil.scss';
import SmallCommandeCard from './SmallCommandeCard';
import SmallCommentCard from './SmallCommentCard';
import SmallNoteCard from './SmallNoteCard';
import SmallServicesCard from './SmallServicesCard';

function BigUserProfilCard() {
  const currentUser = getUser();
  const userID = useParams('id').id;
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isconnected = localStorage.getItem('isconnected');
  const getUsers = async () => {
      const res = await api.getUser({
        headers: {
          Authorization: `Bearer ${getToken()}`,
          id: userID
        }
      });
      console.log(res);
      setUser(res.data);
  }

useEffect(() => {
    if(!isconnected) return null;
    setIsLoading(!isLoading);
    try{
      console.log(" isconnected ::",isconnected)
      getUsers();
    }catch(error){
      console.log(error);
    }finally{
      setIsLoading(false);
    }
}, []);
const averageNote = user ? user.listnotes.reduce((acc, note) => acc + note, 0) / user.listnotes.length : 0;

  return  user && (
    <VerifyAuth>
      <CustomNavbar addstyle={"addstyle"}/>
      <Container >
        {
          isLoading ? <Loading/> : 
        <div className="content m-4 p-3" style={{height:"100vh", overflow:"scroll"}}>
          <div class=" row">
            <div className="col-3">
              <div className="row">
                <img src={`http://localhost:5000/${user.img}`} alt="" srcset="" />
              </div>
              <div className="row"></div>
            </div>
            <div className="col-9">
            <div className="row">
                    <div className="col name">
                      <span>{user.lastname}</span>
                      <span>{user.lastname}</span>
                    </div>
                  </div>
              <div className="row">
                <div className="col-9">
                  <div className="row certifications">
                    <div className="col">
                      <span className="name">certifications : </span>
                      {
                        user.certifications.map((q, index) =>(
                          <span className='item' key={index}>{q}</span>
                        ))
                      }
                    </div>
                  </div>
                  <div className="row description">
                    <span>A propos</span>
                    <p className=''>{user.description} </p>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <span className='contacter '>Me contacter <FaPhone style={{ color: 'gray', fontSize: '10px' }}/></span>
                    </div>
                    <div className="col-4">
                      <span className='notes title-left-content'>Notes :    
                        {[1, 2, 3, 4, 5].map((value) => (
                          <FaStar
                            key={value}
                            color={value <= averageNote ? 'gold' : 'gray'}
                          />
                        ))}
                      </span>
                    </div>
                    
                  </div>
                  
                </div>
                <div className="col-3 qualification ">
                  <span className=''>QUALIFICATION</span>
                  <div className="row title-left-content">
                    <div className="col pt-3">
                      {
                      user.qualification.map((q, index) =>(
                        <span className='item' key={index}>{q}</span>
                      ))
                    }
                    </div>
                  </div>
                  <span className='langues'>LANGUES</span>
                  <div className="row">
                    <div className="col pt-3">

                    {
                      user.languages.map((q, index) =>(
                        <span className='item' key={index}>{q}</span>
                      ))
                    }
                    </div>
                  </div>
                  <div className="row">
                    <div className="col ">
                      <p className='role'>
                      <span className=''>ROLE : </span>
                      {
                        user.roles.map((role, index) =>(
                          <span className='admin-role' key={index}>{role.name}</span>
                        ))
                      }
                      </p>
                    </div>
                  </div>
                  <span>Depuis le</span>
                  <div className="Row">
                    <div className="col">
                      <p className='contacter'> <FaHistory style={{ color: 'gray', fontSize: '10px' }}/> <span>{ extractDate(user.createdAt) } </span> </p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          <div className="row" >
            <h4 className='subtitle comments'>Commentaires</h4>
            <div class=" row">
              {
                user.listcomments.map((comment, key) =>(
                  <div className="col-3">
                    <SmallCommentCard  width={"200px"} height={"180px"} comment={comment} user={user} />
                  </div>
                ))
              }
              
            </div>
            <div className="row my-4">
              {
                currentUser._id == userID &&
                <div className="row favorie ">
                  <span className="my-3 services-favorites">Service favoris <FaHeart style={{ color: 'red', fontSize: '24px' }}/></span>
                    {
                      user.favoriteservice.map((service, key) => (
                        <div className="col-3 small-card-service">
                          <SmallServicesCard shadow={"box-shadow-service"} width={"200px"} height={"180px"}  service={service} />
                        </div>
                      ))
                    }
                </div>
              }
            </div>
            <h4 className='mes-services'>Mes services </h4>
            <div class=" row">
              <div className="row favorie my-3">
                    {
                      user.listservices.map((service, key) => (
                        <div className="col-3 small-card-service">
                          <SmallServicesCard shadow={"box-shadow-service"} width={"200px"} height={"180px"} service={service} />
                        </div>
                      ))
                    }
              </div>
            </div>
            {
              (currentUser._id === userID || currentUser.roles.value >= 3) &&  
              <>
                <h4 className='mes-services'>Liste des commandes </h4>
                <div class=" row">
                  {/* comments.map((comments, key) =>()) */}
                  {
                    user.listcommandes.map((commande, index) =>(
                      
                      <div className="col-3">
                        <SmallCommandeCard shadow={"box-shadow-service"} width={"200px"} height={"180px"}  commande={commande}/>
                      </div>
                    ))
                  }
                </div>

                <h4 className='mes-services' >Liste des services notées </h4>
                <div class=" row" style={{marginBottom:"8rem"}}>
                  {
                    user.listnotes.map((note, index) =>(
                      
                      <div key={index} className="col-3">
                        <SmallNoteCard shadow={"box-shadow-service"} showservice={true} user={user} width={"200px"} height={"180px"}  note={note}/>
                      </div>
                    ))
                  }
                </div>
              </>
            }
          </div>
        </div>
        }
        <br />
      </Container>
    </VerifyAuth>
  );
}

export default BigUserProfilCard;
