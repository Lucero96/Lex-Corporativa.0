import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Home.css';
import { legalAreas } from '../data';

const Home = ({ onNavigate }) => {
  const [ultimasNoticias, setUltimasNoticias] = useState([]);

  useEffect(() => {
    const fetchNoticias = async () => {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*')
        .eq('tipo', 'noticia')
        .order('fecha', { ascending: false })
        .limit(3);
      if (error) {
        console.error('Error fetching noticias:', error);
      } else {
        setUltimasNoticias(data || []);
      }
    };
    fetchNoticias();
  }, []);

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
                {/* ...existing icon code... */}
                <svg className="area-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  {/* ...icon logic... */}
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
            <button className="btn-secondary" onClick={() => onNavigate('noticias')}>VER TODAS</button>
          </div>

          <div className="news-grid">
            {ultimasNoticias.length === 0 ? (
              <div className="news-empty">No hay noticias disponibles.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', justifyContent: 'center', flexWrap: 'nowrap', maxWidth: '1100px', margin: '0 auto' }}>
                {ultimasNoticias.slice(0, 3).map((news, index) => (
                  <div key={news.id} style={{ width: '400px', background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.20) 0%, rgba(247,245,245,0.20) 72%), rgba(1,1,1,0.15)', overflow: 'hidden', backgroundImage: `url(${news.imagen_url || 'https://placehold.co/350x220'})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex', borderRadius: '18px', boxShadow: '0 6px 16px rgba(0,0,0,0.2)', marginBottom: '24px', minHeight: '220px' }}>
                    <div style={{ alignSelf: 'stretch', height: '25px', color: 'white', fontSize: '18px', fontFamily: 'Playfair Display', fontWeight: 700, lineHeight: '28px', wordWrap: 'break-word', padding: '16px 16px 0 16px' }}>
                      Resumen {new Date(news.fecha).toLocaleDateString()}
                    </div>
                    <div style={{ alignSelf: 'stretch', color: 'rgba(255,255,255,0.80)', fontSize: '15px', fontFamily: 'Playfair Display', fontWeight: 500, lineHeight: '28px', wordWrap: 'break-word', padding: '0 16px 16px 16px' }}>
                      {news.resumen}<br />
                      {news.resumen_puntos && Array.isArray(news.resumen_puntos) && news.resumen_puntos.map((punto, idx) => (
                        <span key={idx}>{punto}<br /></span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
