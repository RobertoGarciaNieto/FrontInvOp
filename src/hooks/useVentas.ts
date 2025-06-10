// src/hooks/useVentas.ts

import { useState, useEffect, useCallback } from 'react';
import { Venta, VentaDTO } from '../types'; // Asegúrate de que la ruta sea correcta
import {
  getVentas,
  getVentaById,
  createVenta,
  updateVenta,
  deleteVenta
} from '../api/api'; // Asegúrate de que la ruta sea correcta

const useVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVentas();
      setVentas(data.filter(venta => venta.estado === true)); // Asumiendo que Venta tiene campo 'estado'
    } catch (err: any) {
      setError(err.message || 'Error al obtener las ventas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  const getVenta = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVentaById(id);
      return data;
    } catch (err: any) {
      setError(err.message || `Error al obtener la venta con ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addVenta = useCallback(async (venta: VentaDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newVenta = await createVenta(venta);
      setVentas((prev) => [...prev, newVenta]);
      return newVenta;
    } catch (err: any) {
      setError(err.message || 'Error al agregar la venta.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVentaData = useCallback(async (id: number, venta: VentaDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updatedVenta = await updateVenta(id, venta);
      setVentas((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...updatedVenta } : v))
      );
      return updatedVenta;
    } catch (err: any) {
      setError(err.message || `Error al actualizar la venta con ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVentaData = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteVenta(id);
      setVentas((prev) => prev.filter((v) => v.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || `Error al eliminar la venta con ID ${id}.`);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchVentas = fetchVentas;

  return {
    ventas,
    loading,
    error,
    getVenta,
    addVenta,
    updateVentaData,
    deleteVentaData,
    refetchVentas,
  };
};

export default useVentas;