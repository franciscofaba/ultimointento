import React, { useEffect, useState } from 'react';
import './login.css';
import { useTranslation } from 'react-i18next';
import Spain from '../../images/Flag_of_Spain.svg';
import Usa from '../../images/Flag_of_the_United_States.svg';
import { NavDropdown } from 'react-bootstrap';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { t, i18n } = useTranslation('global');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      setErrorMessage(error);
    }
  }, []);

  return (
    <>
      <div className="sidenav">
        <div className="login-main-text">
          <div className="d-flex justify-content-between align-items-center">
            <h2>{t('login.t1')}<br />{t('login.t2')}</h2>
            <NavDropdown
              className="text-light"
              id="nav-dropdown-3"
              title={t('inicio.t3')}
              menuVariant="light"
              style={{ fontSize: '23px' }}
            >
              <NavDropdown.Item>
                <button
                  onClick={() => i18n.changeLanguage('es')}
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
                  onClick={() => i18n.changeLanguage('en')}
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
          <p>{t('login.t3')}</p>
        </div>
      </div>
      <div className="main">
        <div className="col-md-6 col-sm-12">
          <div className="login-form">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form action="http://localhost:5000/Dashboard/login" method="POST">
              <div className="form-group">
                <label htmlFor="email">{t('login.t4')}</label>
                <input type="email" name="email" className="form-control" id="email" placeholder={t('login.t4')} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">{t('login.t5')}</label>
                <input type="password" name="password" className="form-control" id="password" placeholder={t('login.t5')} required />
              </div>
              <button type="submit" className="btn btn-black">{t('login.t6')}</button>
              <button type="button" className="btn btn-secondary">{t('login.t7')}</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
