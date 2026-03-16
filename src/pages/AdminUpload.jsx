import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Upload.css';

const INITIAL_FORM = {
  titulo: '',
  autor_nombre: '',
  fecha: '',
  categoria_id: '',
  categoria: '',
  imagen_url: '',
  documento_url: '',
  resumen: '',
  resumen_p: ''
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const categoryById = useMemo(
    () => new Map(categorias.map((item) => [String(item.id), item.nombre])),
    [categorias]
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    const isNoticiasTab = activeTab === 'noticias';

    setEditingRecord(record);
    setFormData({
      titulo: record.titulo || '',
      autor_nombre: isNoticiasTab ? '' : (record.autor_nombre || ''),
      fecha: record.fecha ? String(record.fecha).slice(0, 10) : '',
      categoria_id: isNoticiasTab ? '' : (record.categoria_id ? String(record.categoria_id) : ''),
      categoria: isNoticiasTab ? '' : (record.categoria || ''),
      imagen_url: record.imagen_url || '',
      documento_url: isNoticiasTab ? (record.pdf_url || '') : (record.documento_url || ''),
      resumen: isNoticiasTab ? '' : (record.resumen || ''),
      resumen_p: Array.isArray(record.resumen_p) ? record.resumen_p.join(' | ') : (record.resumen_p || '')
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setFormData(INITIAL_FORM);
  };

  const handleDelete = async (recordId) => {
    const targetTable = activeTab === 'publicaciones' ? 'lex_articulos' : 'lex_noticias';
    const { error } = await supabase.from(targetTable).delete().eq('id', recordId);
    if (error) {
      setErrorMsg('No se pudo eliminar el registro.');
      return;
    }
    await fetchDashboardSummary();
    if (activeTab === 'publicaciones') {
      await fetchArticulos();
    } else {
      await fetchNoticias();
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const targetTable = activeTab === 'publicaciones' ? 'lex_articulos' : 'lex_noticias';

    let payload;
    if (activeTab === 'publicaciones') {
      const selectedCategoryName = formData.categoria_id
        ? categoryById.get(String(formData.categoria_id)) || formData.categoria
        : formData.categoria;

      payload = {
        titulo: formData.titulo,
        autor_nombre: formData.autor_nombre,
        fecha: formData.fecha || null,
        categoria_id: formData.categoria_id || null,
        categoria: selectedCategoryName || null,
        imagen_url: formData.imagen_url || null,
        documento_url: formData.documento_url || null,
        resumen: formData.resumen || null,
        resumen_p: formData.resumen_p
          ? formData.resumen_p.split('|').map((item) => item.trim()).filter(Boolean)
          : null
      };
    } else {
      payload = {
        titulo: formData.titulo,
        fecha: formData.fecha || null,
        imagen_url: formData.imagen_url || null,
        pdf_url: formData.documento_url || null,
        resumen_p: formData.resumen_p
          ? formData.resumen_p.split('|').map((item) => item.trim()).filter(Boolean)
          : null
      };
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
    <div className="admin-page">
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
            Gestionar Publicaciones
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'noticias' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('noticias')}
          >
            Gestionar Noticias
          </button>
        </section>

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
                    <td colSpan={5} className="admin-empty">Cargando publicaciones...</td>
                  </tr>
                ) : activeTab === 'noticias' && noticias === null ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">Cargando noticias...</td>
                  </tr>
                ) : activeTab === 'publicaciones' && loadingArticulos ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">Cargando publicaciones...</td>
                  </tr>
                ) : activeTab === 'noticias' && loadingNoticias ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">Cargando noticias...</td>
                  </tr>
                ) : activeTab === 'publicaciones' && (articulos || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">No hay registros disponibles.</td>
                  </tr>
                ) : activeTab === 'noticias' && (noticias || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-empty">No hay registros disponibles.</td>
                  </tr>
                ) : (
                  activeTab === 'publicaciones'
                    ? (articulos || []).map((item) => (
                      <tr key={item.id}>
                        <td>{item.titulo}</td>
                        <td>{item.autor_nombre}</td>
                        <td>
                          <span className="admin-category-pill">{item.lex_categorias?.nombre}</span>
                        </td>
                        <td>{item.fecha}</td>
                        <td>
                          <div className="admin-actions">
                            <button type="button" className="admin-action-btn" onClick={() => openEditModal(item)}>
                              Editar
                            </button>
                            <button type="button" className="admin-action-btn is-danger" onClick={() => handleDelete(item.id)}>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                    : (noticias || []).map((item) => (
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
                            <button type="button" className="admin-action-btn" onClick={() => openEditModal(item)}>
                              Editar
                            </button>
                            <button type="button" className="admin-action-btn is-danger" onClick={() => handleDelete(item.id)}>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
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
              <h3>{editingRecord ? 'Editar Registro' : 'Nueva Publicacion'}</h3>
              <button type="button" className="admin-modal-close" onClick={closeModal}>
                x
              </button>
            </div>

            <form className="admin-modal-form" onSubmit={handleSave}>
              <label>
                Titulo
                <input name="titulo" value={formData.titulo} onChange={handleFormChange} required />
              </label>

              <label>
                Autor
                <input name="autor_nombre" value={formData.autor_nombre} onChange={handleFormChange} required />
              </label>

              <label>
                Fecha
                <input type="date" name="fecha" value={formData.fecha} onChange={handleFormChange} required />
              </label>

              <label>
                Categoria
                <select name="categoria_id" value={formData.categoria_id} onChange={handleFormChange}>
                  <option value="">Selecciona una categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>{cat.nombre}</option>
                  ))}
                </select>
              </label>

              <label>
                Imagen URL
                <input name="imagen_url" value={formData.imagen_url} onChange={handleFormChange} placeholder="https://..." />
              </label>

              <label>
                Documento URL
                <input name="documento_url" value={formData.documento_url} onChange={handleFormChange} placeholder="https://..." />
              </label>

              <label>
                Resumen
                <textarea name="resumen" value={formData.resumen} onChange={handleFormChange} rows={4} />
              </label>

              <label>
                Resumen puntos (separa con |)
                <textarea name="resumen_p" value={formData.resumen_p} onChange={handleFormChange} rows={2} />
              </label>

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
    </div>
  );
};

export default AdminUpload;