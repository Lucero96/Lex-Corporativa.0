import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Noticias.css';

const MONTH_OPTIONS = [
  { value: 'all', label: 'Todos los meses' },
  { value: '0', label: 'Enero' },
  { value: '1', label: 'Febrero' },
  { value: '2', label: 'Marzo' },
  { value: '3', label: 'Abril' },
  { value: '4', label: 'Mayo' },
  { value: '5', label: 'Junio' },
  { value: '6', label: 'Julio' },
  { value: '7', label: 'Agosto' },
  { value: '8', label: 'Septiembre' },
  { value: '9', label: 'Octubre' },
  { value: '10', label: 'Noviembre' },
  { value: '11', label: 'Diciembre' }
];

const NEWS_PER_PAGE = 8;

const Noticias = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const noticiasPageRef = useRef(null);
  const noticiasCanvasRef = useRef(null);

  const publicationYears = useMemo(() => {
    return Array.from(
      new Set(
        publicaciones
          .map((pub) => (pub.fecha ? new Date(pub.fecha).getFullYear() : null))
          .filter((year) => Number.isInteger(year))
      )
    ).sort((a, b) => b - a);
  }, [publicaciones]);

  const filteredPublicaciones = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return publicaciones.filter((pub) => {
      if (!pub.fecha) return false;

      const pubDate = new Date(pub.fecha);
      if (Number.isNaN(pubDate.getTime())) return false;

      const pubYear = String(pubDate.getFullYear());
      const pubMonth = String(pubDate.getMonth());

      const matchesYear = yearFilter === 'all' || pubYear === yearFilter;
      const matchesMonth = monthFilter === 'all' || pubMonth === monthFilter;

      const title = (pub.titulo || '').toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || title.includes(normalizedQuery);

      return matchesYear && matchesMonth && matchesQuery;
    });
  }, [publicaciones, searchQuery, yearFilter, monthFilter]);

  const totalPaginas = Math.ceil(filteredPublicaciones.length / NEWS_PER_PAGE);
  const paginaSegura = Math.min(paginaActual, Math.max(totalPaginas, 1));
  const indiceInicio = (paginaSegura - 1) * NEWS_PER_PAGE;
  const publicacionesPaginadas = filteredPublicaciones.slice(indiceInicio, indiceInicio + NEWS_PER_PAGE);
  const rangoInicio = filteredPublicaciones.length === 0 ? 0 : indiceInicio + 1;
  const rangoFin =
    filteredPublicaciones.length === 0
      ? 0
      : Math.min(indiceInicio + publicacionesPaginadas.length, filteredPublicaciones.length);

  const paginationItems = useMemo(() => {
    if (totalPaginas <= 7) {
      return Array.from({ length: totalPaginas }, (_, index) => index + 1);
    }

    const pages = [1];
    const start = Math.max(2, paginaSegura - 1);
    const end = Math.min(totalPaginas - 1, paginaSegura + 1);

    if (start > 2) {
      pages.push('ellipsis-left');
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (end < totalPaginas - 1) {
      pages.push('ellipsis-right');
    }

    pages.push(totalPaginas);
    return pages;
  }, [paginaSegura, totalPaginas]);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      const { data, error } = await supabase
        .from('lex_noticias')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error fetching publicaciones:', error);
      } else {
        setPublicaciones(data || []);
      }
    };
    fetchPublicaciones();
  }, []);

  useEffect(() => {
    const sectionEl = noticiasPageRef.current;
    const canvas = noticiasCanvasRef.current;
    if (!sectionEl || !canvas) return;

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
      const pointCount = Math.max(34, Math.min(72, Math.floor(area / 21000)));

      for (let i = 0; i < pointCount; i += 1) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.36,
          vy: (Math.random() - 0.5) * 0.36
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

          if (distance < 108) {
            const opacity = ((108 - distance) / 108) * 0.11;
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

          if (mouseDistance < 130) {
            const force = (130 - mouseDistance) / 130;
            p1.x += (mx / (mouseDistance || 1)) * force * 0.65;
            p1.y += (my / (mouseDistance || 1)) * force * 0.65;

            ctx.strokeStyle = `rgba(232, 220, 196, ${(force * 0.18).toFixed(3)})`;
            ctx.lineWidth = 0.7;
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

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      sectionEl.removeEventListener('mousemove', handleMouseMove);
      sectionEl.removeEventListener('mouseleave', handleMouseLeave);
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  const handleCloseViewer = (e) => {
    if (e.target.classList.contains('pdf-viewer')) {
      setSelectedPdf(null);
    }
  };

  const openPdfFromPublication = (pub) => {
    if (pub?.pdf_url) {
      setSelectedPdf(pub.pdf_url);
    }
  };

  const handlePageChange = (page) => {
    if (page === paginaSegura) return;

    setPaginaActual(page);
    const topPosition = noticiasPageRef.current?.offsetTop ?? 0;
    window.scrollTo({ top: topPosition, behavior: 'smooth' });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPaginaActual(1);
  };

  const handleYearChange = (event) => {
    setYearFilter(event.target.value);
    setPaginaActual(1);
  };

  const handleMonthChange = (event) => {
    setMonthFilter(event.target.value);
    setPaginaActual(1);
  };

  return (
    <div className="noticias-page" ref={noticiasPageRef}>
      <canvas className="noticias-network-canvas" ref={noticiasCanvasRef} aria-hidden="true" />

      <main className="noticias-main">
        <div className="container">
          <header className="noticias-header">
            <div className="section-label">REPOSITORIO ACADÉMICO</div>
            <h1 className="noticias-title">Noticias</h1>
            <p className="noticias-subtitle">
              Mantente al tanto de las últimas actualizaciones, novedades legislativas y eventos de nuestra comunidad jurídica.
            </p>
          </header>

          <div className="noticias-filters">
            <input
              className="noticias-filter-input"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar noticias por título..."
              aria-label="Buscar noticias por título"
            />

            <select
              className="noticias-filter-select"
              value={yearFilter}
              onChange={handleYearChange}
              aria-label="Filtrar noticias por año"
            >
              <option value="all">Todos los años</option>
              {publicationYears.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="noticias-filter-select"
              value={monthFilter}
              onChange={handleMonthChange}
              aria-label="Filtrar noticias por mes"
            >
              {MONTH_OPTIONS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <p className="noticias-filter-results">
            Mostrando {rangoInicio}-{rangoFin} de {filteredPublicaciones.length} noticias
          </p>

          {filteredPublicaciones.length === 0 ? (
            <div className="noticias-empty">No hay noticias registradas en este periodo.</div>
          ) : (
            <>
              <section key={`pagina-${paginaSegura}`} className="noticias-grid noticias-grid-fade" aria-label="Listado de noticias">
                {publicacionesPaginadas.map((pub) => (
                <article
                  key={pub.id}
                  className="noticia-grid-card"
                  style={{
                    backgroundImage: `linear-gradient(165deg, rgba(1, 8, 29, 0.86) 0%, rgba(1, 8, 29, 0.62) 48%, rgba(1, 8, 29, 0.88) 100%), url(${pub.imagen_url || 'https://placehold.co/500x650'})`
                  }}
                >
                  <div className="noticia-grid-overlay">
                    <p className="noticia-grid-date">Resumen {new Date(pub.fecha).toLocaleDateString()}</p>
                    {/* LIMITAR TÍTULO A 4 LÍNEAS - Cambia "-webkit-line-clamp: 4" en Noticias.css para ajustar */}
                    <h2 className="noticia-grid-title">{pub.titulo}</h2>
                    <p className="noticia-grid-author">{pub.escritores || 'Lex Corporativa'}</p>

                    {Array.isArray(pub.resumen_p) && pub.resumen_p.length > 0 && (
                      <ul className="noticia-grid-points">
                        {pub.resumen_p.map((punto, idx) => (
                          <li key={idx}>{punto}</li>
                        ))}
                      </ul>
                    )}

                    <button
                      type="button"
                      className="noticia-grid-action"
                      onClick={() => openPdfFromPublication(pub)}
                      disabled={!pub.pdf_url}
                    >
                      {pub.pdf_url ? 'Ver Noticia' : 'No disponible'}
                    </button>
                  </div>
                </article>
                ))}
              </section>

              {totalPaginas > 1 && (
                <nav className="noticias-pagination" aria-label="Paginación de noticias">
                  <div className="noticias-pagination-layout">
                    <div className="noticias-pagination-track">
                      <button
                        type="button"
                        className="noticias-page-btn noticias-page-btn-nav"
                        onClick={() => handlePageChange(Math.max(1, paginaSegura - 1))}
                        disabled={paginaSegura === 1}
                        aria-label="Ir a la página anterior"
                      >
                        &lt;
                      </button>

                      {paginationItems.map((item) => {
                        if (typeof item === 'string') {
                          return (
                            <button
                              key={item}
                              type="button"
                              className="noticias-page-btn noticias-page-btn-ellipsis"
                              disabled
                              aria-hidden="true"
                              tabIndex={-1}
                            >
                              ...
                            </button>
                          );
                        }

                        const isActive = item === paginaSegura;
                        return (
                          <button
                            key={item}
                            type="button"
                            className={`noticias-page-btn noticias-page-btn-number ${isActive ? 'is-active' : ''}`}
                            onClick={() => handlePageChange(item)}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`Ir a la página ${item}`}
                          >
                            {item}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        className="noticias-page-btn noticias-page-btn-nav"
                        onClick={() => handlePageChange(Math.min(totalPaginas, paginaSegura + 1))}
                        disabled={paginaSegura === totalPaginas}
                        aria-label="Ir a la página siguiente"
                      >
                        &gt;
                      </button>
                    </div>

                    <p className="noticias-page-counter">Página {paginaSegura} de {totalPaginas}</p>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>
      </main>

      {selectedPdf && (
        <div className="pdf-viewer" onClick={handleCloseViewer}>
          <div className="noticias-pdf-container">
            <iframe
              src={selectedPdf}
              width="80%"
              height="80%"
              title="PDF Viewer"
            ></iframe>
            <button
              type="button"
              className="noticias-close-button"
              onClick={() => setSelectedPdf(null)}
              aria-label="Cerrar visor PDF"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Noticias;