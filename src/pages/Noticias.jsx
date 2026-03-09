import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Noticias.css';

const Noticias = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

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

  const handleCloseViewer = (e) => {
    if (e.target.classList.contains('pdf-viewer')) {
      setSelectedPdf(null);
    }
  };

    return (
      <div style={{ width: '100vw', minHeight: '100vh', background: '#0B0332', padding: '40px 0' }}>
        <div style={{ width: '90%', margin: '0 auto' }}>
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