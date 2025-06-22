import React, { useState, useEffect } from 'react';
import { OrdenCompraDTO, ArticuloOrdenCompraDetalle, ProveedorDTO, ArticuloProveedorDTO } from '../../types';
import { ordenCompraService } from '../../services/ordenCompraService';
import { articuloService } from '../../services/articuloService';
import { proveedorService } from '../../services/proveedorService';
import { articuloProveedorService } from '../../services/articuloProveedorService';

interface OrdenCompraEditModalProps {
  orden: OrdenCompraDTO;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface ProveedorOption {
  id: number;
  nombreProveedor: string;
  esPredeterminado: boolean;
}

interface ArticuloInfo {
  id: number;
  cantidadOriginal: number;
  cantidadCalculada: number;
  loteOptimo?: number;
  modeloInventario?: string;
}

export const OrdenCompraEditModal: React.FC<OrdenCompraEditModalProps> = ({
  orden,
  isOpen,
  onClose,
  onSave
}) => {
  const [proveedores, setProveedores] = useState<ProveedorOption[]>([]);
  const [selectedProveedor, setSelectedProveedor] = useState<number>(orden.id_proveedor);
  const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
  const [articulosInfo, setArticulosInfo] = useState<ArticuloInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orden.articulosOrdenCompra.length > 0) {
      cargarProveedores();
      inicializarCantidades();
    }
  }, [isOpen, orden]);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener el primer artículo para buscar sus proveedores
      const primerArticulo = orden.articulosOrdenCompra[0];
      const proveedoresArticulo = await articuloService.getProveedoresByArticulo(primerArticulo.id_articulo);
      
      // Obtener todos los proveedores para mostrar en el dropdown
      const todosProveedores = await proveedorService.getAll();
      
      // Crear opciones de proveedores con información de si son predeterminados
      const opcionesProveedores: ProveedorOption[] = todosProveedores.map(prov => ({
        id: prov.id,
        nombreProveedor: prov.nombreProveedor,
        esPredeterminado: proveedoresArticulo.some((p: any) => p.id === prov.id && p.esProveedorPredeterminado)
      }));

      // Ordenar: primero el predeterminado, luego los demás
      const proveedorPredeterminado = opcionesProveedores.find(p => p.esPredeterminado);
      const otrosProveedores = opcionesProveedores.filter(p => !p.esPredeterminado);
      
      const proveedoresOrdenados = proveedorPredeterminado 
        ? [proveedorPredeterminado, ...otrosProveedores]
        : opcionesProveedores;

      setProveedores(proveedoresOrdenados);
      
      // Establecer el proveedor predeterminado como seleccionado por defecto
      if (proveedorPredeterminado) {
        setSelectedProveedor(proveedorPredeterminado.id);
      }
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      setError('Error al cargar los proveedores');
    } finally {
      setLoading(false);
    }
  };

  const inicializarCantidades = async () => {
    try {
      const nuevasCantidades: { [key: number]: number } = {};
      const infoArticulos: ArticuloInfo[] = [];
      
      for (const articulo of orden.articulosOrdenCompra) {
        try {
          // Obtener información del artículo-proveedor para calcular la cantidad
          const articulosProveedor = await articuloProveedorService.getAll();
          const articuloProveedor = articulosProveedor.find(ap => 
            ap.id_articulo === articulo.id_articulo && ap.id_proveedor === orden.id_proveedor
          );
          
          let cantidadCalculada = articulo.cantidad; // Por defecto usar la cantidad original
          let loteOptimo: number | undefined;
          let modeloInventario: string | undefined;
          
          if (articuloProveedor) {
            loteOptimo = articuloProveedor.loteOptimo;
            modeloInventario = articuloProveedor.modeloInventario as string;
            
            // Usar loteOptimo si está disponible
            if (loteOptimo && loteOptimo > 0) {
              cantidadCalculada = loteOptimo;
            }
          }
          
          nuevasCantidades[articulo.id_articulo] = cantidadCalculada;
          
          infoArticulos.push({
            id: articulo.id_articulo,
            cantidadOriginal: articulo.cantidad,
            cantidadCalculada,
            loteOptimo,
            modeloInventario
          });
        } catch (err) {
          console.error(`Error al obtener información del artículo ${articulo.id_articulo}:`, err);
          // Si hay error, usar las cantidades originales
          nuevasCantidades[articulo.id_articulo] = articulo.cantidad;
          infoArticulos.push({
            id: articulo.id_articulo,
            cantidadOriginal: articulo.cantidad,
            cantidadCalculada: articulo.cantidad
          });
        }
      }
      
      setCantidades(nuevasCantidades);
      setArticulosInfo(infoArticulos);
    } catch (err) {
      console.error('Error al inicializar cantidades:', err);
      // Si hay error, usar las cantidades originales
      const cantidadesOriginales: { [key: number]: number } = {};
      const infoArticulos: ArticuloInfo[] = [];
      
      orden.articulosOrdenCompra.forEach(articulo => {
        cantidadesOriginales[articulo.id_articulo] = articulo.cantidad;
        infoArticulos.push({
          id: articulo.id_articulo,
          cantidadOriginal: articulo.cantidad,
          cantidadCalculada: articulo.cantidad
        });
      });
      
      setCantidades(cantidadesOriginales);
      setArticulosInfo(infoArticulos);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Crear el DTO actualizado
      const ordenActualizada: OrdenCompraDTO = {
        ...orden,
        id_proveedor: selectedProveedor,
        articulosOrdenCompra: orden.articulosOrdenCompra.map(articulo => ({
          ...articulo,
          cantidad: cantidades[articulo.id_articulo] || articulo.cantidad
        }))
      };

      // Llamar al servicio para modificar la orden
      await ordenCompraService.modificarOrdenCompra(orden.idOrdenCompra!, ordenActualizada);
      
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error al guardar cambios:', err);
      setError(err.message || 'Error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  const handleCantidadChange = (articuloId: number, nuevaCantidad: number) => {
    setCantidades(prev => ({
      ...prev,
      [articuloId]: nuevaCantidad
    }));
  };

  const getCantidadDescripcion = (articuloInfo: ArticuloInfo) => {
    if (articuloInfo.loteOptimo && articuloInfo.loteOptimo > 0) {
      return `Lote Óptimo: ${articuloInfo.loteOptimo}`;
    }
    return 'Cantidad Calculada';
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-4">
          Editar Orden de Compra #{orden.idOrdenCompra}
        </h3>
        
        {error && (
          <div role="alert" className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Campo Proveedor */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Proveedor</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedProveedor}
              onChange={(e) => setSelectedProveedor(Number(e.target.value))}
              disabled={loading}
            >
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombreProveedor}
                  {proveedor.esPredeterminado && ' (Predeterminado)'}
                </option>
              ))}
            </select>
          </div>

          {/* Tabla de Artículos con Cantidades Editables */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Artículos y Cantidades</span>
            </label>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID Artículo</th>
                    <th>Cantidad Original</th>
                    <th>Cantidad Sugerida</th>
                    <th>Nueva Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {articulosInfo.map((articuloInfo) => (
                    <tr key={articuloInfo.id}>
                      <td>{articuloInfo.id}</td>
                      <td>{articuloInfo.cantidadOriginal}</td>
                      <td>
                        <div className="text-sm">
                          <div>{articuloInfo.cantidadCalculada}</div>
                          <div className="text-gray-500 text-xs">
                            {getCantidadDescripcion(articuloInfo)}
                          </div>
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input input-bordered input-sm w-24"
                          value={cantidades[articuloInfo.id] || articuloInfo.cantidadCalculada}
                          onChange={(e) => handleCantidadChange(articuloInfo.id, Number(e.target.value))}
                          min="1"
                          disabled={loading}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-soft"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 