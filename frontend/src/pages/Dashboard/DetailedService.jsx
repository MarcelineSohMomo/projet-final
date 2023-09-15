// DetailedService.jsx
import React, { Fragment, useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import NotesList from '../../components/note/NotesList';
import CommentsList from '../../components/comment/CommentsList';
import ImageUpload from '../../components/imageUpload/ImageUpload';

const DetailedService = ({ service }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedService, setUpdatedService] = useState(service);
  const [tarification, setTarification] = useState([
    { prix: '', quantite: '' },
  ]);
  const [textareaValue, setTextareaValue] = useState('');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleApplyClick = () => {
    setIsEditing(false);
    console.log("Mise à jour du service :", updatedService);
  };

  const addRow = ()=> {
    setTarification([...tarification, { prix: '', quantite: '' }]);
  }

  const removeRow = (index) => {
    const newTarification = tarification.filter((_, i) => i !== index);
    setTarification(newTarification);
  }
  const handleTarificationChange = (index, field, value) => {
    const newTarification = [...tarification];
    newTarification[index][field] = value;
    setTarification(newTarification);
  };
  const handleChange = (event) => {
    setUpdatedService({ ...updatedService, [event.target.name]: event.target.value });
  };

  return (
     <Row>
        <Col md={8}>
          <Card>
            <Card.Header>{isEditing ? <Form.Control type="text" name="name" value={updatedService.name} onChange={handleChange} /> : updatedService.name}</Card.Header>
            <Card.Body>
              <Card.Title>Description</Card.Title>
              <Card.Text>
                {isEditing ? (
                  <Form.Control as="textarea" rows={3} name="description" value={updatedService.description} onChange={handleChange} />
                ) : (
                  updatedService.description
                )}
              </Card.Text>
              <Form.Group>
                <Form.Label>Tarification</Form.Label>
                <table>
                  <thead>
                    <tr>
                      <th>Prix</th>
                      <th>Quantité</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {service.tarification.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Control
                            type="text"
                            value={row.prix}
                            onChange={(e) =>
                              handleTarificationChange(index, "prix", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={row.quantite}
                            onChange={(e) =>
                              handleTarificationChange(index, "quantite", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Button variant="danger" onClick={() => removeRow(index)}>
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button variant="success" onClick={addRow} className="mt-3">
                  Ajouter
                </Button>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Autres informations...</Form.Label>
                <Form.Control placeholder="Autres informations" as="textarea" rows={3} value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} />
              </Form.Group>  
              <NotesList notes={service.listnotes} />
              <CommentsList comments={service.listcomments} />
              {isEditing ? (
                <Button variant="success" className="mr-2" onClick={handleApplyClick}>
                  Appliquer
                </Button>
              ) : (
                <Button variant="primary" className="mr-2" onClick={handleEditClick}>
                  Éditer
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <ImageUpload id={service._id} />
        </Col>

     </Row>

  );
};

export default DetailedService;
