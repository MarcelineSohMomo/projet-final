import React, { Fragment, useState } from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import Statistics from "./Statistics";
import Services from "./Services";
import AllServices from "./AllServices";
import ProfileWithoutnavbar from "../User/ProfileWithoutnavbar";
import MyCommande from "./MyCommande";
import MyFavorite from "./MyFavorite";
import VerifyAuth from "../../components/VerifyAuth/VerifyAuth";
import Historique from "./Historique";
import ServicesArtisan from "../../components/serviceArtisan/ServicesArtisan";
import ManageUsers from "./ManageUsers";
import { getUser } from "../../util";
import "../../components/profil/profil.scss";
import "./dashboard.scss";
import CommandeClient from "./CommandeClient";

const Dashboard = () => {
  const roles = getUser().roles;
  const location = useLocation();
  // const auth = useSelector((state) => state.auth);
  const isconnected = localStorage.getItem("isconnected");

  const setDisplayCustomer = () => {
    return isconnected && roles.some((role) => (role.name.value = 1));
  };
  const setDisplayArtisan = () => {
    return isconnected && roles.some((role) => role.value >= 2);
  };

  const setDisplayModerator = () => {
    return isconnected && roles.some((role) => role.value >= 3);
  };

  const navLinkStyle = {
    color: "gray",
  };
  const activeNavLinkStyle = {
    color: "black",
    backgroundColor: "rgb(69, 223, 190)",
    boxShadow:
      "rgb(69, 223, 190) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px",
  };
  return (
    <VerifyAuth>
      <CustomNavbar addstyle={"addstyle"} />
      <Container fluid className="my-5 ">
        <Row>
          <Col xs={3} md={2} lg={2} className="sidebar-dashboard px-2">
            <Card className="m-0 h-100 " style={{ border: "0" }}>
              <h4 className="dashboard-title">Dashboard</h4>
              <Card.Body className="p-0" style={{ overflowY: "scroll" }}>
                <Nav className=" flex-column">
                  {setDisplayModerator() && (
                    <>
                      <Nav.Item>
                        <Nav.Link
                          className="dashboard-navlink"
                          as={Link}
                          to="/dashboard/allservices"
                          style={
                            location.pathname === "/dashboard/allservices"
                              ? { ...navLinkStyle, ...activeNavLinkStyle }
                              : navLinkStyle
                          }
                        >
                          Tous les services
                        </Nav.Link>
                      </Nav.Item>
                    </>
                  )}
                  {(setDisplayArtisan() || setDisplayModerator()) && (
                    <>
                      <Nav.Item>
                        <Nav.Link
                          className="dashboard-navlink"
                          as={Link}
                          to="/dashboard/services"
                          style={
                            location.pathname === "/dashboard/services"
                              ? { ...navLinkStyle, ...activeNavLinkStyle }
                              : navLinkStyle
                          }
                        >
                          Services
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          className="dashboard-navlink"
                          as={Link}
                          to="/dashboard/statistics"
                          style={
                            location.pathname === "/dashboard/statistics"
                              ? { ...navLinkStyle, ...activeNavLinkStyle }
                              : navLinkStyle
                          }
                        >
                          Statistiques
                        </Nav.Link>
                      </Nav.Item>
                    </>
                  )}

                  <Nav.Item>
                    <Nav.Link
                      className="dashboard-navlink"
                      as={Link}
                      to="/dashboard/profile"
                      style={
                        location.pathname === "/dashboard/profile"
                          ? { ...navLinkStyle, ...activeNavLinkStyle }
                          : navLinkStyle
                      }
                    >
                      Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      className="dashboard-navlink"
                      as={Link}
                      to="/dashboard/favories"
                      style={
                        location.pathname === "/dashboard/favories"
                          ? { ...navLinkStyle, ...activeNavLinkStyle }
                          : navLinkStyle
                      }
                    >
                      Mes favories
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      className="dashboard-navlink"
                      as={Link}
                      to="/dashboard/commande"
                      style={
                        location.pathname === "/dashboard/commande"
                          ? { ...navLinkStyle, ...activeNavLinkStyle }
                          : navLinkStyle
                      }
                    >
                      Mes Commandes
                    </Nav.Link>
                  </Nav.Item>
                  {(setDisplayArtisan() || setDisplayModerator()) && (
                    <Nav.Item>
                      <Nav.Link
                        className="dashboard-navlink"
                        as={Link}
                        to="/dashboard/commandes-clients"
                        style={
                          location.pathname === "/dashboard/commandes-clients"
                            ? { ...navLinkStyle, ...activeNavLinkStyle }
                            : navLinkStyle
                        }
                      >
                        Commandes reçues
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link
                      className="dashboard-navlink"
                      as={Link}
                      to="/dashboard/historique"
                      style={
                        location.pathname === "/dashboard/historique"
                          ? { ...navLinkStyle, ...activeNavLinkStyle }
                          : navLinkStyle
                      }
                    >
                      Mes historique
                    </Nav.Link>
                  </Nav.Item>
                  {setDisplayModerator() && (
                    <Nav.Item>
                      <Nav.Link
                        className="dashboard-navlink"
                        as={Link}
                        to="/dashboard/manages-users"
                        style={
                          location.pathname === "/dashboard/manages-users"
                            ? { ...navLinkStyle, ...activeNavLinkStyle }
                            : navLinkStyle
                        }
                      >
                        Gestion Utilisateurs
                      </Nav.Link>
                    </Nav.Item>
                  )}
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          {setDisplayModerator && (
            <Col
              xs={9}
              md={10}
              lg={10}
              className=" main-content dashboard-content"
            >
              <Routes>
                {setDisplayArtisan && (
                  <Route path="/" element={<ServicesArtisan />} />
                )}
                {setDisplayArtisan && (
                  <Route path="/services" element={<Services />} />
                )}
                {setDisplayModerator && (
                  <Route path="/" element={<Services />} />
                )}
                {setDisplayModerator && (
                  <Route path="/services" element={<Services />} />
                )}
                {setDisplayModerator && (
                  <Route path="/allservices" element={<AllServices />} />
                )}
                {setDisplayModerator() && (
                  <Route path="/manages-users" element={<ManageUsers />} />
                )}
                {setDisplayArtisan && (
                  <Route path="/statistics" element={<Statistics />} />
                )}
                {setDisplayArtisan && (
                  <Route
                    path="/commandes-clients"
                    element={<CommandeClient />}
                  />
                )}

                <Route path="/profile" element={<ProfileWithoutnavbar />} />
                <Route path="/favories" element={<MyFavorite />} />
                <Route path="/commande" element={<MyCommande />} />
                <Route path="/historique" element={<Historique />} />
              </Routes>
            </Col>
          )}
        </Row>
      </Container>
    </VerifyAuth>
  );
};

export default Dashboard;
