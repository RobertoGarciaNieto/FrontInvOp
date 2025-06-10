// src/pages/VentasPage.tsx

import React, { useState } from 'react';
import useVentas from '../hooks/useVentas'; // Ajusta la ruta
import { Venta, VentaDTO } from '../types'; // Importa el DTO

const VentasPage: React.FC = () => {
  const {
    ventas,
    loading,
    error,
    addVenta,
    updateVentaData,
    deleteVentaData,
    refetchVentas,
  } = useVentas();

  const [newVenta, setNewVenta] = useState<VentaDTO>({
    fechaVenta: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD para input date
    // Si la creación de venta incluye artículos, necesitarías un estado para ArticuloVentaDTO[]
  });
  const [editingVentaId, setEditingVentaId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVenta((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const addedVenta = await addVenta(newVenta);
    if (addedVenta) {
      setNewVenta({
        fechaVenta: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleEditClick = (venta: Venta) => {
    setEditingVentaId(venta.id);
    setNewVenta({
      fechaVenta: venta.fechaVenta ? venta.fechaVenta.split('T')[0] : '', // Asegúrate de que el formato sea compatible con input type="date"
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVentaId !== null) {
      const updated = await updateVentaData(editingVentaId, newVenta);
      if (updated) {
        setEditingVentaId(null);
        setNewVenta({
          fechaVenta: new Date().toISOString().split('T')[0],
        });
      }
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      await deleteVentaData(id);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando ventas...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <h2>Error al cargar ventas:</h2>
        <p>{error}</p>
        <button onClick={refetchVentas} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Gestión de Ventas</h1>

      {/* Formulario para Agregar/Editar Venta */}
      <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>{editingVentaId ? 'Editar Venta' : 'Registrar Nueva Venta'}</h2>
        <form onSubmit={editingVentaId ? handleUpdateSubmit : handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
          <label>
            Fecha Venta:
            <input type="date" name="fechaVenta" value={newVenta.fechaVenta || ''} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
          </label>
          {/* Aquí podrías añadir campos para agregar ArticuloVenta a la Venta */}
          <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {editingVentaId ? 'Actualizar Venta' : 'Registrar Venta'}
          </button>
          {editingVentaId && (
            <button type="button" onClick={() => {
              setEditingVentaId(null);
              setNewVenta({ fechaVenta: new Date().toISOString().split('T')[0] });
            }} style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
              Cancelar Edición
            </button>
          )}
        </form>
      </div>

      {/* Lista de Ventas */}
      <div style={{ marginTop: '30px' }}>
        <h2>Ventas Registradas ({ventas.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Fecha Venta</th>
              <th style={tableHeaderStyle}>Costo Total</th>
              <th style={tableHeaderStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tableCellStyle}>{venta.id}</td>
                <td style={tableCellStyle}>{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                <td style={tableCellStyle}>${venta.costoTotal ? venta.costoTotal.toFixed(2) : 'N/A'}</td>
                <td style={tableCellStyle}>
                  <button onClick={() => handleEditClick(venta)} style={actionButtonStyle}>Editar</button>
                  <button onClick={() => handleDeleteClick(venta.id)} style={{ ...actionButtonStyle, backgroundColor: '#f44336' }}>Eliminar</button>
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

export default VentasPage;