import React from 'react';
import { NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Spain from "../images/Flag_of_Spain.svg";
import Usa from "../images/Flag_of_the_United_States.svg";
import styles from "../shared/style_top.css";

const Top = () => {
    const [t, i18n]= useTranslation("global");

    return (
        <>
            <div className="Top">
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
        </>
    );
};

export default Top;
