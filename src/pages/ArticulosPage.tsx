// src/pages/ArticulosPage.tsx

import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { DataTable } from '../components/DataTable';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/modal';
import { useArticulos, Articulo, ArticuloFormData } from '../hooks/useArticulos';
import ArticuloForm from '../components/ArticuloForm';

const ArticulosPage: React.FC = () => {
  const { articulos, isLoading, error, createArticulo, updateArticulo, deleteArticulo, fetchArticulos } = useArticulos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState<ArticuloFormData | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchArticulos();
  }, [fetchArticulos]);

  const handleOpenModal = (articulo?: Articulo) => {
    if (articulo) {
      setSelectedArticulo({
        nombreArticulo: articulo.nombreArticulo,
        descripcionArticulo: articulo.descripcionArticulo,
        precioVentaArt: articulo.precioVentaArt,
        costoAlmacenamientoUnidad: articulo.costoAlmacenamientoUnidad,
        stockActual: articulo.stockActual,
        demandaArticulo: articulo.demandaArticulo,
        proveedorId: articulo.proveedor?.id || 0
      });
    } else {
      setSelectedArticulo(undefined);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedArticulo(undefined);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: ArticuloFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedArticulo) {
        const articuloId = articulos.find(a => 
          a.nombreArticulo === selectedArticulo.nombreArticulo &&
          a.proveedor?.id === selectedArticulo.proveedorId
        )?.id;
        if (articuloId) {
          await updateArticulo(articuloId, data);
        }
      } else {
        await createArticulo(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el artículo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este artículo?')) {
      try {
        await deleteArticulo(id);
      } catch (error) {
        console.error('Error al eliminar el artículo:', error);
      }
    }
  };

  const columns = [
    { header: 'Nombre', accessorKey: 'nombreArticulo' },
    { header: 'Descripción', accessorKey: 'descripcionArticulo' },
    { header: 'Precio', accessorKey: 'precioVentaArt' },
    { header: 'Stock', accessorKey: 'stockActual' },
    { header: 'Proveedor', accessorKey: 'proveedor.nombreProveedor' },
    { header: 'Estado', accessorKey: 'estado' },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      cell: ({ row }: { row: { original: Articulo } }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenModal(row.original)}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={fetchArticulos}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PageHeader
        title="Artículos"
        description="Gestiona el inventario de artículos"
      >
        <Button onClick={() => handleOpenModal()}>Nuevo Artículo</Button>
      </PageHeader>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={articulos}
          isLoading={isLoading}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedArticulo ? 'Editar Artículo' : 'Nuevo Artículo'}
            </DialogTitle>
          </DialogHeader>
          <ArticuloForm
            initialData={selectedArticulo}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArticulosPage;