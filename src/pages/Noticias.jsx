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
    <div className="noticias-container">
      <h1>Noticias</h1>
      <div className="cards-container">
        {publicaciones.map((pub) => (
          <div key={pub.id} className="card">
            <div className="card-header">
              <span className="card-category">Noticia</span>
              {pub.imagen_url && <img src={pub.imagen_url} alt={pub.titulo} className="card-image" />}
            </div>
            <div className="card-body">
              <h2 className="card-title">{pub.titulo}</h2>
              <p className="card-author">{pub.escritores}</p>
              <p className="card-date">{new Date(pub.fecha).toLocaleDateString()}</p>
              {pub.documento_url && (
                <button onClick={() => setSelectedPdf(pub.documento_url)} className="card-button">
                  Ver Documento
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
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
  );
};

export default Noticias;