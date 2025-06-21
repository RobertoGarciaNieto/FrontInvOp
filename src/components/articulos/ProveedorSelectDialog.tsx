import React, { useState, useEffect } from 'react';
import { Proveedor, ProveedorPredeterminadoDTO, ArticuloProveedorDTO } from '../../types';
import { articuloProveedorService } from '../../services/articuloProveedorService';

interface ProveedorSelectDialogProps {
  open: boolean;
  proveedores: Proveedor[];
  articuloId: number;
  onConfirm: (proveedorData: ProveedorPredeterminadoDTO) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ProveedorSelectDialog: React.FC<ProveedorSelectDialogProps> = ({
  open,
  proveedores,
  articuloId,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const [selectedProveedorId, setSelectedProveedorId] = useState<number | null>(null);
  const [proveedoresAsociados, setProveedoresAsociados] = useState<Proveedor[]>([]);

  useEffect(() => {
    const cargarProveedoresAsociados = async () => {
      try {
        const articulosProveedor = await articuloProveedorService.getAll();
        const relaciones = articulosProveedor.filter(ap => ap.id_articulo === articuloId);
        const proveedoresFiltrados = proveedores.filter(p => 
          relaciones.some(rel => rel.id_proveedor === p.id)
        );
        setProveedoresAsociados(proveedoresFiltrados);
      } catch (error) {
        console.error('Error al cargar proveedores asociados:', error);
      }
    };

    if (open) {
      cargarProveedoresAsociados();
    }
  }, [open, articuloId, proveedores]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProveedorId !== null) {
      onConfirm({
        idProveedor: selectedProveedorId
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">
          Seleccionar Proveedor Predeterminado
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="proveedor" className="block text-sm font-medium text-gray-300">
              Proveedor
            </label>
            <select
              id="proveedor"
              value={selectedProveedorId || ''}
              onChange={(e) => setSelectedProveedorId(Number(e.target.value))}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Seleccione un proveedor</option>
              {proveedoresAsociados.length > 0 ? (
                proveedoresAsociados.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombreProveedor}
                  </option>
                ))
              ) : (
                <option value="" disabled>No hay proveedores asociados</option>
              )}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-soft btn-error"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-soft btn-info"
              disabled={loading || selectedProveedorId === null}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 