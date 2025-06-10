// src/pages/ProveedoresPage.tsx

import React, { useState } from 'react';
import useProveedores from '../hooks/useProveedores'; // Ajusta la ruta si es necesario
import useArticulos from '../hooks/useArticulo'; // Importamos el hook de artículos
import { Proveedor, ProveedorDTO, ArticuloProveedorDTO, ModeloInventario } from '../types'; // Importamos las interfaces necesarias
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Button from '../components/Button';
import Modal from '../components/Modal';
import axios from 'axios';

const ProveedoresPage: React.FC = () => {
  const {
    proveedores,
    loading,
    error,
    addProveedor,
    updateProveedorData,
    deleteProveedorData,
    refetchProveedores,
  } = useProveedores();

  const { articulos, loading: loadingArticulos, error: errorArticulos } = useArticulos(); // Obtenemos los artículos

  const [newProveedor, setNewProveedor] = useState<ProveedorDTO>({
    nombreProveedor: '',
    cuit: '',
    articulosAsociados: [], // Inicializamos la lista de artículos asociados
  });
  const [editingProveedorId, setEditingProveedorId] = useState<number | null>(null);

  // Estados para manejar la selección y costos de artículos para el nuevo/editar proveedor
  const [selectedArticleIds, setSelectedArticleIds] = useState<number[]>([]);
  const [articleCosts, setArticleCosts] = useState<{ [key: number]: number }>({}); // Guarda el costoCompra para cada artículo seleccionado

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState<Proveedor | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProveedor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArticleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
    setSelectedArticleIds(selectedOptions);

    // Inicializar costos para los artículos recién seleccionados si no tienen uno
    const newArticleCosts = { ...articleCosts };
    selectedOptions.forEach(id => {
      if (!(id in newArticleCosts)) {
        newArticleCosts[id] = 0; // O un valor por defecto si lo prefieres
      }
    });
    setArticleCosts(newArticleCosts);
  };

  const handleArticleCostChange = (articleId: number, cost: number) => {
    setArticleCosts((prev) => ({
      ...prev,
      [articleId]: cost,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construir los DTOs de ArticuloProveedor para la asociación
    const articulosAsociadosDTO: ArticuloProveedorDTO[] = selectedArticleIds.map(articuloId => ({
      id_articulo: articuloId,
      // id_proveedor no se necesita aquí, el backend lo asignará al crear la relación
      costoCompra: articleCosts[articuloId] || 0,
      // Los siguientes campos se establecen con valores por defecto o 0
      costoPorPedido: 0,
      costoPedido: 0,
      demoraEntrega: 0,
      desviacionEstandar: 0,
      cantidadPedido: 0,
      precioUnitario: 0, // Podría ser igual a costoCompra o 0
      puntoPedido: 0,
      stockSeguridad: 0,
      CGI: 0,
      intervaloRevision: 0,
      costoAlmacenamiento: 0,
      loteOptimo: 0,
      valorCGI: 0,
      inventarioMaximo: 0,
      modeloInventario: ModeloInventario.LOTE_FIJO, // Valor predeterminado
    }));

    const proveedorDataToSend: ProveedorDTO = {
      ...newProveedor,
      articulosAsociados: articulosAsociadosDTO.length > 0 ? articulosAsociadosDTO : undefined, // Envía solo si hay asociaciones
    };

    const added = await addProveedor(proveedorDataToSend);
    if (added) {
      setNewProveedor({
        nombreProveedor: '',
        cuit: '',
        articulosAsociados: [],
      });
      setSelectedArticleIds([]);
      setArticleCosts({});
    }
  };

  const handleEditClick = (proveedor: Proveedor) => {
    setEditingProveedorId(proveedor.id);
    setNewProveedor({
      nombreProveedor: proveedor.nombreProveedor,
      cuit: proveedor.cuit,
      // Nota: Al editar, no se cargan los articulosAsociados directamente en el formulario de edición
      // porque es una estructura más compleja. Para editarlos, el usuario debería ir a
      // la página de ArticuloProveedor.
      articulosAsociados: [], // Siempre vacío para edición en este formulario simplificado
    });
    setSelectedArticleIds([]);
    setArticleCosts({});
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProveedorId !== null) {
        // En la actualización del proveedor, no se envían los articulosAsociados desde este formulario.
        // Las asociaciones existentes deben ser gestionadas en ArticuloProveedorPage.
      const updated = await updateProveedorData(editingProveedorId, {
        nombreProveedor: newProveedor.nombreProveedor,
        cuit: newProveedor.cuit,
      });
      if (updated) {
        setEditingProveedorId(null);
        setNewProveedor({
          nombreProveedor: '',
          cuit: '',
          articulosAsociados: [],
        });
      }
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres dar de baja lógicamente este proveedor?')) {
      await deleteProveedorData(id);
    }
  };

  const handleOpenModal = (proveedor?: Proveedor) => {
    setSelectedProveedor(proveedor || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProveedor(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: ProveedorDTO) => {
    try {
      setIsSubmitting(true);
      if (selectedProveedor) {
        const response = await axios.put<Proveedor>(
          `http://localhost:8080/proveedores/${selectedProveedor.id}`,
          data
        );
        const updatedProveedores = proveedores.map(p => p.id === selectedProveedor.id ? response.data : p);
        setProveedores(updatedProveedores);
      } else {
        const response = await axios.post<Proveedor>('http://localhost:8080/proveedores', data);
        setProveedores(prev => [...prev, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el proveedor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClickModal = (proveedor: Proveedor) => {
    setProveedorToDelete(proveedor);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (proveedorToDelete) {
      try {
        const response = await axios.put<Proveedor>(
          `http://localhost:8080/proveedores/${proveedorToDelete.id}/estado`,
          { estado: !proveedorToDelete.estado }
        );
        const updatedProveedores = proveedores.map(p => p.id === proveedorToDelete.id ? response.data : p);
        setProveedores(updatedProveedores);
        setIsDeleteModalOpen(false);
        setProveedorToDelete(null);
      } catch (error) {
        console.error('Error al cambiar el estado del proveedor:', error);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProveedorToDelete(null);
  };

  const columns = [
    { header: 'Nombre', accessor: 'nombreProveedor' as keyof Proveedor },
    { header: 'CUIT', accessor: 'cuit' as keyof Proveedor },
    {
      header: 'Estado',
      accessor: 'estado' as keyof Proveedor,
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
      accessor: 'id' as keyof Proveedor,
      cell: (id: number, row: Proveedor) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenModal(row)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteClickModal(row)}
          >
            {row.estado ? 'Dar de Baja' : 'Dar de Alta'}
          </Button>
        </div>
      )
    }
  ];

  if (loading || loadingArticulos) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando proveedores y artículos...</div>;
  }

  if (error || errorArticulos) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <h2>Error al cargar datos:</h2>
        <p>{error || errorArticulos}</p>
        <button onClick={refetchProveedores} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PageHeader
        title="Proveedores"
        description="Gestiona los proveedores del sistema"
      >
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
        >
          Nuevo Proveedor
        </Button>
      </PageHeader>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={proveedores}
          isLoading={loading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      >
        <ProveedorForm
          initialData={selectedProveedor || undefined}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title={proveedorToDelete?.estado ? 'Dar de Baja Proveedor' : 'Dar de Alta Proveedor'}
      >
        <div className="p-4">
          <p className="text-gray-700 mb-4">
            ¿Está seguro que desea {proveedorToDelete?.estado ? 'dar de baja' : 'dar de alta'} al proveedor "{proveedorToDelete?.nombreProveedor}"?
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={handleCancelDelete}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

interface ProveedorFormProps {
  initialData?: Partial<ProveedorDTO>;
  onSubmit: (data: ProveedorDTO) => void;
  isLoading?: boolean;
}

const ProveedorForm: React.FC<ProveedorFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = React.useState<ProveedorDTO>({
    nombreProveedor: '',
    cuit: '',
    articulosAsociados: [],
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
          <label htmlFor="nombreProveedor" className="block text-sm font-medium text-gray-700">
            Nombre del Proveedor
          </label>
          <input
            type="text"
            name="nombreProveedor"
            id="nombreProveedor"
            value={formData.nombreProveedor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="cuit" className="block text-sm font-medium text-gray-700">
            CUIT
          </label>
          <input
            type="text"
            name="cuit"
            id="cuit"
            value={formData.cuit}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
            pattern="[0-9]{2}-[0-9]{8}-[0-9]"
            placeholder="XX-XXXXXXXX-X"
          />
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

export default ProveedoresPage;