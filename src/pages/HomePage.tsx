import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Package, Truck, ShoppingCart, DollarSign } from 'lucide-react';

const menuItems = [
  {
    title: 'Artículos',
    description: 'Gestiona el inventario de artículos',
    icon: Package,
    path: '/articulos',
    color: 'bg-blue-600'
  },
  {
    title: 'Proveedores',
    description: 'Administra los proveedores',
    icon: Truck,
    path: '/proveedores',
    color: 'bg-green-600'
  },
  {
    title: 'Órdenes de Compra',
    description: 'Gestiona las órdenes de compra',
    icon: ShoppingCart,
    path: '/ordenes-compra',
    color: 'bg-purple-600'
  },
  {
    title: 'Ventas',
    description: 'Administra las ventas',
    icon: DollarSign,
    path: '/ventas',
    color: 'bg-yellow-600'
  }
];

export const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Bienvenido al Sistema de Inventario</h1>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block p-6 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}; 