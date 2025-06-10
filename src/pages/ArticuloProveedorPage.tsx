// src/pages/ArticuloProveedorPage.tsx

import React, { useState } from 'react';
import useArticuloProveedores from '../hooks/useArticuloProveedores'; // Ajusta la ruta
import useArticulos from '../hooks/useArticulo'; // Para seleccionar artículos
import useProveedores from '../hooks/useProveedores'; // Para seleccionar proveedores
import { ArticuloProveedor, ArticuloProveedorDTO, ModeloInventario } from '../types'; // Importa el DTO y el Enum

const ArticuloProveedorPage: React.FC = () => {
  const {
    articuloProveedores,
    loading,
    error,
    addArticuloProveedor,
    updateArticuloProveedorData,
    deleteArticuloProveedorData,
    refetchArticuloProveedores,
  } = useArticuloProveedores();

  const { articulos, loading: loadingArticulos, error: errorArticulos } = useArticulos();
  const { proveedores, loading: loadingProveedores, error: errorProveedores } = useProveedores();

  const [newRelacion, setNewRelacion] = useState<ArticuloProveedorDTO>({
    costoCompra: 0,
    costoPorPedido: 0,
    costoPedido: 0,
    demoraEntrega: 0,
    desviacionEstandar: 0,
    cantidadPedido: 0,
    precioUnitario: 0,
    puntoPedido: 0,
    stockSeguridad: 0,
    CGI: 0,
    intervaloRevision: 0,
    costoAlmacenamiento: 0,
    loteOptimo: 0,
    valorCGI: 0,
    inventarioMaximo: 0,
    modeloInventario: ModeloInventario.LOTE_FIJO, // Valor predeterminado
    idProveedor: 0,
    idArticulo: 0,
  });
  const [editingRelacionId, setEditingRelacionId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewRelacion((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRelacion.idArticulo && newRelacion.idProveedor) {
      const addedRelacion = await addArticuloProveedor(newRelacion);
      if (addedRelacion) {
        setNewRelacion({
          costoCompra: 0, costoPorPedido: 0, costoPedido: 0, demoraEntrega: 0,
          desviacionEstandar: 0, cantidadPedido: 0, precioUnitario: 0, puntoPedido: 0,
          stockSeguridad: 0, CGI: 0, intervaloRevision: 0, costoAlmacenamiento: 0,
          loteOptimo: 0, valorCGI: 0, inventarioMaximo: 0,
          modeloInventario: ModeloInventario.LOTE_FIJO,
          idProveedor: 0, idArticulo: 0,
        });
      }
    } else {
      alert('Por favor, selecciona un artículo y un proveedor.');
    }
  };

  const handleEditClick = (relacion: ArticuloProveedor) => {
    setEditingRelacionId(relacion.id);
    setNewRelacion({
      costoCompra: relacion.costoCompra,
      costoPorPedido: relacion.costoPorPedido,
      costoPedido: relacion.costoPedido,
      demoraEntrega: relacion.demoraEntrega,
      desviacionEstandar: relacion.desviacionEstandar,
      cantidadPedido: relacion.cantidadPedido,
      precioUnitario: relacion.precioUnitario,
      puntoPedido: relacion.puntoPedido,
      stockSeguridad: relacion.stockSeguridad,
      CGI: relacion.CGI,
      intervaloRevision: relacion.intervaloRevision,
      costoAlmacenamiento: relacion.costoAlmacenamiento,
      loteOptimo: relacion.loteOptimo,
      valorCGI: relacion.valorCGI,
      inventarioMaximo: relacion.inventarioMaximo,
      modeloInventario: relacion.modeloInventario,
      idProveedor: relacion.proveedor?.id || 0,
      idArticulo: relacion.articulo?.id || 0,
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRelacionId !== null && newRelacion.idArticulo && newRelacion.idProveedor) {
      const updated = await updateArticuloProveedorData(editingRelacionId, newRelacion);
      if (updated) {
        setEditingRelacionId(null);
        setNewRelacion({
          costoCompra: 0, costoPorPedido: 0, costoPedido: 0, demoraEntrega: 0,
          desviacionEstandar: 0, cantidadPedido: 0, precioUnitario: 0, puntoPedido: 0,
          stockSeguridad: 0, CGI: 0, intervaloRevision: 0, costoAlmacenamiento: 0,
          loteOptimo: 0, valorCGI: 0, inventarioMaximo: 0,
          modeloInventario: ModeloInventario.LOTE_FIJO,
          idProveedor: 0, idArticulo: 0,
        });
      }
    } else {
      alert('Por favor, selecciona un artículo y un proveedor.');
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta relación Artículo-Proveedor?')) {
      await deleteArticuloProveedorData(id);
    }
  };

  if (loading || loadingArticulos || loadingProveedores) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando relaciones Artículo-Proveedor...</div>;
  }

  if (error || errorArticulos || errorProveedores) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <h2>Error al cargar datos:</h2>
        <p>{error || errorArticulos || errorProveedores}</p>
        <button onClick={refetchArticuloProveedores} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Gestión de Relaciones Artículo-Proveedor</h1>

      {/* Formulario para Agregar/Editar Relación */}
      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>{editingRelacionId ? 'Editar Relación' : 'Crear Nueva Relación'}</h2>
        <form onSubmit={editingRelacionId ? handleUpdateSubmit : handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <label>
            Artículo:
            <select name="idArticulo" value={newRelacion.idArticulo || ''} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }}>
              <option value="">Seleccione un artículo</option>
              {articulos.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.nombreArticulo}
                </option>
              ))}
            </select>
          </label>
          <label>
            Proveedor:
            <select name="idProveedor" value={newRelacion.idProveedor || ''} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }}>
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombreProveedor}
                </option>
              ))}
            </select>
          </label>
          <label>
            Costo Compra:
            <input type="number" name="costoCompra" value={newRelacion.costoCompra || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Costo Por Pedido:
            <input type="number" name="costoPorPedido" value={newRelacion.costoPorPedido || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Costo Pedido:
            <input type="number" name="costoPedido" value={newRelacion.costoPedido || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Demora Entrega:
            <input type="number" name="demoraEntrega" value={newRelacion.demoraEntrega || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Desviación Estándar:
            <input type="number" name="desviacionEstandar" value={newRelacion.desviacionEstandar || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Cantidad Pedido:
            <input type="number" name="cantidadPedido" value={newRelacion.cantidadPedido || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Precio Unitario:
            <input type="number" name="precioUnitario" value={newRelacion.precioUnitario || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Punto Pedido:
            <input type="number" name="puntoPedido" value={newRelacion.puntoPedido || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Stock Seguridad:
            <input type="number" name="stockSeguridad" value={newRelacion.stockSeguridad || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            CGI:
            <input type="number" name="CGI" value={newRelacion.CGI || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Intervalo Revisión:
            <input type="number" name="intervaloRevision" value={newRelacion.intervaloRevision || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Costo Almacenamiento:
            <input type="number" name="costoAlmacenamiento" value={newRelacion.costoAlmacenamiento || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Lote Óptimo:
            <input type="number" name="loteOptimo" value={newRelacion.loteOptimo || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Valor CGI:
            <input type="number" name="valorCGI" value={newRelacion.valorCGI || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Inventario Máximo:
            <input type="number" name="inventarioMaximo" value={newRelacion.inventarioMaximo || 0} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Modelo Inventario:
            <select name="modeloInventario" value={newRelacion.modeloInventario || ''} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }}>
              {Object.values(ModeloInventario).map((modelo) => (
                <option key={modelo} value={modelo}>{modelo}</option>
              ))}
            </select>
          </label>

          <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {editingRelacionId ? 'Actualizar Relación' : 'Crear Relación'}
          </button>
          {editingRelacionId && (
            <button type="button" onClick={() => {
              setEditingRelacionId(null);
              setNewRelacion({
                costoCompra: 0, costoPorPedido: 0, costoPedido: 0, demoraEntrega: 0,
                desviacionEstandar: 0, cantidadPedido: 0, precioUnitario: 0, puntoPedido: 0,
                stockSeguridad: 0, CGI: 0, intervaloRevision: 0, costoAlmacenamiento: 0,
                loteOptimo: 0, valorCGI: 0, inventarioMaximo: 0,
                modeloInventario: ModeloInventario.LOTE_FIJO,
                idProveedor: 0, idArticulo: 0,
              });
            }} style={{ gridColumn: 'span 2', padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
              Cancelar Edición
            </button>
          )}
        </form>
      </div>

      {/* Lista de Relaciones Artículo-Proveedor */}
      <div style={{ marginTop: '30px' }}>
        <h2>Relaciones Artículo-Proveedor Activas ({articuloProveedores.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Artículo</th>
              <th style={tableHeaderStyle}>Proveedor</th>
              <th style={tableHeaderStyle}>Costo Compra</th>
              <th style={tableHeaderStyle}>Modelo Inv.</th>
              <th style={tableHeaderStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articuloProveedores.map((relacion) => (
              <tr key={relacion.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tableCellStyle}>{relacion.id}</td>
                <td style={tableCellStyle}>{relacion.articulo?.nombreArticulo || 'N/A'}</td>
                <td style={tableCellStyle}>{relacion.proveedor?.nombreProveedor || 'N/A'}</td>
                <td style={tableCellStyle}>${relacion.costoCompra.toFixed(2)}</td>
                <td style={tableCellStyle}>{relacion.modeloInventario}</td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleEditClick(relacion)} style={actionButtonStyle}>Editar</button>
                  <button onClick={() => handleDeleteClick(relacion.id)} style={{ ...actionButtonStyle, backgroundColor: '#f44336' }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const actionButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  marginRight: '8px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#008CBA',
  color: 'white',
};

export default ArticuloProveedorPage;