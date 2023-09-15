import React from 'react'
import './cards.css'

const LeftIcon = (props) =>{
    const subtitle =props.subtitle ? <div style={{fontSize: "1rem", color: `${props.subTitleColor}` }}>{props.subtitle}</div> : null
    return <>
        <div className='card-icon-left row p-0 m-0'>
            <div className='col-3 d-flex justify-content-center p-0'>
                {
                    props.wrapper   ? <div style={{ backgroundColor : "#fff", borderRadius:"50%", width : "70px", height:"70px",display:"flex", justifyContent:"center", alignItems:"center"}}> <img  src={props.icon} alt=""  style={{width: "60%"}}/> </div> : 
                     ( !props.rounded ? 
                     <div style={{width: `${props.width}`, height: `${props.height}`}}> <img style={{width: "100%", height:"100%"}}  src={props.icon} alt="" /> </div> : 
                        props.rounded && <div style={{width: `${props.width}`, height: `${props.height}`}}> <img style={{width: "100%", height:"100%", borderRadius:"100%"}}  src={props.icon} alt="" /> </div>
                     )
                }
                {
                    
                }
            </div>
            <div className="col-9 d-flex justify-content-center align-items-center" style={{padding : `${props.padding}`}}>
            {
                props.children === undefined ?
                    <>
                        <div className='col p-0' style={{ backgroundColor : `${props.backgroundColor}` }}>
                            <div style={{fontWeight: "bold", fontSize : "14px", color : `${props.titleColor}`}} className="row justify-content-between">
                                <div className="col d-flex"  style={{margin : `${props.titlemargin}`, fontSize : `${props.titlesize}`}}>{props.title}</div>
                                <div className="col d-flex justify-content-end" style={{fontWeight: "200"}}>{props.times}</div>
                            </div>
                            <div style={{fontWeight: "200"}}>{subtitle}</div>
                        </div>
                        { props.badge &&  <div className="" style={{backgroundColor:"rgba(0,255,0,.4)",margin:"0 4px", padding : "4px",borderRadius:'10px', color:'green'}} >{props.badge}</div> }
                    </>
                 : props.children }
            </div>
        </div>
    </>
}
export default LeftIcon