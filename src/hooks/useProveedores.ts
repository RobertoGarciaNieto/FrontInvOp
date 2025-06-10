import { useState, useEffect, useCallback } from 'react';
import { Proveedor, ProveedorDTO } from '../types'; // Asegúrate de que la ruta sea correcta
import {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
} from '../api/api'; // Asegúrate de que la ruta sea correcta

// Custom hook para la gestión de datos de Proveedores
const useProveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los proveedores activos
  const fetchProveedores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProveedores();
      // Filtra solo los proveedores con estado=true (activos)
      setProveedores(data.filter(proveedor => proveedor.estado === true));
    } catch (err: any) {
      setError(err.message || 'Error al obtener los proveedores.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para cargar los proveedores al montar el componente
  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  // Función para obtener un proveedor por ID
  const getProveedor = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProveedorById(id);
      return data;
    } catch (err: any) {
      setError(err.message || `Error al obtener el proveedor con ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para agregar un nuevo proveedor
  const addProveedor = useCallback(async (proveedor: ProveedorDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newProveedor = await createProveedor(proveedor);
      setProveedores((prev) => [...prev, newProveedor]);
      return newProveedor;
    } catch (err: any) {
      setError(err.message || 'Error al agregar el proveedor.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar un proveedor existente
  const updateProveedorData = useCallback(async (id: number, proveedor: ProveedorDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProveedor = await updateProveedor(id, proveedor);
      setProveedores((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedProveedor } : p))
      );
      return updatedProveedor;
    } catch (err: any) {
      setError(err.message || `Error al actualizar el proveedor con ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para eliminar un proveedor (baja lógica)
  const deleteProveedorData = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProveedor(id);
      setProveedores((prev) => prev.filter((p) => p.id !== id)); // Asumiendo que se filtra de la lista
      return true;
    } catch (err: any) {
      setError(err.message || `Error al eliminar el proveedor con ID ${id}.`);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchProveedores = fetchProveedores;

  return {
    proveedores,
    loading,
    error,
    getProveedor,
    addProveedor,
    updateProveedorData,
    deleteProveedorData,
    refetchProveedores,
  };
};

export default useProveedores;