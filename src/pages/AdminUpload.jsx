import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileText, Newspaper, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Upload.css';

const INITIAL_FORM = {
  titulo: '',
  autor_nombre: '',
  fecha: '',
  categoria_id: '',
  imagen_url: '',
  pdf_url: '',
  resumen_p: ''
};

const MONTH_OPTIONS = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' }
];

const ADMIN_ROWS_PER_PAGE = 8;

const getDateParts = (rawDate) => {
  if (!rawDate) return { year: '', month: '' };

  const raw = String(rawDate).trim();
  const match = raw.match(/^(\d{4})-(\d{2})/);
  if (match) {
    return {
      year: match[1],
      month: String(Number(match[2]))
    };
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return { year: '', month: '' };
  }

  return {
    year: String(parsed.getFullYear()),
    month: String(parsed.getMonth() + 1)
  };
};

const AdminUpload = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [articulos, setArticulos] = useState(null);
  const [noticias, setNoticias] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [totalPublicaciones, setTotalPublicaciones] = useState(0);
  const [totalNoticias, setTotalNoticias] = useState(0);
  const [loadingArticulos, setLoadingArticulos] = useState(false);
  const [loadingNoticias, setLoadingNoticias] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalModule, setModalModule] = useState('publicaciones');
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [paginaPublicaciones, setPaginaPublicaciones] = useState(1);
  const [isPaginatingPublicaciones, setIsPaginatingPublicaciones] = useState(false);
  const [paginaNoticias, setPaginaNoticias] = useState(1);
  const [isPaginatingNoticias, setIsPaginatingNoticias] = useState(false);
  const [publicationFilters, setPublicationFilters] = useState({
    search: '',
    categoria: '',
    year: '',
    month: ''
  });
  const [newsFilters, setNewsFilters] = useState({
    search: '',
    year: '',
    month: ''
  });
  const adminPageRef = useRef(null);
  const adminCanvasRef = useRef(null);
  const paginationTimeoutRef = useRef(null);
  const noticiasPaginationTimeoutRef = useRef(null);

  const availableYears = useMemo(() => {
    const yearsSet = new Set();

    (articulos || []).forEach((item) => {
      const { year } = getDateParts(item.fecha);
      if (year) yearsSet.add(year);
    });

    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, [articulos]);

  const filteredArticulos = useMemo(() => {
    const normalizedSearch = publicationFilters.search.trim().toLowerCase();

    return (articulos || []).filter((item) => {
      const titulo = String(item.titulo || '').toLowerCase();
      const autor = String(item.autor_nombre || '').toLowerCase();
      const categoriaId = String(item.categoria_id || '');
      const { year, month } = getDateParts(item.fecha);

      const matchesSearch = !normalizedSearch
        || titulo.includes(normalizedSearch)
        || autor.includes(normalizedSearch);
      const matchesCategory = !publicationFilters.categoria || categoriaId === publicationFilters.categoria;
      const matchesYear = !publicationFilters.year || year === publicationFilters.year;
      const matchesMonth = !publicationFilters.month || month === publicationFilters.month;

      return matchesSearch && matchesCategory && matchesYear && matchesMonth;
    });
  }, [articulos, publicationFilters]);

  const availableNewsYears = useMemo(() => {
    const yearsSet = new Set();

    (noticias || []).forEach((item) => {
      const { year } = getDateParts(item.fecha);
      if (year) yearsSet.add(year);
    });

    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, [noticias]);

  const filteredNoticias = useMemo(() => {
    const normalizedSearch = newsFilters.search.trim().toLowerCase();

    return (noticias || []).filter((item) => {
      const titulo = String(item.titulo || '').toLowerCase();
      const resumenText = Array.isArray(item.resumen_p)
        ? item.resumen_p.join(' ').toLowerCase()
        : String(item.resumen_p || '').toLowerCase();
      const { year, month } = getDateParts(item.fecha);

      const matchesSearch = !normalizedSearch
        || titulo.includes(normalizedSearch)
        || resumenText.includes(normalizedSearch);
      const matchesYear = !newsFilters.year || year === newsFilters.year;
      const matchesMonth = !newsFilters.month || month === newsFilters.month;

      return matchesSearch && matchesYear && matchesMonth;
    });
  }, [noticias, newsFilters]);

  const totalPaginasPublicaciones = Math.ceil(filteredArticulos.length / ADMIN_ROWS_PER_PAGE);
  const paginaPublicacionesSegura = Math.min(paginaPublicaciones, Math.max(totalPaginasPublicaciones, 1));
  const inicioPublicaciones = (paginaPublicacionesSegura - 1) * ADMIN_ROWS_PER_PAGE;
  const publicacionesPaginadas = filteredArticulos.slice(
    inicioPublicaciones,
    inicioPublicaciones + ADMIN_ROWS_PER_PAGE
  );
  const totalPaginasNoticias = Math.ceil(filteredNoticias.length / ADMIN_ROWS_PER_PAGE);
  const paginaNoticiasSegura = Math.min(paginaNoticias, Math.max(totalPaginasNoticias, 1));
  const inicioNoticias = (paginaNoticiasSegura - 1) * ADMIN_ROWS_PER_PAGE;
  const noticiasPaginadas = filteredNoticias.slice(
    inicioNoticias,
    inicioNoticias + ADMIN_ROWS_PER_PAGE
  );

  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from('lex_categorias')
      .select('id, nombre')
      .order('nombre', { ascending: true });

    if (error) {
      console.log('Error detallado:', error);
      return;
    }

    setCategorias(data || []);
  };

  const fetchDashboardSummary = async () => {
    const [pubCountRes, newsCountRes] = await Promise.all([
      supabase.from('lex_articulos').select('*', { count: 'exact', head: true }),
      supabase.from('lex_noticias').select('*', { count: 'exact', head: true })
    ]);

    setTotalPublicaciones(pubCountRes.count || 0);
    setTotalNoticias(newsCountRes.count || 0);
  };

  const fetchArticulos = async () => {
    setLoadingArticulos(true);
    setErrorMsg('');

    const { data, error } = await supabase.from('lex_articulos').select('*, lex_categorias(nombre)').order('fecha', { ascending: false });

    if (error) {
      console.log('Error detallado:', error);
      setErrorMsg('No se pudo cargar la data del panel. Intenta nuevamente.');
      setArticulos([]);
    } else {
      setArticulos(data || []);
    }

    setLoadingArticulos(false);
  };

  const fetchNoticias = async () => {
    setLoadingNoticias(true);
    setErrorMsg('');

    const { data, error } = await supabase
      .from('lex_noticias')
      .select('id, titulo, fecha, imagen_url, pdf_url, resumen_p')
      .order('fecha', { ascending: false });

    if (error) {
      console.log('Error detallado:', error);
      setErrorMsg('No se pudo cargar la data del panel. Intenta nuevamente.');
      setNoticias([]);
    } else {
      setNoticias(data || []);
    }

    setLoadingNoticias(false);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchCategorias();
      fetchDashboardSummary();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (activeTab === 'publicaciones') {
        fetchArticulos();
        return;
      }

      fetchNoticias();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (paginationTimeoutRef.current) {
        window.clearTimeout(paginationTimeoutRef.current);
      }

      if (noticiasPaginationTimeoutRef.current) {
        window.clearTimeout(noticiasPaginationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const sectionEl = adminPageRef.current;
    const canvas = adminCanvasRef.current;
    if (!sectionEl || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = 0;
    let height = 0;
    const mouse = { x: null, y: null };
    const points = [];

    const pointColor = 'rgba(232, 220, 196, 0.35)';
    const lineColor = 'rgba(232, 220, 196, 0.10)';
    const connectionDistance = 110;
    const mouseRadius = 140;
    const pointRadius = 1.9;
    const density = 15000;
    const minPoints = 46;
    const maxPoints = 96;

    const buildPoints = () => {
      points.length = 0;
      const area = width * height;
      const pointCount = Math.max(minPoints, Math.min(maxPoints, Math.floor(area / density)));

      for (let i = 0; i < pointCount; i += 1) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28
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

          if (distance < connectionDistance) {
            const opacity = ((connectionDistance - distance) / connectionDistance) * 0.12;
            ctx.strokeStyle = lineColor.replace('0.10', opacity.toFixed(3));
            ctx.lineWidth = 0.55;
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

          if (mouseDistance < mouseRadius) {
            const force = (mouseRadius - mouseDistance) / mouseRadius;
            p1.x += (mx / (mouseDistance || 1)) * force * 0.65;
            p1.y += (my / (mouseDistance || 1)) * force * 0.65;
          }
        }

        ctx.fillStyle = pointColor;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, pointRadius, 0, Math.PI * 2);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setModalModule(activeTab);
    setFormData(INITIAL_FORM);
    setSelectedImageFile(null);
    setSelectedPdfFile(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (record, moduleName) => {
    const isNoticiasTab = moduleName === 'noticias';

    setEditingRecord(record);
    setModalModule(moduleName);
    setFormData({
      titulo: record.titulo || '',
      autor_nombre: isNoticiasTab ? '' : (record.autor_nombre || ''),
      fecha: record.fecha ? String(record.fecha).slice(0, 10) : '',
      categoria_id: isNoticiasTab ? '' : (record.categoria_id ? String(record.categoria_id) : ''),
      imagen_url: record.imagen_url || '',
      pdf_url: isNoticiasTab ? (record.pdf_url || '') : (record.pdf_url || record.documento_url || ''),
      resumen_p: Array.isArray(record.resumen_p) ? record.resumen_p.join(', ') : (record.resumen_p || '')
    });
    setSelectedImageFile(null);
    setSelectedPdfFile(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setModalModule(activeTab);
    setFormData(INITIAL_FORM);
    setSelectedImageFile(null);
    setSelectedPdfFile(null);
    setUploadingField('');
  };

  const getTableByModule = (moduleName) => {
    if (moduleName === 'publicaciones' || moduleName === 'articulos') return 'lex_articulos';
    return 'lex_noticias';
  };

  const handleDelete = async (id, moduleName) => {
    const shouldDelete = window.confirm('Esta seguro de eliminar este registro? Esta accion no se puede deshacer.');
    if (!shouldDelete) return;

    const tabla = getTableByModule(moduleName);
    console.log('Borrando ID:', id, 'de la tabla:', tabla);

    const { error } = await supabase.from(tabla).delete().eq('id', id);
    if (error) {
      setErrorMsg('No se pudo eliminar el registro.');
      return;
    }

    if (tabla === 'lex_articulos') {
      setArticulos((prev) => (prev || []).filter((a) => a.id !== id));
    } else {
      setNoticias((prev) => (prev || []).filter((n) => n.id !== id));
    }

    await fetchDashboardSummary();
  };

  const getPublicacionPdfUrl = (item) => item?.pdf_url || item?.documento_url || '';
  const getNoticiaPdfUrl = (item) => item?.pdf_url || '';

  const openPdfViewer = (pdfUrl) => {
    if (!pdfUrl) return;
    setSelectedPdf(pdfUrl);
  };

  const closePdfViewer = () => {
    setSelectedPdf(null);
  };

  const handlePdfBackdropClick = (event) => {
    if (event.target.classList.contains('admin-pdf-viewer')) {
      closePdfViewer();
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublicationFilterChange = (event) => {
    const { name, value } = event.target;
    setPublicationFilters((prev) => ({ ...prev, [name]: value }));
    setPaginaPublicaciones(1);
  };

  const handleNewsFilterChange = (event) => {
    const { name, value } = event.target;
    setNewsFilters((prev) => ({ ...prev, [name]: value }));
    setPaginaNoticias(1);
  };

  const handlePublicacionesPageChange = (nextPage) => {
    if (nextPage === paginaPublicacionesSegura) return;

    if (paginationTimeoutRef.current) {
      window.clearTimeout(paginationTimeoutRef.current);
    }

    setIsPaginatingPublicaciones(true);
    paginationTimeoutRef.current = window.setTimeout(() => {
      setPaginaPublicaciones(nextPage);
      setIsPaginatingPublicaciones(false);
      const topPosition = adminPageRef.current?.offsetTop ?? 0;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
      paginationTimeoutRef.current = null;
    }, 170);
  };

  const handleNoticiasPageChange = (nextPage) => {
    if (nextPage === paginaNoticiasSegura) return;

    if (noticiasPaginationTimeoutRef.current) {
      window.clearTimeout(noticiasPaginationTimeoutRef.current);
    }

    setIsPaginatingNoticias(true);
    noticiasPaginationTimeoutRef.current = window.setTimeout(() => {
      setPaginaNoticias(nextPage);
      setIsPaginatingNoticias(false);
      const topPosition = adminPageRef.current?.offsetTop ?? 0;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
      noticiasPaginationTimeoutRef.current = null;
    }, 170);
  };

  const handleUpload = async (event, fileType) => {
    const selectedFile = event.target.files?.[0];
    const nextFile = selectedFile || null;

    if (fileType === 'pdf') {
      setSelectedPdfFile(nextFile);
      if (nextFile) {
        setFormData((prev) => ({ ...prev, pdf_url: '' }));
      }
    } else {
      setSelectedImageFile(nextFile);
      if (nextFile) {
        setFormData((prev) => ({ ...prev, imagen_url: '' }));
      }
    }

    // Si ya hay archivo(s) seleccionado(s), limpiamos errores previos de validacion.
    setErrorMsg('');
  };

  const uploadFileAndGetPublicUrl = async (file, fileType, section) => {
    const isPdf = fileType === 'pdf';
    const bucketName = section === 'noticias' ? 'Lex-noticias' : 'Lex-publicaciones';
    const folder = isPdf ? 'documentos' : 'portadas';
    const targetField = isPdf ? 'pdf_url' : 'imagen_url';
    const fileExt = file.name.split('.').pop();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${Date.now()}-${safeName}${fileExt ? '' : '.bin'}`;
    const storagePath = `${folder}/${fileName}`;

    setUploadingField(targetField);

    try {
      console.log('Subiendo a:', bucketName, 'con ruta:', storagePath);

      const { error: uploadError } = await supabase
        .storage
        .from(bucketName)
        .upload(storagePath, file, { upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = await supabase.storage.from(bucketName).getPublicUrl(storagePath);
      const publicUrl = data?.publicUrl || '';

      if (!publicUrl) {
        throw new Error('No se pudo obtener la URL publica del archivo.');
      }

      return publicUrl;
    } finally {
      setUploadingField('');
    }
  };

  const parseResumenPuntos = (rawValue) => {
    if (!rawValue) return null;

    return rawValue
      .split(/\s*[,-]\s*|\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentModule = modalModule;

    if (currentModule === 'publicaciones') {
      const titulo = formData.titulo.trim();
      const categoriaId = String(formData.categoria_id || '').trim();

      if (!titulo || !categoriaId) {
        setErrorMsg('El titulo y la categoria son obligatorios para una publicacion.');
        return;
      }

      const hasImageSource = Boolean(selectedImageFile || String(formData.imagen_url || '').trim());
      const hasPdfSource = Boolean(selectedPdfFile || String(formData.pdf_url || '').trim());

      if (!hasImageSource || !hasPdfSource) {
        setErrorMsg('Debes subir imagen y PDF antes de guardar la publicacion.');
        return;
      }
    }

    setSaving(true);
    setErrorMsg('');

    const targetTable = getTableByModule(currentModule);

    let payload;
    if (currentModule === 'publicaciones') {
      const categoriaId = String(formData.categoria_id || '').trim();
      const autorInputValue = String(formData.autor_nombre ?? formData.autor ?? '').trim();
      let imageUrl = String(formData.imagen_url || '').trim();
      let pdfUrl = String(formData.pdf_url || '').trim();

      try {
        if (selectedImageFile) {
          imageUrl = await uploadFileAndGetPublicUrl(selectedImageFile, 'imagen', 'publicaciones');
        }

        if (selectedPdfFile) {
          pdfUrl = await uploadFileAndGetPublicUrl(selectedPdfFile, 'pdf', 'publicaciones');
        }
      } catch {
        setSaving(false);
        setErrorMsg('No se pudieron subir los archivos. Intenta nuevamente.');
        return;
      }

      if (!imageUrl || !pdfUrl) {
        setSaving(false);
        setErrorMsg('No se pudieron obtener las URLs de imagen y PDF.');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imagen_url: imageUrl,
        pdf_url: pdfUrl
      }));

      payload = {
        titulo: formData.titulo.trim(),
        autor_nombre: autorInputValue || null,
        fecha: formData.fecha || null,
        categoria_id: categoriaId || null,
        imagen_url: imageUrl || null,
        pdf_url: pdfUrl || null
      };
    } else {
      payload = {
        titulo: formData.titulo,
        fecha: formData.fecha || null,
        imagen_url: null,
        pdf_url: null,
        resumen_p: null
      };

      const hasImageSource = Boolean(selectedImageFile || String(formData.imagen_url || '').trim());
      const hasPdfSource = Boolean(selectedPdfFile || String(formData.pdf_url || '').trim());

      if (!hasImageSource || !hasPdfSource) {
        setSaving(false);
        setErrorMsg('Debes subir imagen y PDF antes de guardar la noticia.');
        return;
      }

      let imageUrl = String(formData.imagen_url || '').trim();
      let pdfUrl = String(formData.pdf_url || '').trim();

      try {
        if (selectedImageFile) {
          imageUrl = await uploadFileAndGetPublicUrl(selectedImageFile, 'imagen', 'noticias');
        }

        if (selectedPdfFile) {
          pdfUrl = await uploadFileAndGetPublicUrl(selectedPdfFile, 'pdf', 'noticias');
        }
      } catch {
        setSaving(false);
        setErrorMsg('No se pudieron subir los archivos de la noticia. Intenta nuevamente.');
        return;
      }

      if (!imageUrl || !pdfUrl) {
        setSaving(false);
        setErrorMsg('No se pudieron obtener las URLs de imagen y PDF para la noticia.');
        return;
      }

      payload = {
        titulo: formData.titulo.trim(),
        fecha: formData.fecha || null,
        imagen_url: imageUrl,
        pdf_url: pdfUrl,
        resumen_p: parseResumenPuntos(formData.resumen_p)
      };

      setFormData((prev) => ({
        ...prev,
        imagen_url: imageUrl,
        pdf_url: pdfUrl
      }));
    }

    let request;
    if (editingRecord) {
      request = supabase.from(targetTable).update(payload).eq('id', editingRecord.id);
    } else {
      request = supabase.from(targetTable).insert(payload);
    }

    const { error } = await request;

    if (error) {
      setSaving(false);
      setErrorMsg('No se pudo guardar el registro. Verifica la configuración de Supabase.');
      return;
    }

    setSaving(false);
    closeModal();
    await fetchDashboardSummary();
    if (activeTab === 'publicaciones') {
      await fetchArticulos();
    } else {
      await fetchNoticias();
    }
  };

  console.log('Datos Publicaciones:', articulos);
  console.log('Datos Noticias:', noticias);

  return (
    <div className="admin-page" ref={adminPageRef}>
      <canvas className="admin-network-canvas" ref={adminCanvasRef} aria-hidden="true" />
      <header className="admin-header">
        <div className="admin-header-content container">
          <div className="admin-logo-container" aria-label="Lex Corporativa">
            <div className="admin-logo-circle">
              <img src="/assets/logo.png" alt="Lex Corporativa" className="admin-logo-image" />
            </div>
            <div className="admin-logo-text">
              <span className="admin-logo-main">LEX</span>
              <span className="admin-logo-sub">CORPORATIVA</span>
            </div>
          </div>

          <button type="button" className="admin-logout-btn" onClick={handleSignOut}>
            Cerrar Sesion
          </button>
        </div>
      </header>

      <main className="admin-main container">
        <section className="admin-hero" aria-label="Cabecera del panel administrativo">
          <p className="admin-hero-kicker">REPOSITORIO ACADÉMICO</p>
          <h1 className="admin-hero-title">Panel de Administración</h1>
          <p className="admin-hero-subtitle">Gestione, edite y organice las publicaciones y noticias del repositorio legal.</p>
        </section>

        <section className="admin-kpis" aria-label="Resumen del panel">
          <article className="admin-kpi-card admin-kpi-card-primary">
            <p className="admin-kpi-number">{totalPublicaciones}</p>
            <p className="admin-kpi-label">Publicaciones Totales</p>
          </article>

          <article className="admin-kpi-card admin-kpi-card-gold">
            <p className="admin-kpi-number">{totalNoticias}</p>
            <p className="admin-kpi-label">Noticias Publicadas</p>
          </article>
        </section>

        <section className="admin-tabs" aria-label="Navegacion de panel">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'publicaciones' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('publicaciones')}
          >
            <FileText size={16} className="admin-tab-icon" aria-hidden="true" />
            Gestionar Publicaciones
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'noticias' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('noticias')}
          >
            <Newspaper size={16} className="admin-tab-icon" aria-hidden="true" />
            Gestionar Noticias
          </button>
        </section>

        {activeTab === 'publicaciones' ? (
          <section className="admin-filters" aria-label="Filtros dinamicos de publicaciones">
            <input
              type="text"
              name="search"
              className="admin-filter-control"
              placeholder="Buscar por título o autores..."
              value={publicationFilters.search}
              onChange={handlePublicationFilterChange}
            />

            <select
              name="categoria"
              className="admin-filter-control"
              value={publicationFilters.categoria}
              onChange={handlePublicationFilterChange}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>{cat.nombre}</option>
              ))}
            </select>

            <select
              name="year"
              className="admin-filter-control"
              value={publicationFilters.year}
              onChange={handlePublicationFilterChange}
            >
              <option value="">Todos los años</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              name="month"
              className="admin-filter-control"
              value={publicationFilters.month}
              onChange={handlePublicationFilterChange}
            >
              <option value="">Todos los meses</option>
              {MONTH_OPTIONS.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </section>
        ) : activeTab === 'noticias' ? (
          <section className="admin-filters" aria-label="Filtros dinamicos de noticias">
            <input
              type="text"
              name="search"
              className="admin-filter-control"
              placeholder="Buscar por título o contenido..."
              value={newsFilters.search}
              onChange={handleNewsFilterChange}
            />

            <select
              name="year"
              className="admin-filter-control"
              value={newsFilters.year}
              onChange={handleNewsFilterChange}
            >
              <option value="">Todos los años</option>
              {availableNewsYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              name="month"
              className="admin-filter-control"
              value={newsFilters.month}
              onChange={handleNewsFilterChange}
            >
              <option value="">Todos los meses</option>
              {MONTH_OPTIONS.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </section>
        ) : null}

        <section className="admin-table-block" aria-live="polite">
          <div className="admin-table-toolbar">
            <h2>{activeTab === 'publicaciones' ? 'Publicaciones' : 'Noticias'}</h2>
            <button type="button" className="admin-create-btn" onClick={openCreateModal}>
              {activeTab === 'publicaciones' ? '+ Nueva Publicacion' : '+ Nueva Noticia'}
            </button>
          </div>

          {errorMsg && !((activeTab === 'publicaciones' && articulos === null) || (activeTab === 'noticias' && noticias === null))
            ? <p className="admin-error">{errorMsg}</p>
            : null}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                {activeTab === 'publicaciones' ? (
                  <tr>
                    <th>Miniatura</th>
                    <th>Titulo</th>
                    <th>Autor</th>
                    <th>Categoria</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Miniatura</th>
                    <th>Titulo</th>
                    <th>Resumen</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {activeTab === 'publicaciones' && articulos === null ? (
                  <tr>
                    <td colSpan={6} className="admin-empty">Cargando publicaciones...</td>
                  </tr>
                ) : activeTab === 'noticias' && noticias === null ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">Cargando noticias...</td>
                  </tr>
                ) : activeTab === 'publicaciones' && loadingArticulos ? (
                  <tr>
                    <td colSpan={6} className="admin-empty">Cargando publicaciones...</td>
                  </tr>
                ) : activeTab === 'noticias' && loadingNoticias ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">Cargando noticias...</td>
                  </tr>
                ) : activeTab === 'publicaciones' && (articulos || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-empty">No hay registros disponibles.</td>
                  </tr>
                ) : activeTab === 'publicaciones' && filteredArticulos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-empty">No hay publicaciones que coincidan con los filtros.</td>
                  </tr>
                ) : activeTab === 'noticias' && (noticias || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">No hay registros disponibles.</td>
                  </tr>
                ) : activeTab === 'noticias' && filteredNoticias.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">No hay noticias que coincidan con los filtros.</td>
                  </tr>
                ) : activeTab === 'publicaciones' && isPaginatingPublicaciones ? (
                  <tr>
                    <td colSpan={6} className="admin-empty">Cargando publicaciones...</td>
                  </tr>
                ) : activeTab === 'noticias' && isPaginatingNoticias ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">Cargando noticias...</td>
                  </tr>
                ) : (
                  activeTab === 'publicaciones'
                    ? publicacionesPaginadas.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.imagen_url || 'https://placehold.co/96x62'}
                            alt={item.titulo || 'Publicacion'}
                            className="admin-news-thumb"
                          />
                        </td>
                        <td>{item.titulo}</td>
                        <td>{item.autor_nombre}</td>
                        <td>
                          <span className="admin-category-pill">{item.lex_categorias?.nombre}</span>
                        </td>
                        <td>{item.fecha}</td>
                        <td>
                          <div className="admin-actions">
                            {getPublicacionPdfUrl(item) ? (
                              <button
                                type="button"
                                className="admin-action-btn"
                                onClick={() => openPdfViewer(getPublicacionPdfUrl(item))}
                                aria-label="Ver PDF"
                                title="Ver PDF"
                              >
                                <Eye size={18} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="admin-action-btn is-disabled"
                                aria-label="PDF no disponible"
                                title="PDF no disponible"
                                disabled
                              >
                                <Eye size={18} />
                              </button>
                            )}

                            <button
                              type="button"
                              className="admin-action-btn"
                              onClick={() => openEditModal(item, 'publicaciones')}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              type="button"
                              className="admin-action-btn is-danger"
                              onClick={() => handleDelete(item.id, 'articulos')}
                              aria-label="Eliminar"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                    : noticiasPaginadas.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.imagen_url || 'https://placehold.co/96x62'}
                            alt={item.titulo || 'Noticia'}
                            className="admin-news-thumb"
                          />
                        </td>
                        <td>{item.titulo || '-'}</td>
                        <td>
                          <span className="admin-news-summary">{item.resumen_p?.[0]}</span>
                        </td>
                        <td>{item.fecha}</td>
                        <td>
                          <div className="admin-actions">
                            {getNoticiaPdfUrl(item) ? (
                              <button
                                type="button"
                                className="admin-action-btn"
                                onClick={() => openPdfViewer(getNoticiaPdfUrl(item))}
                                aria-label="Ver PDF"
                                title="Ver PDF"
                              >
                                <Eye size={18} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="admin-action-btn is-disabled"
                                aria-label="PDF no disponible"
                                title="PDF no disponible"
                                disabled
                              >
                                <Eye size={18} />
                              </button>
                            )}

                            <button
                              type="button"
                              className="admin-action-btn"
                              onClick={() => openEditModal(item, 'noticias')}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              type="button"
                              className="admin-action-btn is-danger"
                              onClick={() => handleDelete(item.id, 'noticias')}
                              aria-label="Eliminar"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {activeTab === 'publicaciones' && totalPaginasPublicaciones > 1 ? (
            <div className="admin-table-pagination">
              <div className="admin-table-pagination-track" aria-label="Paginación de publicaciones">
                <button
                  type="button"
                  className="admin-table-page-btn admin-table-page-btn-nav"
                  onClick={() => handlePublicacionesPageChange(Math.max(1, paginaPublicacionesSegura - 1))}
                  disabled={paginaPublicacionesSegura === 1}
                  aria-label="Ir a la página anterior"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPaginasPublicaciones }, (_, index) => {
                  const page = index + 1;
                  const isActive = page === paginaPublicacionesSegura;

                  return (
                    <button
                      key={page}
                      type="button"
                      className={`admin-table-page-btn ${isActive ? 'is-active' : ''}`}
                      onClick={() => handlePublicacionesPageChange(page)}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={`Ir a la página ${page}`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="admin-table-page-btn admin-table-page-btn-nav"
                  onClick={() => handlePublicacionesPageChange(Math.min(totalPaginasPublicaciones, paginaPublicacionesSegura + 1))}
                  disabled={paginaPublicacionesSegura === totalPaginasPublicaciones}
                  aria-label="Ir a la página siguiente"
                >
                  &gt;
                </button>
              </div>
            </div>
          ) : activeTab === 'noticias' && totalPaginasNoticias > 1 ? (
            <div className="admin-table-pagination">
              <div className="admin-table-pagination-track" aria-label="Paginación de noticias">
                <button
                  type="button"
                  className="admin-table-page-btn admin-table-page-btn-nav"
                  onClick={() => handleNoticiasPageChange(Math.max(1, paginaNoticiasSegura - 1))}
                  disabled={paginaNoticiasSegura === 1}
                  aria-label="Ir a la página anterior"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPaginasNoticias }, (_, index) => {
                  const page = index + 1;
                  const isActive = page === paginaNoticiasSegura;

                  return (
                    <button
                      key={page}
                      type="button"
                      className={`admin-table-page-btn ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleNoticiasPageChange(page)}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={`Ir a la página ${page}`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="admin-table-page-btn admin-table-page-btn-nav"
                  onClick={() => handleNoticiasPageChange(Math.min(totalPaginasNoticias, paginaNoticiasSegura + 1))}
                  disabled={paginaNoticiasSegura === totalPaginasNoticias}
                  aria-label="Ir a la página siguiente"
                >
                  &gt;
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <footer className="admin-footer">
        <div className="admin-footer-content container">
          <div className="admin-footer-brand">
            <div className="admin-footer-logo">LC</div>
            <div>
              <h3 className="admin-footer-title">LEX CORPORATIVA</h3>
              <p className="admin-footer-description">
                Repositorio academico especializado en derecho corporativo y analisis juridico de vanguardia.
              </p>
            </div>
          </div>

          <div className="admin-footer-contact">
            <h4>Contacto</h4>
            <p>contacto@lexcorporativa.com</p>
            <p>Lima, Peru</p>
          </div>
        </div>
      </footer>

      {isModalOpen ? (
        <div className="admin-modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Formulario de publicacion" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                {editingRecord
                  ? 'Editar Registro'
                  : (modalModule === 'publicaciones' ? 'Nueva Publicacion' : 'Nueva Noticia')}
              </h3>
              <button type="button" className="admin-modal-close" onClick={closeModal}>
                x
              </button>
            </div>

            <form className="admin-modal-form" onSubmit={handleSubmit}>
              <label>
                Titulo
                <input name="titulo" value={formData.titulo} onChange={handleFormChange} required />
              </label>

              {modalModule === 'publicaciones' ? (
                <label>
                  Autor
                  <input name="autor_nombre" value={formData.autor_nombre} onChange={handleFormChange} />
                </label>
              ) : null}

              <label>
                Fecha
                <input type="date" name="fecha" value={formData.fecha} onChange={handleFormChange} required />
              </label>

              {modalModule === 'publicaciones' ? (
                <label>
                  Categoria
                  <select name="categoria_id" value={formData.categoria_id} onChange={handleFormChange} required>
                    <option value="">Selecciona una categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>{cat.nombre}</option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label>
                Imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleUpload(event, 'imagen')}
                  disabled={uploadingField === 'imagen_url'}
                />
                {uploadingField === 'imagen_url' ? <small>Subiendo...</small> : null}
                {selectedImageFile ? <small>Archivo seleccionado: {selectedImageFile.name}</small> : null}
              </label>

              <label>
                PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => handleUpload(event, 'pdf')}
                  disabled={uploadingField === 'pdf_url'}
                />
                {uploadingField === 'pdf_url' ? <small>Subiendo...</small> : null}
                {selectedPdfFile ? <small>Archivo seleccionado: {selectedPdfFile.name}</small> : null}
              </label>

              {modalModule === 'noticias' ? (
                <label>
                  Resumen puntos (separa con coma o guion)
                  <small style={{ color: '#C5A059', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>Recomendación: 4-6 puntos, máximo 80-100 caracteres por punto</small>
                  <textarea name="resumen_p" value={formData.resumen_p} onChange={handleFormChange} rows={2} />
                </label>
              ) : null}

              <div className="admin-modal-actions">
                <button type="button" className="admin-secondary-btn" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="admin-primary-btn" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {selectedPdf ? (
        <div className="admin-pdf-viewer" role="presentation" onClick={handlePdfBackdropClick}>
          <div className="admin-pdf-container" role="dialog" aria-modal="true" aria-label="Vista previa del PDF">
            <button
              type="button"
              className="admin-pdf-close"
              onClick={closePdfViewer}
              aria-label="Cerrar visor PDF"
            >
              ×
            </button>
            <iframe src={selectedPdf} title="Visor de PDF" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminUpload;