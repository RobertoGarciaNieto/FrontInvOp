import { useState, useEffect } from "react";
import {
  ProveedorDTO,
  ArticuloProveedorDTO,
  ModeloInventario,
  ArticuloDTO,
} from "../../types";
import { proveedorService } from "../../services/proveedorService";
import { articuloService } from "../../services/articuloService";
import { articuloProveedorService } from "../../services/articuloProveedorService";

interface ArticuloProveedorFormProps {
  idArticulo: number;
  idProveedor?: number;
  onSuccess: () => void;
  onCancel: () => void;
  articuloProveedor?: ArticuloProveedorDTO | null;
}

interface FormErrors {
  [key: string]: string;
}

export const ArticuloProveedorForm = ({
  idArticulo,
  idProveedor,
  onSuccess,
  onCancel,
  articuloProveedor
}: ArticuloProveedorFormProps) => {
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [articulo, setArticulo] = useState<ArticuloDTO | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<ArticuloProveedorDTO>(() => {
    if (articuloProveedor) {
      return {
        ...articuloProveedor,
        id_proveedor: idProveedor || 0,
        id_articulo: idArticulo,
      };
    }
    return {
      id_proveedor: idProveedor || 0,
      id_articulo: idArticulo,
      idArticuloProveedor: 0,
      precioUnitario: 0,
      demoraEntrega: 0,
      desviacionEstandar: 0,
      costoPorPedido: 0,
      costoPedido: 0,
      modeloInventario: ModeloInventario.loteFijo,
      intervaloRevision: 0,
      stockSeguridad: 0,
      loteOptimo: 0,
      puntoPedido: 0,
      valorCGI: 0,
      costoAlmacenamiento: 0,
      costoCompra: 0,
    };
  });

  // Guardamos el estado inicial para comparaciones
  const [initialState] = useState<ArticuloProveedorDTO>(() => {
    if (articuloProveedor) {
      return {
        ...articuloProveedor,
        id_proveedor: idProveedor || 0,
        id_articulo: idArticulo,
      };
    }
    return formData;
  });

  const hasChanges = (): boolean => {
    if (!articuloProveedor) return true; // Si es nuevo, siempre hay cambios

    const camposRelevantes: (keyof ArticuloProveedorDTO)[] = [
      'precioUnitario',
      'demoraEntrega',
      'desviacionEstandar',
      'costoPorPedido',
      'modeloInventario',
      'intervaloRevision',
      'costoAlmacenamiento',
      'costoCompra'
    ];

    return camposRelevantes.some(campo => {
      const valorInicial = Number(initialState[campo]);
      const valorActual = Number(formData[campo]);
      
      // Manejo especial para modeloInventario que puede ser string o number
      if (campo === 'modeloInventario') {
        return Number(valorInicial) !== Number(valorActual);
      }
      
      // Para campos numéricos, comparamos los valores numéricos
      if (typeof valorInicial === 'number' && typeof valorActual === 'number') {
        return valorInicial !== valorActual;
      }
      
      return valorInicial !== valorActual;
    });
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [proveedoresData, articuloData] = await Promise.all([
          proveedorService.getAll(),
          articuloService.getById(idArticulo),
        ]);
        setProveedores(proveedoresData);
        setArticulo(articuloData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, [idArticulo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    const newErrors: FormErrors = {};
    if (!formData.id_proveedor) {
      newErrors.id_proveedor = "Debe seleccionar un proveedor";
    }
    if (formData.precioUnitario <= 0) {
      newErrors.precioUnitario = "El precio unitario debe ser mayor a 0";
    }
    if (formData.costoPorPedido <= 0) {
      newErrors.costoPorPedido = "El costo por pedido debe ser mayor a 0";
    }
    if (formData.demoraEntrega <= 0) {
      newErrors.demoraEntrega = "La demora de entrega debe ser mayor a 0";
    }
    if (formData.desviacionEstandar <= 0) {
      newErrors.desviacionEstandar = "La desviación estándar debe ser mayor a 0";
    }
    if (formData.modeloInventario === ModeloInventario.intervaloFijo) {
      if (formData.intervaloRevision <= 0) {
        newErrors.intervaloRevision = "El intervalo de revisión debe ser mayor a 0";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const dataToSubmit: ArticuloProveedorDTO = {
        id_articulo: idArticulo,
        id_proveedor: formData.id_proveedor || idProveedor || 0,
        idArticuloProveedor: articuloProveedor?.idArticuloProveedor || 0,
        precioUnitario: formData.precioUnitario,
        demoraEntrega: formData.demoraEntrega,
        desviacionEstandar: formData.desviacionEstandar,
        costoPorPedido: formData.costoPorPedido,
        costoPedido: formData.costoPedido,
        modeloInventario: formData.modeloInventario,
        intervaloRevision: formData.intervaloRevision,
        stockSeguridad: formData.stockSeguridad,
        loteOptimo: formData.loteOptimo,
        puntoPedido: 0,
        valorCGI: formData.valorCGI,
        costoAlmacenamiento: formData.costoAlmacenamiento,
        costoCompra: formData.costoCompra
      };

      if (articuloProveedor) {
        console.log('Intentando modificar con ID:', articuloProveedor.idArticuloProveedor);
        await articuloProveedorService.modificarAP(articuloProveedor.idArticuloProveedor, dataToSubmit);
      } else {
        console.log('Intentando crear nuevo artículo-proveedor');
        await articuloProveedorService.altaAP(dataToSubmit);
      }
      onSuccess();
    } catch (error) {
      console.error("Error detallado al guardar:", error);
      setErrors(prev => ({
        ...prev,
        submit: "Error al guardar. Por favor, intente nuevamente."
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === "modeloInventario"
          ? Number(value)
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!idProveedor && (
        <div>
          <label
            htmlFor="id_proveedor"
            className="block text-sm font-medium text-gray-300"
          >
            Proveedor
          </label>
          <select
            id="id_proveedor"
            name="id_proveedor"
            value={formData.id_proveedor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombreProveedor}
              </option>
            ))}
          </select>
          {errors.id_proveedor && (
            <p className="mt-1 text-sm text-red-400">{errors.id_proveedor}</p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="precioUnitario"
          className="block text-sm font-medium text-gray-300"
        >
          Precio Unitario
        </label>
        <input
          type="number"
          id="precioUnitario"
          name="precioUnitario"
          value={formData.precioUnitario}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.precioUnitario && (
          <p className="mt-1 text-sm text-red-400">{errors.precioUnitario}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="costoPorPedido"
          className="block text-sm font-medium text-gray-300"
        >
          Costo por Pedido
        </label>
        <input
          type="number"
          id="costoPorPedido"
          name="costoPorPedido"
          value={formData.costoPorPedido}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.costoPorPedido && (
          <p className="mt-1 text-sm text-red-400">{errors.costoPorPedido}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="demoraEntrega"
          className="block text-sm font-medium text-gray-300"
        >
          Demora de Entrega (días)
        </label>
        <input
          type="number"
          id="demoraEntrega"
          name="demoraEntrega"
          value={formData.demoraEntrega}
          onChange={handleChange}
          min="1"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.demoraEntrega && (
          <p className="mt-1 text-sm text-red-400">{errors.demoraEntrega}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="desviacionEstandar"
          className="block text-sm font-medium text-gray-300"
        >
          Desviación Estándar
        </label>
        <input
          type="number"
          id="desviacionEstandar"
          name="desviacionEstandar"
          value={formData.desviacionEstandar}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.desviacionEstandar && (
          <p className="mt-1 text-sm text-red-400">{errors.desviacionEstandar}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="modeloInventario"
          className="block text-sm font-medium text-gray-300"
        >
          Modelo de Inventario
        </label>
        <select
          id="modeloInventario"
          name="modeloInventario"
          value={formData.modeloInventario}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value={ModeloInventario.loteFijo}>Lote Fijo</option>
          <option value={ModeloInventario.intervaloFijo}>Intervalo Fijo</option>
        </select>
      </div>

      {formData.modeloInventario === ModeloInventario.loteFijo ? (
        <div>
          {/* Campo de Punto de Pedido eliminado - se calcula en el backend */}
        </div>
      ) : (
        <div>
          <label
            htmlFor="intervaloRevision"
            className="block text-sm font-medium text-gray-300"
          >
            Intervalo de Revisión
          </label>
          <input
            type="number"
            id="intervaloRevision"
            name="intervaloRevision"
            value={formData.intervaloRevision}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.intervaloRevision && (
            <p className="mt-1 text-sm text-red-400">{errors.intervaloRevision}</p>
          )}
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
          {articuloProveedor ? 'Guardar Cambios' : 'Crear'}
        </button>
      </div>

      {errors.submit && (
        <p className="mt-2 text-sm text-red-400">{errors.submit}</p>
      )}
    </form>
  );
};