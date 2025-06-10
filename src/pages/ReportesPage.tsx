import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Estadisticas {
  totalArticulos: number;
  articulosBajoStock: number;
  articulosSobreStock: number;
  totalProveedores: number;
  proveedoresActivos: number;
  totalPedidos: number;
  pedidosPendientes: number;
  pedidosEntregados: number;
  pedidosCancelados: number;
  valorTotalInventario: number;
  demandaPorArticulo: {
    nombreArticulo: string;
    demanda: number;
  }[];
  stockPorArticulo: {
    nombreArticulo: string;
    stockActual: number;
    stockMinimo: number;
  }[];
  pedidosPorProveedor: {
    nombreProveedor: string;
    cantidadPedidos: number;
  }[];
}

const ReportesPage: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<Estadisticas>('http://localhost:8080/reportes/estadisticas');
      setEstadisticas(response.data);
    } catch (err) {
      setError('Error al cargar las estadísticas');
      console.error('Error fetching estadisticas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, []);

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
                Error al cargar las estadísticas
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={fetchEstadisticas}
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !estadisticas) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const demandaChartData = {
    labels: estadisticas.demandaPorArticulo.map(item => item.nombreArticulo),
    datasets: [
      {
        label: 'Demanda por Artículo',
        data: estadisticas.demandaPorArticulo.map(item => item.demanda),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const stockChartData = {
    labels: estadisticas.stockPorArticulo.map(item => item.nombreArticulo),
    datasets: [
      {
        label: 'Stock Actual',
        data: estadisticas.stockPorArticulo.map(item => item.stockActual),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Stock Mínimo',
        data: estadisticas.stockPorArticulo.map(item => item.stockMinimo),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const pedidosChartData = {
    labels: estadisticas.pedidosPorProveedor.map(item => item.nombreProveedor),
    datasets: [
      {
        label: 'Pedidos por Proveedor',
        data: estadisticas.pedidosPorProveedor.map(item => item.cantidadPedidos),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  return (
    <div className="p-4">
      <PageHeader
        title="Reportes"
        description="Estadísticas y análisis del sistema"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900">Artículos</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold text-blue-600">{estadisticas.totalArticulos}</p>
            <p className="text-sm text-gray-500">
              {estadisticas.articulosBajoStock} bajo stock mínimo
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900">Proveedores</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold text-green-600">{estadisticas.totalProveedores}</p>
            <p className="text-sm text-gray-500">
              {estadisticas.proveedoresActivos} activos
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900">Pedidos</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold text-purple-600">{estadisticas.totalPedidos}</p>
            <p className="text-sm text-gray-500">
              {estadisticas.pedidosPendientes} pendientes
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900">Valor Total</h3>
          <div className="mt-2">
            <p className="text-3xl font-bold text-yellow-600">
              ${estadisticas.valorTotalInventario.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Valor del inventario
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Demanda por Artículo</h3>
          <div className="h-80">
            <Bar data={demandaChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Stock por Artículo</h3>
          <div className="h-80">
            <Line data={stockChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pedidos por Proveedor</h3>
          <div className="h-80">
            <Pie data={pedidosChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right' as const,
                },
              },
            }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Pedidos</h3>
          <div className="h-80">
            <Pie data={{
              labels: ['Pendientes', 'Entregados', 'Cancelados'],
              datasets: [{
                data: [
                  estadisticas.pedidosPendientes,
                  estadisticas.pedidosEntregados,
                  estadisticas.pedidosCancelados
                ],
                backgroundColor: [
                  'rgba(255, 206, 86, 0.5)',
                  'rgba(75, 192, 192, 0.5)',
                  'rgba(255, 99, 132, 0.5)',
                ],
              }],
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right' as const,
                },
              },
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesPage; 