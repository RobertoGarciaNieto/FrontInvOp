import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ArticulosPage from './pages/ArticulosPage';
import ProveedoresPage from './pages/ProveedoresPage';
import PedidosPage from './pages/PedidosPage';
import InventarioPage from './pages/InventarioPage';
import ReportesPage from './pages/ReportesPage';
import ConfiguracionPage from './pages/ConfiguracionPage';
import { ROUTES } from './constants';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="container mx-auto py-4">
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.ARTICULOS} element={<ArticulosPage />} />
            <Route path={ROUTES.PROVEEDORES} element={<ProveedoresPage />} />
            <Route path={ROUTES.PEDIDOS} element={<PedidosPage />} />
            <Route path={ROUTES.INVENTARIO} element={<InventarioPage />} />
            <Route path={ROUTES.REPORTES} element={<ReportesPage />} />
            <Route path={ROUTES.CONFIGURACION} element={<ConfiguracionPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;