import React, { useState, Fragment } from 'react';
import { Button, Form, FormGroup, Card, Container, Col, Row } from 'react-bootstrap';
import api from '../../api';
import { getToken, getUser, saveCurrentUserInfo } from '../../util';
import './userprofil.scss'

const FormField = ({ name, label, type, value, onChange, disabled, className }) => {
  return (
    <FormGroup>
      <Form.Label htmlFor={name} className="label-text">{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input-form ${className}`}
      />
    </FormGroup>
  );
};

const ProfileInfoForm = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const token = getToken();
  const userID = getUser()._id;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (['languages', 'certifications', 'qualification'].includes(name)) {
      updatedValue = value.split(',').map(item => item.trim());
    }
    setUpdatedUser({ ...updatedUser, [name]: updatedValue });
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
      id: userID
    },
  }
  const saveChanges = async (e) => {
    e.preventDefault()
    try {
      await api.updateUser(updatedUser, headers)
      .then(res => {
        console.log(res)
        saveCurrentUserInfo(res.data);
        setUpdatedUser(res.data.user)
        setTimeout(() => {
          // window.location.reload();
      }, 1500);
      });

    } catch (error) {
      console.log(error);
    }
    setIsEditing(false);
  };


  const labelsFr = {
    firstname: 'Prénom',
    lastname: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    dateOfBirth: 'Date de naissance',
    description: 'Description',
    languages: 'Langues',
    certifications: 'Certifications',
    qualification: 'Qualification',
  };

  const formFields = Object.entries(updatedUser).filter(([key, value]) => key in labelsFr);

  console.log("updatedUser  ", updatedUser)
  return (
    <Fragment>
      <div className="row" style={{height:"80vh", overflowY:"scroll"}}>
        <Form className='edit-user-profil'>
          <Row>
            {formFields.slice(0, formFields.length / 2).map(([key, value]) => (
              <Col md={6}>
                <FormField
                  key={key}
                  name={key}
                  label={labelsFr[key]}
                  type={
                    key === 'dateOfBirth'
                      ? 'date'
                      : ['languages', 'certifications', 'qualification'].includes(key)
                      ? 'text'
                      : 'textarea'
                  }
                  value={isEditing ? updatedUser[key] : value}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={"es-inputs"}
                  
                />
              </Col>
            ))}
          </Row>
          <Row>
            {formFields.slice(formFields.length / 2).map(([key, value]) => (
              <Col md={6}>
                <FormField
                  key={key}
                  name={key}
                  label={labelsFr[key]}
                  type={
                    key === 'dateOfBirth'
                      ? 'date'
                      : ['languages', 'certifications', 'qualification'].includes(key)
                      ? 'text'
                      : 'textarea'
                  }
                  value={isEditing ? updatedUser[key] : value}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={"es-inputs"}
                />
              </Col>
            ))}
          </Row>
          {isEditing ? (
            <button className='es-button my-3' onClick={saveChanges}>
              Appiquer les changements
            </button>
          ) : (
            <>
              <button className='es-button my-3' onClick={toggleEditing}>
                Editer
              </button>
              <a className='es-button m-3' href={`/viewuser/${userID}`}>
                Voir
              </a>
            </>
          )}
        </Form>
      </div>
    </Fragment>
  );
};

export default ProfileInfoForm;
