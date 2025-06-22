import React, { useState, useEffect } from 'react';
import { OrdenCompra, OrdenCompraDTO, Proveedor, Articulo, EstadoOrdenCompra, ProveedorDTO, ArticuloDTO } from '../../types';
import { ordenCompraService } from '../../services/ordenCompraService';
import { proveedorService } from '../../services/proveedorService';
import { articuloService } from '../../services/articuloService';
import { formatCurrency } from '../../lib/utils';

interface OrdenCompraFormProps {
  orden?: OrdenCompra;
  onSuccess: () => void;
  onCancel: () => void;
}

const OrdenCompraForm: React.FC<OrdenCompraFormProps> = ({ orden, onSuccess, onCancel }) => {
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [selectedProveedor, setSelectedProveedor] = useState<number | null>(null);
  const [selectedArticulos, setSelectedArticulos] = useState<{ id: number; cantidad: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [proveedoresData, articulosData] = await Promise.all([
          proveedorService.getAll(),
          articuloService.getAll()
        ]);
        setProveedores(proveedoresData);
        setArticulos(articulosData);

        if (orden) {
          setSelectedProveedor(orden.proveedor.id);
          setSelectedArticulos(
            orden.ordenCompraArticulo.map(oca => ({
              id: oca.articulo.id,
              cantidad: oca.cantOCA
            }))
          );
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [orden]);

  // Funciones de paginación
  const totalPages = Math.ceil(articulos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticulos = articulos.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleArticuloChange = async (articuloId: number, checked: boolean) => {
    if (checked) {
      try {
        const articulo = articulos.find(a => a.idArticulo === articuloId);
        if (!articulo) {
          throw new Error('Artículo no encontrado');
        }

        // Verificar si el artículo tiene proveedor predeterminado
        if (!articulo.idProveedorPredeterminado) {
          setWarnings(prev => [...prev, `El artículo ${articulo.nombreArticulo} no tiene proveedor predeterminado asignado`]);
          return;
        }

        // Verificar si ya existe una orden activa para este artículo
        const activeOrders = await ordenCompraService.getActiveOrdersForArticulo(articuloId);
        if (activeOrders.length > 0) {
          const existingOrder = activeOrders[0];
          if (existingOrder.proveedor.id === articulo.idProveedorPredeterminado) {
            setWarnings(prev => [...prev, `El artículo ${articulo.nombreArticulo} ya tiene una orden activa con el proveedor predeterminado`]);
            return;
          }
        }

        // Calcular cantidad estimada basada en el punto de pedido o inventario máximo
        let cantidadEstimada = 0;
        if (articulo.stockActual < articulo.inventarioMaximo) {
          // Calcular cantidad para llegar al inventario máximo
          cantidadEstimada = articulo.inventarioMaximo - articulo.stockActual;
        }

        // Verificar si el stock actual ya está en el inventario máximo
        if (cantidadEstimada <= 0) {
          setWarnings(prev => [...prev, `El artículo ${articulo.nombreArticulo} ya está en su inventario máximo (${articulo.inventarioMaximo}). No se puede generar una orden de compra.`]);
          return;
        }

        // Si no hay orden activa, agregar el artículo con su proveedor predeterminado
        setSelectedProveedor(articulo.idProveedorPredeterminado);
        setSelectedArticulos(prev => [...prev, { id: articuloId, cantidad: cantidadEstimada }]);
      } catch (err) {
        console.error('Error al verificar órdenes activas:', err);
        setError('Error al verificar órdenes activas');
      }
    } else {
      setSelectedArticulos(prev => prev.filter(a => a.id !== articuloId));
      setWarnings(prev => prev.filter(w => !w.includes(articulos.find(a => a.idArticulo === articuloId)?.nombreArticulo || '')));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProveedor || selectedArticulos.length === 0) {
      setError('Debe seleccionar al menos un artículo');
      return;
    }

    // Validación adicional: Verificar que los artículos seleccionados no excedan el inventario máximo
    const articulosConProblemas = selectedArticulos.filter(selected => {
      const articulo = articulos.find(a => a.idArticulo === selected.id);
      if (!articulo) return false;
      
      // Verificar que la cantidad no exceda el inventario máximo
      const stockResultante = articulo.stockActual + selected.cantidad;
      return stockResultante > articulo.inventarioMaximo;
    });

    if (articulosConProblemas.length > 0) {
      const nombresArticulos = articulosConProblemas.map(selected => {
        const articulo = articulos.find(a => a.idArticulo === selected.id);
        const stockResultante = articulo ? articulo.stockActual + selected.cantidad : 0;
        return `${articulo?.nombreArticulo || 'Artículo desconocido'} (stock resultante: ${stockResultante}, máximo: ${articulo?.inventarioMaximo})`;
      });
      setError(`No se puede generar la orden de compra para los siguientes artículos que excederían su inventario máximo: ${nombresArticulos.join(', ')}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setWarnings([]);

      const ordenCompraDTO: OrdenCompraDTO = {
        id_proveedor: selectedProveedor,
        estado: "Pendiente",
        articulosOrdenCompra: selectedArticulos.map(a => ({
          id_articulo: a.id,
          cantidad: a.cantidad // Usar la cantidad calculada
        }))
      };

      await ordenCompraService.altaOrdenCompra(ordenCompraDTO);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al procesar la orden de compra');
      if (err.warning) setWarnings([err.warning]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-ring loading-xl"></span></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div role="alert" className="alert alert-error alert-soft">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {warnings.length > 0 && (
        <div role="alert" className="alert alert-warning alert-soft">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-bold">Advertencias:</h3>
            <ul className="list-disc list-inside">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Artículos</span>
        </label>
        <div className="space-y-4">
          {currentArticulos.map(articulo => (
            <div key={articulo.idArticulo}>
              <button
                type="button"
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedArticulos.some(a => a.id === articulo.idArticulo)
                    ? 'bg-primary/10 border-primary ring-2 ring-primary'
                    : 'border-gray-700 hover:bg-gray-800'
                }`}
                onClick={() => {
                  const isSelected = selectedArticulos.some(a => a.id === articulo.idArticulo);
                  handleArticuloChange(articulo.idArticulo, !isSelected);
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{articulo.nombreArticulo}</span>
                  <div className="text-sm text-right text-gray-400">
                    <div>Stock actual: {articulo.stockActual}</div>
                    <div>Inventario máximo: {articulo.inventarioMaximo}</div>
                    <div className="font-semibold">Espacio disponible: {articulo.inventarioMaximo - articulo.stockActual}</div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
        
        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-4 py-3 border-t border-border bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(endIndex, articulos.length)} de {articulos.length} artículos
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-border bg-background text-foreground 
                  hover:bg-accent hover:text-accent-foreground transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background text-sm"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-border bg-background text-foreground 
                  hover:bg-accent hover:text-accent-foreground transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background text-sm"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="btn btn-soft btn-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-soft btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : orden ? 'Modificar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default OrdenCompraForm; 