import React, { useState } from 'react';
import './Upload.css';
import { supabase } from '../supabaseClient';

const AdminUpload = () => {
  const [formData, setFormData] = useState({
    title: '', author: '', date: '', image: null, document: null, type: '', category: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, author, date, image, document, type, category } = formData;

    if (!title || !author || !date || !image || !document || !type || !category) {
      setMessage('⚠️ Por favor, completa todos los campos.');
      return;
    }

    try {
      const imgPath = `images/${Date.now()}_${image.name}`;
      const docPath = `documents/${Date.now()}_${document.name}`;

      const imageUpload = await supabase.storage.from('uploads').upload(imgPath, image);
      const documentUpload = await supabase.storage.from('uploads').upload(docPath, document);

      if (imageUpload.error || documentUpload.error) throw new Error("Error en la carga de archivos");

      setMessage('✅ Contenido subido con éxito.');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1>Subir Contenido</h1>
        <p className="subtitle">Panel de Administración</p>
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Título del Contenido</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Reporte Anual 2024" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Escritor</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Nombre completo" />
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="Ej: PDF, Artículo" />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Ej: Tecnología" />
            </div>
          </div>

          <div className="file-section">
            <div className="form-group">
              <label>Imagen de Portada</label>
              <input type="file" name="image" onChange={handleChange} accept="image/*" />
            </div>
            <div className="form-group">
              <label>Documento Adjunto</label>
              <input type="file" name="document" onChange={handleChange} accept=".pdf,.doc,.docx" />
            </div>
          </div>

          <button type="submit" className="submit-btn btn-lex btn-lex-dark">Publicar ahora</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminUpload;