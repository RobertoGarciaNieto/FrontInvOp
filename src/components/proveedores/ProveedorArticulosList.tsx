import { useState, useEffect } from 'react';
import { ProveedorDTO, ArticuloProveedorDTO, ModeloInventario, ArticuloDTO, ListadoArtProvDTO } from '../../types';
import { articuloProveedorService } from '../../services/articuloProveedorService';
import { articuloService } from '../../services/articuloService';
import { ArticuloProveedorForm } from '../articulos/ArticuloProveedorForm';
import { Edit2 } from 'lucide-react';

interface ProveedorArticulosListProps {
  proveedor: ProveedorDTO;
  onSuccess: () => void;
}

export const ProveedorArticulosList: React.FC<ProveedorArticulosListProps> = ({
  proveedor,
  onSuccess
}) => {
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [articulosProveedor, setArticulosProveedor] = useState<ArticuloProveedorDTO[]>([]);
  const [listadoArticulos, setListadoArticulos] = useState<ListadoArtProvDTO[]>([]);
  const [selectedArticulo, setSelectedArticulo] = useState<ArticuloDTO | null>(null);
  const [selectedArticuloProveedor, setSelectedArticuloProveedor] = useState<ArticuloProveedorDTO | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [proveedor.id]);

  const cargarDatos = async () => {
    try {
      // Cargar el listado básico de artículos
      const listadoData = await articuloProveedorService.listadoArticulosPorProveedor(proveedor.id);
      setListadoArticulos(listadoData);

      // Cargar todos los artículos para tener la información completa
      const [articulosData, articulosProveedorData] = await Promise.all([
        articuloService.getAll(),
        articuloProveedorService.getAll()
      ]);
      
      setArticulos(articulosData);
      setArticulosProveedor(articulosProveedorData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleAddArticulo = (articulo: ArticuloDTO) => {
    setSelectedArticulo(articulo);
    setSelectedArticuloProveedor(null);
    setShowForm(true);
  };

  const handleEditArticulo = (articulo: ArticuloDTO, articuloProveedor: ArticuloProveedorDTO) => {
    setSelectedArticulo(articulo);
    setSelectedArticuloProveedor(articuloProveedor);
    setShowForm(true);
  };

  const handleFormSuccess = async () => {
    await cargarDatos();
    setShowForm(false);
    setSelectedArticulo(null);
    setSelectedArticuloProveedor(null);
    onSuccess();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedArticulo(null);
    setSelectedArticuloProveedor(null);
  };

  // Función para obtener los datos completos de ArticuloProveedor para un artículo
  const getArticuloProveedorData = (nombreArticulo: string): ArticuloProveedorDTO | undefined => {
    const articulo = articulos.find(a => a.nombreArticulo === nombreArticulo);
    if (!articulo) return undefined;
    
    return articulosProveedor.find(ap => 
      ap.id_articulo === articulo.idArticulo && 
      ap.id_proveedor === proveedor.id
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Artículos del Proveedor</h3>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Agregar Artículo
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">
              {selectedArticulo ? 'Editar Artículo' : 'Seleccionar Artículo'}
            </h2>
            {!selectedArticulo ? (
              <div className="space-y-4">
                <select
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => {
                    const articulo = articulos.find(a => a.idArticulo === Number(e.target.value));
                    if (articulo) handleAddArticulo(articulo);
                  }}
                >
                  <option value="">Seleccione un artículo</option>
                  {articulos.map(articulo => (
                    <option key={articulo.idArticulo} value={articulo.idArticulo}>
                      {articulo.nombreArticulo}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleFormCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <ArticuloProveedorForm
                idArticulo={selectedArticulo.idArticulo}
                idProveedor={proveedor.id}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
                articuloProveedor={selectedArticuloProveedor}
              />
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Artículo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Modelo de Inventario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Precio Unitario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Demora de Entrega
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Stock de Seguridad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Lote Óptimo / Intervalo de Revisión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Punto Pedido / Inventario Máximo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Costo por Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {listadoArticulos.map((listadoArt) => {
              const articuloProveedor = getArticuloProveedorData(listadoArt.nombreArticulo);
              return (
                <tr key={`${listadoArt.nombreArticulo}-${proveedor.id}`} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {listadoArt.nombreArticulo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {articuloProveedor?.modeloInventario === "loteFijo" || articuloProveedor?.modeloInventario === ModeloInventario.loteFijo
                      ? 'Lote Fijo' 
                      : articuloProveedor?.modeloInventario === "intervaloFijo" || articuloProveedor?.modeloInventario === ModeloInventario.intervaloFijo
                        ? 'Intervalo Fijo'
                        : 'No definido'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${articuloProveedor?.precioUnitario?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {articuloProveedor?.demoraEntrega || 0} días
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {articuloProveedor?.stockSeguridad || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {articuloProveedor?.modeloInventario === "loteFijo" || articuloProveedor?.modeloInventario === ModeloInventario.loteFijo
                      ? articuloProveedor?.loteOptimo || 0
                      : articuloProveedor?.intervaloRevision || 0} {articuloProveedor?.modeloInventario === "loteFijo" || articuloProveedor?.modeloInventario === ModeloInventario.loteFijo ? '' : 'días'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {articuloProveedor?.modeloInventario === "loteFijo" || articuloProveedor?.modeloInventario === ModeloInventario.loteFijo
                      ? articuloProveedor?.puntoPedido || 0
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {articuloProveedor?.modeloInventario === "loteFijo" || articuloProveedor?.modeloInventario === ModeloInventario.loteFijo
                      ? `$${articuloProveedor?.costoPorPedido?.toFixed(2) || '0.00'}`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() => {
                        const articulo = articulos.find(a => a.nombreArticulo === listadoArt.nombreArticulo);
                        if (articulo && articuloProveedor) {
                          handleEditArticulo(articulo, articuloProveedor);
                        }
                      }}
                      className="text-blue-400 hover:text-blue-300 focus:outline-none focus:underline"
                      title="Modificar atributos"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
