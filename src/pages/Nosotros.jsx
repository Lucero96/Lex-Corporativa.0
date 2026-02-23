import './Nosotros.css';
import yamile from '../assets/team/yamiley.png';
import ariana from '../assets/team/ariana.png';
import nikold from '../assets/team/nikold.jpg';
import fatima from '../assets/team/fatima.jpg';

const Nosotros = () => {
  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <div>
            <div className="section-label">QUIÉNES SOMOS</div>
            <h1 className="page-title">Sobre Nosotros</h1>
          </div>
        </div>

        <div className="about-content">
          {/* Misión y Visión */}
          <section className="about-section mission-vision-section">
            <div className="mission-vision-grid">
              {/* Misión */}
              <div className="mission-vision-card">
                <div className="mv-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3v18" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 15l-7 6-7-6" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <h2 className="mv-title">Nuestra Misión</h2>
                <p className="mv-text">
                  Lex Corporativa es un repositorio académico especializado en derecho corporativo 
                  que tiene como misión democratizar el acceso al conocimiento jurídico de alta calidad. 
                  Nos dedicamos a recopilar, preservar y difundir investigaciones, análisis y publicaciones 
                  que contribuyen al desarrollo del derecho en el ámbito empresarial y corporativo.
                </p>
              </div>

              {/* Visión */}
              <div className="mission-vision-card">
                <div className="mv-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2v4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18v4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.93 4.93l2.83 2.83" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.24 16.24l2.83 2.83" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12h4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 12h4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.93 19.07l2.83-2.83" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.24 7.76l2.83-2.83" strokeLinecap="round" strokeLinejoin="round"/>
                    <polygon points="12,7 13,11 12,15 11,11" fill="currentColor"/>
                  </svg>
                </div>
                <h2 className="mv-title">Nuestra Visión</h2>
                <p className="mv-text">
                  Aspiramos a ser el repositorio académico jurídico de referencia en América Latina, 
                  reconocido por la calidad, diversidad y accesibilidad de nuestros contenidos. 
                  Buscamos fomentar el debate académico y profesional, promoviendo el intercambio 
                  de ideas y el avance del conocimiento jurídico corporativo.
                </p>
              </div>
            </div>
          </section>

          {/* Consejo Editorial */}
          <section className="about-section">
            <h2 className="about-heading">Consejo Editorial</h2>
            <div className="team-grid">
              {/* Yamiley */}
              <div className="team-member">
                <div className="team-image-wrapper">
                  <img 
                    src={yamile} 
                    alt="Yamiley" 
                    className="team-image"
                  />
                </div>
                <div className="team-role">
                  Directora Editorial
                </div>
                <h3 className="team-name">
                  Yamiley Rodríguez
                </h3>
                <p className="team-description">
                  "Impulsa la creación y desarrollo de Lex Corporativa como un espacio de investigación, análisis y difusión del pensamiento jurídico estudiantil."
                </p>
              </div>

              {/* Ariana */}
              <div className="team-member">
                <div className="team-image-wrapper">
                  <img 
                    src={ariana} 
                    alt="Ariana" 
                    className="team-image"
                  />
                </div>
                <div className="team-role">
                  Editora Senior
                </div>
                <h3 className="team-name">
                  Ariana Martínez
                </h3>
                <p className="team-description">
                  "Impulsa la creación y desarrollo de Lex Corporativa como un espacio de investigación, análisis y difusión del pensamiento jurídico estudiantil."
                </p>
              </div>

              {/* Nikold */}
              <div className="team-member">
                <div className="team-image-wrapper">
                  <img 
                    src={nikold} 
                    alt="Nikold" 
                    className="team-image"
                  />
                </div>
                <div className="team-role">
                  Editor Asociado
                </div>
                <h3 className="team-name">
                  Nikold García
                </h3>
                <p className="team-description">
                  "Encargada de la promoción institucional de Lex Corporativa, la difusión del contenido editorial y el posicionamiento de la revista en espacios académicos y digitales."
                </p>
              </div>

              {/* Fátima */}
              <div className="team-member">
                <div className="team-image-wrapper">
                  <img 
                    src={fatima} 
                    alt="Fátima" 
                    className="team-image"
                  />
                </div>
                <div className="team-role">
                  Coordinadora de Contenidos
                </div>
                <h3 className="team-name">
                  Fátima López
                </h3>
                <p className="team-description">
                  "Encargada de la promoción institucional de Lex Corporativa, la difusión del contenido editorial y el posicionamiento de la revista en espacios académicos y digitales."
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="about-heading">Qué Ofrecemos</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Biblioteca Digital</h3>
                <p className="feature-desc">
                  Acceso a una extensa colección de publicaciones académicas, 
                  papers y libros especializados en derecho corporativo.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="10,9 9,9 8,9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Actualidad Jurídica</h3>
                <p className="feature-desc">
                  Noticias y análisis de las últimas novedades legislativas, 
                  jurisprudenciales y doctrinarias del ámbito legal.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Investigación</h3>
                <p className="feature-desc">
                  Estudios profundos sobre temas especializados en las 
                  diversas áreas del derecho corporativo y empresarial.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Colaboración</h3>
                <p className="feature-desc">
                  Espacio para que académicos y profesionales compartan 
                  sus trabajos y contribuyan al conocimiento colectivo.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;

