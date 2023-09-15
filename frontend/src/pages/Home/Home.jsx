import { Fragment, useState } from "react";
import ServicesBackground from "./ServicesBackground";
import TitreServices from "./TitreServices";
import AccueilClasses from "./home.css";
import Footer from "../../components/footer/Footer";
import { useEffect } from "react";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import api from "../../api";
import ServicesByCategory from "../../components/service/ServicesByCategory"
import VerifyAuth from "../../components/VerifyAuth/VerifyAuth";
import { Carousel } from "react-bootstrap";
import img01  from "../../assets/images/jakob-owens-15IJv-APJSE-unsplash.jpg"
import img02 from "../../assets/images/jakob-owens-DhS2f0QO7z4-unsplash.jpg"
import img03 from "../../assets/images/jakob-owens-DQPP9rVLYGQ-unsplash.jpg"

const AccueilServices = () => {
  const token = localStorage.getItem("token");
  const [services, setServices] = useState([]);
  const [clickedMemberId, setClickedMemberId] = useState(null);
  
  const  user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchServices = async () => {
    try {
      api.services({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        setServices(res.data)
        console.log(res)
      })
    }catch (err) {
      console.log("Une erreur c'est produit lors de la recupération des services ", err);
    }
    };
    fetchServices()
    }, []);

  return (
    <VerifyAuth>
      <Fragment>
        <CustomNavbar clickedMemberId={clickedMemberId} />
        <div className="row" style={{height:"90vh", overflow:"scroll"}}>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={img01}
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={img02}
                alt="Second slide"
              />
              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={img03}
                alt="Third slide"
              />
              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
          <ServicesBackground>
              <ServicesByCategory services={services} />
          </ServicesBackground>
          <Footer />
        </div>
      </Fragment>
    </VerifyAuth>
  );
};

export default AccueilServices;
