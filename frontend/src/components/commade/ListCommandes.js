import React, { useEffect, useState } from 'react';
import Commande from './Commande';
import api from '../../api';

const ListCommandes = () => {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await api.getCommandes();
        setCommandes(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCommandes();
  }, []);

  return (
    <div>
      <h3>Mes commandes</h3>
      {commandes.map(commande => (
        <Commande key={commande._id} commande={commande} />
      ))}
    </div>
  );
};

export default ListCommandes;
