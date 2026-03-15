import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Noticias.css';

const Noticias = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const noticiasPageRef = useRef(null);
  const noticiasCanvasRef = useRef(null);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*')
        .eq('tipo', 'noticia');

      if (error) {
        console.error('Error fetching publicaciones:', error);
      } else {
        setPublicaciones(data);
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

    return (
      <div className="noticias-page" ref={noticiasPageRef}>
        <canvas className="noticias-network-canvas" ref={noticiasCanvasRef} aria-hidden="true" />
        <div style={{ width: '90%', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', marginTop: '110px' }}>
            <div>
              <div style={{ color: '#80CC66', fontSize: '10px', fontFamily: 'Inter', fontWeight: 900, textTransform: 'uppercase', lineHeight: '16px', letterSpacing: '5px', wordWrap: 'break-word', marginBottom: '8px' }}>REPOSITORIO ACADÉMICO</div>
              <div style={{ color: 'white', fontSize: '48px', fontFamily: 'Playfair Display', fontWeight: 700, lineHeight: '76.80px', wordWrap: 'break-word' }}>Noticia Semanal</div>
            </div>
            {/* Aquí puedes agregar el logo si lo necesitas, separado del título */}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '24px', minHeight: '700px' }}>
            {/* Card principal grande, ocupa dos filas */}
            {publicaciones[0] && (
              <div style={{ gridRow: '1 / span 2', gridColumn: '1', minHeight: '600px', background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.20) 0%, rgba(247, 245, 245, 0.20) 72%), rgba(1, 1, 1, 0.15)', overflow: 'hidden', backgroundImage: `url(${publicaciones[0].imagen_url || 'https://placehold.co/588x700'})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '40px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                <div style={{ color: 'white', fontSize: '24px', fontFamily: 'Playfair Display', fontWeight: 700, lineHeight: '32px', marginBottom: '18px' }}>Resumen {new Date(publicaciones[0].fecha).toLocaleDateString()}</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.80)', fontSize: '20px', fontFamily: 'Playfair Display', fontWeight: 500, lineHeight: '32px', marginBottom: '18px' }}>{publicaciones[0].titulo}<br />{publicaciones[0].escritores}<br />{publicaciones[0].resumen || ''}</div>
                {publicaciones[0].resumen_puntos && Array.isArray(publicaciones[0].resumen_puntos) && (
                  <ul style={{ color: '#fff', fontSize: '18px', fontFamily: 'Playfair Display', fontWeight: 500, marginTop: '12px', paddingLeft: '24px' }}>
                    {publicaciones[0].resumen_puntos.map((punto, idx) => (
                      <li key={idx} style={{ marginBottom: '10px', lineHeight: '1.5' }}>{punto}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {/* 4 cards verticales a la derecha */}
            {publicaciones.slice(1, 5).map((pub, idx) => (
              <div key={pub.id} style={{
                gridRow: '1',
                gridColumn: `${idx+2}`,
                minHeight: '290px',
                backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.20) 0%, rgba(247,245,245,0.20) 72%), url(${pub.imagen_url || 'https://placehold.co/284x290'})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                padding: '20px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
              }}>
                <div style={{ color: 'white', fontSize: '14px', fontFamily: 'Playfair Display', fontWeight: 700, lineHeight: '20px', marginBottom: '8px' }}>Resumen {new Date(pub.fecha).toLocaleDateString()}</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.80)', fontSize: '13px', fontFamily: 'Playfair Display', fontWeight: 500, lineHeight: '16px', marginBottom: '8px' }}>{pub.titulo}<br />{pub.escritores}<br />{pub.resumen || ''}</div>
                {pub.resumen_puntos && Array.isArray(pub.resumen_puntos) && (
                  <ul style={{ color: '#fff', fontSize: '12px', fontFamily: 'Playfair Display', fontWeight: 500, marginTop: '4px', paddingLeft: '16px' }}>
                    {pub.resumen_puntos.map((punto, idx2) => (
                      <li key={idx2} style={{ marginBottom: '4px', lineHeight: '1.3' }}>{punto}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {/* 4 cards horizontales abajo */}
            {publicaciones.slice(5, 9).map((pub, idx) => (
              <div key={pub.id} style={{
                gridRow: '2',
                gridColumn: `${idx+2}`,
                minHeight: '290px',
                backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.20) 0%, rgba(247,245,245,0.20) 72%), url(${pub.imagen_url || 'https://placehold.co/284x290'})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                padding: '20px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
              }}>
                <div style={{ color: 'white', fontSize: '14px', fontFamily: 'Playfair Display', fontWeight: 700, lineHeight: '20px', marginBottom: '8px' }}>Resumen {new Date(pub.fecha).toLocaleDateString()}</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.80)', fontSize: '13px', fontFamily: 'Playfair Display', fontWeight: 500, lineHeight: '16px', marginBottom: '8px' }}>{pub.titulo}<br />{pub.escritores}<br />{pub.resumen || ''}</div>
                {pub.resumen_puntos && Array.isArray(pub.resumen_puntos) && (
                  <ul style={{ color: '#fff', fontSize: '12px', fontFamily: 'Playfair Display', fontWeight: 500, marginTop: '4px', paddingLeft: '16px' }}>
                    {pub.resumen_puntos.map((punto, idx2) => (
                      <li key={idx2} style={{ marginBottom: '4px', lineHeight: '1.3' }}>{punto}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          {/* PDF Viewer */}
          {selectedPdf && (
            <div className="pdf-viewer" onClick={handleCloseViewer}>
              <iframe
                src={selectedPdf}
                width="80%"
                height="80%"
                title="PDF Viewer"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    );
};

export default Noticias;