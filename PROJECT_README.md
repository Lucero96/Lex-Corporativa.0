# Lex Corporativa - Repositorio Académico Jurídico

Plataforma web especializada en investigación, análisis y difusión del conocimiento jurídico corporativo.

## 🚀 Características

- **Diseño Moderno**: Interfaz elegante con tipografías Playfair Display e Inter
- **Navegación Fluida**: Sistema de navegación SPA (Single Page Application)
- **Responsive**: Completamente adaptable a dispositivos móviles
- **Animaciones**: Transiciones suaves y efectos visuales elegantes
- **Componentizado**: Arquitectura modular y mantenible

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Barra de navegación
│   ├── Navbar.css
│   ├── Footer.jsx      # Pie de página
│   └── Footer.css
├── pages/              # Páginas principales
│   ├── Home.jsx        # Página de inicio
│   ├── Home.css
│   ├── Noticias.jsx    # Listado de noticias
│   ├── Noticias.css
│   ├── Archivo.jsx     # Biblioteca de publicaciones
│   ├── Archivo.css
│   ├── Nosotros.jsx    # Información institucional
│   └── Nosotros.css
├── data.js             # Datos mock (noticias y publicaciones)
├── App.jsx             # Componente principal con router
├── App.css
├── index.css           # Estilos globales
└── main.jsx
```

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **CSS3** - Estilos personalizados sin frameworks
- **Google Fonts** - Playfair Display e Inter

## 📦 Instalación

1. Asegúrate de tener Node.js instalado (versión 16 o superior)

2. Instala las dependencias:
```bash
npm install
```

## 🎯 Uso

### Modo Desarrollo

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

### Vista Previa de Producción

```bash
npm run preview
```

## 🎨 Paleta de Colores

- **Fondo Principal**: `#0B0332` (Azul oscuro profundo)
- **Fondo Secundario**: `#05021a` (Negro azulado)
- **Texto Principal**: `#E8DCC4` (Beige claro)
- **Acento**: `#80cc66` (Verde vibrante)
- **Dorado**: `#C6A75E` (Detalles en logo)

## 📱 Navegación

- **Inicio**: Hero section, áreas legales y preview de noticias
- **Noticias**: Listado completo de actualidad jurídica
- **Archivo**: Biblioteca digital de publicaciones
- **Nosotros**: Información institucional y de contacto

## 🔄 Sistema de Navegación

El proyecto implementa un sistema de navegación simple sin React Router, usando `useState` para controlar la página actual. Si deseas implementar React Router en el futuro:

```bash
npm install react-router-dom
```

## 📝 Próximos Pasos

- [ ] Agregar imágenes reales (actualmente usa placeholders)
- [ ] Implementar backend para datos dinámicos
- [ ] Agregar página de detalle para noticias y publicaciones
- [ ] Implementar buscador
- [ ] Agregar sistema de filtros
- [ ] Implementar React Router para URLs amigables

## 👥 Contacto

- Email: contacto@lexcorporativa.com
- Teléfono: +51 999 999 999
- Ubicación: Lima, Perú

---

**Desarrollado con ❤️ para Lex Corporativa**
