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
              
              <li>Lima, Perú</li>
            </ul>
          </div>

          <div className="footer-social">
            <a href="https://www.linkedin.com/company/lex-corporativa/" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/lex_corporativa?utm_source=qr&igsh=MTQ2dWU2YW9rdnU2cw==" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm6.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/share/1C2LvPrdqZ/" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .732.592 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.294h6.116c.73 0 1.322-.592 1.322-1.324v-21.35c0-.733-.592-1.325-1.325-1.325z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@lex.corporativa?_r=1&_t=ZS-93LXmMV4IXx" target="_blank" rel="noopener noreferrer" title="TikTok" aria-label="TikTok">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
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
