import './Contacto.css';

const Contacto = () => {
  return (
    <div className="contact-page-content">
      <div className="container">
        <div className="page-header">
          <div>
            <div className="section-label">COMUNÍCATE CON NOSOTROS</div>
            <h1 className="page-title">Contacto</h1>
          </div>
        </div>

        <div className="contact-content">
          <section className="contact-section-main">
            <div className="contact-container">
              {/* Columna Izquierda - Información */}
              <div className="contact-info-column">
                <h2 className="contact-main-title">Información de Contacto</h2>
                <p className="contact-description">
                  Estamos aquí para responder tus consultas, recibir tus colaboraciones 
                  y fortalecer nuestra comunidad académica.
                </p>

                {/* Email */}
                <div className="info-item">
                  <div className="info-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="info-content">
                    <h4 className="info-title">Correo Electrónico</h4>
                    <p className="info-text">contacto@lexcorporativa.com</p>
                    <p className="info-text">editorial@lexcorporativa.com</p>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="info-item">
                  <div className="info-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="info-content">
                    <h4 className="info-title">Teléfono</h4>
                    <p className="info-text">+51 999 999 999</p>
                    <p className="info-detail">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                {/* Dirección */}
                <div className="info-item">
                  <div className="info-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="info-content">
                    <h4 className="info-title">Dirección</h4>
                    <p className="info-text">Lima, Perú</p>
                    <p className="info-detail">Facultad de Derecho</p>
                  </div>
                </div>

                {/* Bloques Destacados */}
                <div className="highlight-blocks">
                  <div className="highlight-item">
                    <h5 className="highlight-title">Envío de Artículos</h5>
                    <p className="highlight-text">articulos@lexcorporativa.com</p>
                  </div>
                  <div className="highlight-item">
                    <h5 className="highlight-title">Suscripciones</h5>
                    <p className="highlight-text">newsletter@lexcorporativa.com</p>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Formulario */}
              <div className="contact-form-column">
                <div className="form-card">
                  <h3 className="form-title">Envíanos un Mensaje</h3>
                  <form className="contact-form">
                    <div className="form-group">
                      <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                      <input 
                        type="text" 
                        id="nombre" 
                        className="form-input" 
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Correo Electrónico</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="form-input" 
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="asunto" className="form-label">Asunto</label>
                      <select id="asunto" className="form-select">
                        <option value="">Selecciona un asunto</option>
                        <option value="consulta">Consulta General</option>
                        <option value="articulo">Envío de Artículo</option>
                        <option value="colaboracion">Colaboración</option>
                        <option value="suscripcion">Suscripción</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="mensaje" className="form-label">Mensaje</label>
                      <textarea 
                        id="mensaje" 
                        className="form-textarea" 
                        rows="6"
                        placeholder="Escribe tu mensaje aquí..."
                      ></textarea>
                    </div>

                    <button type="submit" className="form-button">
                      Enviar Mensaje
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
