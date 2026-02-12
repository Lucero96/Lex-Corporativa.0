import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Archivo.css';

const Archivo = () => {
  const [publicaciones, setPublicaciones] = useState([]);

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

  return (
    <div className="archivo-container">
      <h1>Publicaciones</h1>
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
                <a href={pub.documento_url} target="_blank" rel="noopener noreferrer" className="card-button">
                  Leer Documento
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archivo;
