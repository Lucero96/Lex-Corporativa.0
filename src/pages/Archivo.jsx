import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Archivo.css';

const Archivo = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
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
          .map((pub) => (pub.categoria || '').trim())
          .filter((category) => category.length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [publicaciones]);

  const filteredPublicaciones = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return publicaciones.filter((pub) => {
      const pubYear = pub.fecha ? String(new Date(pub.fecha).getFullYear()) : '';
      const pubCategory = (pub.categoria || '').trim();

      const matchesYear = yearFilter === 'all' || pubYear === yearFilter;
      const matchesCategory = categoryFilter === 'all' || pubCategory === categoryFilter;

      const searchableText = [pub.titulo, pub.escritores, pub.categoria, pub.resumen]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return matchesYear && matchesCategory && matchesQuery;
    });
  }, [publicaciones, searchQuery, yearFilter, categoryFilter]);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*')
        .neq('tipo', 'noticia');

      if (error) {
        console.error('Error fetching publicaciones:', error);
      } else {
        setPublicaciones(data);
      }
    };

    fetchPublicaciones();
  }, []);

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

  const handleCloseViewer = (e) => {
    if (e.target.classList.contains('pdf-viewer')) {
      setSelectedPdf(null);
    }
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
            </div>
          </div>

          <div className="archivo-filters">
            <input
              className="archivo-filter-input"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar boletines..."
              aria-label="Buscar boletines"
            />

            <select
              className="archivo-filter-select"
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
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
              onChange={(event) => setCategoryFilter(event.target.value)}
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
            Mostrando {filteredPublicaciones.length} de {publicaciones.length} boletines
          </p>

          <div className="archivo-content">
            <div className="cards-container">
              {filteredPublicaciones.map((pub) => (
                <div key={pub.id} className="card">
                  <div className="card-header">
                    <span className="card-category">{pub.categoria}</span>
                    {pub.imagen_url && <img src={pub.imagen_url} alt={pub.titulo} className="card-image" />}
                  </div>
                  <div className="card-body">
                    <h2 className="card-title">{pub.titulo}</h2>
                    <p className="card-author">{pub.escritores}</p>
                    <p className="card-date">{new Date(pub.fecha).toLocaleDateString()}</p>
                    {pub.documento_url && (
                      <button onClick={() => setSelectedPdf(pub.documento_url)} className="card-button btn-lex btn-lex-dark">
                        Leer Documento
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedPdf && (
        <div className="pdf-viewer" onClick={handleCloseViewer}>
          <div className="pdf-container">
            <iframe
              src={selectedPdf}
              width="80%"
              height="80%"
              title="PDF Viewer"
            ></iframe>
            <button className="close-button" onClick={() => setSelectedPdf(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Archivo;
