import React, { useEffect, useState } from 'react'
import { Button, Card, Row, Col, ButtonGroup } from 'react-bootstrap';
import api from '../../api';
import Loading from '../../components/loading/Loading';
import { getToken, getUser } from '../../util';
import Historique from './Historique';

const ListHistorique = () => {
    const [serverMessageKey, setServerMessageKey] = useState(0);
    const [serverMessage, setServerMessage] = useState(null);
    const  [commandes, setCommandes] = useState([]);
    
    const header = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            id: getUser()._id,
        },
    }
    useEffect(() => {

        const getCommandes = async ()=>{
            await api.getCommandesByProvider(header)
            .then(res => {
                console.log(res);
                setCommandes(res.data);
                setServerMessage({ message: res.data.message, type: 'success' });
                setServerMessageKey(prev => prev + 1);
            }).catch(error =>{
                const resolvedError =  error.response;
                setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
                setServerMessageKey(prev => prev + 1);
            })
        }

        getCommandes();
    }, []);
    return (
        <div>
            <h6>Mon historique </h6>
            <Row>
                {
                    commandes.length !== 0 ? commandes.map((commande, index) =>
                        <>
                            <Historique key={index} commande={commande} />
                        </>
                    ) :<Loading />
                }
            </Row>
        </div>
  )
}

export default ListHistorique