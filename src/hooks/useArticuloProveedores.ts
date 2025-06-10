// src/hooks/useArticuloProveedores.ts

import { useState, useEffect, useCallback } from 'react';
import { ArticuloProveedor, ArticuloProveedorDTO } from '../types'; // Asegúrate de que la ruta sea correcta
import {
  getArticuloProveedores,
  getArticuloProveedorById,
  createArticuloProveedor,
  updateArticuloProveedor,
  deleteArticuloProveedor,
  getArticulosPorProveedor,
  getArticuloProveedorByArticuloId,
  getArticuloProveedorByProveedorIdAndArticuloId
} from '../api/api'; // Asegúrate de que la ruta sea correcta

const useArticuloProveedores = () => {
  const [articuloProveedores, setArticuloProveedores] = useState<ArticuloProveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticuloProveedores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticuloProveedores();
      setArticuloProveedores(data.filter(ap => ap.estado === true)); // Asumiendo que ArticuloProveedor tiene campo 'estado'
    } catch (err: any) {
      setError(err.message || 'Error al obtener las relaciones Artículo-Proveedor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticuloProveedores();
  }, [fetchArticuloProveedores]);

  const getArticuloProveedor = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticuloProveedorById(id);
      return data;
    } catch (err: any) {
      setError(err.message || `Error al obtener la relación con ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addArticuloProveedor = useCallback(async (relacion: ArticuloProveedorDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newRelacion = await createArticuloProveedor(relacion);
      setArticuloProveedores((prev) => [...prev, newRelacion]);
      return newRelacion;
    } catch (err: any) {
      setError(err.message || 'Error al agregar la relación Artículo-Proveedor.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateArticuloProveedorData = useCallback(async (id: number, relacion: ArticuloProveedorDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRelacion = await updateArticuloProveedor(id, relacion);
      setArticuloProveedores((prev) =>
        prev.map((ap) => (ap.id === id ? { ...ap, ...updatedRelacion } : ap))
      );
      return updatedRelacion;
    } catch (err: any) {
      setError(err.message || `Error al actualizar la relación con ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteArticuloProveedorData = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteArticuloProveedor(id);
      setArticuloProveedores((prev) => prev.filter((ap) => ap.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || `Error al eliminar la relación con ID ${id}.`);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArticulosPorProveedor = useCallback(async (proveedorId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticulosPorProveedor(proveedorId);
      return data;
    } catch (err: any) {
      setError(err.message || `Error al obtener artículos para el proveedor ${proveedorId}.`);
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArticuloProveedorByArticulo = useCallback(async (articuloId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticuloProveedorByArticuloId(articuloId);
      return data;
    } catch (err: any) {
      setError(err.message || `Error al obtener relación por ID de artículo ${articuloId}.`);
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArticuloProveedorByProveedorAndArticulo = useCallback(async (proveedorId: number, articuloId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticuloProveedorByProveedorIdAndArticuloId(proveedorId, articuloId);
      return data;
    } catch (err: any) {
      setError(err.message || `Error al obtener relación por proveedor ${proveedorId} y artículo ${articuloId}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const refetchArticuloProveedores = fetchArticuloProveedores;

  return {
    articuloProveedores,
    loading,
    error,
    getArticuloProveedor,
    addArticuloProveedor,
    updateArticuloProveedorData,
    deleteArticuloProveedorData,
    fetchArticulosPorProveedor,
    fetchArticuloProveedorByArticulo,
    fetchArticuloProveedorByProveedorAndArticulo,
    refetchArticuloProveedores,
  };
};

export default useArticuloProveedores;