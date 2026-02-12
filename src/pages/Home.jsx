import { legalAreas, newsData } from '../data';
import './Home.css';

const Home = ({ onNavigate }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/hero-background.jpg" alt="Biblioteca legal" />
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              REPOSITORIO <span>académico</span> JURÍDICO
            </h1>
            <p className="hero-subtitle">
              Plataforma especializada en investigación, análisis y difusión del conocimiento jurídico corporativo. 
              Acceda a recursos académicos de vanguardia y participe en el debate legal contemporáneo.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => onNavigate('archivo')}>
                EXPLORAR ARCHIVO
              </button>
              <button className="btn-secondary" onClick={() => onNavigate('noticias')}>
                VER NOTICIAS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Areas Section */}
      <section className="section-wrapper legal-areas">
        <div className="container">
          <div className="section-header">
            <div className="section-label">ESPECIALIZACIÓN</div>
            <h2 className="section-title">Áreas de Práctica Legal</h2>
          </div>

          <div className="areas-grid">
            {legalAreas.map((area, index) => (
              <div key={area.id} className="area-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <svg className="area-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  {area.icon === 'scale' && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                  )}
                  {area.icon === 'users' && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  )}
                  {area.icon === 'shield' && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  )}
                  {area.icon === 'briefcase' && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  )}
                  {area.icon === 'file-text' && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  )}
                  {area.icon === 'globe' && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  )}
                </svg>
                <h3 className="area-title">{area.title}</h3>
                <p className="area-desc">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Preview Section */}
      <section className="section-wrapper news-preview">
        <div className="container">
          <div className="news-header">
            <div>
              <div className="section-label">ACTUALIDAD</div>
              <h2 className="section-title">Últimas Noticias Jurídicas</h2>
            </div>
            <button className="btn-secondary" onClick={() => onNavigate('noticias')}>
              VER TODAS
            </button>
          </div>

          <div className="news-grid">
            {newsData.slice(0, 3).map((news, index) => (
              <article key={news.id} className="news-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="news-image">
                  <img src={news.image} alt={news.title} />
                  <div className="news-badge">{news.badge}</div>
                </div>
                <div className="news-date">{news.date}</div>
                <h3 className="news-title">{news.title}</h3>
                <p className="news-excerpt">{news.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
