import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { OrdenCompraList } from '../components/ordenes-compra/OrdenCompraList';
import OrdenCompraForm from '../components/ordenes-compra/OrdenCompraForm';
import { ordenCompraService } from '../services/ordenCompraService';
import { SuccessAlert, ConfirmationAlert } from '../components/ui/Alert';

export const OrdenesCompraPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = () => {
    setShowForm(false);
    setSuccessMessage('Orden de compra creada exitosamente');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleConfirmar = async (id: number) => {
    setConfirmMessage('¿Está seguro que desea confirmar esta orden de compra?');
    setConfirmAction(() => async () => {
      try {
        await ordenCompraService.confirmarOrdenCompra(id);
        setSuccessMessage('Orden de compra confirmada exitosamente');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('❌ Error al confirmar orden:', err);
        setError('Error al confirmar la orden de compra');
      }
    });
    setShowConfirmAlert(true);
  };

  const handleCancelar = async (id: number) => {
    setConfirmMessage('¿Está seguro que desea cancelar esta orden de compra?');
    setConfirmAction(() => async () => {
      try {
        await ordenCompraService.cancelarOrdenCompra(id);
        setSuccessMessage('Orden de compra cancelada exitosamente');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('❌ Error al cancelar orden:', err);
        setError('Error al cancelar la orden de compra');
      }
    });
    setShowConfirmAlert(true);
  };

  const handleFinalizar = async (id: number) => {
    setConfirmMessage('¿Está seguro que desea finalizar esta orden de compra?');
    setConfirmAction(() => async () => {
      try {
        await ordenCompraService.finalizarOrdenCompra(id);
        setSuccessMessage('Orden de compra finalizada exitosamente');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('❌ Error al finalizar orden:', err);
        setError('Error al finalizar la orden de compra');
      }
    });
    setShowConfirmAlert(true);
  };

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
          <h1 className="text-2xl font-bold text-white">Órdenes de Compra</h1>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-soft btn-primary"
          >
            Nueva Orden de Compra
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <OrdenCompraList 
            refreshTrigger={refreshTrigger}
            onConfirmar={handleConfirmar}
            onCancelar={handleCancelar}
            onFinalizar={handleFinalizar}
          />
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Nueva Orden de Compra
              </h2>
              <OrdenCompraForm
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