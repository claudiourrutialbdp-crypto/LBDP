import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-5 py-5">
      <div className="container">
        <div className="row g-4">
          {/* Mapa del Sitio */}
          <div className="col-lg-3 col-md-6">
            <h3 className="footer-section-title">Mapa del Sitio</h3>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link">Inicio</Link></li>
              <li><Link to="/noticias" className="footer-link">Noticias</Link></li>
              <li><a href="#" className="footer-link">Nuestra Historia</a></li>
              <li><a href="#" className="footer-link">Misión y Visión</a></li>
              <li><a href="#" className="footer-link">Documentos</a></li>
            </ul>
          </div>
          
          {/* Vida Escolar */}
          <div className="col-lg-3 col-md-6">
            <h3 className="footer-section-title">Vida Escolar</h3>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Calendario de Actividades</a></li>
              <li><a href="#" className="footer-link">Evaluaciones</a></li>
              <li><a href="#" className="footer-link">Talleres Extraescolares</a></li>
              <li><a href="#" className="footer-link">Uniforme Escolar</a></li>
              <li><a href="#" className="footer-link">Proceso de Admisión</a></li>
            </ul>
          </div>
          
          {/* Contacto */}
          <div className="col-lg-3 col-md-6">
            <h3 className="footer-section-title">Contacto</h3>
            <div className="footer-contact-item">
              <i className="bi bi-envelope"></i>
              <a href="mailto:contacto@liceo.edu.cl" className="footer-link">contacto@liceo.edu.cl</a>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-telephone"></i>
              <a href="tel:+56223456789" className="footer-link">+56 2 2345 6789</a>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-geo-alt"></i>
              <span>Av. Educativa 1234, Santiago, Chile</span>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-clock"></i>
              <span>Lun - Vie: 8:00 - 18:00 hrs</span>
            </div>
          </div>
          
          {/* Redes Sociales */}
          <div className="col-lg-3 col-md-6">
            <h3 className="footer-section-title">Síguenos</h3>
            <p className="text-muted mb-3">Mantente conectado con nuestra comunidad educativa</p>
            <div className="d-flex gap-3 flex-wrap">
              <a href="#" aria-label="Facebook" className="footer-social-link">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" aria-label="Instagram" className="footer-social-link">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" aria-label="Twitter" className="footer-social-link">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" aria-label="YouTube" className="footer-social-link">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">© {currentYear} Liceo. Todos los derechos reservados.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="d-inline-flex gap-3">
                <a href="#" className="small">Términos y Condiciones</a>
                <a href="#" className="small">Política de Privacidad</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;