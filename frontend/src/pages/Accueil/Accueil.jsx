import React from 'react'
import Navbar from '../../components/navbar/Navbar';
import Sugession from './sugession';
import artisan from "../../assets/images/artisan.svg";
import Talents from './Talents';
import Scrollgroupcard from '../../components/card/scrollgroupcard';
import Picturecard from '../../components/card/picturecard';
import yellowcard from "../../assets/images/yellowcard.svg"
import { Link } from 'react-router-dom';
import './accueil.scss';
import Footer from '../../components/footer/Footer';


const Accueil = () => {
  return (    
    <div className='main-accueil'>
        <div className="container">
            <div className="row px-4">
                <Navbar/>
            </div>
            <div className="row px-4" >
                <div className="d-flex flex-column col-md-6 justify-content-center ">
                    <div className="" >
                       <div className='mx-2 title-right-bloc' > Trouver le parfait <span style={{border: "none",  borderBottom: "10px solid #F2BF5E", margin:"0 10px"}}>artisan</span>
                         pour <br /> votre entreprise
                        </div>
                    </div> <br /> <br /> <br /><br /> <br />
                    <Sugession />
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className='img-left-bloc'>
                        <img src={artisan} alt="" />
                    </div>
                </div>
            </div>
            <br /><br />
            <div className="row">
                <div className="col d-flex justify-content-center align-items-center h2">
                    Trouver le votre parmi nos <span className="prestation-rec"> 10 + catégories </span>
                </div>
            </div>
            <br />
            <div className="row">
                {                                                                   }
            </div>
            <br /><br />
        </div>
        <Talents />
        <div className="container-fluid">
            <br /><br /><br />
            <div className="row">
                <br />
                <div className=" col d-flex justify-content-center align-items-center h2">
                    Ils  <span className="confiance-rec">nous ont fait confiance</span>
                </div>
                <Scrollgroupcard data={[]} />
            </div>
            <div className=" row justify-content-center align-items-center">
                <h2 className='h1 text-center mb-4'>Services les plus populaires</h2>
                <Picturecard data={[]}  imgWidth={"250px"} imgHeight={"300px"} />
            </div>
            <div className=" row justify-content-center align-items-center" >
                <div style={{width : "800px", height : "300px"}} >
                    <div className="col-12 d-flex flex-column justify-content-center align-items-center" style={{width : "100%", height : "100%" ,background : `url(${yellowcard}) center center no-repeat`}}>
                        <h2 className='h2 m-2'>Trouvez le talent qu’il vous faut</h2>
                        <p className='text-center m-2' style={{fontWeight:100}}>Aliquet sapien pretium rhoncus, adipiscing morbi adipiscing nisl nec. Felis <br /> aliquet et, phasellus est semper. Fringilla elit a aliquam pharetra quam.</p>
                        <br />
                        <Link to={"/inscription"}>
                            <button style={{color:"white", background: "#1DBF73",padding:"1rem",width:"fit-content", height:"fit-content", borderRadius: "10px"}}>
                                Commencez maintenant
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        <br /><br /><hr />
        <Footer />
    </div>
  )
}

export default Accueil;