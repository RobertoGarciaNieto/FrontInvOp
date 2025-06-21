import React, { useState, useEffect } from 'react';
import { ArticuloFaltanteDTO } from '../../types';
import { articuloService } from '../../services/articuloService';
import { useNavigate } from 'react-router-dom';

const ArticuloFaltanteList: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloFaltanteDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadArticulos = async () => {
    try {
      console.log('Iniciando carga de artículos faltantes...');
      setLoading(true);
      const data = await articuloService.getArticulosFaltantes();
      console.log('Datos recibidos:', data);
      setArticulos(data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
      setError('Error al cargar artículos faltantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticulos();
  }, []);

  const handleGenerarOrden = (articulo: ArticuloFaltanteDTO) => {
    navigate('/ordenes-compra/nueva', { 
      state: { 
        articuloId: articulo.id,
        proveedorId: articulo.idProveedorPredeterminado
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock Actual</th>
            <th>Stock Seguridad</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo) => (
            <tr key={articulo.id}>
              <td>{articulo.nombreArticulo}</td>
              <td>
                <span className={`badge ${articulo.stockActual < articulo.stockSeguridad ? 'badge-error' : 'badge-warning'}`}>
                  {articulo.stockActual}
                </span>
              </td>
              <td>{articulo.stockSeguridad}</td>
              <td>{articulo.nombreProveedor}</td>
              <td>
                <button
                  onClick={() => handleGenerarOrden(articulo)}
                  className="btn btn-primary btn-sm"
                >
                  Generar Orden
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticuloFaltanteList; 