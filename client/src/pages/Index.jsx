import React from "react";
import "../assets/css/estilos_pagina.css"; // Importar estilos
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faStar, faStarHalfAlt, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/img/logo.png";
import imagen1 from "../assets/img/imagen1.png";
import comuna13 from "../assets/img/Comuna13.webp";
import pueblitoPaisa from "../assets/img/pueblito_paisa.jpg";
import parqueArvi from "../assets/img/parque_arvi.jpeg";
import parqueExplora from "../assets/img/parque_explora.jpg";
import plazaBotero from "../assets/img/plaza_botero.jpg";
import museoCastillo from "../assets/img/museo_castillo.jpg";

const Index = () => {
  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src={logo} alt="Logo" />
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
            <a href="/login">
              <button className="btn btn-ghost login-button">Iniciar Sesión</button>
            </a>
            <a href="/registro">
              <button className="btn btn-primary">Registrarse</button>
            </a>
          </div>
          <button className="menu-toggle" id="menuToggle">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      <div className="mobile-menu" id="mobileMenu">
        <ul>
          <li><a href="#">Destinos</a></li>
          <li><a href="#">Paquetes</a></li>
          <li><a href="#">Ofertas</a></li>
          <li><a href="#">Sobre Nosotros</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </div>

      <section className="hero">
        <div className="hero-overlay">
          <img src={imagen1} alt="Imagen1" />
        </div>
      </section>

      <section className="destinos">
        <div className="container">
          <div className="section-header">
            <h2 id="destino_seccion">Destinos Populares</h2>
            <p>Explora nuestros destinos más buscados y encuentra tu próxima aventura</p>
          </div>
          <div className="destinos-grid">
            {[
              { img: comuna13, title: "La Comuna 13", rating: 4.8, reviews: 120, desc: "Disfruta uno de los lugares más turísticos de Medellín." },
              { img: pueblitoPaisa, title: "Pueblito Paisa", rating: 4.7, reviews: 98, desc: "Disfruta de unas vacaciones inolvidables en este maravilloso destino." },
              { img: parqueArvi, title: "Parque Arví", rating: 4.9, reviews: 150, desc: "Disfruta de unas vacaciones inolvidables en este maravilloso destino." },
              { img: parqueExplora, title: "Parque Explora", rating: 4.6, reviews: 200, desc: "Disfruta de unas vacaciones inolvidables en este maravilloso destino." },
              { img: plazaBotero, title: "Plaza Botero", rating: 4.3, reviews: 180, desc: "Disfruta de unas vacaciones inolvidables en este maravilloso destino." },
              { img: museoCastillo, title: "Museo El Castillo", rating: 4.7, reviews: 210, desc: "Disfruta de unas vacaciones inolvidables en este maravilloso destino." },
            ].map((destino, index) => (
              <div key={index} className="destino-card">
                <div className="destino-img">
                  <img src={destino.img} alt={destino.title} />
                </div>
                <div className="destino-content">
                  <h3>{destino.title}</h3>
                  <div className="rating">
                    {[...Array(Math.floor(destino.rating))].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                    {destino.rating % 1 !== 0 && <FontAwesomeIcon icon={faStarHalfAlt} />}
                    <span>{destino.rating} ({destino.reviews}+ reseñas)</span>
                  </div>
                  <p>{destino.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="ver-mas">
            <a href="/home">
              <button className="btn btn-outline">
                Ver todos los destinos
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
