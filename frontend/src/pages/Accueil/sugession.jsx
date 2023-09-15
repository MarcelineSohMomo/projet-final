import React from 'react'
import search from '../../assets/icons/search.svg'


const Sugession = () => {
  return (
    <>
        <div className="d-flex justify-content-between search " style={{background: '#F5F4F4', borderRadius: "5px 0 0 5px"}}>
            <div className='d-flex rounded mx-2'>
                <img src={search} alt="" style={{width : "20px"}}/><input style={{flex : "1 auto 1", width : "400px", outline: "none" }} type="text" placeholder='ex: décoration' className='bg-transparent ' />
            </div>
            <div className='d-flex justify-content-center  align-items-center text-white font-weight rounded-r' style={{backgroundColor: "#1DBF73", width: "224px", height: "50px"}}>
                Rechercher
            </div>
        </div>
        <div className="d-flex my-4">
            <div className='flex justify-content-center  align-items-center '>
                Les plus populaires :
            </div> 
            <div style={{ color : "#7A7A7A", border: "1px solid #7A7A7A" ,borderRadius: "30px"}} className="mx-2 p-2" >Coiffure</div>
            <div style={{ color : "#7A7A7A", border: "1px solid #7A7A7A" ,borderRadius: "30px"}} className="mx-1.5 p-2">Esthétique</div>
        </div>
    </>
  )
}

export default Sugession