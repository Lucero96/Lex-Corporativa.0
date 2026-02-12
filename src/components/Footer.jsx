import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-circle-small">LC</div>
              <div className="footer-title">LEX CORPORATIVA</div>
            </div>
            <p className="footer-description">
              Repositorio académico especializado en derecho corporativo y análisis jurídico de vanguardia.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Navegación</h3>
            <ul className="footer-links">
              <li><a href="#home">Inicio</a></li>
              <li><a href="#noticias">Noticias</a></li>
              <li><a href="#archivo">Archivo</a></li>
              <li><a href="#nosotros">Nosotros</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Áreas Legales</h3>
            <ul className="footer-links">
              <li><a href="#constitucional">Derecho Constitucional</a></li>
              <li><a href="#civil">Derecho Civil</a></li>
              <li><a href="#penal">Derecho Penal</a></li>
              <li><a href="#comercial">Derecho Comercial</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Contacto</h3>
            <ul className="footer-links">
              <li><a href="mailto:contacto@lexcorporativa.com">contacto@lexcorporativa.com</a></li>
              <li><a href="tel:+51999999999">+51 999 999 999</a></li>
              <li>Lima, Perú</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Lex Corporativa. Todos los derechos reservados.</p>
          <div className="footer-legal">
            <a href="#privacidad">Política de Privacidad</a>
            <span className="separator">•</span>
            <a href="#terminos">Términos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
