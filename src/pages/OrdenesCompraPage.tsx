// src/pages/OrdenesCompraPage.tsx

import React, { useState } from 'react';
import useOrdenesCompra from '../hooks/useOrdenesCompra'; // Ajusta la ruta
import useProveedores from '../hooks/useProveedores'; // Para seleccionar proveedor
import { OrdenCompraDTO, EstadoOrdenCompra, OrdenCompra } from '../types'; // Importa el DTO y el Enum

const OrdenesCompraPage: React.FC = () => {
  const {
    ordenesCompra,
    loading,
    error,
    addOrdenCompra,
    updateOrdenCompraData,
    deleteOrdenCompraData,
    changeOrdenCompraEstado,
    refetchOrdenesCompra,
  } = useOrdenesCompra();

  const { proveedores, loading: loadingProveedores, error: errorProveedores } = useProveedores();

  const [newOrden, setNewOrden] = useState<OrdenCompraDTO>({
    fechaOrdenCompra: new Date().toISOString().split('T')[0],
    idProveedor: 0, // O el ID de un proveedor predeterminado
  });
  const [editingOrdenId, setEditingOrdenId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOrden((prev) => ({
      ...prev,
      [name]: name === 'idProveedor' ? parseInt(value) : value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrden.idProveedor) {
      const addedOrden = await addOrdenCompra(newOrden);
      if (addedOrden) {
        setNewOrden({
          fechaOrdenCompra: new Date().toISOString().split('T')[0],
          idProveedor: 0,
        });
      }
    } else {
      alert('Por favor, selecciona un proveedor.');
    }
  };

  const handleEditClick = (orden: OrdenCompra) => {
    setEditingOrdenId(orden.id);
    setNewOrden({
      fechaOrdenCompra: orden.fechaOrdenCompra ? orden.fechaOrdenCompra.split('T')[0] : '',
      idProveedor: orden.proveedor?.id || 0,
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrdenId !== null && newOrden.idProveedor) {
      const updated = await updateOrdenCompraData(editingOrdenId, newOrden);
      if (updated) {
        setEditingOrdenId(null);
        setNewOrden({
          fechaOrdenCompra: new Date().toISOString().split('T')[0],
          idProveedor: 0,
        });
      }
    } else {
      alert('Por favor, selecciona un proveedor.');
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta orden de compra?')) {
      await deleteOrdenCompraData(id);
    }
  };

  const handleChangeEstado = async (id: number, estado: string) => {
    if (window.confirm(`¿Estás seguro de cambiar el estado a ${estado}?`)) {
      await changeOrdenCompraEstado(id, estado as EstadoOrdenCompra);
    }
  };

  if (loading || loadingProveedores) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando órdenes de compra y proveedores...</div>;
  }

  if (error || errorProveedores) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <h2>Error al cargar datos:</h2>
        <p>{error || errorProveedores}</p>
        <button onClick={refetchOrdenesCompra} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Gestión de Órdenes de Compra</h1>

      {/* Formulario para Agregar/Editar Orden de Compra */}
      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>{editingOrdenId ? 'Editar Orden de Compra' : 'Crear Nueva Orden de Compra'}</h2>
        <form onSubmit={editingOrdenId ? handleUpdateSubmit : handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <label>
            Fecha Orden:
            <input type="date" name="fechaOrdenCompra" value={newOrden.fechaOrdenCompra || ''} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          <label>
            Proveedor:
            <select name="idProveedor" value={newOrden.idProveedor || ''} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }}>
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombreProveedor}
                </option>
              ))}
            </select>
          </label>
          {/* Aquí podrías añadir campos para ArticuloOrdenCompra si se crean junto con la OC */}
          <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {editingOrdenId ? 'Actualizar Orden' : 'Crear Orden'}
          </button>
          {editingOrdenId && (
            <button type="button" onClick={() => {
              setEditingOrdenId(null);
              setNewOrden({ fechaOrdenCompra: new Date().toISOString().split('T')[0], idProveedor: 0 });
            }} style={{ gridColumn: 'span 2', padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
              Cancelar Edición
            </button>
          )}
        </form>
      </div>

      {/* Lista de Órdenes de Compra */}
      <div style={{ marginTop: '30px' }}>
        <h2>Órdenes de Compra ({ordenesCompra.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Fecha</th>
              <th style={tableHeaderStyle}>Proveedor</th>
              <th style={tableHeaderStyle}>Estado</th>
              <th style={tableHeaderStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenesCompra.map((orden) => (
              <tr key={orden.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tableCellStyle}>{orden.id}</td>
                <td style={tableCellStyle}>{new Date(orden.fechaOrdenCompra).toLocaleDateString()}</td>
                <td style={tableCellStyle}>{orden.proveedor?.nombreProveedor || 'N/A'}</td>
                <td style={tableCellStyle}>{orden.estado}</td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleEditClick(orden)} style={actionButtonStyle}>Editar</button>
                  <button onClick={() => handleDeleteClick(orden.id)} style={{ ...actionButtonStyle, backgroundColor: '#f44336' }}>Eliminar</button>
                  <select
                    value={orden.estado}
                    onChange={(e) => handleChangeEstado(orden.id, e.target.value)}
                    style={{ marginLeft: '10px', padding: '6px', borderRadius: '5px' }}
                  >
                    {Object.values(EstadoOrdenCompra).map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
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

export default OrdenesCompraPage;