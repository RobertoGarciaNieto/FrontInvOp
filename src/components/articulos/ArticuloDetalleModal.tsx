import React from 'react';
import { ArticuloDTO } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface ArticuloDetalleModalProps {
  articulo: ArticuloDTO;
  onClose: () => void;
  onAsignarProveedorPredeterminado: () => void;
  onAsignarProveedores: () => void;
  onEdit: (articulo: ArticuloDTO) => void;
  onDelete: (id: number) => void;
}

export const ArticuloDetalleModal: React.FC<ArticuloDetalleModalProps> = ({
  articulo,
  onClose,
  onAsignarProveedorPredeterminado,
  onAsignarProveedores,
  onEdit,
  onDelete
}) => {
  const handleDelete = async () => {
    if (window.confirm('¿Está seguro que desea eliminar este artículo?')) {
      onDelete(articulo.idArticulo);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Detalles del Artículo</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(articulo)}
              className="btn btn-soft btn-warning btn-sm"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-soft btn-error btn-sm"
            >
              Eliminar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Nombre</h3>
            <p className="text-white">{articulo.nombreArticulo}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Descripción</h3>
            <p className="text-white">{articulo.descripcionArticulo}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Precio de Venta</h3>
            <p className="text-white">{formatCurrency(articulo.precioVentaArt)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Stock Actual</h3>
            <p className="text-white">{articulo.stockActual}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Costo de Almacenamiento</h3>
            <p className="text-white">{formatCurrency(articulo.costoAlmacenamiento)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Demanda</h3>
            <p className="text-white">{articulo.demandaArticulo}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-400">Inventario Máximo</h3>
            <p className="text-white">{articulo.inventarioMaximo}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Proveedor Predeterminado</h3>
          {articulo.idProveedorPredeterminado ? (
            <p className="text-white">ID: {articulo.idProveedorPredeterminado}</p>
          ) : (
            <button
              onClick={onAsignarProveedorPredeterminado}
              className="btn btn-soft btn-primary btn-sm"
            >
              Asignar Proveedor Predeterminado
            </button>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onAsignarProveedores}
            className="btn btn-soft btn-info"
          >
            Asignar Proveedores
          </button>
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