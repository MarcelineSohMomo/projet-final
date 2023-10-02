import { Fragment, useState } from "react";
import ServicesBackground from "./ServicesBackground";
import TitreServices from "./TitreServices";
import AccueilClasses from "./home.css";
import Footer from "../../components/footer/Footer";
import { useEffect } from "react";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import api from "../../api";
import ServicesByCategory from "../../components/service/ServicesByCategory";
import VerifyAuth from "../../components/VerifyAuth/VerifyAuth";
import { Carousel } from "react-bootstrap";
import img01 from "../../assets/images/jakob-owens-15IJv-APJSE-unsplash.jpg";
import img02 from "../../assets/images/jakob-owens-DhS2f0QO7z4-unsplash.jpg";
import img03 from "../../assets/images/jakob-owens-DQPP9rVLYGQ-unsplash.jpg";
import { Button } from "react-bootstrap";

const AccueilServices = () => {
  const token = localStorage.getItem("token");
  const [services, setServices] = useState([]);
  const [clickedMemberId, setClickedMemberId] = useState(null);
  const [query, setQuery] = useState("");
  const [distance, setDistance] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSuccess = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation([latitude, longitude]);
  };

  const handleError = () => {
    setError("Impossible de récupérer votre localisation!");
    setTimeout(() => {
      setError("");
    }, "2000");
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        api
          .services({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setServices(res.data);
          });
      } catch (err) {
        console.log(
          "Une erreur c'est produit lors de la recupération des services ",
          err
        );
      }
    };
    fetchServices();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      setError(
        "La géolocalisation n'est pas prise en charge par votre navigateur."
      );
    }
  }, []);

  const handleSearch = async () => {
    // hit endpoint to search
    try {
      const res = await api.searchServices({
        headers: {
          Authorization: `Bearer ${token}`,
          query: query,
          distance: parseInt(distance) * 1000,
          lat: location[0],
          lng: location[1],
        },
      });

      setServices(res.data);
      console.log(res);
    } catch (err) {
      setError(err?.response?.data?.message);
      setTimeout(() => {
        setError("");
      }, "5000");
    }
  };

  return (
    <VerifyAuth>
      <Fragment>
        <CustomNavbar clickedMemberId={clickedMemberId} />
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover", height: "50vh" }}
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
              style={{ objectFit: "cover", height: "50vh" }}
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
              style={{ objectFit: "cover", height: "50vh" }}
              src={img03}
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <ServicesBackground>
          <div class="d-flex flex-column align-items-center pt-4">
            <div>
              <div className="d-flex">
                <input
                  className="rounded border-sm bg-transparent px-2"
                  style={{ marginRight: 4, outline: "none" }}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tapez ici pour rechercher"
                />
                <input
                  className="rounded border-sm bg-transparent px-2"
                  style={{ marginRight: 4, outline: "none" }}
                  type="text"
                  value={query}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Tapez la distance en km"
                />
                <Button
                  className="text-white rounded"
                  style={{ backgroundColor: "#1DBF73", height: "50px" }}
                  onClick={() => handleSearch()}
                  disabled={query.trim() ? false : true}
                >
                  Rechercher
                </Button>
              </div>
              <p className="text-danger mt-1">{error}</p>
            </div>
            <div className="d-flex my-4">
              <div className="flex justify-content-center  align-items-center ">
                Les plus populaires :
              </div>
              <div
                style={{
                  color: "#7A7A7A",
                  border: "1px solid #7A7A7A",
                  borderRadius: "30px",
                }}
                className="mx-2 p-2"
              >
                Coiffure
              </div>
              <div
                style={{
                  color: "#7A7A7A",
                  border: "1px solid #7A7A7A",
                  borderRadius: "30px",
                }}
                className="mx-1.5 p-2"
              >
                Esthétique
              </div>
            </div>
          </div>
          <ServicesByCategory services={services} />
        </ServicesBackground>
        <Footer />
      </Fragment>
    </VerifyAuth>
  );
};

export default AccueilServices;
