import React from 'react';
import { Navbar, Container, Nav, Form, FormControl, Button, Dropdown, Image, Row} from 'react-bootstrap';
import './CustomNavbar.scss'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/actions';
import Loading from '../loading/Loading';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../util';
import { useEffect } from 'react';
import { useState } from 'react';
import { FaUser, FaUserAlt, FaUserAltSlash } from 'react-icons/fa';
import Notification from '../Notification/Notification';

  


const CustomNavbar = ({addstyle}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const isconnected =  localStorage.getItem("isconnected");
  const  user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();
  const [clickedMemberId, setClickedMemberId] = useState(null);


  const handleLogout = () => {
    localStorage.clear()
    return navigate("/signin");
  };
  const hasNewMessage = true;

  useEffect(() => {
    setClickedMemberId(getUser()._id)
    const handleScroll = () => {
      setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isScrolled = scrollPosition > 0;


  if (!isconnected) {
    return <>
      <Row className='justify-content-center'>
        <h3>Reconnecte vous pour que les mises à jour soient appliquees</h3>
      </Row>
      <Loading />

    </>;
  }
  const navbarStyle = addstyle != null ? addstyle : (isScrolled ? 'scrolled' : '');

  return (
    <Navbar  className={`navbar ${navbarStyle}`} expand="lg">
      <Container>
        <Navbar.Brand href="/home" className='text-color logo'>EMMS PRESTATION</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/signup-artisan" className='text-color'>Devenir prestataire</Nav.Link>
            <Nav.Link href="#notifications" className="position-relative">
              <i className="bi bi-bell"></i>
              { <span className="notification-badge"><Notification clickedMemberId={clickedMemberId} /> </span>}
            </Nav.Link>
          </Nav>
          <Nav>
          <Nav.Link className=" current-user position-relative">
                <span><FaUser /> {getUser().firstname } &nbsp;</span>
                <span> {getUser().lastname}  &nbsp;</span>
                <span className='role-user'> {getUser().roles[0].name}</span>
            </Nav.Link>
          </Nav>
          <Dropdown align="end">
            <Dropdown.Toggle variant="none">
              {<Image
                src={`http://localhost:5000/${getUser().img}`}
                roundedCircle
                alt="Menu"
                width="50"
                height="50"
              />}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/profile" >Profile</Dropdown.Item>
              <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
              <Dropdown.Item href="/service">Creer un service</Dropdown.Item>
              <Dropdown.Item href="/inbox">Inbox</Dropdown.Item>
              <Dropdown.Item  onClick={handleLogout}>Déconnexion</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
