import React, { useState, useEffect } from 'react';
import { ProveedorDTO, ArticuloDTO, ArticuloProveedorDTO, ModeloInventario } from '../../types';
import { articuloService } from '../../services/articuloService';

interface ProveedorFormProps {
  onSubmit: (proveedor: ProveedorDTO) => void;
  onCancel: () => void;
  proveedor?: ProveedorDTO;
}

export const ProveedorForm: React.FC<ProveedorFormProps> = ({
  onSubmit,
  onCancel,
  proveedor
}) => {
  const [nombreProveedor, setNombreProveedor] = useState(proveedor?.nombreProveedor || '');
  const [cuit, setCuit] = useState(proveedor?.cuit || '');
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [selectedArticulo, setSelectedArticulo] = useState<number | null>(null);
  const [modeloInventario, setModeloInventario] = useState<ModeloInventario>(ModeloInventario.loteFijo);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [demoraEntrega, setDemoraEntrega] = useState<number>(0);
  const [desviacionEstandar, setDesviacionEstandar] = useState<number>(1.64);
  const [costoPorPedido, setCostoPorPedido] = useState<number>(0);
  const [intervaloRevision, setIntervaloRevision] = useState<number>(0);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      const articulosData = await articuloService.getAll();
      setArticulos(articulosData);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const articuloProveedor: ArticuloProveedorDTO = {
      id_articulo: selectedArticulo!,
      id_proveedor: proveedor?.id || 0,
      idArticuloProveedor: 0,
      precioUnitario,
      demoraEntrega,
      modeloInventario,
      desviacionEstandar,
      costoPorPedido,
      intervaloRevision: modeloInventario === ModeloInventario.intervaloFijo ? intervaloRevision : 0,
      costoCompra: 0,
      costoPedido: 0,
      stockSeguridad: 0,
      costoAlmacenamiento: 0,
      valorCGI: 0,
      loteOptimo: 0,
      puntoPedido: 0
    };

    const proveedorData: ProveedorDTO = {
      id: proveedor?.id || 0,
      nombreProveedor,
      cuit,
      articulosAsociados: [articuloProveedor]
    };

    onSubmit(proveedorData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Nombre del Proveedor
        </label>
        <input
          type="text"
          value={nombreProveedor}
          onChange={(e) => setNombreProveedor(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          CUIT
        </label>
        <input
          type="text"
          value={cuit}
          onChange={(e) => setCuit(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Artículo
        </label>
        <select
          value={selectedArticulo || ''}
          onChange={(e) => setSelectedArticulo(Number(e.target.value))}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Seleccione un artículo</option>
          {articulos.map(articulo => (
            <option key={articulo.idArticulo} value={articulo.idArticulo}>
              {articulo.nombreArticulo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Modelo de Inventario
        </label>
        <select
          value={modeloInventario}
          onChange={(e) => setModeloInventario(Number(e.target.value) as ModeloInventario)}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value={ModeloInventario.loteFijo}>Lote Fijo</option>
          <option value={ModeloInventario.intervaloFijo}>Intervalo Fijo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Precio Unitario
        </label>
        <input
          type="number"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(Number(e.target.value))}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Demora de Entrega (días)
        </label>
        <input
          type="number"
          value={demoraEntrega}
          onChange={(e) => setDemoraEntrega(Number(e.target.value))}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Desviación Estándar
        </label>
        <input
          type="number"
          value={desviacionEstandar}
          onChange={(e) => setDesviacionEstandar(Number(e.target.value))}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Costo por Pedido
        </label>
        <input
          type="number"
          value={costoPorPedido}
          onChange={(e) => setCostoPorPedido(Number(e.target.value))}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          min="0"
          step="0.01"
        />
      </div>

      {modeloInventario === ModeloInventario.intervaloFijo && (
        <div>
          <label htmlFor="intervaloRevision" className="block text-sm font-medium text-gray-300">
            Intervalo de Revisión
          </label>
          <input
            type="number"
            id="intervaloRevision"
            value={intervaloRevision}
            onChange={(e) => setIntervaloRevision(Number(e.target.value))}
            min="0"
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {proveedor ? 'Actualizar' : 'Crear'} Proveedor
        </button>
      </div>
    </form>
  );
}; 