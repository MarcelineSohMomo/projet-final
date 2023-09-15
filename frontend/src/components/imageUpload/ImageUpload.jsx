import React, { useState } from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../../api';
import { getToken } from '../../util';
import ServerMessage from '../serverMessage/ServerMessage';
import "../service/editService.scss"

const ImageUpload = ({ id }) => {
  const navigate = useNavigate();
  const isconnected = localStorage.getItem("isconnected");
    if (!isconnected) {
      navigate('/signin');
    }
  const [images, setImages] = useState([]);
  const [navigateToServices, setNavigateToServices] = useState(false);
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [serverMessage, setServerMessage] = useState(null);

  const handleImageChange = (e) => {
    const uploadedImages = Array.from(e.target.files);
    setImages(uploadedImages);
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const formData = new FormData();
    images.forEach(img =>{
      formData.append("files", img);
    });
    const headers = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data',
        id: id,
      },
    }
    try {
      const response = await api.updateServiceImgs(formData,headers);
      console.log('Images uploaded:', response);
      setServerMessage({
        message: response.data.message,
        type: 'success',
      });
      setTimeout(() => {
        setNavigateToServices(true);
      }, 5000);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  }
  return (
    <div>
      {navigateToServices && <Navigate to="/home" />}
        {serverMessage && (
          <ServerMessage
            message={serverMessage.message}
            type={serverMessage.type}
            key={serverMessageKey}
          />
        )}

      <h2 className='es-subtitle'>Uploader les images</h2>
      <Form >
        <FormGroup>
          <FormControl
            id="imageUpload"
            type="file"
            multiple
            onChange={handleImageChange}
            className="es-inputs"
          />
        </FormGroup>
        <button className='es-button my-3' onClick={handleSubmit}>
          Sauvegarder dans la galerie
        </button>
      </Form>
      <div>
        {images.map((img, index) => (
          <img
            key={index}
            src={URL.createObjectURL(img)}
            alt={`uploaded-${index}`}
            className="img-thumbnail"
            style={{ width: '400px', height: '400px', objectFit: 'cover' }}
          />
        ))}
      </div>
    </div>
  );
};


export default ImageUpload;
