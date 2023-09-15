import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, FormText } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import ServerMessage from '../../components/serverMessage/ServerMessage';
import { getToken, getUser, saveCurrentUserInfo } from '../../util';
import './userprofil.scss'


const ProfileImageForm = ({ user }) => {
  const isconnected =  localStorage.getItem("isconnected");
  const token = getToken();
  const userID = getUser()._id;
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [serverMessageKey, setServerMessageKey] = useState(0);
  const [serverMessage, setServerMessage] = useState(null);

  useEffect(() => {
    if (!isconnected) {
      navigate('/signin');
    }
  }, [isconnected, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        id: userID,
      },
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await api.updateUserImg(formData, headers)
      .then((res) =>{
        saveCurrentUserInfo(res.data);
        setServerMessage({
          message: "Image profil mise à jour avec succèss",
          type: 'success',
        });
        setTimeout(() => {
          window.location.reload();
      }, 1500);
        setServerMessageKey(prevKey =>prevKey + 1);
      });

    } catch (error) {
      console.log(error);
      setServerMessage({
        message: "Une erreur s'est produite lors du téléchargement du fichier. \n \n Seule les fichiers de format (JPEG, PNG, JPG) et de taille inferieur à 1MB sont autorisés",
        type: 'error',
      });
      setServerMessageKey(prevKey =>prevKey + 1);
    }
    
  };

  return (
    <div className="row edit-user-profil">
      <Form onSubmit={handleSubmit}>
        {serverMessage && (
            <ServerMessage
            message={serverMessage.message}
            type={serverMessage.type}
            key={serverMessageKey}
            />
          )}
        <FormGroup>
          <Form.Label htmlFor="profileImage">Image</Form.Label>
          <Form.Control className='es-inputs' type="file" name="profileImage" id="profileImage" onChange={handleFileChange} />
          <FormText color="muted">Choisis l'image à mettre sur ton profil.</FormText>
        </FormGroup>
        {previewSrc && <img src={previewSrc} alt="Profile Preview" style={{ width: '100%', height: 'auto' }} />}
        <button className='es-button my-3' type='submit'>Appliquer la mise à jour </button>
      </Form>
    </div>
  );
};

export default ProfileImageForm;
