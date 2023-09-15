import React from 'react'
import LeftIcon from './LeftIcon'

const Customcard = (props) => {
  return (
    <div className='custom-card' style={{width : "100%", height:"100%", padding: "2rem"}}>
        <p>{props.description} </p>
        <br />
        <LeftIcon  width={props.width}  title={props.title} subtitle={props.subtitle} icon={props.icon} />
    </div>
  )
}

export default Customcard