import React, { useState, useEffect } from 'react';
import { ArticuloProveedorDTO, ProveedorDTO, ListadoArtProvDTO } from '../../types';
import { Edit2, Trash2, Package, Plus } from 'lucide-react';
import { articuloProveedorService } from '../../services/articuloProveedorService';

interface ProveedorListProps {
  proveedores: ProveedorDTO[];
  onEdit: (proveedor: ProveedorDTO) => void;
  onDelete: (id: number) => void;
  onAddArticulo?: (proveedor: ProveedorDTO) => void;
}

export const ProveedorList: React.FC<ProveedorListProps> = ({
  proveedores,
  onEdit,
  onDelete,
  onAddArticulo,
}) => {
  const [articulosPorProveedor, setArticulosPorProveedor] = useState<{ [key: number]: ListadoArtProvDTO[] }>({});

  useEffect(() => {
    const cargarArticulosPorProveedor = async () => {
      const articulosMap: { [key: number]: ListadoArtProvDTO[] } = {};
      
      for (const proveedor of proveedores) {
        try {
          const articulos = await articuloProveedorService.listadoArticulosPorProveedor(proveedor.id);
          articulosMap[proveedor.id] = articulos;
        } catch (error) {
          console.error(`Error al cargar artículos para el proveedor ${proveedor.id}:`, error);
          articulosMap[proveedor.id] = [];
        }
      }
      
      setArticulosPorProveedor(articulosMap);
    };

    cargarArticulosPorProveedor();
  }, [proveedores]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              CUIT
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Artículos
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {proveedores.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-300">
                No hay proveedores registrados
              </td>
            </tr>
          ) : (
            proveedores.map((proveedor, index) => (
              <tr key={`${proveedor.id}-${index}`} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-300">
                    {proveedor.nombreProveedor}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{proveedor.cuit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-300">
                    <Package className="h-4 w-4 mr-1" />
                    {articulosPorProveedor[proveedor.id]?.length || 0} artículos asociados
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(proveedor)}
                      className="text-blue-400 hover:text-blue-300 focus:outline-none focus:underline"
                      title="Editar proveedor"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onAddArticulo?.(proveedor)}
                      className="text-green-400 hover:text-green-300 focus:outline-none focus:underline"
                      title="Ver artículos"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(proveedor.id)}
                      className="text-red-400 hover:text-red-300 focus:outline-none focus:underline"
                      title="Eliminar proveedor"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}; 