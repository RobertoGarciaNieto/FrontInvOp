import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Venta } from '../types';
import { PaginatedTable } from '../components/ui/PaginatedTable';
import VentaForm from '../components/ventas/VentaForm';
import { ventaService } from '../services/ventaService';
import { formatCurrency } from '../lib/utils';
import { SuccessAlert, ConfirmationAlert } from '../components/ui/Alert';

export const VentasPage: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const itemsPerPage = 10;

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await ventaService.getAll();
      setVentas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSuccess = () => {
    setSuccessMessage('Venta registrada exitosamente');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
    cargarDatos();
    setShowForm(false);
  };

  const totalPages = Math.ceil(ventas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = ventas.slice(startIndex, startIndex + itemsPerPage);

  const columns = [
    {
      header: 'Fecha',
      accessor: (item: Venta) => new Date(item.fechaVenta).toLocaleDateString(),
    },
    {
      header: 'Total',
      accessor: (item: Venta) => formatCurrency(item.costoTotal),
    },
    {
      header: 'Estado',
      accessor: (item: Venta) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          item.estado 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {item.estado ? 'Activa' : 'Inactiva'}
        </span>
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
          <h1 className="text-2xl font-bold text-white">Ventas</h1>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-soft btn-primary"
          >
            Nueva Venta
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Todas las Ventas</h2>
            <PaginatedTable
              columns={columns}
              data={paginatedData}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Nueva Venta
              </h2>
              <VentaForm
                onSuccess={handleSuccess}
                onCancel={() => {
                  setShowForm(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}; 