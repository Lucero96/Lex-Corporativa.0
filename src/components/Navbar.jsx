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
            <div className="logo-circle">LC</div>
            <div className="logo-text">LEX CORPORATIVA</div>
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
