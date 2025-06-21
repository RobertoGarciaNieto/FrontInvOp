import React, { useState, useEffect } from 'react';
import { ArticuloProveedorList } from '../components/articulos/ArticuloProveedorList';
import { ArticuloProveedorForm } from '../components/articulos/ArticuloProveedorForm';
import { ArticuloProveedorDTO } from '../types';
import { articuloProveedorService } from '../services/articuloProveedorService';

export const ArticuloProveedorPage: React.FC = () => {
  const [articulosProveedor, setArticulosProveedor] = useState<ArticuloProveedorDTO[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedArticuloProveedor, setSelectedArticuloProveedor] = useState<ArticuloProveedorDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadArticulosProveedor = async () => {
    try {
      const data = await articuloProveedorService.getAll();
      setArticulosProveedor(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las relaciones artículo-proveedor');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    loadArticulosProveedor();
  }, []);

  const handleFormSuccess = async () => {
    try {
      setShowForm(false);
      setSelectedArticuloProveedor(null);
      await loadArticulosProveedor();
      setError(null);
    } catch (err) {
      setError('Error al guardar la relación artículo-proveedor');
      console.error('Error:', err);
    }
  };

  const handleEdit = (articuloProveedor: ArticuloProveedorDTO) => {
    setSelectedArticuloProveedor(articuloProveedor);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta relación?')) {
      try {
        // Implementar la eliminación cuando esté disponible en el backend
        loadArticulosProveedor();
        setError(null);
      } catch (err) {
        setError('Error al eliminar la relación artículo-proveedor');
        console.error('Error:', err);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Relaciones Artículo-Proveedor</h1>
        <button
          onClick={() => {
            setSelectedArticuloProveedor(null);
            setShowForm(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Nueva Relación
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedArticuloProveedor ? 'Editar' : 'Nueva'} Relación Artículo-Proveedor
          </h2>
          <ArticuloProveedorForm
            idArticulo={selectedArticuloProveedor?.id_articulo || 0}
            idProveedor={selectedArticuloProveedor?.id_proveedor}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setSelectedArticuloProveedor(null);
            }}
            articuloProveedor={selectedArticuloProveedor}
          />
        </div>
      ) : (
        <ArticuloProveedorList
          articulosProveedor={articulosProveedor}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}; 