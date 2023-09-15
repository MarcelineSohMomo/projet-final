import React from 'react'
import { Image } from 'react-bootstrap';
import { FaCheck, FaEdit, FaSave, FaStar, FaTrash } from 'react-icons/fa';
import { extractDate, extractDateAndHours, getUser } from '../../util';
import SmallServicesCard from './SmallServicesCard';
import './profil.scss'
import { useState } from 'react';
import Loading from '../loading/Loading';

const SmallCommentCard = ({width, height, commentText, setCommentText, comment, user, dontShowService, updateComment, deleteComment}) => {
    const service = comment.serviceId;
    const [isEditing, setIsEditing] = useState(false);
    const [display, setDisplay] = useState(true)
    const handleupdateComment = () =>{
        setIsEditing(!isEditing);
    }

    return (
        <div className='small-comment-card'>
            {
                // dontShowService ? null : <SmallServicesCard width={width} height={height} service={service} />
            }
            <div className="row">
                <div className="col-3">
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
                            
                        </div>
                    
                    </div>
                </div>
                <div className="col-9 my-3">
                    <div className="row">
                        <div className="provider-name hours">
                            {
                                comment.commenterId && user && (getUser()._id !== comment.commenterId._id) ?
                                <div className="col-4 provider-name ">
                                    <span> {comment.commenterId && comment.commenterId.lastname}</span>
                                    <span> {comment.commenterId && comment.commenterId.firstname} </span> 
                                </div> : <span>Moi</span>
                            }
                             <span>{extractDateAndHours(comment.createdAt).hours }</span> 
                        </div>
                        <div className='commentaire'>
                            { !isEditing ? <p> {comment.text} </p> :
                                <textarea type="text" 
                                    rows={2}
                                    value={commentText} 
                                    onChange={(e) => setCommentText(e.target.value)} 
                                    className="editing-comment"
                                />
                            }
                            <p className='date'>{extractDate(comment.createdAt)} </p>
                        </div>
                        <p className='icon'>
                            {
                                isEditing && <FaCheck 
                                className='save-icon'
                                onClick={(e)=> {
                                        setIsEditing(!isEditing);
                                        updateComment(comment);
                                    }
                                }/>
                            }
                            {
                                (((user && comment.commenterId && getUser()._id === comment.commenterId._id) || (getUser().roles && getUser().roles.name ==="admin")) || 
                                ((user && comment.commenterId && getUser()._id === comment.commenterId) || (getUser().roles && getUser().roles.name ==="admin"))) && 
                            <>
                                <FaEdit  onClick={() => {
                                        setCommentText(comment.text)
                                        handleupdateComment()
                                    }} 
                                    className='edit-icon'/>
                                {
                                    display ?
                                    <FaTrash 
                                    onClick={() => {
                                        const shouldDelete = window.confirm('Etes vous sure de vouloir supprimer cette note ?');
                                        if(shouldDelete){
                                            setDisplay(true)
                                            deleteComment(comment)
                                        }    
                                        
                                    }} 
                                    className='delete-icon'/> : <Loading />
                                }
                                
                            </>
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SmallCommentCard;