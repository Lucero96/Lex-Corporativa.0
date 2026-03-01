import React from 'react';
import './Card.css';

const Card = ({ titulo, escritores, fecha, imagen_url, documento_url }) => {
  return (
    <div className="news-card">
      <div className="card-header">
        <h2>{titulo}</h2>
        <p>📅 {fecha ? new Date(fecha).toLocaleDateString() : ''}</p>
      </div>
      <div className="card-body">
        {escritores && <p><strong>{escritores}</strong></p>}
        {imagen_url && <img src={imagen_url} alt={titulo} className="card-image" />}
      </div>
      <div className="card-footer">
        {documento_url && (
          <button className="card-button" onClick={() => window.open(documento_url, '_blank')}>Ver Documento</button>
        )}
      </div>
    </div>
  );
};

export default Card;