import React, { useContext, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { defaultReview, Review } from '../../components/two-side-form'
import './auth.scss'
import SlideShow from '../../components/slide/SlideShow';
import api from '../../api';
import ServerMessage from '../../components/serverMessage/ServerMessage';


function CheckIsEmpty(empty) {
    return empty.lastname === "" || empty.firstname === "" || empty.phone === "" || empty.email === "" || empty.password === "" || empty.confirmpassword === "";
}
const Signup = () => {
	const navigate = useNavigate();
    const [serverMessageKey, setServerMessageKey] = useState(0);
    const [serverMessage, setServerMessage] = useState(null);
    const [navigateToServices, setNavigateToServices] = useState(false);
    const data = {
        lastname : "",
        firstname : "",
        email : "",
        phone : "",
        password : "",
        confirmpassword : ""
    }
    const [errorpassword, setErrorPassword] = useState(false);

	function clearValue() {
        setFormdata(data)
	}

	
    const borderstyle={ border :"1px solid #D9D9D9"}
    const width = "col mx-3 "
    const [formdata, setFormdata] = useState(data)
    const onchange= (e)=>{
        setFormdata({
            ...formdata,
            [e.target.id] : e.target.value
        })
    }
    const submit = (e)=>{
        e.preventDefault();
        if(formdata.password === formdata.confirmpassword){
            api.signup(formdata)
            .then(res => {
                setServerMessage({ message: res.data.message, type: 'success' });
                setServerMessageKey(prev => prev + 1);
                clearValue();
                setTimeout(() => {
                    setNavigateToServices(true);
                }, 1500);
            })
            .catch(error => {
                const resolvedError = error.response;
                setServerMessage({ message: resolvedError?.data?.message, type: 'error' });
                setServerMessageKey(prevKey => prevKey + 1);
 
            })
        }else{
            setErrorPassword(!errorpassword)
        }
    }
    const {lastname, firstname, email, phone, password, confirmpassword} = formdata
    const btnSubmit = (CheckIsEmpty(formdata)) ? <button disabled type="submit" className='signin-button bg-secondary'>S'inscrire</button> :
    <button type="submit" onClick={submit} className='signin-button'>S'inscrire</button>

  return (
    <div className='container-fluid '>
        {navigateToServices && <Navigate to="/signin" />}
        {serverMessage && (
          <ServerMessage
          message={serverMessage.message}
          type={serverMessage.type}
          key={serverMessageKey}
          />
        )}
        <div className="row  justify-content-center align-items-center">
            <div className="col-md-6 justify-content-center align-items-center" style={{padding :"0 5rem"}}>
                <form>
                    <div className="form-row">
                        <div className="mx-3 h3"> S’inscrire à EMM’S PRESTATION </div>
                    </div>
                    <div className="form-row d-flex my-2">
                        <div className={`form-group ${width}`}>
                            <label for="lastname" className='fw-bold'>Nom</label>
                            <input style={borderstyle} value={lastname} onChange={onchange} type="text" class="form-control" id="lastname"/>
                        </div>
                        <div className={`form-group ${width}`} >
                            <label for="firstname" className='fw-bold'>Prenom</label>
                            <input style={borderstyle} value={firstname} onChange={onchange} type="text" class="form-control" id="firstname"/>
                        </div>
                    </div>
                    <div className="form-row d-flex my-2">
                        <div className={`form-group ${width}`} >
                            <label for="email" className='fw-bold'>Email</label>
                            <input style={borderstyle} value={email} onChange={onchange} type="email" class="form-control" id="email"/>
                        </div>
                    </div>
                    <div className="form-row d-flex my-2 ">
                        <div className={`form-group ${width}`} >
                            <label for="phone" className='fw-bold'>Phone</label>
                            <input style={borderstyle} value={phone} onChange={onchange} type="text" class="form-control" id="phone"/>
                        </div>
                    </div>
                    <div className="form-row d-flex my-2 ">
                        <div className={`form-group ${width}`}>
                            <label for="password" className='fw-bold'>Mot de passe</label>
                            <input style={borderstyle} value={password} onChange={onchange} type="password" class="form-control" id="password"/>
                        </div>
                    </div>
                    <div className="form-row d-flex my-2 ">
                        <div className={`form-group ${width}`}>
                            <label for="confirmpassword" className='fw-bold'>Confirmer le mot de passe</label>
                            <input style={borderstyle} value={confirmpassword} onChange={onchange} type="password" class="form-control" id="confirmpassword"/>
                        </div>
                    </div>
                    {errorpassword && <span style={{color:"red" , fontSize:"1.2rem", fontWeight:"bold"}}> Les deux mots de passe entrés sont différents </span>}

                    <div className="form-row mx-3 d-flex my-2">
                        {btnSubmit}
                    </div>
                    <div className="form-row mx-3 d-flex my-1">
                        <button type="submit" className='signin-button socialbtn'>
                            Se connecter avec Google
                        </button>
                    </div>
                    <div className="form-row mx-3 d-flex my-1">
                        <button type="submit" className='signin-button socialbtn'>
                            Se connecter avec Facebook
                        </button>
                    </div>
                    <span className="mx-3 text-center ">
                        Déja inscrit ? 
                        <Link to="/signin" className=" tw-text-primary tw-shadow-yellow-underline hover:tw-text-green-700 tw-cursor-pointer tw-visited:text-green-700"> Connectez-vous </Link>
                    </span>
                </form>
            </div>
            <div className="col-md-6 p-0" style={{height: "100vh"}}>
                <SlideShow reviews={defaultReview} />
            </div>
        </div>
    </div>
  )
}

export default Signup