import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Button from '../components/Button';
import Modal from '../components/Modal';
import axios from 'axios';

interface Pedido {
  id: number;
  fechaPedido: string;
  fechaEntrega: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'ENTREGADO' | 'CANCELADO';
  total: number;
  proveedor: {
    id: number;
    nombreProveedor: string;
  };
  articulos: {
    id: number;
    nombreArticulo: string;
    cantidad: number;
    precioUnitario: number;
  }[];
}

interface PedidoFormData {
  proveedorId: number;
  articulos: {
    articuloId: number;
    cantidad: number;
  }[];
}

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [proveedores, setProveedores] = useState<{ id: number; nombreProveedor: string }[]>([]);
  const [articulos, setArticulos] = useState<{ id: number; nombreArticulo: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPedidos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<Pedido[]>('http://localhost:8080/pedidos');
      setPedidos(response.data);
    } catch (err) {
      setError('Error al cargar los pedidos');
      console.error('Error fetching pedidos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await axios.get<{ id: number; nombreProveedor: string }[]>('http://localhost:8080/proveedores');
      setProveedores(response.data);
    } catch (err) {
      console.error('Error fetching proveedores:', err);
    }
  };

  const fetchArticulos = async () => {
    try {
      const response = await axios.get<{ id: number; nombreArticulo: string }[]>('http://localhost:8080/articulos');
      setArticulos(response.data);
    } catch (err) {
      console.error('Error fetching articulos:', err);
    }
  };

  useEffect(() => {
    fetchPedidos();
    fetchProveedores();
    fetchArticulos();
  }, []);

  const handleOpenModal = (pedido?: Pedido) => {
    setSelectedPedido(pedido || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPedido(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: PedidoFormData) => {
    try {
      setIsSubmitting(true);
      if (selectedPedido) {
        const response = await axios.put<Pedido>(
          `http://localhost:8080/pedidos/${selectedPedido.id}`,
          data
        );
        setPedidos(prev => prev.map(p => p.id === selectedPedido.id ? response.data : p));
      } else {
        const response = await axios.post<Pedido>('http://localhost:8080/pedidos', data);
        setPedidos(prev => [...prev, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEstadoChange = async (pedidoId: number, nuevoEstado: Pedido['estado']) => {
    try {
      const response = await axios.put<Pedido>(
        `http://localhost:8080/pedidos/${pedidoId}/estado`,
        { estado: nuevoEstado }
      );
      setPedidos(prev => prev.map(p => p.id === pedidoId ? response.data : p));
    } catch (error) {
      console.error('Error al cambiar el estado del pedido:', error);
    }
  };

  const columns = [
    { 
      header: 'Fecha Pedido', 
      accessor: 'fechaPedido' as keyof Pedido,
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      header: 'Fecha Entrega', 
      accessor: 'fechaEntrega' as keyof Pedido,
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      header: 'Estado',
      accessor: 'estado' as keyof Pedido,
      cell: (value: Pedido['estado']) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'ENTREGADO' ? 'bg-green-100 text-green-800' :
          value === 'EN_PROCESO' ? 'bg-blue-100 text-blue-800' :
          value === 'CANCELADO' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      header: 'Total', 
      accessor: 'total' as keyof Pedido,
      cell: (value: number) => `$${value.toFixed(2)}`
    },
    { 
      header: 'Proveedor', 
      accessor: 'proveedor' as keyof Pedido,
      cell: (value: Pedido['proveedor']) => value.nombreProveedor
    },
    {
      header: 'Acciones',
      accessor: 'id' as keyof Pedido,
      cell: (id: number, row: Pedido) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenModal(row)}
          >
            Editar
          </Button>
          {row.estado === 'PENDIENTE' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEstadoChange(row.id, 'EN_PROCESO')}
            >
              Procesar
            </Button>
          )}
          {row.estado === 'EN_PROCESO' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleEstadoChange(row.id, 'ENTREGADO')}
            >
              Entregar
            </Button>
          )}
          {row.estado !== 'CANCELADO' && row.estado !== 'ENTREGADO' && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleEstadoChange(row.id, 'CANCELADO')}
            >
              Cancelar
            </Button>
          )}
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
                Error al cargar los pedidos
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={fetchPedidos}
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
        title="Pedidos"
        description="Gestiona los pedidos a proveedores"
      >
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
        >
          Nuevo Pedido
        </Button>
      </PageHeader>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={pedidos}
          isLoading={isLoading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
      >
        <PedidoForm
          initialData={selectedPedido || undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          proveedores={proveedores}
          articulos={articulos}
        />
      </Modal>
    </div>
  );
};

interface PedidoFormProps {
  initialData?: Partial<Pedido>;
  onSubmit: (data: PedidoFormData) => void;
  isLoading?: boolean;
  proveedores: { id: number; nombreProveedor: string }[];
  articulos: { id: number; nombreArticulo: string }[];
}

const PedidoForm: React.FC<PedidoFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  proveedores,
  articulos
}) => {
  const [formData, setFormData] = React.useState<PedidoFormData>({
    proveedorId: initialData.proveedor?.id || 0,
    articulos: initialData.articulos?.map(a => ({
      articuloId: a.id,
      cantidad: a.cantidad
    })) || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const handleArticuloChange = (index: number, field: 'articuloId' | 'cantidad', value: number) => {
    setFormData(prev => ({
      ...prev,
      articulos: prev.articulos.map((a, i) => 
        i === index ? { ...a, [field]: value } : a
      )
    }));
  };

  const handleAddArticulo = () => {
    setFormData(prev => ({
      ...prev,
      articulos: [...prev.articulos, { articuloId: 0, cantidad: 1 }]
    }));
  };

  const handleRemoveArticulo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      articulos: prev.articulos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="proveedorId" className="block text-sm font-medium text-gray-700">
            Proveedor
          </label>
          <select
            name="proveedorId"
            id="proveedorId"
            value={formData.proveedorId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map(proveedor => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombreProveedor}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Artículos
          </label>
          {formData.articulos.map((articulo, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <select
                value={articulo.articuloId}
                onChange={(e) => handleArticuloChange(index, 'articuloId', parseInt(e.target.value))}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Seleccione un artículo</option>
                {articulos.map(art => (
                  <option key={art.id} value={art.id}>
                    {art.nombreArticulo}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={articulo.cantidad}
                onChange={(e) => handleArticuloChange(index, 'cantidad', parseInt(e.target.value))}
                min="1"
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => handleRemoveArticulo(index)}
              >
                Eliminar
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddArticulo}
            className="mt-2"
          >
            Agregar Artículo
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          Guardar
        </Button>
      </div>
    </form>
  );
};

export default PedidosPage; 