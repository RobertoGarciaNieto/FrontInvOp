import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ArticulosPage } from './pages/ArticulosPage';
import { ProveedoresPage } from './pages/ProveedoresPage';
import { VentasPage } from './pages/VentasPage';
import { OrdenesCompraPage } from './pages/OrdenesCompraPage';
import { ArticuloProveedorPage } from './pages/ArticuloProveedorPage';
import { ROUTES } from './constants';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-800 flex flex-col">
        <main className="container mx-auto px-4 py-6 w-ful">
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.ARTICULOS} element={<ArticulosPage />} />
            <Route path={ROUTES.PROVEEDORES} element={<ProveedoresPage />} />
            <Route path={ROUTES.ORDENES_COMPRA} element={<OrdenesCompraPage />} />
            <Route path={ROUTES.ARTICULO_PROVEEDOR} element={<ArticuloProveedorPage />} />
            <Route path={ROUTES.VENTAS} element={<VentasPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;