import React, { useState, useEffect } from 'react';
import { ArticuloDTO, ProveedorPredeterminadoDTO, ArticuloAReponerDTO, ArticuloFaltanteDTO, OrdenCompraDTO, ModeloInventario, ArticuloProveedorDTO } from '../types';
import { articuloService } from '../services/articuloService';
import { proveedorService } from '../services/proveedorService';
import { ordenCompraService } from '../services/ordenCompraService';
import { MainLayout } from '../components/layout/MainLayout';
import ArticuloForm from '../components/articulos/ArticuloForm';
import { ArticuloDetalleModal } from '../components/articulos/ArticuloDetalleModal';
import { ProveedorSelectDialog } from '../components/articulos/ProveedorSelectDialog';
import { ArticuloProveedorForm } from '../components/articulos/ArticuloProveedorForm';
import { articuloProveedorService } from '../services/articuloProveedorService';
import { SuccessAlert, ConfirmationAlert } from '../components/ui/Alert';
import { PaginatedTable } from '../components/ui/PaginatedTable';
import { formatCurrency } from '../lib/utils';

export const ArticulosPage: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [articulosAReponer, setArticulosAReponer] = useState<ArticuloAReponerDTO[]>([]);
  const [articulosFaltantes, setArticulosFaltantes] = useState<ArticuloFaltanteDTO[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showProveedorDialog, setShowProveedorDialog] = useState(false);
  const [showArticuloProveedorForm, setShowArticuloProveedorForm] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState<ArticuloDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [articulosData, proveedoresData, aReponerData, faltantesData] = await Promise.all([
        articuloService.getAll(),
        proveedorService.getAll(),
        articuloService.getArticulosAReponer(),
        articuloService.getArticulosFaltantes()
      ]);

      setArticulos(articulosData);
      setProveedores(proveedoresData);
      setArticulosAReponer(aReponerData);
      setArticulosFaltantes(faltantesData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticulo = async (articuloDTO: Omit<ArticuloDTO, 'id'>) => {
    try {
      const articuloCreado = await articuloService.create(articuloDTO);
      setArticulos(prev => [...prev, articuloCreado]);
      setShowForm(false);
      setSuccessMessage('Artículo creado exitosamente');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      cargarDatos();
    } catch (err) {
      console.error('Error al crear artículo:', err);
      setError('Error al crear el artículo');
    }
  };

  const handleEditArticulo = async (articuloDTO: ArticuloDTO) => {
    try {
      const articuloActualizado = await articuloService.update(articuloDTO.idArticulo, articuloDTO);
      setArticulos(prev => prev.map(a => a.idArticulo === articuloDTO.idArticulo ? articuloActualizado : a));
      setShowForm(false);
      setSelectedArticulo(null);
      cargarDatos();
    } catch (err) {
      console.error('Error al actualizar artículo:', err);
      setError('Error al actualizar el artículo');
    }
  };

  const handleDeleteArticulo = async (id: number) => {
    setConfirmMessage('¿Está seguro que desea eliminar este artículo?');
    setConfirmAction(() => async () => {
      try {
        await articuloService.delete(id);
        setArticulos(prev => prev.filter(a => a.idArticulo !== id));
        setSuccessMessage('Artículo eliminado exitosamente');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        cargarDatos();
      } catch (err) {
        console.error('Error al eliminar artículo:', err);
        setError('Error al eliminar el artículo');
      }
    });
    setShowConfirmAlert(true);
  };

  const handleVerMas = (articulo: ArticuloDTO) => {
    setSelectedArticulo(articulo);
    setShowDetalleModal(true);
  };

  const handleAsignarProveedor = (articulo: ArticuloDTO) => {
    setSelectedArticulo(articulo);
    setShowProveedorDialog(true);
  };

  const handleSetProveedorPredeterminado = async (proveedorData: ProveedorPredeterminadoDTO) => {
    if (!selectedArticulo?.idArticulo) return;
    
    try {
      setLoading(true);
      await articuloService.establecerProveedor(selectedArticulo.idArticulo, proveedorData);
      setShowProveedorDialog(false);
      
      // Actualizar los datos después de asignar el proveedor
      const [articulosData, aReponerData, faltantesData] = await Promise.all([
        articuloService.getAll(),
        articuloService.getArticulosAReponer(),
        articuloService.getArticulosFaltantes()
      ]);

      setArticulos(articulosData);
      setArticulosAReponer(aReponerData);
      setArticulosFaltantes(faltantesData);
      setError(null);
    } catch (err) {
      setError('Error al establecer el proveedor predeterminado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarProveedores = () => {
    setShowArticuloProveedorForm(true);
  };

  const handleGenerarOrdenCompra = async (articulo: ArticuloAReponerDTO | ArticuloFaltanteDTO) => {
    try {
      if (!articulo.nombreProveedor) {
        setError(`El artículo "${articulo.nombreArticulo}" no tiene un proveedor predeterminado asignado. Por favor, asigne un proveedor predeterminado antes de generar la orden de compra.`);
        return;
      }

      const proveedor = proveedores.find(p => p.nombreProveedor === articulo.nombreProveedor);
      if (!proveedor) {
        setError(`No se encontró el proveedor "${articulo.nombreProveedor}" para el artículo "${articulo.nombreArticulo}".`);
        return;
      }

      let cantidad = 0;
      if ('puntoPedido' in articulo) {
        cantidad = articulo.puntoPedido - articulo.stockActual;
      } else {
        cantidad = articulo.stockSeguridad - articulo.stockActual;
      }

      if (cantidad <= 0) {
        setError(`No es necesario generar una orden de compra para el artículo "${articulo.nombreArticulo}" ya que la cantidad a pedir es 0 o negativa.`);
        return;
      }

      // Validación: Verificar que el stock resultante no exceda el inventario máximo
      const stockResultante = articulo.stockActual + cantidad;
      if ('inventarioMaximo' in articulo && stockResultante > articulo.inventarioMaximo) {
        setError(`No se puede generar la orden de compra para el artículo "${articulo.nombreArticulo}". El stock resultante (${stockResultante}) excedería el inventario máximo (${articulo.inventarioMaximo}).`);
        return;
      }

      setConfirmMessage(
        `¿Está seguro que desea generar una orden de compra para el artículo "${articulo.nombreArticulo}"?\n\n` +
        `Proveedor: ${articulo.nombreProveedor}\n` +
        `Cantidad a pedir: ${cantidad}\n` +
        `Stock actual: ${articulo.stockActual}\n` +
        `Stock resultante: ${stockResultante}`
      );

      setConfirmAction(() => async () => {
        const ordenCompra: OrdenCompraDTO = {
          id_proveedor: proveedor.id,
          articulosOrdenCompra: [{
            id_articulo: articulo.id,
            cantidad: cantidad
          }],
          estado: 'PENDIENTE'
        };

        await ordenCompraService.altaOrdenCompra(ordenCompra);
        setSuccessMessage('Orden de compra generada exitosamente');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        cargarDatos();
      });

      setShowConfirmAlert(true);
    } catch (err) {
      console.error('Error al generar orden de compra:', err);
      setError('Error al generar la orden de compra');
    }
  };

  // Lógica de paginación
  const totalPages = Math.ceil(articulos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const sortedArticulos = [...articulos].sort((a, b) => a.nombreArticulo.localeCompare(b.nombreArticulo));
  const paginatedData = sortedArticulos.slice(startIndex, startIndex + itemsPerPage);

  // Función para obtener el proveedor predeterminado
  const getProveedorPredeterminado = (articuloId: number) => {
    const articulo = articulos.find(a => a.idArticulo === articuloId);
    if (!articulo?.idProveedorPredeterminado) return 'Sin proveedor';
    
    const proveedor = proveedores.find(p => p.id === articulo.idProveedorPredeterminado);
    return proveedor?.nombreProveedor || 'Sin proveedor';
  };

  // Columnas para la tabla paginada
  const columns = [
    {
      header: 'Nombre',
      accessor: (item: ArticuloDTO) => item.nombreArticulo,
    },
    {
      header: 'Descripción',
      accessor: (item: ArticuloDTO) => item.descripcionArticulo,
    },
    {
      header: 'Precio de Venta',
      accessor: (item: ArticuloDTO) => formatCurrency(item.precioVentaArt),
    },
    {
      header: 'Stock Actual',
      accessor: (item: ArticuloDTO) => (
        <span className={item.stockActual <= 0 ? 'text-red-500' : 'text-green-500'}>
          {item.stockActual}
        </span>
      ),
    },
    {
      header: 'Demanda',
      accessor: (item: ArticuloDTO) => item.demandaArticulo,
    },
    {
      header: 'Proveedor Predeterminado',
      accessor: (item: ArticuloDTO) => getProveedorPredeterminado(item.idArticulo),
    },
    {
      header: 'Acciones',
      accessor: (item: ArticuloDTO) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleVerMas(item)}
            className="btn btn-soft btn-info btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver más
          </button>
          <button
            onClick={() => handleAsignarProveedor(item)}
            className="btn btn-soft btn-warning btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Asignar Prov.
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
          <h1 className="text-2xl font-bold text-white">Artículos</h1>
          <button 
            onClick={() => setShowForm(true)} 
            className="btn btn-soft btn-primary"
          >
            Nuevo Artículo
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Sección de Todos los Artículos */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Todos los Artículos</h2>
            <PaginatedTable
              columns={columns}
              data={paginatedData}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>

          {/* Sección de Artículos a Reponer */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Artículos a Reponer</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock Actual</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Punto de Pedido</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Proveedor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {articulosAReponer.map((articulo) => (
                    <tr key={articulo.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-sm text-gray-300">{articulo.nombreArticulo}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{articulo.stockActual}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{articulo.puntoPedido}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{articulo.nombreProveedor}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <button
                          onClick={() => handleGenerarOrdenCompra(articulo)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Generar Orden de Compra
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sección de Artículos Faltantes */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Artículos Faltantes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock Actual</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock Seguridad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Proveedor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {articulosFaltantes.map((articulo) => (
                    <tr key={articulo.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-sm text-gray-300">{articulo.nombreArticulo}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{articulo.stockActual}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{articulo.stockSeguridad}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{articulo.nombreProveedor}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <button
                          onClick={() => handleGenerarOrdenCompra(articulo)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Generar Orden de Compra
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showForm && (
          <ArticuloForm
            onSubmit={selectedArticulo ? handleEditArticulo : handleCreateArticulo}
            onCancel={() => {
              setShowForm(false);
              setSelectedArticulo(null);
            }}
            articulo={selectedArticulo}
          />
        )}

        {showDetalleModal && selectedArticulo && (
          <ArticuloDetalleModal
            articulo={selectedArticulo}
            onClose={() => {
              setShowDetalleModal(false);
              setSelectedArticulo(null);
            }}
            onAsignarProveedorPredeterminado={() => {
              setShowDetalleModal(false);
              setShowProveedorDialog(true);
            }}
            onAsignarProveedores={handleAsignarProveedores}
            onEdit={(articulo) => {
              setShowDetalleModal(false);
              setSelectedArticulo(articulo);
              setShowForm(true);
            }}
            onDelete={handleDeleteArticulo}
          />
        )}

        {showProveedorDialog && selectedArticulo && (
          <ProveedorSelectDialog
            open={showProveedorDialog}
            proveedores={proveedores}
            articuloId={selectedArticulo.idArticulo}
            onConfirm={handleSetProveedorPredeterminado}
            onCancel={() => {
              setShowProveedorDialog(false);
              setSelectedArticulo(null);
            }}
            loading={loading}
          />
        )}

        {showArticuloProveedorForm && selectedArticulo && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Asignar Proveedor al Artículo
              </h2>
              <ArticuloProveedorForm
                onSuccess={() => {
                  setShowArticuloProveedorForm(false);
                  setSelectedArticulo(null);
                  cargarDatos();
                }}
                onCancel={() => {
                  setShowArticuloProveedorForm(false);
                  setSelectedArticulo(null);
                }}
                idArticulo={selectedArticulo.idArticulo}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}; 