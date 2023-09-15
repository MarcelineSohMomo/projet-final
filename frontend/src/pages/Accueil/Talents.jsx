import React from 'react'
import LeftIcon from '../../components/card/LeftIcon';
import budget from '../../assets/images/budget.svg'
import quality from '../../assets/images/quality.svg'
import payement from '../../assets/images/payement.svg'
import line from '../../assets/images/line.svg'
import dev from '../../assets/images/dev.svg'

const Talents = () => {
  return (
    <div className="container-fluid find-talents">
        <div className="row justify-content-center ">
            <div className="col-md-5 col-xs-12 m-2">
                <div className="display-4" style={{fontWeight: "600"}}>Trouver des talents à porter de main</div>
                <br />
                <LeftIcon icon={budget} width={"70px"}  title={"Le meilleur pour chaque budget"} subtitle={"Ullamcorper magna faucibus tempus consequat nunc pulvinar leo, tristique facilisi. Quis feugiat pellentesque lobortis lacus amet at etiam egestas. Hac lobortis porta ac dui integer sit sit."} />
                <br />
                <LeftIcon icon={quality}  width={"70px"} title={"Le meilleur pour chaque budget"} subtitle={"Ullamcorper magna faucibus tempus consequat nunc pulvinar leo, tristique facilisi. Quis feugiat pellentesque lobortis lacus amet at etiam egestas. Hac lobortis porta ac dui integer sit sit."} />
                <br />
                <LeftIcon wrapper={true} icon={payement}  title={"Le meilleur pour chaque budget"} subtitle={"Ullamcorper magna faucibus tempus consequat nunc pulvinar leo, tristique facilisi. Quis feugiat pellentesque lobortis lacus amet at etiam egestas. Hac lobortis porta ac dui integer sit sit."} />
            </div>
            <div className="col-md-5 m-2 col-xs-12 d-flex flex-column justify-content-center align-items-center">
                
                <h2 className='my-3' style={{fontWeight: "200", fontSize:"2rem"}}>Est lorem lacus, ultrices erat turpis. Mi egestas mi mauris in condimentum praesent.</h2>
                <div className='row green-card'>
                    <div className="col-5">
                        <span style={{fontWeight: "bolder", fontSize:"4rem", color:"#fff"}}>05</span>
                        <p>Ans d'Expérience</p>
                    </div>
                    <div className="col d-flex justify-content-center py-3" > <img  src={line} alt=""  /> </div>
                    <div className="col-5">
                        <span style={{fontWeight: "bolder", fontSize:"4rem", color:"#fff"}}>250</span>
                        <p>Services</p>
                    </div>
                </div>
                <div className='row'>
                    <img src={dev} alt="" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Talents