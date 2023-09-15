import React from 'react'
import Signin from '../../pages/Auth/Signin';

const VerifyAuth = (props) => {
    return (
    <>
        {localStorage.getItem("isconnected") ? props.children : <Signin />}
    </>
  )
}

export default VerifyAuth