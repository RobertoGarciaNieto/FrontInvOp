import React, { useState, useEffect } from 'react';
import { ProveedorDTO } from '../types';
import { proveedorService } from '../services/proveedorService';
import { MainLayout } from '../components/layout/MainLayout';
import { ProveedorForm } from '../components/proveedores/ProveedorForm';
import { ProveedorList } from '../components/proveedores/ProveedorList';
import { ProveedorArticulosList } from '../components/proveedores/ProveedorArticulosList';
import { SuccessAlert, ConfirmationAlert } from '../components/ui/Alert';

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

  const handleCreateProveedor = async (proveedor: ProveedorDTO) => {
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

  const handleEditProveedor = async (proveedor: ProveedorDTO) => {
    try {
      const proveedorActualizado = await proveedorService.modificarProveedor(proveedor.id, proveedor);
      setProveedores(prev => prev.map(p => p.id === proveedor.id ? proveedorActualizado : p));
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
            <ProveedorList
              proveedores={proveedores}
              onEdit={handleEdit}
              onDelete={handleDeleteProveedor}
              onAddArticulo={handleVerArticulos}
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