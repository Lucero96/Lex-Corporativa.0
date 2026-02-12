import './Nosotros.css';

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
          <section className="about-section">
            <h2 className="about-heading">Nuestra Misión</h2>
            <p className="about-text">
              Lex Corporativa es un repositorio académico especializado en derecho corporativo 
              que tiene como misión democratizar el acceso al conocimiento jurídico de alta calidad. 
              Nos dedicamos a recopilar, preservar y difundir investigaciones, análisis y publicaciones 
              que contribuyen al desarrollo del derecho en el ámbito empresarial y corporativo.
            </p>
          </section>

          <section className="about-section">
            <h2 className="about-heading">Nuestra Visión</h2>
            <p className="about-text">
              Aspiramos a ser el repositorio académico jurídico de referencia en América Latina, 
              reconocido por la calidad, diversidad y accesibilidad de nuestros contenidos. 
              Buscamos fomentar el debate académico y profesional, promoviendo el intercambio 
              de ideas y el avance del conocimiento jurídico corporativo.
            </p>
          </section>

          <section className="about-section">
            <h2 className="about-heading">Qué Ofrecemos</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3 className="feature-title">Biblioteca Digital</h3>
                <p className="feature-desc">
                  Acceso a una extensa colección de publicaciones académicas, 
                  papers y libros especializados en derecho corporativo.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📰</div>
                <h3 className="feature-title">Actualidad Jurídica</h3>
                <p className="feature-desc">
                  Noticias y análisis de las últimas novedades legislativas, 
                  jurisprudenciales y doctrinarias del ámbito legal.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3 className="feature-title">Investigación</h3>
                <p className="feature-desc">
                  Estudios profundos sobre temas especializados en las 
                  diversas áreas del derecho corporativo y empresarial.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h3 className="feature-title">Colaboración</h3>
                <p className="feature-desc">
                  Espacio para que académicos y profesionales compartan 
                  sus trabajos y contribuyan al conocimiento colectivo.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="about-heading">Nuestros Valores</h2>
            <div className="values-list">
              <div className="value-item">
                <h3 className="value-title">Excelencia Académica</h3>
                <p className="value-desc">
                  Mantenemos los más altos estándares de calidad en todas 
                  nuestras publicaciones y contenidos.
                </p>
              </div>

              <div className="value-item">
                <h3 className="value-title">Accesibilidad</h3>
                <p className="value-desc">
                  Creemos en el acceso abierto al conocimiento jurídico 
                  para todos los interesados.
                </p>
              </div>

              <div className="value-item">
                <h3 className="value-title">Innovación</h3>
                <p className="value-desc">
                  Adoptamos las últimas tecnologías para mejorar la 
                  experiencia de usuario y la difusión del conocimiento.
                </p>
              </div>

              <div className="value-item">
                <h3 className="value-title">Integridad</h3>
                <p className="value-desc">
                  Mantenemos rigurosos estándares éticos en la publicación 
                  y difusión de contenidos académicos.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section contact-section">
            <h2 className="about-heading">Contáctanos</h2>
            <p className="about-text">
              Si tienes preguntas, sugerencias o deseas colaborar con nosotros, 
              no dudes en ponerte en contacto:
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Email:</strong> contacto@lexcorporativa.com
              </div>
              <div className="contact-item">
                <strong>Teléfono:</strong> +51 999 999 999
              </div>
              <div className="contact-item">
                <strong>Ubicación:</strong> Lima, Perú
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
