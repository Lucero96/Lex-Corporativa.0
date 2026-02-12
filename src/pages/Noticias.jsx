import { newsData } from '../data';
import './Noticias.css';

const Noticias = () => {
  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <div>
            <div className="section-label">ACTUALIDAD JURÍDICA</div>
            <h1 className="page-title">Noticias</h1>
          </div>
        </div>

        <div className="news-grid-full">
          {newsData.map((news, index) => (
            <article key={news.id} className="news-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="news-image">
                <img src={news.image} alt={news.title} />
                <div className="news-badge">{news.badge}</div>
              </div>
              <div className="news-content">
                <div className="news-date">{news.date}</div>
                <h3 className="news-title">{news.title}</h3>
                <p className="news-excerpt">{news.excerpt}</p>
                <button className="read-more">Leer más →</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Noticias;
