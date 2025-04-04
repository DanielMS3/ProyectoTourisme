import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/estilos_pagina.css';

const Navbar = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="logo">
                    <img src="/client/src/assets/img/logo.png" alt="Logo" />
                    <span>Tourisme</span>
                </div>
                <nav className="nav-desktop">
                    <ul>
                        <li><a href="#destino_seccion">Destinos</a></li>
                        <li><a href="#">Sobre Nosotros</a></li>
                        <li><a href="#">Contacto</a></li>
                    </ul>
                </nav>
                <div className="auth-buttons">
                    <Link to="/login">
                        <button className="btn btn-ghost login-button">Iniciar Sesión</button>
                    </Link> 
                    <Link to="/registro">               
                        <button className="btn btn-primary">Registrarse</button>
                    </Link>  
                </div>
                <button className="menu-toggle" id="menuToggle">
                    <i className="fas fa-bars"></i>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
