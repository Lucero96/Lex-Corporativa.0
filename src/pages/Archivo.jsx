import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Archivo.css';

const ITEMS_PER_PAGE = 8;

const Archivo = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paginaActual, setPaginaActual] = useState(1);
  const archivoPageRef = useRef(null);
  const archivoCanvasRef = useRef(null);

  const publicationYears = useMemo(() => {
    return Array.from(
      new Set(
        publicaciones
          .map((pub) => (pub.fecha ? new Date(pub.fecha).getFullYear() : null))
          .filter((year) => Number.isInteger(year))
      )
    ).sort((a, b) => b - a);
  }, [publicaciones]);

  const publicationCategories = useMemo(() => {
    return Array.from(
      new Set(
        publicaciones
          .map((pub) => (pub.lex_categorias?.nombre || '').trim())
          .filter((category) => category.length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [publicaciones]);

  const filteredPublicaciones = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return publicaciones.filter((pub) => {
      const pubYear = pub.fecha ? String(new Date(pub.fecha).getFullYear()) : '';
      const pubCategory = (pub.lex_categorias?.nombre || '').trim();

      const matchesYear = yearFilter === 'all' || pubYear === yearFilter;
      const matchesCategory = categoryFilter === 'all' || pubCategory === categoryFilter;

      const searchableText = [pub.titulo, pub.autor_nombre, pub.lex_categorias?.nombre, pub.resumen]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return matchesYear && matchesCategory && matchesQuery;
    });
  }, [publicaciones, searchQuery, yearFilter, categoryFilter]);

  const totalPaginas = Math.ceil(filteredPublicaciones.length / ITEMS_PER_PAGE);
  const paginaSegura = Math.min(paginaActual, Math.max(totalPaginas, 1));
  const indiceInicio = (paginaSegura - 1) * ITEMS_PER_PAGE;
  const publicacionesPaginadas = filteredPublicaciones.slice(indiceInicio, indiceInicio + ITEMS_PER_PAGE);
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
        .from('lex_articulos')
        .select('*, lex_categorias(nombre)');

      if (error) {
        console.error('Error fetching publicaciones:', error);
      } else {
        setPublicaciones(data || []);
      }
    };

    fetchPublicaciones();
  }, []);

  useEffect(() => {
    console.log('Data en Archivo:', publicaciones);
  }, [publicaciones]);

  useEffect(() => {
    const sectionEl = archivoPageRef.current;
    const canvas = archivoCanvasRef.current;
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

  const handleCloseViewer = (event) => {
    if (event.target.classList.contains('pdf-viewer')) {
      setSelectedPdf(null);
    }
  };

  const handlePageChange = (page) => {
    if (page === paginaSegura) return;

    setPaginaActual(page);
    const topPosition = archivoPageRef.current?.offsetTop ?? 0;
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

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    setPaginaActual(1);
  };

  return (
    <div className="archivo-page" ref={archivoPageRef}>
      <canvas className="archivo-network-canvas" ref={archivoCanvasRef} aria-hidden="true" />
      <div className="page-content">
        <div className="container">
          <div className="page-header">
            <div>
              <div className="section-label">REPOSITORIO ACADÉMICO</div>
              <h1 className="page-title">Archivo de Publicaciones</h1>
              <p className="page-subtitle">Explore nuestra colección completa de publicaciones académicas y boletines jurídicos.</p>
              <div className="page-header-divider" aria-hidden="true" />
            </div>
          </div>

          <div className="archivo-filters">
            <input
              className="archivo-filter-input"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar boletines..."
              aria-label="Buscar boletines"
            />

            <select
              className="archivo-filter-select"
              value={yearFilter}
              onChange={handleYearChange}
              aria-label="Filtrar por año"
            >
              <option value="all">Todos los años</option>
              {publicationYears.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>

            <select
              className="archivo-filter-select"
              value={categoryFilter}
              onChange={handleCategoryChange}
              aria-label="Filtrar por categoría"
            >
              <option value="all">Todas las categorías</option>
              {publicationCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <p className="archivo-filter-results">
            Mostrando {rangoInicio}-{rangoFin} de {filteredPublicaciones.length} boletines
          </p>

          <div className="archivo-content">
            <div key={`pagina-${paginaSegura}`} className="cards-container cards-container-fade">
              {publicacionesPaginadas.map((item) => (
                <div key={item.id} className="card">
                  <div className="card-header">
                    <span className="card-category">{item.lex_categorias?.nombre || 'Sin categoría'}</span>
                    {item.imagen_url && <img src={item.imagen_url} alt={item.titulo} className="card-image" />}
                  </div>
                  <div className="card-body">
                    <h2 className="card-title">{item.titulo}</h2>
                    <p className="card-author">{item.autor_nombre || 'Autor no especificado'}</p>
                    <p className="card-date">{item.fecha ? new Date(item.fecha).toLocaleDateString() : 'Fecha no disponible'}</p>
                    {item.pdf_url ? (
                      <button
                        type="button"
                        onClick={() => setSelectedPdf(item.pdf_url)}
                        className="card-button btn-lex btn-lex-dark"
                      >
                        Leer Documento
                      </button>
                    ) : (
                      <span className="card-button btn-lex btn-lex-dark" aria-disabled="true">
                        No disponible
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPaginas > 1 && (
              <nav className="archivo-pagination" aria-label="Paginación de archivo">
                <div className="archivo-pagination-layout">
                  <div className="archivo-pagination-track">
                    <button
                      type="button"
                      className="archivo-page-btn archivo-page-btn-nav"
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
                            className="archivo-page-btn archivo-page-btn-ellipsis"
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
                          className={`archivo-page-btn archivo-page-btn-number ${isActive ? 'is-active' : ''}`}
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
                      className="archivo-page-btn archivo-page-btn-nav"
                      onClick={() => handlePageChange(Math.min(totalPaginas, paginaSegura + 1))}
                      disabled={paginaSegura === totalPaginas}
                      aria-label="Ir a la página siguiente"
                    >
                      &gt;
                    </button>
                  </div>

                  <p className="archivo-page-counter">Página {paginaSegura} de {totalPaginas}</p>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>

      {selectedPdf && (
        <div className="pdf-viewer" onClick={handleCloseViewer}>
          <div className="pdf-container">
            <button className="close-button" onClick={() => setSelectedPdf(null)} type="button" aria-label="Cerrar visor">
              ×
            </button>
            <iframe src={selectedPdf} title="Vista previa del documento" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Archivo;
