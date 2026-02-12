import { publicationsData } from '../data';
import './Archivo.css';

const Archivo = () => {
  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <div>
            <div className="section-label">BIBLIOTECA DIGITAL</div>
            <h1 className="page-title">Archivo de Publicaciones</h1>
          </div>
        </div>

        <div className="publications-grid">
          {publicationsData.map((pub, index) => (
            <article key={pub.id} className="pub-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="pub-cover">
                <img src={pub.cover} alt={pub.title} />
              </div>
              <div className="pub-content">
                <h3 className="pub-title">{pub.title}</h3>
                <div className="pub-author">{pub.author}</div>
                <div className="pub-date">{pub.date}</div>
                <p className="pub-description">{pub.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Archivo;
