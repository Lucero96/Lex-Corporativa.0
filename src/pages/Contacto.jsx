import { useEffect, useRef } from 'react';
import './Contacto.css';

const Contacto = () => {
  const contactPageRef = useRef(null);
  const contactPageCanvasRef = useRef(null);

  useEffect(() => {
    const pageEl = contactPageRef.current;
    const canvas = contactPageCanvasRef.current;
    if (!pageEl || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = 0;
    let height = 0;
    const mouse = { x: null, y: null };
    const points = [];

    const buildPoints = () => {
      points.length = 0;
      const area = width * height;
      const pointCount = Math.max(24, Math.min(56, Math.floor(area / 21000)));

      for (let i = 0; i < pointCount; i += 1) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.34,
          vy: (Math.random() - 0.5) * 0.34
        });
      }
    };

    const resizeCanvas = () => {
      const rect = pageEl.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      buildPoints();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < points.length; i += 1) {
        const p1 = points[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x <= 0 || p1.x >= width) p1.vx *= -1;
        if (p1.y <= 0 || p1.y >= height) p1.vy *= -1;

        for (let j = i + 1; j < points.length; j += 1) {
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 102) {
            const opacity = ((102 - distance) / 102) * 0.11;
            ctx.strokeStyle = `rgba(232, 220, 196, ${opacity.toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mx = p1.x - mouse.x;
          const my = p1.y - mouse.y;
          const mouseDistance = Math.hypot(mx, my);

          if (mouseDistance < 120) {
            const force = (120 - mouseDistance) / 120;
            p1.x += (mx / (mouseDistance || 1)) * force * 0.6;
            p1.y += (my / (mouseDistance || 1)) * force * 0.6;

            ctx.strokeStyle = `rgba(232, 220, 196, ${(force * 0.18).toFixed(3)})`;
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = 'rgba(232, 220, 196, 0.30)';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = window.requestAnimationFrame(draw);
    };

    const handleMouseMove = (event) => {
      const rect = pageEl.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    resizeCanvas();
    draw();

    window.addEventListener('resize', resizeCanvas);
    pageEl.addEventListener('mousemove', handleMouseMove);
    pageEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      pageEl.removeEventListener('mousemove', handleMouseMove);
      pageEl.removeEventListener('mouseleave', handleMouseLeave);
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="contact-page-content" ref={contactPageRef}>
      <canvas className="contact-page-network-canvas" ref={contactPageCanvasRef} aria-hidden="true" />
      <section className="contact-hero">
        <div className="container">
          <div className="page-header">
            <div>
              <div className="section-label">COMUNÍCATE CON NOSOTROS</div>
              <h1 className="page-title">Contacto</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-main-wrapper">
        <div className="container">
          <div className="contact-content">
            <section className="contact-section-main">
              <div className="contact-container">
                {/* Columna Izquierda - Información */}
                <div className="contact-info-column">
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

                      <button type="submit" className="form-button btn-lex btn-lex-dark">
                        Enviar Mensaje
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;
