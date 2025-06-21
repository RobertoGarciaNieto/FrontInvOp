import React, { useEffect, useState } from 'react';
import { ArticuloProveedorDTO, ProveedorDTO } from '../../types';
import Table from '../ui/Table';
import { formatCurrency } from '../../lib/utils';
import { ArticuloDTO } from '../../types';
import { proveedorService } from '@/services/proveedorService';
import { articuloProveedorService } from '@/services/articuloProveedorService';

interface ArticuloListProps {
  articulos: ArticuloDTO[];
  onVerMas: (articulo: ArticuloDTO) => void;
  onAsignarProveedor: (articulo: ArticuloDTO) => void;
}

export const ArticuloList: React.FC<ArticuloListProps> = ({
  articulos,
  onVerMas,
  onAsignarProveedor
}) => {
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [articulosProveedor, setArticulosProveedor] = useState<ArticuloProveedorDTO[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const ArtProvData = await articuloProveedorService.getAll();
        const proveedoresData = await proveedorService.getAll();
        setArticulosProveedor(ArtProvData);
        setProveedores(proveedoresData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    loadData();
  }, []);

  const getProveedorPredeterminado = (articuloId: number) => {
    const articulo = articulos.find(a => a.idArticulo === articuloId);
    if (!articulo?.idProveedorPredeterminado) return 'Sin proveedor';
    
    const proveedor = proveedores.find(p => p.id === articulo.idProveedorPredeterminado);
    return proveedor?.nombreProveedor || 'Sin proveedor';
  };
  

  const columns = [
    {
      header: 'Nombre',
      accessor: 'nombreArticulo'
    },
    {
      header: 'Descripción',
      accessor: 'descripcionArticulo'
    },
    {
      header: 'Precio de Venta',
      accessor: 'precioVentaArt',
      cell: (value: number) => formatCurrency(value)
    },
    {
      header: 'Stock Actual',
      accessor: 'stockActual',
      cell: (value: number) => (
        <span className={value <= 0 ? 'text-red-500' : 'text-green-500'}>
          {value}
        </span>
      )
    },
    {
      header: 'Demanda',
      accessor: 'demandaArticulo'
    },
    {
      header: 'Proveedor Predeterminado',
      accessor: 'idArticulo',
      cell: (value: number) => getProveedorPredeterminado(value)
    },
    {
      header: 'Acciones',
      accessor: 'idArticulo',
      cell: (value: number) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onVerMas(articulos.find(a => a.idArticulo === value) as ArticuloDTO)}
            className="btn btn-soft btn-info"
          >
            Ver más
          </button>
          <button
            onClick={() => onAsignarProveedor(articulos.find(a => a.idArticulo === value) as ArticuloDTO)}
            className="btn btn-soft"
          >
            Asignar Prov. Predeterminado
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Artículos ({articulos.length})</h2>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <Table
          columns={columns}
          data={articulos}
          keyExtractor={(row) => row.idArticulo.toString()}
          tableClassName="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg"
          theadClassName="bg-gray-800"
          thClassName="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
          trClassName="bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
          tdClassName="px-6 py-4 whitespace-nowrap text-sm text-gray-200 border-b border-gray-700"
        />
      </div>
    </div>
  );
}; 