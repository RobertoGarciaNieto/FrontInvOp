import React, { useState, useEffect } from 'react';
import { ProveedorDTO } from '../types';
import { proveedorService } from '../services/proveedorService';
import { MainLayout } from '../components/layout/MainLayout';
import { ProveedorForm } from '../components/proveedores/ProveedorForm';
import { ProveedorArticulosList } from '../components/proveedores/ProveedorArticulosList';
import { SuccessAlert, ConfirmationAlert } from '../components/ui/Alert';
import { PaginatedTable } from '../components/ui/PaginatedTable';
import { Edit2, Trash2, Package, Plus } from 'lucide-react';
import { articuloProveedorService } from '../services/articuloProveedorService';

type ProveedorCreateData = Omit<ProveedorDTO, 'id'>;

export const ProveedoresPage: React.FC = () => {
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [articulosPorProveedor, setArticulosPorProveedor] = useState<{ [key: number]: any[] }>({});
  const itemsPerPage = 10;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const proveedoresData = await proveedorService.getAll();
      setProveedores(proveedoresData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar artículos por proveedor
  useEffect(() => {
    const cargarArticulosPorProveedor = async () => {
      const articulosMap: { [key: number]: any[] } = {};
      
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

    if (proveedores.length > 0) {
      cargarArticulosPorProveedor();
    }
  }, [proveedores]);

  const handleCreateProveedor = async (proveedor: ProveedorCreateData) => {
    try {
      const proveedorCreado = await proveedorService.altaProveedor(proveedor);
      setProveedores(prev => [...prev, proveedorCreado]);
      setShowForm(false);
      setSuccessMessage('Proveedor creado exitosamente');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      cargarDatos();
    } catch (err) {
      console.error('Error al crear proveedor:', err);
      setError('Error al crear el proveedor');
    }
  };

  const handleEditProveedor = async (proveedor: ProveedorCreateData) => {
    if (!selectedProveedor) return;
    
    try {
      const proveedorToUpdate: ProveedorDTO = {
        ...proveedor,
        id: selectedProveedor.id
      };
      const proveedorActualizado = await proveedorService.modificarProveedor(selectedProveedor.id, proveedorToUpdate);
      setProveedores(prev => prev.map(p => p.id === selectedProveedor.id ? proveedorActualizado : p));
      setShowForm(false);
      setSelectedProveedor(null);
      setIsEditing(false);
      setSuccessMessage('Proveedor actualizado exitosamente');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      cargarDatos();
    } catch (err) {
      console.error('Error al actualizar proveedor:', err);
      setError('Error al actualizar el proveedor');
    }
  };

  const handleDeleteProveedor = async (id: number) => {
    setConfirmMessage('¿Está seguro que desea eliminar este proveedor?');
    setConfirmAction(() => async () => {
      try {
        await proveedorService.bajaProveedor(id);
        setProveedores(prev => prev.filter(p => p.id !== id));
        setSuccessMessage('Proveedor eliminado exitosamente');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        cargarDatos();
      } catch (err) {
        console.error('Error al eliminar proveedor:', err);
        setError('Error al eliminar el proveedor');
      }
    });
    setShowConfirmAlert(true);
  };

  const handleNewProveedor = () => {
    setSelectedProveedor(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (proveedor: ProveedorDTO) => {
    setSelectedProveedor(proveedor);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleVerArticulos = (proveedor: ProveedorDTO) => {
    setSelectedProveedor(proveedor);
  };

  // Lógica de paginación
  const totalPages = Math.ceil(proveedores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const sortedProveedores = [...proveedores].sort((a, b) => a.nombreProveedor.localeCompare(b.nombreProveedor));
  const paginatedData = sortedProveedores.slice(startIndex, startIndex + itemsPerPage);

  // Columnas para la tabla paginada
  const columns = [
    {
      header: 'Nombre',
      accessor: (item: ProveedorDTO) => (
        <div className="text-sm font-medium text-gray-300">
          {item.nombreProveedor}
        </div>
      ),
    },
    {
      header: 'CUIT',
      accessor: (item: ProveedorDTO) => (
        <div className="text-sm text-gray-300">{item.cuit}</div>
      ),
    },
    {
      header: 'Artículos',
      accessor: (item: ProveedorDTO) => (
        <div className="flex items-center text-sm text-gray-300">
          <Package className="h-4 w-4 mr-1" />
          {articulosPorProveedor[item.id]?.length || 0} artículos asociados
        </div>
      ),
    },
    {
      header: 'Acciones',
      accessor: (item: ProveedorDTO) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleEdit(item)}
            className="text-blue-400 hover:text-blue-300 focus:outline-none focus:underline"
            title="Editar proveedor"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleVerArticulos(item)}
            className="text-green-400 hover:text-green-300 focus:outline-none focus:underline"
            title="Ver artículos"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteProveedor(item.id)}
            className="text-red-400 hover:text-red-300 focus:outline-none focus:underline"
            title="Eliminar proveedor"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ),
    }
  ];

  if (loading) return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-ring loading-xl"></span></div>;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {showSuccessAlert && <SuccessAlert message={successMessage} />}
        {showConfirmAlert && (
          <ConfirmationAlert
            message={confirmMessage}
            onAccept={() => {
              if (confirmAction) {
                confirmAction();
              }
              setShowConfirmAlert(false);
            }}
            onDeny={() => setShowConfirmAlert(false)}
          />
        )}
        {error && <div className="alert alert-error mb-4">{error}</div>}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Proveedores</h1>
          <button 
            onClick={handleNewProveedor}
            className="btn btn-soft btn-primary"
          >
            Nuevo Proveedor
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Sección de Todos los Proveedores */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Todos los Proveedores</h2>
            <PaginatedTable
              columns={columns}
              data={paginatedData}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Sección de Artículos por Proveedor */}
          {selectedProveedor && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Artículos del Proveedor: {selectedProveedor.nombreProveedor}
              </h2>
              <ProveedorArticulosList
                proveedor={selectedProveedor}
                onSuccess={() => {
                  cargarDatos();
                }}
              />
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-white">
                {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h2>
              <ProveedorForm
                onSubmit={isEditing ? handleEditProveedor : handleCreateProveedor}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedProveedor(null);
                  setIsEditing(false);
                }}
                proveedor={selectedProveedor || undefined}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}; 