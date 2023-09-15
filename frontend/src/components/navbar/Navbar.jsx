import React from 'react'
import { Link } from 'react-router-dom'
import LoginSignUpBtn from '../btnAuth/LoginSignUpBtn'
import styles from './navbar.module.css'

const Navbar = () => {
  return (
    <nav className={styles['navbar']}>
        <div className={styles['navbar-logo']}>EMM’S PRESTATION</div>
        <ul className={styles['nav-links']}>
            <input type="checkbox" id="checkbox_toggle" />
            <label for="checkbox_toggle" className={styles['hamburger']}>&#9776;</label>
            <div className={styles["menu"]}>
                <Link >Explorez</Link>
                <Link to={"/signup-artisan"} >Devenir prestataire</Link>
            </div>
        </ul>
        <div>
            <LoginSignUpBtn />
        </div>
    </nav>
  )
}

export default Navbar


