import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { OrdenCompraDTO, EstadoOrdenCompra } from '../types';
import { PaginatedTable } from '../components/ui/PaginatedTable';
import OrdenCompraForm from '../components/ordenes-compra/OrdenCompraForm';
import { ordenCompraService } from '../services/ordenCompraService';
import { formatCurrency } from '../lib/utils';
import { SuccessAlert, ConfirmationAlert } from '../components/ui/Alert';
import { OrdenCompraEditModal } from '../components/ordenes-compra/OrdenCompraEditModal';

export const OrdenesCompraPage: React.FC = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompraDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [selectedOrden, setSelectedOrden] = useState<OrdenCompraDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ordenToEdit, setOrdenToEdit] = useState<OrdenCompraDTO | null>(null);
  const itemsPerPage = 10;

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const data = await ordenCompraService.getAll();
      setOrdenes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las órdenes de compra');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const handleSuccess = () => {
    setSuccessMessage('Orden de compra creada exitosamente');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
    cargarOrdenes();
    setShowForm(false);
  };

  const handleConfirmar = async (id: number) => {
    setConfirmMessage('¿Está seguro que desea confirmar esta orden de compra?');
    setConfirmAction(() => async () => {
      try {
        await ordenCompraService.confirmarOrdenCompra(id);
        setSuccessMessage('Orden de compra confirmada exitosamente');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        cargarOrdenes();
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
        cargarOrdenes();
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
        cargarOrdenes();
      } catch (err) {
        console.error('❌ Error al finalizar orden:', err);
        setError('Error al finalizar la orden de compra');
      }
    });
    setShowConfirmAlert(true);
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case EstadoOrdenCompra.Pendiente:
        return 'badge-warning';
      case EstadoOrdenCompra.Enviada:
        return 'badge-info';
      case EstadoOrdenCompra.Cancelada:
        return 'badge-error';
      case EstadoOrdenCompra.Finalizada:
        return 'badge-success';
      default:
        return 'badge-ghost';
    }
  };

  const handleVerDetalle = (orden: OrdenCompraDTO) => {
    setSelectedOrden(orden);
    setShowModal(true);
  };

  const handleEditar = (orden: OrdenCompraDTO) => {
    setOrdenToEdit(orden);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    cargarOrdenes(); // Recargar la lista después de editar
  };

  const totalPages = Math.ceil(ordenes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // Ordenar órdenes por fecha más reciente primero
  const sortedOrdenes = [...ordenes].sort((a, b) => {
    const dateA = a.fechaPendiente ? new Date(a.fechaPendiente).getTime() : 0;
    const dateB = b.fechaPendiente ? new Date(b.fechaPendiente).getTime() : 0;
    return dateB - dateA;
  });
  const paginatedData = sortedOrdenes.slice(startIndex, startIndex + itemsPerPage);

  const columns = [
    {
      header: 'ID',
      accessor: (item: OrdenCompraDTO) => <span className="font-mono">{item.idOrdenCompra}</span>,
    },
    {
      header: 'Fecha',
      accessor: (item: OrdenCompraDTO) => item.fechaPendiente ? new Date(item.fechaPendiente).toLocaleDateString() : 'N/A',
    },
    {
      header: 'Proveedor',
      accessor: (item: OrdenCompraDTO) => `ID: ${item.id_proveedor}`,
    },
    {
      header: 'Total',
      accessor: (item: OrdenCompraDTO) => formatCurrency(item.totalOrdenCompra || 0),
    },
    {
      header: 'Estado',
      accessor: (item: OrdenCompraDTO) => (
        <span className={`badge ${getBadgeColor(item.estado)}`}>
          {item.estado}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (item: OrdenCompraDTO) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleVerDetalle(item)}
            className="btn btn-soft btn-info btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Detalle
          </button>
          {item.estado === EstadoOrdenCompra.Pendiente && (
            <>
              <button
                onClick={() => handleEditar(item)}
                className="btn btn-soft btn-warning btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                onClick={() => handleConfirmar(item.idOrdenCompra || 0)}
                className="btn btn-soft btn-success btn-sm"
              >
                Confirmar
              </button>
              <button
                onClick={() => handleCancelar(item.idOrdenCompra || 0)}
                className="btn btn-soft btn-error btn-sm"
              >
                Cancelar
              </button>
            </>
          )}
          {item.estado === EstadoOrdenCompra.Enviada && (
            <button
              onClick={() => handleFinalizar(item.idOrdenCompra || 0)}
              className="btn btn-soft btn-success btn-sm"
            >
              Finalizar
            </button>
          )}
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
          <h1 className="text-2xl font-bold text-white">Órdenes de Compra</h1>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-soft btn-primary"
          >
            Nueva Orden de Compra
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Todas las Órdenes de Compra</h2>
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

        {/* Modal de Detalles */}
        {showModal && selectedOrden && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                Detalles de la Orden de Compra #{selectedOrden.idOrdenCompra}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Información General</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-gray-500">Proveedor:</span>
                      <p>{selectedOrden.id_proveedor}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Estado:</span>
                      <p><span className={`badge ${getBadgeColor(selectedOrden.estado)}`}>{selectedOrden.estado}</span></p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <p>{formatCurrency(selectedOrden.totalOrdenCompra || 0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Cantidad Total:</span>
                      <p>{selectedOrden.cantidadOrdenCompra || 0} unidades</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Artículos</h4>
                  <div className="overflow-x-auto mt-2">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>ID Artículo</th>
                          <th>Cantidad</th>
                          <th>Precio Unitario</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrden.articulosOrdenCompra.map((articulo, index) => (
                          <tr key={index}>
                            <td>{articulo.id_articulo}</td>
                            <td>{articulo.cantidad}</td>
                            <td>{formatCurrency(articulo.precioUnitarioOCA || 0)}</td>
                            <td>{formatCurrency(articulo.precioSubTotalOCA || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Fechas</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-gray-500">Fecha Pendiente:</span>
                      <p>{selectedOrden.fechaPendiente ? new Date(selectedOrden.fechaPendiente).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Fecha Confirmada:</span>
                      <p>{selectedOrden.fechaConfirmada ? new Date(selectedOrden.fechaConfirmada).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Fecha Recibida:</span>
                      <p>{selectedOrden.fechaRecibida ? new Date(selectedOrden.fechaRecibida).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Fecha Cancelada:</span>
                      <p>{selectedOrden.fechaCancelada ? new Date(selectedOrden.fechaCancelada).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-soft"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        {showEditModal && ordenToEdit && (
          <OrdenCompraEditModal
            orden={ordenToEdit}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setOrdenToEdit(null);
            }}
            onSave={handleEditSave}
          />
        )}
      </div>
    </MainLayout>
  );
}; 