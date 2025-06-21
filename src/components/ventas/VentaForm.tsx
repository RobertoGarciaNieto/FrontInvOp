import React, { useState, useEffect } from 'react';
import { ArticuloDTO, VentaDTO } from '../../types';
import { articuloService } from '../../services/articuloService';
import { ventaService } from '../../services/ventaService';

interface VentaFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const VentaForm: React.FC<VentaFormProps> = ({ onCancel, onSuccess }) => {
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<{ idArticulo: number; cantidad: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      const data = await articuloService.getAll();
      // Filtrar artículos que tienen proveedor predeterminado
      const articulosConProveedor = data.filter(a => a.idProveedorPredeterminado);
      setArticulos(articulosConProveedor);
    } catch (err) {
      setError('Error al cargar artículos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validarStock = (articuloId: number, cantidad: number): boolean => {
    const articulo = articulos.find(a => a.idArticulo === articuloId);
    if (!articulo) return false;
    return articulo.stockActual >= cantidad;
  };

  const handleCantidadChange = (articuloId: number, cantidad: number) => {
    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (!validarStock(articuloId, cantidad)) {
      const articulo = articulos.find(a => a.idArticulo === articuloId);
      setError(`Stock insuficiente para el artículo: ${articulo?.nombreArticulo}. Stock actual: ${articulo?.stockActual}, Cantidad solicitada: ${cantidad}`);
      return;
    }

    setArticulosSeleccionados(prev => {
      const index = prev.findIndex(a => a.idArticulo === articuloId);
      if (index >= 0) {
        const newArray = [...prev];
        newArray[index] = { idArticulo: articuloId, cantidad };
        return newArray;
      }
      return [...prev, { idArticulo: articuloId, cantidad }];
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando submit con artículos:', articulosSeleccionados);

    // Validación frontend
    if (articulosSeleccionados.some(a => a.cantidad <= 0)) {
      setError('No se permiten cantidades menores o iguales a 0');
      return;
    }
    if (articulosSeleccionados.some(a => !validarStock(a.idArticulo, a.cantidad))) {
      setError('No puede vender más de lo que hay en stock');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Asegurarnos de que cada artículo tenga un idArticulo válido
      const articulosValidos = articulosSeleccionados.filter(a => a.idArticulo > 0);
      if (articulosValidos.length === 0) {
        setError('Debe seleccionar al menos un artículo');
        return;
      }

      const ventaDTO: VentaDTO = {
        articulosVenta: articulosValidos
      };

      console.log('Enviando ventaDTO:', ventaDTO);
      await ventaService.altaVenta(ventaDTO);
      setSuccessMessage('Venta creada correctamente');
      limpiarFormulario();
      onSuccess();
    } catch (err: any) {
      console.error('Error completo:', err);
      setError(err.message || 'Error al crear la venta');
      if (err.warning) setWarning(err.warning);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setArticulosSeleccionados([]);
    setError(null);
    setSuccessMessage(null);
    setWarning(null);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-ring loading-xl"></span></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div role="alert" className="alert alert-error alert-soft mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div role="alert" className="alert alert-success alert-soft mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {warning && (
        <div role="alert" className="alert alert-warning alert-soft mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L2.697 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{warning}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Artículos
        </label>
        <div className="space-y-4">
          {articulos.map(articulo => (
            <div key={articulo.idArticulo} className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-400">{articulo.nombreArticulo}</label>
                <p className="text-xs text-gray-500">Stock disponible: {articulo.stockActual}</p>
                <p className="text-xs text-gray-500">Precio: ${articulo.precioVentaArt}</p>
                <p className="text-xs text-gray-500">ID Proveedor predeterminado: {articulo.idProveedorPredeterminado || 'No asignado'}</p>
              </div>
              <input
                type="number"
                min="1"
                max={articulo.stockActual}
                onChange={(e) => handleCantidadChange(articulo.idArticulo, parseInt(e.target.value))}
                className="input input-bordered w-24"
                placeholder="Cantidad"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-soft btn-error"
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-soft btn-info">
          Crear Venta
        </button>
      </div>
    </form>
  );
};

export default VentaForm;
