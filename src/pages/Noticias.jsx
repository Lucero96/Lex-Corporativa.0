import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Noticias.css';

const Noticias = () => {
  const [publicaciones, setPublicaciones] = useState([]);

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

  return (
    <div className="noticias-container">
      <h1>Noticias</h1>
      <div className="noticias-list">
        {publicaciones.map((pub) => (
          <div key={pub.id} className="noticia-item">
            <h2>{pub.titulo}</h2>
            <p>{pub.escritores}</p>
            <p>{new Date(pub.fecha).toLocaleDateString()}</p>
            {pub.imagen_url && <img src={pub.imagen_url} alt={pub.titulo} />}
            {pub.documento_url && (
              <a href={pub.documento_url} target="_blank" rel="noopener noreferrer">
                Ver Documento
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Noticias;
