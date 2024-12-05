// LoadingPage.js
import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignOutAlt, faChartLine, faWarehouse, faUsers, faBell, faFileAlt, faBox } from '@fortawesome/free-solid-svg-icons';
import './LoadingPage.css';
import DateRangePicker from './DateRangePicker';

const InventoryTable = lazy(() => import('./InventoryTable'));
const ProductTable = lazy(() => import('./ProductTable')); // Importar el componente de productos
const ProvidersTable = lazy(() => import('./ProvidersTable')); // Importar el componente de proveedores
const SalesPage = lazy(() => import('./SalesPage'));
const ClientesTable = lazy(() => import('./ClientesTable'));

const LoadingPage = () => {
  const navigate = useNavigate();
  const [mainContent, setMainContent] = useState(<p>Bienvenido</p>);
  const [mainTitle, setMainTitle] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/'); // Redirige a la ruta de Login
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Alterna la visibilidad de la barra lateral en móviles
  };

  const openDateRangePicker = (reportTitle) => {
    setMainContent(<DateRangePicker reportTitle={reportTitle} onClose={() => setMainContent(<p>Bienvenido</p>)} />);
    setMainTitle(reportTitle);
  };

  const handleNavigation = (content, title) => {
    setMainContent(content);
    setMainTitle(title);
    setMenuOpen(false); // Cierra el menú al navegar en móviles
  };

  return (
    <div className="container">
      <button className="menu-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="logo">
          <img src="/LogoLogin.png" alt="Site Control" />
          <h1>SITE Control</h1>
        </div>
        <nav className="sidebar-nav">
          {/* Sección Administrador */}
          <details open>
            <summary>Administrador</summary>
            <ul>
              <li>
                <button className="nav-button" onClick={() => openDateRangePicker("Reporte general de ventas")}>
                  <FontAwesomeIcon icon={faFileAlt} /> Reporte general de ventas
                </button>
              </li>
              <li>
                <button className="nav-button" onClick={() => openDateRangePicker("Reporte de artículos vendidos")}>
                  <FontAwesomeIcon icon={faFileAlt} /> Reporte de artículos vendidos
                </button>
              </li>
              <li>
                <button className="nav-button" onClick={() => openDateRangePicker("Reporte de movimientos de inventario")}>
                  <FontAwesomeIcon icon={faFileAlt} /> Reporte de movimientos de inventario
                </button>
              </li>
            </ul>
          </details>

          {/* Sección Ventas */}
          <details>
            <summary>Ventas</summary>
            <ul>
              <li>
                <button className="nav-button" onClick={() => handleNavigation(<InventoryTable />, 'Ver inventario')}>
                  <FontAwesomeIcon icon={faWarehouse} /> Ver inventario
                </button>
              </li>
              <li>
                <button className="nav-button" onClick={() => handleNavigation(<SalesPage />, 'Ventas')}>
                  <FontAwesomeIcon icon={faChartLine} /> Ventas
                </button>
              </li>
              <li>
                <button className="nav-button" onClick={() => handleNavigation(<ClientesTable />, 'Clientes')}>
                  <FontAwesomeIcon icon={faUsers} /> Clientes
                </button>
              </li>
            </ul>
          </details>

          {/* Sección Almacén */}
          <details>
            <summary>Almacén</summary>
            <ul>
              <li>
                <button className="nav-button" onClick={() => handleNavigation(<ProductTable />, 'Productos')}>
                  <FontAwesomeIcon icon={faBox} /> Productos
                </button>
              </li>
              <li>
                <button className="nav-button" onClick={() => handleNavigation(<ProvidersTable />, 'Proveedores')}>
                  <FontAwesomeIcon icon={faWarehouse} /> Proveedores
                </button>
              </li>
            </ul>
          </details>
        </nav>

        {/* Botón de Cerrar sesión */}
        <div className="logout-section">
          <button className="logout-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-info">
            <span className="main-title">{mainTitle}</span>
          </div>
          <div className="header-icons">
            <button className="icon-button">
              <FontAwesomeIcon icon={faUsers} />
            </button>
            <button className="icon-button">
              <FontAwesomeIcon icon={faBell} />
            </button>
          </div>
        </header>
        <section className="content">
          <div className="loading-box">
            <Suspense fallback={<div>Cargando...</div>}>
              {mainContent}
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoadingPage;
