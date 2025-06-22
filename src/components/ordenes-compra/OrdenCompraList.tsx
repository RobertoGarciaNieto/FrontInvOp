import React, { useState, useEffect } from 'react';
import { OrdenCompraDTO, EstadoOrdenCompra } from '../../types';
import { ordenCompraService } from '../../services/ordenCompraService';
import { PaginatedTable } from '../ui/PaginatedTable';
import { formatCurrency } from '../../lib/utils';
import { OrdenCompraEditModal } from './OrdenCompraEditModal';

interface OrdenCompraListProps {
  refreshTrigger: number;
  onConfirmar: (id: number) => Promise<void>;
  onCancelar: (id: number) => Promise<void>;
  onFinalizar: (id: number) => Promise<void>;
}

interface Column {
  header: string;
  accessor: keyof OrdenCompraDTO;
  cell: (value: any, row: OrdenCompraDTO) => React.ReactNode;
}

export const OrdenCompraList: React.FC<OrdenCompraListProps> = ({ 
  refreshTrigger,
  onConfirmar,
  onCancelar,
  onFinalizar
}) => {
  const [ordenes, setOrdenes] = useState<OrdenCompraDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedOrden, setSelectedOrden] = useState<OrdenCompraDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ordenToEdit, setOrdenToEdit] = useState<OrdenCompraDTO | null>(null);

  useEffect(() => {
    cargarOrdenes();
  }, [refreshTrigger]);

  const cargarOrdenes = async () => {
    try {
      setLoading(true);
      const data = await ordenCompraService.getAll();
      setOrdenes(data);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError('Error al cargar las órdenes de compra');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async (id: number) => {
    try {
      await onConfirmar(id);
    } catch (err) {
      console.error('Error al confirmar orden:', err);
      setError('Error al confirmar la orden de compra');
    }
  };

  const handleCancelar = async (id: number) => {
    try {
      await onCancelar(id);
    } catch (err) {
      console.error('Error al cancelar orden:', err);
      setError('Error al cancelar la orden de compra');
    }
  };

  const handleFinalizar = async (id: number) => {
    try {
      await onFinalizar(id);
    } catch (err) {
      console.error('Error al finalizar orden:', err);
      setError('Error al finalizar la orden de compra');
    }
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
  const paginatedData = ordenes.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column[] = [
    {
      header: 'ID',
      accessor: 'idOrdenCompra',
      cell: (value: number, row: OrdenCompraDTO) => <span className="font-mono">{value}</span>
    },
    {
      header: 'Fecha',
      accessor: 'fechaPendiente',
      cell: (value: Date, row: OrdenCompraDTO) => new Date(value).toLocaleDateString()
    },
    {
      header: 'Proveedor',
      accessor: 'id_proveedor',
      cell: (value: number, row: OrdenCompraDTO) => `ID: ${value}`
    },
    {
      header: 'Total',
      accessor: 'totalOrdenCompra',
      cell: (value: number, row: OrdenCompraDTO) => formatCurrency(value || 0)
    },
    {
      header: 'Estado',
      accessor: 'estado',
      cell: (value: string, row: OrdenCompraDTO) => (
        <span className={`badge ${getBadgeColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: 'idOrdenCompra',
      cell: (value: number, row: OrdenCompraDTO) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleVerDetalle(row)}
            className="btn btn-soft btn-info btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Detalle
          </button>
          {row.estado === EstadoOrdenCompra.Pendiente && (
            <>
              <button
                onClick={() => handleEditar(row)}
                className="btn btn-soft btn-warning btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                onClick={() => handleConfirmar(value)}
                className="btn btn-soft btn-success btn-sm"
              >
                Confirmar
              </button>
              <button
                onClick={() => handleCancelar(value)}
                className="btn btn-soft btn-error btn-sm"
              >
                Cancelar
              </button>
            </>
          )}
          {row.estado === EstadoOrdenCompra.Enviada && (
            <button
              onClick={() => handleFinalizar(value)}
              className="btn btn-soft btn-success btn-sm"
            >
              Finalizar
            </button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.idOrdenCompra}>
                {columns.map((column, index) => (
                  <td key={index}>
                    {column.cell(orden[column.accessor as keyof OrdenCompraDTO], orden)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
  );
}; 