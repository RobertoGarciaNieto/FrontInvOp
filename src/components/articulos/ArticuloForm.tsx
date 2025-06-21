import React, { useState } from 'react';
import { ArticuloDTO } from '../../types';

type ArticuloFormData = Omit<ArticuloDTO, 'id'>;

interface ArticuloFormProps {
  articulo?: ArticuloDTO | null;
  onSubmit: (articulo: ArticuloFormData) => void;
  onCancel: () => void;
}

export const ArticuloForm: React.FC<ArticuloFormProps> = ({
  articulo,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<ArticuloFormData>({
    nombreArticulo: articulo?.nombreArticulo || '',
    descripcionArticulo: articulo?.descripcionArticulo || '',
    precioVentaArt: articulo?.precioVentaArt || 0,
    costoAlmacenamiento: articulo?.costoAlmacenamiento || 0,
    stockActual: articulo?.stockActual || 0,
    demandaArticulo: articulo?.demandaArticulo || 0,
    inventarioMaximo: articulo?.inventarioMaximo || 0,
    idArticulo: articulo?.idArticulo || 0,
    idProveedorPredeterminado: articulo?.idProveedorPredeterminado
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ArticuloDTO, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ArticuloDTO, string>> = {};

    if (!formData.nombreArticulo.trim()) {
      newErrors.nombreArticulo = 'El nombre es requerido';
    }

    if (!formData.descripcionArticulo.trim()) {
      newErrors.descripcionArticulo = 'La descripción es requerida';
    }

    if (formData.precioVentaArt <= 0) {
      newErrors.precioVentaArt = 'El valor debe ser superior a 0';
    }

    if (formData.costoAlmacenamiento <= 0) {
      newErrors.costoAlmacenamiento = 'El valor debe ser superior a 0';
    }

    if (formData.stockActual < 0) {
      newErrors.stockActual = 'El stock actual debe ser mayor o igual a 0';
    }

    if (formData.demandaArticulo <= 0) {
      newErrors.demandaArticulo = 'El valor debe ser superior a 0';
    }

    if (formData.inventarioMaximo <= 0) {
      newErrors.inventarioMaximo = 'El valor debe ser superior a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const articuloDTO: ArticuloFormData = {
        nombreArticulo: formData.nombreArticulo,
        descripcionArticulo: formData.descripcionArticulo,
        precioVentaArt: formData.precioVentaArt,
        costoAlmacenamiento: formData.costoAlmacenamiento,
        stockActual: formData.stockActual,
        demandaArticulo: formData.demandaArticulo,
        inventarioMaximo: formData.inventarioMaximo,
        idArticulo: formData.idArticulo,
        idProveedorPredeterminado: formData.idProveedorPredeterminado
      };
      onSubmit(articuloDTO);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('precio') || name.includes('costo') || name.includes('stock') || name.includes('demanda') || name.includes('inventario')
        ? Number(value)
        : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {articulo ? 'Editar Artículo' : 'Nuevo Artículo'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombreArticulo" className="block text-sm font-medium text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              id="nombreArticulo"
              name="nombreArticulo"
              value={formData.nombreArticulo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.nombreArticulo && (
              <p className="mt-1 text-sm text-red-400">{errors.nombreArticulo}</p>
            )}
          </div>

          <div>
            <label htmlFor="descripcionArticulo" className="block text-sm font-medium text-gray-300">
              Descripción
            </label>
            <textarea
              id="descripcionArticulo"
              name="descripcionArticulo"
              value={formData.descripcionArticulo}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.descripcionArticulo && (
              <p className="mt-1 text-sm text-red-400">{errors.descripcionArticulo}</p>
            )}
          </div>

          <div>
            <label htmlFor="precioVentaArt" className="block text-sm font-medium text-gray-300">
              Precio de Venta
            </label>
            <input
              type="number"
              id="precioVentaArt"
              name="precioVentaArt"
              value={formData.precioVentaArt}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.precioVentaArt && (
              <p className="mt-1 text-sm text-red-400">{errors.precioVentaArt}</p>
            )}
          </div>

          <div>
            <label htmlFor="costoAlmacenamiento" className="block text-sm font-medium text-gray-300">
              Costo de Almacenamiento
            </label>
            <input
              type="number"
              id="costoAlmacenamiento"
              name="costoAlmacenamiento"
              value={formData.costoAlmacenamiento}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.costoAlmacenamiento && (
              <p className="mt-1 text-sm text-red-400">{errors.costoAlmacenamiento}</p>
            )}
          </div>

          <div>
            <label htmlFor="stockActual" className="block text-sm font-medium text-gray-300">
              Stock Actual
            </label>
            <input
              type="number"
              id="stockActual"
              name="stockActual"
              value={formData.stockActual}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.stockActual && (
              <p className="mt-1 text-sm text-red-400">{errors.stockActual}</p>
            )}
          </div>

          <div>
            <label htmlFor="demandaArticulo" className="block text-sm font-medium text-gray-300">
              Demanda
            </label>
            <input
              type="number"
              id="demandaArticulo"
              name="demandaArticulo"
              value={formData.demandaArticulo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.demandaArticulo && (
              <p className="mt-1 text-sm text-red-400">{errors.demandaArticulo}</p>
            )}
          </div>

          <div>
            <label htmlFor="inventarioMaximo" className="block text-sm font-medium text-gray-300">
              Inventario Máximo
            </label>
            <input
              type="number"
              id="inventarioMaximo"
              name="inventarioMaximo"
              value={formData.inventarioMaximo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.inventarioMaximo && (
              <p className="mt-1 text-sm text-red-400">{errors.inventarioMaximo}</p>
            )}
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
              {articulo ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticuloForm; 