import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';

const Commande = ({ tarifications, onAdd, onRemove }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [paid, setPaid] = useState(false);  

  const handleAddOrRemove = (index, tarif) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
      onRemove(tarif);
    } else {
      setSelectedRows([...selectedRows, index]);
      onAdd(tarif);
    }
  };

  const handlePay = () => {
    setPaid(!paid);
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Prix</th>
          <th>Quantité</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {
        tarifications.map((tarif, index) => (
          <tr key={index}>
            <td> {tarif.prix} </td>
            <td> {tarif.quantite} </td>
            <td>
              <Button 
                variant={selectedRows.includes(index) ? 'danger' : 'primary'}
                onClick={() => handleAddOrRemove(index, tarif)}
              >
                {selectedRows.includes(index) ? 'Annuler' : 'Ajouter'}
              </Button>
            </td>
          </tr>
        ))
      }
      </tbody>
      <Button variant={paid ? 'success' : 'danger'} className="my-3" onClick={handlePay}>
        Payé
      </Button>
    </Table>
  );
};

export default Commande;
