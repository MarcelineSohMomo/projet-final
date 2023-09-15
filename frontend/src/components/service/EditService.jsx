import React from 'react'
import { useState } from 'react';
import api from '../../api';
import { getToken } from '../../util';
import ImageUpload from '../imageUpload/ImageUpload';
import Loading from '../loading/Loading';
import './editService.scss'


const EditService = ({service, setReLoading}) => {
    const [inputs, setInputs] = useState(service.tarification);
    const [updatedData, setUpdatedData] = useState({
        name: service.name,
        description: service.description,
        others: service.others
    });
    const [isLoading, setIsLoading] = useState(false);
    const header = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            id:service._id
        },
    }
    const addInput = () => {
        setInputs([...inputs, {
            prix:"",
            quantite:""
        }]);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        console.log("inputs : ", inputs)

        const allData = {
            ...updatedData,
            tarification: [...inputs]
        }
        console.log("allData : ", allData)

        try {

            setIsLoading(!isLoading);

            await api.updateService(allData,header)
            .then(res => {
                console.log(res);
                setUpdatedData({
                    name: res.data.name,
                    description: res.data.description,
                    others: res.data.others
                })
            })
            setInputs(service.tarification);
            setReLoading(true);
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }



    const removeInput = (index) =>{
        const updatedInputs = inputs.filter((_, i) => i !== index);
        setInputs(updatedInputs);
    };
    const handleChange = (e) => {
        setUpdatedData({
            ...updatedData,
            [e.target.name]: e.target.value
        });
    }
    const getTarifData = (index, champ, valeur) => {
        const nouveauxInputs = [...inputs];
        nouveauxInputs[index][champ] = valeur;
        setInputs(nouveauxInputs);
    };
    console.log("inputs : ", inputs)
    return (
        <div className="row edit-service">
            <div className="col-8 es-info-text">
                <div className="row">
                    <input 
                        className='es-inputs es-inputs-title' 
                        name='name' 
                        type="text"  
                        placeholder='Nom du service' 
                        value={updatedData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="row">
                    <textarea onChange={handleChange} className='es-textarea' name="description" placeholder='Décrivez votre prestation' id="" cols="30" rows="4" value={updatedData.description}></textarea>
                </div>
                <div className="row justify-content-center ">
                    <p className='es-subtitle p-0'>Différentes formule</p>
                    {
                        inputs.map((input, index) =>(
                            <div className='p-0 row'>
                                <p className='input-row' key={index}>
                                    <input  className='es-inputs ' value={input.prix}   type={"text"} onChange={(e) => getTarifData(index, 'prix', e.target.value)} />
                                    <input  className='es-inputs ' value={input.quantite}type={"text"} onChange={(e) => getTarifData(index, 'quantite', e.target.value)}/>
                                    <button className='es-inputs es-button-delete' onClick={()=> removeInput(index)}>Supprimer</button>
                                </p>
                            </div>
                        ))
                    }
                    <div className="">
                        <button className='es-button' onClick={addInput}>Ajouter un nouveau </button>
                    </div>
                </div>
                <div className="row">
                    <p className='es-subtitle p-0'>Autres...</p>
                </div>
                <div className="row">
                    <textarea className='es-textarea' onChange={handleChange} name="others" placeholder='Autres informations' id="" cols="30" rows="4" value={updatedData.others}></textarea>
                </div>
                <div className="row ">
                    <div onClick={handleSave} className="col d-flex justify-content-center">
                        <button className="es-button es-appliquer">
                            Appliquer
                        </button>
                        
                    </div>
                </div>
            </div>
            <div className="col-4 es-info-img">
                <ImageUpload id={service._id} />
            </div>
            { isLoading &&  <Loading /> }
        </div>
    )
}

export default EditService