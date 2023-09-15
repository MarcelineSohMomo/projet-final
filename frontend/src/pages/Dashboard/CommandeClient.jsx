import React, { useEffect, useState } from 'react'
import { Button, Card, Row, Col, ButtonGroup } from 'react-bootstrap';
import api from '../../api';
import Loading from '../../components/loading/Loading';
import { getToken, getUser } from '../../util';
import SmallCommandeCard from '../../components/profil/SmallCommandeCard'
import "./mycommande.scss"
import ConfirmationDialog from '../../components/confirmationDialog/ConfirmationDialog';
import { FaCheck, FaTrash } from 'react-icons/fa';

const CommandeClient = () => {
    const [serverMessageKey, setServerMessageKey] = useState(0);
    const [serverMessage, setServerMessage] = useState(null);
    const  [commandes, setCommandes] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isValidate, setValidate] = useState(false);
    const [isLoadingCommandes, setLoadingCommandes] = useState(false);
    const [status, setStatus] = useState("");


    const token = getToken();
    const userID = getUser()._id;
    const header = {
        headers: {
            Authorization: `Bearer ${token}`,
            id: userID,
        },
    }

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

    useEffect(() => {

        try {
          setLoadingCommandes(true)

          getCommandes();
        } catch (error) {
          
        }finally{
          setLoadingCommandes(false)
        }
    }, [status, isValidate]);

    const handleValidate = async (commande, update_status) => {
        const header = {
            headers: {
                Authorization: `Bearer ${token}`,
                id: commande._id,
            },
        }
        try {
          setLoading(true)
          setValidate(true)
          await api.updateCommande({status: update_status}, header)
          .then(res => {
            setStatus(res.data.status);
            console.log("res.data ", res.data)
            setServerMessageKey(prevKey => prevKey + 1);
            setServerMessage({
              message: res.data.message,
              type: 'success',
            });
          })
        } catch (error) {
          const resolvedError = error.response;
          setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
          setServerMessageKey(prevKey => prevKey + 1);
          console.log(error);
        }finally{
          setLoading(false)
          setValidate(false)
        }
      };
    
    
      const handleConfirmDelete = async (commande) => {
        const header = {
            headers: {
                Authorization: `Bearer ${token}`,
                id: commande._id,
            },
        }
        
        try {
          setLoading(true)
          setValidate(true)
          await api.deleteCommande(header)
          .then(res => {
            setServerMessageKey(prevKey => prevKey + 1);
            setServerMessage({
              message: res.data.message,
              type: 'success',
            });
          })
        } catch (error) {
          const resolvedError = error.response;
            setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
            setServerMessageKey(prevKey => prevKey + 1);
            console.log(error);
        }finally{
          setLoading(false)
          setValidate(false)

        }
      };
      const handleDelete = async () => {
        setShowDialog(true);  
      };

      console.log("status ", status)
      console.log("isValidate ", isValidate)
    return (
        <div  style={{height:"90vh", overflowY:"scroll"}}>
            <ConfirmationDialog
                show={showDialog}
                handleClose={() => setShowDialog(false)}
                handleConfirm={handleConfirmDelete}
                message="Êtes-vous sûr de vouloir supprimer cette commande ?"
            />
            <p className='commandes'>Commandes de mes clients </p>
            <div className='row p-2 mb-5'>
                {
                    !isLoadingCommandes ? commandes.map((commande, index) =>
                        <div className="col-3 my-3 small-commande-card">
                            <SmallCommandeCard key={index} width={"200px"} height={"180px"} commande={commande}/>
                            {!(commande.status ==="completed" || commande.status ==="cancelled") ? <p className='icon'>
                                <span  className=' mx-2' onClick={()=>handleValidate(commande, 'completed')}><FaCheck /> </span>
                                <span   className='mx-2'onClick={()=>handleValidate(commande, 'cancelled')}><FaTrash /></span>
                                { isLoading && <Loading />}
                              </p> : ""}
                        </div>
                    ) :<Loading />
                }
            </div>
        </div>
  )
}

export default CommandeClient