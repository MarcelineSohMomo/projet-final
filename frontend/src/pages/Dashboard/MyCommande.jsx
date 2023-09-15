import React, { useEffect, useState } from 'react'
import { Button, Card, Row, Col, ButtonGroup } from 'react-bootstrap';
import api from '../../api';
import Loading from '../../components/loading/Loading';
import { getToken, getUser } from '../../util';
import SmallCommandeCard from '../../components/profil/SmallCommandeCard'
import "./mycommande.scss"
import ConfirmationDialog from '../../components/confirmationDialog/ConfirmationDialog';
import { FaCheck, FaTrash } from 'react-icons/fa';

const MyCommande = () => {
    const [serverMessageKey, setServerMessageKey] = useState(0);
    const [serverMessage, setServerMessage] = useState(null);
    const  [commandes, setCommandes] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [reloading, setReloading] = useState(false);
    const [isdelete, setisdelete] = useState(false);
    const [status, setStatus] = useState("");


    const token = getToken();
    const userID = getUser()._id;
    const header = {
        headers: {
            Authorization: `Bearer ${token}`,
            id: userID,
        },
    }
    useEffect(() => {
      try {
        setReloading(true);

        const getCommandes = async ()=>{
            await api.getCommandesCustormer(header)
            .then(res => {
                console.log(res);
                setCommandes(res.data);
                setServerMessage({ message: res.data.message, type: 'success' });
                setServerMessageKey(prev => prev + 1);
            })
        }

        getCommandes();
      } catch (error) {
          const resolvedError =  error.response;
          setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
          setServerMessageKey(prev => prev + 1);
      }finally{
        setReloading(false);
      }
        
    }, []);

    const handleValidate = async (commande, update_status) => {
        const header = {
            headers: {
                Authorization: `Bearer ${token}`,
                id: commande._id,
            },
        }

        setStatus(update_status);
        await api.updateCommande({status: update_status}, header)
        .then(res => {
          setServerMessageKey(prevKey => prevKey + 1);
          setServerMessage({
            message: res.data.message,
            type: 'success',
          });
        })
        .catch(error => {
          const resolvedError = error.response;
          setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
          setServerMessageKey(prevKey => prevKey + 1);
          console.log(error);
        })    
      };
    
    
      const handleConfirmDelete = async (commande) => {
        const header = {
            headers: {
                Authorization: `Bearer ${token}`,
                id: commande._id,
            },
        }
        await api.deleteCommande(header)
        .then(res => {
          setServerMessageKey(prevKey => prevKey + 1);
          setServerMessage({
            message: res.data.message,
            type: 'success',
          });
          setisdelete(true)
        })
        .catch(error => {
          const resolvedError = error.response;
          setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
          setServerMessageKey(prevKey => prevKey + 1);
          console.log(error);
        })  
      };
      const handleDelete = async () => {
        setShowDialog(true);  
      };


    return (
        <div  >
            <ConfirmationDialog
                show={showDialog}
                handleClose={() => setShowDialog(false)}
                handleConfirm={handleConfirmDelete}
                message="Êtes-vous sûr de vouloir supprimer cette commande ?"
            />
            <p className='commandes'>Mes Commandes </p>
            <div className='row p-2 mb-5'>
                {
                    !reloading ? commandes.map((commande, index) =>
                        <div className="col-3 my-3 small-commande-card">
                            {!commande.serviceId &&  <div style={{color :"gray", fontWeight:"bold", fontSiz:"1rem"}}>{"Service supprimé"} </div>} 

                            <SmallCommandeCard key={index} width={"200px"} height={"180px"} commande={commande}/>
                            {/* {!(commande.status ==="completed" || commande.status ==="cancelled") ? <p>
                                <span  className='mx-2' onClick={()=>handleValidate(commande, 'completed')}><FaCheck /> </span>
                                <span   className='mx-2'onClick={()=>handleValidate(commande, 'cancelled')}><FaTrash /></span>
                            </p> : ""} */}
                        </div>
                    ) :<Loading />
                }
                {
                  commandes.length == 0 && <h4 style={{color: "gray", fontWeight:"bold", fontSize:"1rem"}}>Pas de commande</h4>
                }
            </div>
        </div>
  )
}

export default MyCommande