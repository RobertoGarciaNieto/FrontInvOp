import React from 'react';
import { Venta } from '../../types';
import Table from '../ui/Table';
import { formatCurrency } from '../../lib/utils';

interface VentaListProps {
  ventas: Venta[];
  onEdit: (venta: Venta) => void;
  onDelete: (venta: Venta) => void;
  onDetail?: (venta: Venta) => void;
}

const VentaList: React.FC<VentaListProps> = ({ ventas, onEdit, onDelete, onDetail }) => {
  const columns = [
    {
      header: 'ID',
      accessor: 'id'
    },
    {
      header: 'Fecha',
      accessor: 'fechaVenta',
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      header: 'Total',
      accessor: 'costoTotal',
      cell: (value: number) => formatCurrency(value)
    },
    {
      header: 'Estado',
      accessor: 'estado',
      cell: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: 'id',
      cell: (value: number) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onDetail?.(ventas.find(v => v.id === value) as Venta)}
            className="btn btn-soft btn-primary"
          >
            Detalle
          </button>
          <button
            onClick={() => onEdit(ventas.find(v => v.id === value) as Venta)}
            className="btn btn-soft btn-info"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(ventas.find(v => v.id === value) as Venta)}
            className="btn btn-soft btn-error"
          >
            Eliminar
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Ventas ({ventas.length})</h2>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <Table
          columns={columns}
          data={ventas}
          keyExtractor={(row) => row.id.toString()}
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

export default VentaList;
