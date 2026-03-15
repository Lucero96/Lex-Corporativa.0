import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Home.css';
import { legalAreas } from '../data';

const Home = ({ onNavigate }) => {
  const getCardsPerView = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const [ultimasNoticias, setUltimasNoticias] = useState([]);
  const [ultimosArchivos, setUltimosArchivos] = useState([]);
  const [archivoSlideIndex, setArchivoSlideIndex] = useState(0);
  const [noticiaSlideIndex, setNoticiaSlideIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(() => {
    if (typeof window === 'undefined') return 3;
    return getCardsPerView();
  });
  const heroRef = useRef(null);
  const networkCanvasRef = useRef(null);
  const legalAreasRef = useRef(null);
  const legalAreasCanvasRef = useRef(null);
  const newsPreviewRef = useRef(null);
  const newsPreviewCanvasRef = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      const { data: noticiasData, error: noticiasError } = await supabase
        .from('publicaciones')
        .select('*')
        .eq('tipo', 'noticia')
        .order('fecha', { ascending: false })
        .limit(10);

      if (noticiasError) {
        console.error('Error fetching noticias:', noticiasError);
      } else {
        setUltimasNoticias(noticiasData || []);
      }

      const { data: archivosData, error: archivosError } = await supabase
        .from('publicaciones')
        .select('*')
        .neq('tipo', 'noticia')
        .order('fecha', { ascending: false })
        .limit(10);

      if (archivosError) {
        console.error('Error fetching archivos:', archivosError);
      } else {
        setUltimosArchivos(archivosData || []);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const updateCardsPerView = () => {
      setCardsPerView(getCardsPerView());
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);

    return () => {
      window.removeEventListener('resize', updateCardsPerView);
    };
  }, []);

  const maxArchivoStart = Math.max(0, ultimosArchivos.length - cardsPerView);
  const maxNoticiaStart = Math.max(0, ultimasNoticias.length - cardsPerView);

  useEffect(() => {
    if (ultimosArchivos.length <= cardsPerView) return undefined;

    const intervalId = window.setInterval(() => {
      setArchivoSlideIndex((prev) => (prev >= maxArchivoStart ? 0 : prev + 1));
    }, 4300);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [ultimosArchivos.length, cardsPerView, maxArchivoStart]);

  useEffect(() => {
    if (ultimasNoticias.length <= cardsPerView) return undefined;

    const intervalId = window.setInterval(() => {
      setNoticiaSlideIndex((prev) => (prev >= maxNoticiaStart ? 0 : prev + 1));
    }, 4700);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [ultimasNoticias.length, cardsPerView, maxNoticiaStart]);

  useEffect(() => {
    const cleanups = [];

    const createNetworkLayer = (sectionEl, canvas, options = {}) => {
      if (!sectionEl || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pointColor = options.pointColor || 'rgba(232, 220, 196, 0.30)';
      const baseLineOpacity = options.baseLineOpacity ?? 0.14;
      const connectionDistance = options.connectionDistance ?? 120;
      const mouseRadius = options.mouseRadius ?? 145;
      const pointRadius = options.pointRadius ?? 2.2;
      const minPoints = options.minPoints ?? 34;
      const maxPoints = options.maxPoints ?? 78;
      const density = options.density ?? 18500;

      let animationId;
      let width = 0;
      let height = 0;
      const mouse = { x: null, y: null };
      const points = [];

      const buildPoints = () => {
        points.length = 0;
        const area = width * height;
        const pointCount = Math.max(minPoints, Math.min(maxPoints, Math.floor(area / density)));

        for (let i = 0; i < pointCount; i += 1) {
          points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.38,
            vy: (Math.random() - 0.5) * 0.38
          });
        }
      };

      const resizeCanvas = () => {
        const rect = sectionEl.getBoundingClientRect();
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

            if (distance < connectionDistance) {
              const opacity = ((connectionDistance - distance) / connectionDistance) * baseLineOpacity;
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

            if (mouseDistance < mouseRadius) {
              const force = (mouseRadius - mouseDistance) / mouseRadius;
              p1.x += (mx / (mouseDistance || 1)) * force * 0.65;
              p1.y += (my / (mouseDistance || 1)) * force * 0.65;

              const mouseLineOpacity = force * 0.18;
              ctx.strokeStyle = `rgba(232, 220, 196, ${mouseLineOpacity.toFixed(3)})`;
              ctx.lineWidth = 0.7;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }

          ctx.fillStyle = pointColor;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, pointRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        animationId = window.requestAnimationFrame(draw);
      };

      const handleMouseMove = (event) => {
        const rect = sectionEl.getBoundingClientRect();
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
      sectionEl.addEventListener('mousemove', handleMouseMove);
      sectionEl.addEventListener('mouseleave', handleMouseLeave);

      cleanups.push(() => {
        window.removeEventListener('resize', resizeCanvas);
        sectionEl.removeEventListener('mousemove', handleMouseMove);
        sectionEl.removeEventListener('mouseleave', handleMouseLeave);
        window.cancelAnimationFrame(animationId);
      });
    };

    createNetworkLayer(heroRef.current, networkCanvasRef.current, {
      baseLineOpacity: 0.14,
      connectionDistance: 120,
      mouseRadius: 145,
      pointRadius: 2.2,
      minPoints: 34,
      maxPoints: 78,
      density: 18500
    });

    createNetworkLayer(legalAreasRef.current, legalAreasCanvasRef.current, {
      baseLineOpacity: 0.11,
      connectionDistance: 108,
      mouseRadius: 132,
      pointRadius: 2,
      minPoints: 30,
      maxPoints: 62,
      density: 21000
    });

    createNetworkLayer(newsPreviewRef.current, newsPreviewCanvasRef.current, {
      baseLineOpacity: 0.1,
      connectionDistance: 105,
      mouseRadius: 130,
      pointRadius: 2,
      minPoints: 30,
      maxPoints: 62,
      density: 21500
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  const currentArchivoSlideIndex = Math.min(archivoSlideIndex, maxArchivoStart);
  const archivoTranslate = (currentArchivoSlideIndex * 100) / cardsPerView;

  const currentNoticiaSlideIndex = Math.min(noticiaSlideIndex, maxNoticiaStart);
  const noticiaTranslate = (currentNoticiaSlideIndex * 100) / cardsPerView;

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <img src="/hero-background.jpg" alt="Biblioteca legal" />
        </div>
        <canvas className="hero-network-canvas" ref={networkCanvasRef} aria-hidden="true" />
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              REPOSITORIO <span>académico</span> JURÍDICO
            </h1>
            <p className="hero-subtitle">
              Plataforma especializada en investigación, análisis y difusión del conocimiento jurídico corporativo. 
              Acceda a recursos académicos de vanguardia y participe en el debate legal contemporáneo.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary btn-lex btn-lex-dark" onClick={() => onNavigate('archivo')}>
                EXPLORAR ARCHIVO
              </button>
              <button className="btn-secondary btn-lex btn-lex-dark" onClick={() => onNavigate('noticias')}>
                VER NOTICIAS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Intro Section */}
      <section className="about-intro">
        <div className="container">
          <div className="about-intro-grid">
            <div className="about-media" aria-label="Galeria destacada de Lex Corporativa">
              <div className="about-image about-image-main" data-label="Recursos 24/7">
                <img
                  src="/assets/foto-principal.png"
                  alt="Equipo Lex Corporativa en sesion de analisis juridico"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="about-image about-image-secondary" data-label="Cuerpo Editorial">
                <img
                  src="/assets/foto-secundaria.png"
                  alt="Reunion estrategica de Lex Corporativa"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div className="about-content">
              <p className="about-kicker">SOBRE NOSOTROS</p>
              <h2 className="about-title">Liderazgo y Estrategia: El Poder del Saber Jurídico</h2>
              <p className="about-description">
                En Lex Corporativa, no solo acumulamos información; transformamos el derecho en una herramienta de éxito. Hemos creado este espacio para que cada estudiante y profesional encuentre el respaldo que necesita para enfrentar desafíos reales. Unimos la precisión tecnológica con el análisis estratégico para que el conocimiento sea tu mayor ventaja competitiva.
              </p>

              <div className="about-highlights">
                <div className="about-highlight-item">
                  <span className="about-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="M4 5h16v3H4z" />
                      <path d="M5 8h14v11H5z" />
                      <path d="M9 12h6" />
                      <path d="M9 15h4" />
                    </svg>
                  </span>
                  <span>Inteligencia Jurídica</span>
                </div>

                <div className="about-highlight-item">
                  <span className="about-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="M12 3v5" />
                      <path d="M12 16v5" />
                      <path d="M4.93 4.93l3.54 3.54" />
                      <path d="M15.53 15.53l3.54 3.54" />
                      <path d="M3 12h5" />
                      <path d="M16 12h5" />
                      <path d="M4.93 19.07l3.54-3.54" />
                      <path d="M15.53 8.47l3.54-3.54" />
                    </svg>
                  </span>
                  <span>Evolución Digital</span>
                </div>
              </div>

              <button className="about-btn btn-lex btn-lex-light" onClick={() => onNavigate('nosotros')}>
                Saber Mas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Areas Section */}
      <section className="section-wrapper legal-areas" ref={legalAreasRef}>
        <canvas className="section-network-canvas" ref={legalAreasCanvasRef} aria-hidden="true" />
        <div className="container">
          <div className="section-header">
            <div className="section-label">ESPECIALIZACIÓN</div>
            <h2 className="section-title">Áreas de Práctica Legal</h2>
          </div>

          <div className="areas-grid">
            {legalAreas.map((area, index) => (
              <div key={area.id} className="area-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="area-title">{area.title}</h3>
                <p className="area-desc">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Archive Preview Section */}
      <section className="section-wrapper files-preview">
        <div className="container">
          <div className="files-header">
            <div>
              <div className="files-label">REPOSITORIO</div>
              <h2 className="files-title">Archivo Destacado</h2>
            </div>
            <button className="files-btn btn-lex btn-lex-light" onClick={() => onNavigate('archivo')}>VER ARCHIVO</button>
          </div>

          {ultimosArchivos.length === 0 ? (
            <div className="files-empty">No hay archivos disponibles.</div>
          ) : (
            <div className="carousel-shell files-carousel-shell" style={{ '--carousel-visible': cardsPerView }}>
              {maxArchivoStart > 0 && (
                <button
                  type="button"
                  className="carousel-nav carousel-nav-prev"
                  aria-label="Archivo anterior"
                  onClick={() =>
                    setArchivoSlideIndex((prev) => (prev <= 0 ? maxArchivoStart : prev - 1))
                  }
                >
                  ‹
                </button>
              )}

              <div className="carousel-viewport">
                <div
                  className="carousel-track"
                  style={{ transform: `translateX(-${archivoTranslate}%)` }}
                >
                  {ultimosArchivos.map((archivo) => (
                    <div key={archivo.id} className="carousel-slide">
                      <article className="file-card file-card-featured">
                        <div className="file-card-image-wrap">
                          <img
                            className="file-card-image"
                            src={archivo.imagen_url || 'https://placehold.co/400x260'}
                            alt={archivo.titulo}
                          />
                          {archivo.categoria && <span className="file-card-category">{archivo.categoria}</span>}
                        </div>
                        <div className="file-card-body">
                          <h3 className="file-card-title">{archivo.titulo}</h3>
                          <p className="file-card-meta">{archivo.escritores || 'Lex Corporativa'}</p>
                          <p className="file-card-date">{new Date(archivo.fecha).toLocaleDateString()}</p>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>

              {maxArchivoStart > 0 && (
                <button
                  type="button"
                  className="carousel-nav carousel-nav-next"
                  aria-label="Siguiente archivo"
                  onClick={() =>
                    setArchivoSlideIndex((prev) => (prev >= maxArchivoStart ? 0 : prev + 1))
                  }
                >
                  ›
                </button>
              )}
            </div>
          )}

          {maxArchivoStart > 0 && (
            <div className="carousel-dots" aria-label="Indicadores de archivos destacados">
              {Array.from({ length: maxArchivoStart + 1 }).map((_, idx) => (
                <button
                  key={`archivo-dot-${idx}`}
                  type="button"
                  className={`carousel-dot ${idx === currentArchivoSlideIndex ? 'is-active' : ''}`}
                  onClick={() => setArchivoSlideIndex(idx)}
                  aria-label={`Ir al grupo ${idx + 1} de archivos`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News Preview Section */}
      <section className="section-wrapper news-preview" ref={newsPreviewRef}>
        <canvas className="section-network-canvas" ref={newsPreviewCanvasRef} aria-hidden="true" />
        <div className="container">
          <div className="news-header">
            <div>
              <div className="section-label">ACTUALIDAD</div>
              <h2 className="section-title">Últimas Noticias Jurídicas</h2>
            </div>
            <button className="btn-secondary btn-lex btn-lex-dark" onClick={() => onNavigate('noticias')}>VER TODAS</button>
          </div>

          {ultimasNoticias.length === 0 ? (
            <div className="news-empty">No hay noticias disponibles.</div>
          ) : (
            <div className="carousel-shell news-carousel-shell" style={{ '--carousel-visible': cardsPerView }}>
              {maxNoticiaStart > 0 && (
                <button
                  type="button"
                  className="carousel-nav carousel-nav-prev"
                  aria-label="Noticia anterior"
                  onClick={() =>
                    setNoticiaSlideIndex((prev) => (prev <= 0 ? maxNoticiaStart : prev - 1))
                  }
                >
                  ‹
                </button>
              )}

              <div className="carousel-viewport">
                <div
                  className="carousel-track"
                  style={{ transform: `translateX(-${noticiaTranslate}%)` }}
                >
                  {ultimasNoticias.map((news) => (
                    <div key={news.id} className="carousel-slide">
                      <article
                        className="news-slide-card"
                        style={{ backgroundImage: `url(${news.imagen_url || 'https://placehold.co/900x420'})` }}
                      >
                        <div className="news-slide-overlay">
                          <p className="news-slide-date">Resumen {new Date(news.fecha).toLocaleDateString()}</p>
                          <h3 className="news-slide-title">{news.titulo}</h3>
                          <p className="news-slide-summary">{news.resumen || 'Sin resumen disponible.'}</p>
                          {Array.isArray(news.resumen_puntos) && news.resumen_puntos.length > 0 && (
                            <ul className="news-slide-points">
                              {news.resumen_puntos.slice(0, 3).map((punto, idx) => (
                                <li key={idx}>{punto}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>

              {maxNoticiaStart > 0 && (
                <button
                  type="button"
                  className="carousel-nav carousel-nav-next"
                  aria-label="Siguiente noticia"
                  onClick={() =>
                    setNoticiaSlideIndex((prev) => (prev >= maxNoticiaStart ? 0 : prev + 1))
                  }
                >
                  ›
                </button>
              )}
            </div>
          )}

          {maxNoticiaStart > 0 && (
            <div className="carousel-dots" aria-label="Indicadores de noticias">
              {Array.from({ length: maxNoticiaStart + 1 }).map((_, idx) => (
                <button
                  key={`news-dot-${idx}`}
                  type="button"
                  className={`carousel-dot ${idx === currentNoticiaSlideIndex ? 'is-active' : ''}`}
                  onClick={() => setNoticiaSlideIndex(idx)}
                  aria-label={`Ir al grupo ${idx + 1} de noticias`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;