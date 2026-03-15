import { useEffect, useRef } from 'react';
import './Nosotros.css';
import yamile from '../assets/team/yamiley.png';
import ariana from '../assets/team/ariana.png';
import nikold from '../assets/team/nikold.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Nosotros = () => {
  const editorialSectionRef = useRef(null);
  const editorialCanvasRef = useRef(null);

  useEffect(() => {
    const sectionEl = editorialSectionRef.current;
    const canvas = editorialCanvasRef.current;
    if (!sectionEl || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = 0;
    let height = 0;
    const mouse = { x: null, y: null };
    const points = [];

    const buildPoints = () => {
      points.length = 0;
      const area = width * height;
      const pointCount = Math.max(26, Math.min(58, Math.floor(area / 22000)));

      for (let i = 0; i < pointCount; i += 1) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.34,
          vy: (Math.random() - 0.5) * 0.34
        });
      }
    };

    const resizeCanvas = () => {
      const rect = sectionEl.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      buildPoints();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < points.length; i += 1) {
        const p1 = points[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x <= 0 || p1.x >= width) p1.vx *= -1;
        if (p1.y <= 0 || p1.y >= height) p1.vy *= -1;

        for (let j = i + 1; j < points.length; j += 1) {
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 102) {
            const opacity = ((102 - distance) / 102) * 0.11;
            ctx.strokeStyle = `rgba(232, 220, 196, ${opacity.toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mx = p1.x - mouse.x;
          const my = p1.y - mouse.y;
          const mouseDistance = Math.hypot(mx, my);

          if (mouseDistance < 120) {
            const force = (120 - mouseDistance) / 120;
            p1.x += (mx / (mouseDistance || 1)) * force * 0.6;
            p1.y += (my / (mouseDistance || 1)) * force * 0.6;

            ctx.strokeStyle = `rgba(232, 220, 196, ${(force * 0.18).toFixed(3)})`;
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = 'rgba(232, 220, 196, 0.30)';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = window.requestAnimationFrame(draw);
    };

    const handleMouseMove = (event) => {
      const rect = sectionEl.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    resizeCanvas();
    draw();

    window.addEventListener('resize', resizeCanvas);
    sectionEl.addEventListener('mousemove', handleMouseMove);
    sectionEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      sectionEl.removeEventListener('mousemove', handleMouseMove);
      sectionEl.removeEventListener('mouseleave', handleMouseLeave);
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  const editorialTeam = [
    {
      name: 'Yamiley Rodriguez',
      role: 'Directora Editorial',
      institution: 'Universidad Nacional',
      description: 'Impulsa la creacion y desarrollo de Lex Corporativa como un espacio de investigacion, analisis y difusion del pensamiento juridico estudiantil.',
      image: yamile,
      alt: 'Yamiley Rodriguez'
    },
    {
      name: 'Ariana Martinez',
      role: 'Editora Senior',
      institution: 'Universidad de los Andes',
      description: 'Coordina el proceso editorial y fortalece la calidad academica de los contenidos juridicos publicados en la revista.',
      image: ariana,
      alt: 'Ariana Martinez'
    },
    {
      name: 'Nikold Garcia',
      role: 'Editor Asociado',
      institution: 'Pontificia Universidad',
      description: 'Encargada de la promocion institucional, la difusion del contenido editorial y el posicionamiento de Lex Corporativa.',
      image: nikold,
      alt: 'Nikold Garcia'
    },
  ];

  const features = [
    {
      title: 'Biblioteca Digital',
      description:
        'Acceso a una extensa colección de publicaciones académicas, papers y libros especializados en derecho corporativo.',
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Actualidad Jurídica',
      description:
        'Noticias y análisis de las últimas novedades legislativas, jurisprudenciales y doctrinarias del ámbito legal.',
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="10,9 9,9 8,9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Investigación',
      description:
        'Estudios profundos sobre temas especializados en las diversas áreas del derecho corporativo y empresarial.',
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Colaboración',
      description:
        'Espacio para que académicos y profesionales compartan sus trabajos y contribuyan al conocimiento colectivo.',
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <div className="page-content about-page">
      <section className="section-wrapper about-sector about-sector-dark about-sector-header">
        <div className="about-hero-shell">
          <div className="about-hero-grid">
            <div className="about-hero-image" aria-label="Imagen de Sobre Nosotros" />

            <div className="about-hero-content">
              <div className="about-hero-copy">
                <div className="section-label">SOBRE NOSOTROS</div>
                <h1 className="about-hero-title">Pasión por el Derecho, Compromiso con la Excelencia</h1>
                <p className="about-hero-text">
                  Lex Corporativa nació en los pasillos de la facultad, de la mano de estudiantes que entendieron que el derecho no es algo estático, sino un saber que evoluciona. No somos solo una base de datos; somos el esfuerzo por centralizar la excelencia, por darle al futuro abogado herramientas reales para un mundo complejo. Construimos este espacio con rigor académico y pasión tecnológica, convencidos de que compartir el conocimiento es la única forma de elevar nuestra profesión.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="section-wrapper about-sector about-sector-light">
        <div className="container">
          <div className="about-content">
            <section className="about-section mission-vision-section">
              <h2 className="about-heading">Misión y Visión</h2>
            <div className="mission-vision-grid">
              {/* Misión */}
              <div className="mission-vision-card mission-card">
                <h2 className="mv-title">MISIÓN</h2>
                <p className="mv-text">
                  LEX CORPORATIVA es una revista jurídica estudiantil que busca promover la investigación académica, difundir el conocimiento jurídico y generar espacios de aprendizaje interdisciplinario. Nuestro propósito es acercar a estudiantes y profesionales mediante publicaciones innovadoras, actividades formativas y colaboraciones con instituciones académicas, consolidando así un espacio comprometido con la excelencia y el pensamiento crítico.
                </p>
              </div>

              {/* Visión */}
              <div className="mission-vision-card vision-card">
                <h2 className="mv-title">VISIÓN</h2>
                <p className="mv-text">
                  Ser reconocida como una revista jurídica estudiantil referente en el Perú y Latinoamérica, destacando por su impacto académico, proyección internacional y aporte a la formación de nuevas generaciones de juristas. Aspiramos a consolidar una comunidad que integre el derecho con otras áreas del conocimiento, promoviendo así un diálogo interdisciplinario que enriquezca la investigación y la práctica jurídica.
                </p>
              </div>
            </div>
            </section>
          </div>
        </div>
      </section>

      {/* Consejo Editorial */}
      <section className="section-wrapper about-sector about-sector-dark editorial-section" ref={editorialSectionRef}>
        <canvas className="editorial-network-canvas" ref={editorialCanvasRef} aria-hidden="true" />
        <div className="container">
          <div className="about-content">
            <section className="about-section">
              <h2 className="about-heading">Consejo Editorial</h2>
            <div className="team-grid">
              {editorialTeam.map((member) => (
                <article className="team-member" key={member.name}>
                  <div className="team-image-wrapper">
                    <img
                      src={member.image}
                      alt={member.alt}
                      className="team-image"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-institution">{member.institution}</p>
                  <span className="team-divider" aria-hidden="true" />
                  <p className="team-description">{member.description}</p>

                  <div className="team-actions" aria-label={`Canales de contacto de ${member.name}`}>
                    <a href="mailto:contacto@lexcorporativa.com" className="team-action" aria-label={`Enviar correo a ${member.name}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="team-action" aria-label={`Ver perfil profesional de ${member.name}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  </div>
                </article>
              ))}
            </div>
            </section>
          </div>
        </div>
      </section>

      {/* Qué Ofrecemos */}
      <section className="section-wrapper about-sector about-sector-light">
        <div className="container">
          <div className="about-content">
            <section className="about-section">
              <h2 className="about-heading">Qué Ofrecemos</h2>
              <div className="features-slider-shell">
                <button className="features-nav features-prev" aria-label="Tarjeta anterior">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <Swiper
                  className="features-slider"
                  modules={[Navigation, Pagination, A11y, Autoplay]}
                  spaceBetween={24}
                  slidesPerView={1}
                  grabCursor
                  loop
                  speed={700}
                  autoplay={{
                    delay: 3200,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                  }}
                  navigation={{
                    prevEl: '.features-prev',
                    nextEl: '.features-next'
                  }}
                  pagination={{
                    el: '.features-dots',
                    clickable: true
                  }}
                  breakpoints={{
                    1024: {
                      slidesPerView: 3
                    }
                  }}
                >
                  {features.map((feature) => (
                    <SwiperSlide key={feature.title} className="features-slide">
                      <article className="feature-card">
                        <div className="feature-icon">{feature.icon}</div>
                        <h3 className="feature-title">{feature.title}</h3>
                        <p className="feature-desc">{feature.description}</p>
                      </article>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button className="features-nav features-next" aria-label="Tarjeta siguiente">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                <div className="features-dots" aria-hidden="false" />
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;

