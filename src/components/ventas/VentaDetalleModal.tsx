import React from 'react';
import { Venta } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface VentaDetalleModalProps {
  venta: Venta | null;
  isOpen: boolean;
  onClose: () => void;
}

const VentaDetalleModal: React.FC<VentaDetalleModalProps> = ({ venta, isOpen, onClose }) => {
  if (!isOpen || !venta) return null;

  // Validar que articuloVenta existe, si no, usar array vacío
  const articulosVenta = venta.articuloVenta || [];

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Detalle de Venta #{venta.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Información de la Venta</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">ID de Venta:</span>
                <span className="text-white font-medium">#{venta.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Fecha de Venta:</span>
                <span className="text-white font-medium">
                  {new Date(venta.fechaVenta).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total:</span>
                <span className="text-white font-bold text-lg">
                  {formatCurrency(venta.costoTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Estado:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  venta.estado 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {venta.estado ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Resumen</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Cantidad de Productos:</span>
                <span className="text-white font-medium">
                  {articulosVenta.length} productos
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total de Unidades:</span>
                <span className="text-white font-medium">
                  {articulosVenta.reduce((total, item) => total + item.cantArticuloVenta, 0)} unidades
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Productos de la Venta</h3>
          {articulosVenta.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No hay información de productos disponible para esta venta.</p>
              <p className="text-gray-500 text-sm mt-2">Los detalles de productos no están incluidos en la respuesta del servidor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead>
                  <tr className="bg-gray-600">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Precio Unitario
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-700 divide-y divide-gray-600">
                  {articulosVenta.map((articuloVenta, index) => (
                    <tr key={index} className="hover:bg-gray-600 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        <div>
                          <div className="font-medium">{articuloVenta.articulo.nombreArticulo}</div>
                          <div className="text-gray-300 text-xs">
                            {articuloVenta.articulo.descripcionArticulo}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {articuloVenta.cantArticuloVenta}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {formatCurrency(articuloVenta.precioUnitario)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white font-medium">
                        {formatCurrency(articuloVenta.precioSubTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="btn btn-soft btn-secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalleModal; 