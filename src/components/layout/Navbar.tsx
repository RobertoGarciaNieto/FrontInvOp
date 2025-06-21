import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Package,
  Truck,
  ShoppingCart,
  DollarSign,
  Home
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: Home, label: 'Inicio' },
  { path: '/articulos', icon: Package, label: 'Artículos' },
  { path: '/proveedores', icon: Truck, label: 'Proveedores' },
  { path: '/ordenes-compra', icon: ShoppingCart, label: 'Órdenes de Compra' },
  { path: '/ventas', icon: DollarSign, label: 'Ventas' }
];

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">Sistema de Inventario</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="block">
              <div className="ml-10 flex items-baseline space-x-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}; 