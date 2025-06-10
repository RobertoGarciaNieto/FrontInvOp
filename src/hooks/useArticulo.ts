// src/hooks/useArticulos.ts

import { useState, useEffect, useCallback } from 'react';
import { Articulo, ArticuloDTO } from '../types'; // Asegúrate de que la ruta sea correcta
import {
  getArticulos,
  getArticuloById,
  createArticulo,
  updateArticulo,
  deleteArticulo
} from '../api/api'; // Asegúrate de que la ruta sea correcta

// Custom hook para la gestión de datos de Articulos
const useArticulos = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los artículos activos
  const fetchArticulos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticulos();
      // Filtra solo los artículos con estado=true (activos)
      setArticulos(data.filter(articulo => articulo.estado === true));
    } catch (err: any) {
      // El interceptor en api.ts ya loguea el error detallado, aquí solo se establece el mensaje para la UI
      setError(err.message || 'Error al obtener los artículos.');
    } finally {
      setLoading(false);
    }
  }, []); // No hay dependencias externas, solo se crea una vez

  // Efecto para cargar los artículos al montar el componente que usa este hook
  useEffect(() => {
    fetchArticulos();
  }, [fetchArticulos]); // Se ejecuta cuando fetchArticulos cambia (que es solo una vez)

  // Función para obtener un artículo por ID
  const getArticulo = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticuloById(id);
      return data;
    } catch (err: any) {
      setError(err.message || `Error al obtener el artículo con ID ${id}.`);
      console.error(err); // Sigue logueando el error detallado en la consola
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para agregar un nuevo artículo
  const addArticulo = useCallback(async (articulo: ArticuloDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newArticulo = await createArticulo(articulo);
      setArticulos((prev) => [...prev, newArticulo]); // Agrega el nuevo artículo al estado
      return newArticulo;
    } catch (err: any) {
      setError(err.message || 'Error al agregar el artículo.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar un artículo existente
  const updateArticuloData = useCallback(async (id: number, articulo: ArticuloDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updatedArticulo = await updateArticulo(id, articulo);
      setArticulos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updatedArticulo } : a)) // Actualiza el artículo en el estado
      );
      return updatedArticulo;
    } catch (err: any) {
      setError(err.message || `Error al actualizar el artículo con ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para eliminar un artículo (baja lógica)
  const deleteArticuloData = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteArticulo(id);
      // Asumiendo que la baja lógica significa que ya no se muestra en la lista de activos
      setArticulos((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || `Error al eliminar el artículo con ID ${id}.`);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para volver a cargar la lista de artículos manualmente
  const refetchArticulos = fetchArticulos;

  return {
    articulos,
    loading,
    error,
    getArticulo,
    addArticulo,
    updateArticuloData,
    deleteArticuloData,
    refetchArticulos,
  };
};

export default useArticulos;