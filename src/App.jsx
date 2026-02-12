import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Noticias from './pages/Noticias';
import Archivo from './pages/Archivo';
import Nosotros from './pages/Nosotros';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'noticias':
        return <Noticias />;
      case 'archivo':
        return <Archivo />;
      case 'nosotros':
        return <Nosotros />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
