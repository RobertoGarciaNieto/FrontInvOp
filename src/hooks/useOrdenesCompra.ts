// src/hooks/useOrdenesCompra.ts

import { useState, useEffect, useCallback } from 'react';
import { OrdenCompra, OrdenCompraDTO, EstadoOrdenCompra } from '../types'; // Asegúrate de que la ruta sea correcta
import {
  getOrdenesCompra,
  getOrdenCompraById,
  createOrdenCompra,
  updateOrdenCompra,
  deleteOrdenCompra,
  updateEstadoOrdenCompra
} from '../api/api'; // Asegúrate de que la ruta sea correcta

const useOrdenesCompra = () => {
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdenesCompra = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdenesCompra();
      setOrdenesCompra(data.filter(oc => oc.estado !== EstadoOrdenCompra.CANCELADA)); // Filtrar canceladas por ejemplo
    } catch (err: any) {
      setError(err.message || 'Error al obtener las órdenes de compra.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdenesCompra();
  }, [fetchOrdenesCompra]);

  const getOrdenCompra = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdenCompraById(id);
      return data;
    } catch (err: any) {
      setError(err.message || `Error al obtener la orden de compra con ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrdenCompra = useCallback(async (orden: OrdenCompraDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newOrden = await createOrdenCompra(orden);
      setOrdenesCompra((prev) => [...prev, newOrden]);
      return newOrden;
    } catch (err: any) {
      setError(err.message || 'Error al agregar la orden de compra.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrdenCompraData = useCallback(async (id: number, orden: OrdenCompraDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrden = await updateOrdenCompra(id, orden);
      setOrdenesCompra((prev) =>
        prev.map((oc) => (oc.id === id ? { ...oc, ...updatedOrden } : oc))
      );
      return updatedOrden;
    } catch (err: any) {
      setError(err.message || `Error al actualizar la orden de compra con ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrdenCompraData = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteOrdenCompra(id);
      setOrdenesCompra((prev) => prev.filter((oc) => oc.id !== id)); // Asumiendo que se filtra de la lista
      return true;
    } catch (err: any) {
      setError(err.message || `Error al eliminar la orden de compra con ID ${id}.`);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeOrdenCompraEstado = useCallback(async (id: number, nuevoEstado: EstadoOrdenCompra) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrden = await updateEstadoOrdenCompra(id, nuevoEstado);
      setOrdenesCompra((prev) =>
        prev.map((oc) => (oc.id === id ? { ...oc, ...updatedOrden } : oc))
      );
      return updatedOrden;
    } catch (err: any) {
      setError(err.message || `Error al cambiar el estado de la orden de compra con ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchOrdenesCompra = fetchOrdenesCompra;

  return {
    ordenesCompra,
    loading,
    error,
    getOrdenCompra,
    addOrdenCompra,
    updateOrdenCompraData,
    deleteOrdenCompraData,
    changeOrdenCompraEstado,
    refetchOrdenesCompra,
  };
};

export default useOrdenesCompra;