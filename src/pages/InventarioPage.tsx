import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Button from '../components/Button';
import Modal from '../components/Modal';
import axios from 'axios';

interface ArticuloInventario {
  id: number;
  nombreArticulo: string;
  descripcionArticulo: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  puntoPedido: number;
  demandaArticulo: number;
  costoAlmacenamiento: number;
  precioVenta: number;
  proveedor: {
    id: number;
    nombreProveedor: string;
  };
  estado: boolean;
}

interface AjusteStock {
  articuloId: number;
  cantidad: number;
  tipo: 'ENTRADA' | 'SALIDA';
  motivo: string;
}

const InventarioPage: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloInventario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState<ArticuloInventario | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchArticulos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<ArticuloInventario[]>('http://localhost:8080/articulos/inventario');
      setArticulos(response.data);
    } catch (err) {
      setError('Error al cargar el inventario');
      console.error('Error fetching inventario:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  const handleOpenModal = (articulo: ArticuloInventario) => {
    setSelectedArticulo(articulo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedArticulo(null);
    setIsModalOpen(false);
  };

  const handleAjusteStock = async (data: AjusteStock) => {
    try {
      setIsSubmitting(true);
      await axios.post('http://localhost:8080/articulos/ajuste-stock', data);
      await fetchArticulos(); // Recargar el inventario
      handleCloseModal();
    } catch (error) {
      console.error('Error al ajustar el stock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { 
      header: 'Artículo', 
      accessor: 'nombreArticulo' as keyof ArticuloInventario 
    },
    { 
      header: 'Stock Actual', 
      accessor: 'stockActual' as keyof ArticuloInventario,
      cell: (value: number, row: ArticuloInventario) => (
        <span className={`font-medium ${
          value <= row.stockMinimo ? 'text-red-600' :
          value >= row.stockMaximo ? 'text-green-600' :
          'text-gray-900'
        }`}>
          {value}
        </span>
      )
    },
    { 
      header: 'Stock Mínimo', 
      accessor: 'stockMinimo' as keyof ArticuloInventario 
    },
    { 
      header: 'Stock Máximo', 
      accessor: 'stockMaximo' as keyof ArticuloInventario 
    },
    { 
      header: 'Punto de Pedido', 
      accessor: 'puntoPedido' as keyof ArticuloInventario 
    },
    { 
      header: 'Demanda', 
      accessor: 'demandaArticulo' as keyof ArticuloInventario 
    },
    { 
      header: 'Proveedor', 
      accessor: 'proveedor' as keyof ArticuloInventario,
      cell: (value: ArticuloInventario['proveedor']) => value.nombreProveedor
    },
    {
      header: 'Estado',
      accessor: 'estado' as keyof ArticuloInventario,
      cell: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: 'id' as keyof ArticuloInventario,
      cell: (id: number, row: ArticuloInventario) => (
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenModal(row)}
          >
            Ajustar Stock
          </Button>
        </div>
      )
    }
  ];

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar el inventario
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={fetchArticulos}
                >
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PageHeader
        title="Inventario"
        description="Gestiona el inventario de artículos"
      />

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={articulos}
          isLoading={isLoading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Ajustar Stock - ${selectedArticulo?.nombreArticulo}`}
      >
        <AjusteStockForm
          articulo={selectedArticulo}
          onSubmit={handleAjusteStock}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

interface AjusteStockFormProps {
  articulo: ArticuloInventario | null;
  onSubmit: (data: AjusteStock) => void;
  isLoading?: boolean;
}

const AjusteStockForm: React.FC<AjusteStockFormProps> = ({
  articulo,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = React.useState<AjusteStock>({
    articuloId: articulo?.id || 0,
    cantidad: 0,
    tipo: 'ENTRADA',
    motivo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!articulo) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock Actual
          </label>
          <p className="mt-1 text-sm text-gray-900">{articulo.stockActual}</p>
        </div>

        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
            Tipo de Ajuste
          </label>
          <select
            name="tipo"
            id="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="ENTRADA">Entrada</option>
            <option value="SALIDA">Salida</option>
          </select>
        </div>

        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            name="cantidad"
            id="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">
            Motivo
          </label>
          <textarea
            name="motivo"
            id="motivo"
            value={formData.motivo}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          Guardar Ajuste
        </Button>
      </div>
    </form>
  );
};

export default InventarioPage; 