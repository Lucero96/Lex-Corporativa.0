import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Archivo.css';

const Archivo = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*');

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
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <div>
            <div className="section-label">REPOSITORIO ACADÉMICO</div>
            <h1 className="page-title">Archivo de Publicaciones</h1>
          </div>
        </div>

        <div className="archivo-content">
          <div className="cards-container">
            {publicaciones.map((pub) => (
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
                    <button onClick={() => setSelectedPdf(pub.documento_url)} className="card-button">
                      Leer Documento
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPdf && (
        <div className="pdf-viewer" onClick={handleCloseViewer}>
          <iframe
            src={selectedPdf}
            width="80%"
            height="80%"
            title="PDF Viewer"
          ></iframe>
          <button className="close-button" onClick={() => setSelectedPdf(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default Archivo;
