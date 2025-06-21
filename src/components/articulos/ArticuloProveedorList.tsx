import React from 'react';
import { ArticuloProveedorDTO, ModeloInventario } from '../../types';

interface ArticuloProveedorListProps {
  articulosProveedor: ArticuloProveedorDTO[];
  onEdit?: (articuloProveedor: ArticuloProveedorDTO) => void;
  onDelete?: (id: number) => void;
}

export const ArticuloProveedorList: React.FC<ArticuloProveedorListProps> = ({ 
  articulosProveedor, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              ID Artículo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              ID Proveedor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Precio Unitario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Costo Compra
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Demora Entrega
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Modelo Inventario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {articulosProveedor.map((ap) => (
            <tr key={ap.idArticuloProveedor}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {ap.id_articulo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {ap.id_proveedor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ${ap.precioUnitario.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ${ap.costoCompra.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {ap.demoraEntrega} días
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {ap.modeloInventario === ModeloInventario.loteFijo ? 'Lote Fijo' : 'Intervalo Fijo'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {onEdit && (
                  <button
                    onClick={() => onEdit(ap)}
                    className="text-blue-400 hover:text-blue-300 mr-4"
                  >
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(ap.idArticuloProveedor)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 