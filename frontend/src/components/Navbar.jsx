import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      {/* Topbar */}
      <div className="topbar text-white py-1 small sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3 align-items-center">
            <a href="mailto:contacto@liceo.edu.cl" className="d-inline-flex align-items-center gap-1">
              <i className="bi bi-envelope"></i>
              <span>contacto@liceo.edu.cl</span>
            </a>
            <a href="tel:+56223456789" className="d-none d-sm-inline-flex align-items-center gap-1">
              <i className="bi bi-telephone"></i>
              <span>+56 2 2345 6789</span>
            </a>
          </div>
          <div className="d-flex gap-2">
            <a href="#" aria-label="Facebook" className="social-link">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" aria-label="Instagram" className="social-link">
              <i className="bi bi-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white sticky-top navbar-liceo" aria-label="Principal">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/" aria-label="Inicio">
            <span className="rounded" style={{width:'32px', height:'32px', background:'var(--aqua)', display:'inline-block'}}></span>
            <strong>Liceo</strong>
          </Link>
          
          <button className="navbar-toggler border-0 p-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Abrir menú">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarMain">
            <div className="d-lg-none d-flex justify-content-between align-items-center p-3 border-bottom mb-2">
              <span className="fw-semibold text-primary">Menú de Navegación</span>
              <button type="button" className="btn-close" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-label="Cerrar menú"></button>
            </div>
            
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/noticias">Noticias</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Documentos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Contacto</a>
              </li>
            </ul>

            <div className="navbar-nav">
              <div className="nav-item d-none d-lg-block">
                <a href="#" className="btn btn-primary-liceo btn-sm">
                  <i className="bi bi-person-plus me-1"></i>Postula Aquí
                </a>
              </div>
              
              <div className="nav-item d-lg-none mt-3 mb-2">
                <a href="#" className="btn btn-primary-liceo w-100">
                  <i className="bi bi-person-plus me-2"></i>Proceso de Admisión
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;