import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ currentPage, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-content">
          <div className="logo-container" onClick={() => onNavigate('home')}>
            <div className="logo-circle">
              <img
                src="/assets/logo.png"
                alt="Lex Corporativa Logo"
                className="logo-image"
              />
            </div>
            <div className="logo-text">
              <span className="logo-text-main">LEX</span>
              <span className="logo-text-sub">CORPORATIVA</span>
            </div>
          </div>

          <div className="nav-links">
            <button
              className={currentPage === 'home' ? 'active' : ''}
              onClick={() => onNavigate('home')}
            >
              Inicio
            </button>
            <button
              className={currentPage === 'noticias' ? 'active' : ''}
              onClick={() => onNavigate('noticias')}
            >
              Noticias
            </button>
            <button
              className={currentPage === 'archivo' ? 'active' : ''}
              onClick={() => onNavigate('archivo')}
            >
              Archivo
            </button>
            <button
              className={currentPage === 'nosotros' ? 'active' : ''}
              onClick={() => onNavigate('nosotros')}
            >
              Nosotros
            </button>
            <li className="nav-item" style={{ listStyle: 'none' }}>
              <button
                className={currentPage === 'contacto' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  const footer = document.getElementById('footer');
                  if (footer) {
                    footer.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Contacto
              </button>
            </li>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
