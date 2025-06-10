import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';

const NavBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: ROUTES.HOME, label: 'Inicio' },
    { path: ROUTES.ARTICULOS, label: 'Artículos' },
    { path: ROUTES.PROVEEDORES, label: 'Proveedores' },
    { path: ROUTES.PEDIDOS, label: 'Pedidos' },
    { path: ROUTES.INVENTARIO, label: 'Inventario' },
    { path: ROUTES.REPORTES, label: 'Reportes' },
    { path: ROUTES.CONFIGURACION, label: 'Configuración' },
  ];

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="text-xl font-bold">
              Sistema de Inventario
            </Link>
          </div>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-foreground/10'
                    : 'hover:bg-primary-foreground/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;