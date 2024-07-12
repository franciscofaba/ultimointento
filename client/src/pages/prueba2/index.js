import React, { useEffect,useRef, useState } from 'react';
import {NavDropdown,Nav, Card, Row,Col, Button} from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Spain from "../../images/Flag_of_Spain.svg";
import Usa from "../../images/Flag_of_the_United_States.svg";
import './estilos.css';
import Cookies from 'js-cookie';
import useWindowSize from './useWindowSize';


function Pagina2({ children }) {
  const size = useWindowSize();
  const [t, i18n]= useTranslation("global");
  const [idUser, setIdUser] = useState(null);
  const [idCareer_fk, setIdCareer_fk] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const toggleMenu = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom, left: rect.left });
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const userId = Cookies.get('userId');
    console.log(userId);  // Verificar valor
 
    if (userId) {
      console.log('este es id: ', userId);
      const url = `http://localhost:5000/api/user/${userId}`;
      console.log("Fetching URL:", url);  // Verificar la URL completa
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setIdUser(data.idUser);
          setIdCareer_fk(data.idCareer_fk);
          setUserName(data.UserName);
          setEmail(data.email);
          setRole(data.role);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);
  useEffect(() => {
    console.log(idUser, idCareer_fk, userName, email, role);
  }, [idUser, idCareer_fk, userName, email, role]); 
  return (
    
    <div >
      <div className="container-scroller">

        {/* <!-- partial:partials/_sidebar.html --> */}
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
            <a className="sidebar-brand brand-logo" href="index.html">
              <img src="assets/images/logo.svg" alt="logo" />
            </a>
            <a className="sidebar-brand brand-logo-mini" href="index.html">
              <img src="assets/images/logo-mini.svg" alt="logo" />
            </a>
          </div>
          <ul className="nav">
            <li className="nav-item profile">
              <div className="profile-desc">
                <div className="profile-pic">
                  <div className="count-indicator">
                    <img
                      className="img-xs rounded-circle "
                      src="assets/images/faces-clipart/pic-4.png"
                      alt=""
                    ></img>
                    <span className="count bg-success"></span>
                  </div>
                  <div className="profile-name">
                    <h5 className="mb-0 font-weight-normal" style={{ color: '#FFFFFF' }}>{userName}</h5>
                    <span>{t("prueba.t11")}</span>
                  </div>
                </div>
            
              
                
              </div>
            </li>

            

            <li className="nav-item nav-category">
              <span className="nav-link">{t("prueba.t3")}</span>
            </li>
            <li className="nav-item menu-items">
              <div
                className="nav-link"
                href=""
              >
                <span className="menu-icon">
                  <i className="mdi mdi-file-document-box"></i>
                </span>
                <span className="menu-title" > 
                  <Nav.Item>
                    <Nav.Link href="/Portal2_chatbot" style={{ color: '#FFFFFF' }} >Chatbot </Nav.Link>
                  </Nav.Item>
                </span>
              </div>
            </li>
            <li className="nav-item menu-items">
              
                <div className="nav-link" href="index.html">
                  <span className="menu-icon">
                    <i className="mdi mdi-speedometer"></i>
                  </span>
                  <span className="menu-title">
                    <Nav.Item>
                      <Nav.Link href="/Portal2" eventKey="link-1" style={{ color: '#FFFFFF' }}>{t("prueba.t10")}</Nav.Link>
                    </Nav.Item>

                  </span>
                </div>
          
            </li>

            <li className="nav-item menu-items">
          <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }} href="index.html">
            <span className="menu-icon" style={{ flexShrink: 0, minWidth: '24px' }}>
              <i className="mdi mdi-speedometer"></i>
            </span>
            <span className="menu-title" style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
              <Nav.Item>
                <Nav.Link href="/SubirImagen" eventKey="link-1" style={{ color: '#FFFFFF' }}>{t("portal2.t12")}</Nav.Link>
              </Nav.Item>
            </span>
          </div>
        </li>

        <li className="nav-item menu-items">
          <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }} href="index.html">
            <span className="menu-icon" style={{ flexShrink: 0, minWidth: '24px' }}>
              <i className="mdi mdi-speedometer"></i>
            </span>
            <span className="menu-title" style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
              <Nav.Item>
                <Nav.Link href="/portal2_ver_asistencia" eventKey="link-1" style={{ color: '#FFFFFF' }}>{t("portal2.t18")}</Nav.Link>
              </Nav.Item>
            </span>
          </div>
        </li>
        
        <li className="nav-item menu-items">
          <div className="nav-link" style={{ display: 'flex', alignItems: 'center' }} href="index.html">
            <span className="menu-icon" style={{ flexShrink: 0, minWidth: '24px' }}>
              <i className="mdi mdi-speedometer"></i>
            </span>
            <span className="menu-title" style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
              <Nav.Item>
                <Nav.Link href="/portal2_contar_asistencia" eventKey="link-1" style={{ color: '#FFFFFF' }}>{t("portal2.t14")}</Nav.Link>
              </Nav.Item>
            </span>
          </div>
        </li>

          
          </ul>

        
        
        </nav>
        {/* <!-- partial --> */}
        <div className="container-fluid page-body-wrapper">
























          {/* <!-- partial:partials/_navbar.html --> */}
          <nav className="navbar p-0 fixed-top d-flex flex-row">
      <div className="d-flex d-lg-none align-items-center justify-content-center">
        <Button
          ref={buttonRef}
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          aria-controls="navbarNavDropdown"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="mdi mdi-menu"></span>
        </Button>

        {menuOpen && (
          <div className="nav-dropdown-custom" style={{ top: `${menuPosition.top + 5}px`, left: `${menuPosition.left}px` }}>
            <div className="nav-item" onClick={() => window.location.href = "/Portal2_chatbot"}>
              Chatbot
            </div>
            <div className="nav-item" onClick={() => window.location.href = "/Portal2"}>
              {t("prueba.t10")}
            </div>
            <div className="nav-item" onClick={() => window.location.href = "/SubirImagen"}>
              {t("portal2.t12")}
            </div>
            <div className="nav-item" onClick={() => window.location.href = "/portal2_ver_asistencia"}>
              {t("portal2.t18")}
            </div>
            <div className="nav-item" onClick={() => window.location.href = "/portal2_contar_asistencia"}>
              {t("portal2.t14")}
            </div>
          </div>
        )}
      </div>
      <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
        <ul className="navbar-nav w-100">
          <li className="nav-item w-100">
            <h3>{t("prueba.t1")}</h3>
          </li>
        </ul>

        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-settings d-none d-lg-block">
            <div className="nav-link">
              <div>
                <NavDropdown
                  className="text-light d-flex justify-content-end"
                  id="nav-dropdown-3"
                  title={t("top.t1")}
                  menuVariant="light"
                  style={{ marginRight: '20px', fontSize: '23px' }}
                >
                  <NavDropdown.Item>
                    <button
                      onClick={() => i18n.changeLanguage("es")}
                      className="custom-button-idioma d-flex align-items-center"
                      style={{ maxWidth: '150px' }}
                    >
                      <img
                        src={Spain}
                        alt="spain"
                        style={{ width: '20px', marginRight: '5px' }}
                      />
                      ES
                    </button>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <button
                      onClick={() => i18n.changeLanguage("en")}
                      className="custom-button-idioma d-flex align-items-center"
                      style={{ maxWidth: '150px' }}
                    >
                      <img
                        src={Usa}
                        alt="usa"
                        style={{ width: '20px', marginRight: '5px' }}
                      />
                      EN
                    </button>
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </div>
          </li>

          <li className="nav-item dropdown">
            <div
              className="nav-link"
              id="profileDropdown"
              data-bs-toggle="dropdown"
            >
              <div className="navbar-profile">
                <img
                  className="img-xs rounded-circle"
                  src="assets/images/faces-clipart/pic-4.png"
                  alt=""
                />
                <NavDropdown
                  id="nav-dropdown-dark-example"
                  title={email}
                  menuVariant="dark"
                  align={{ lg: 'end' }}
                >
                  <NavDropdown.Item href="/login">
                    {t("prueba.t9")}
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
          {/* <!-- partial --> */}
          

          {size.width >= 768 ? (
          <div className="d-flex justify-content-center" style={{marginTop:'5px' , width:'90%'}} >
            <Card style={{marginTop:'70px' , width:'80%'}} border="success" bg='light' >
              <Card.Header as="h5" className="d-flex justify-content-center" >UAI</Card.Header>
              <Row>
                <Col xs={1}></Col>
                <Col xs={10}>{children}</Col>
                <Col xs={1}></Col>
              </Row>
              
            </Card>
          </div>
           ) : (
            <div className="flex-fill justify-content-center" style={{marginTop:'105px' , width:'100%'}}>
              
              <Row style={{marginTop:'5px'}}>
                <Col xs={12}>{children}</Col>
              </Row>
            </div>
          )}
  
       
          
     
          

          {/* <!-- partial --> */}
        </div>
       
        {/* <!-- main-panel ends --> */}
      </div>
   
      <script src="assets/vendors/js/vendor.bundle.base.js"></script>

      <script src="assets/vendors/chart.js/Chart.min.js"></script>
      <script src="assets/vendors/progressbar.js/progressbar.min.js"></script>
      <script src="assets/vendors/jvectormap/jquery-jvectormap.min.js"></script>
      <script src="assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
      <script src="assets/vendors/owl-carousel-2/owl.carousel.min.js"></script>
      <script src="assets/js/jquery.cookie.js" type="text/javascript"></script>

      <script src="assets/js/off-canvas.js"></script>
      <script src="assets/js/hoverable-collapse.js"></script>
      <script src="assets/js/misc.js"></script>
      <script src="assets/js/settings.js"></script>
      <script src="assets/js/todolist.js"></script>

      <script src="assets/js/dashboard.js"></script>

    </div>
  );
}

export default Pagina2;
