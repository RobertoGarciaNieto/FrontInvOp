import { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseEntity } from '../types';

// Generic hook for fetching, adding, updating, and deleting entities
const useEntities = <T extends BaseEntity>(baseUrl: string) => {
  const [entities, setEntities] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<T[]>(baseUrl);
      setEntities(response.data.filter(entity => entity.estado === true)); // Filter for active entities
    } catch (err) {
      setError('Error fetching entities.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEntityById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<T>(`${baseUrl}/${id}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(`Error fetching entity with ID ${id}.`);
      console.error(err);
      setLoading(false);
      return null;
    }
  };

  const addEntity = async (entity: Omit<T, 'id' | 'estado' | 'fechaAlta' | 'fechaModificacion' | 'fechaBaja'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<T>(baseUrl, entity);
      // The backend should return the created entity with all base fields
      setEntities((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Error adding entity.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEntity = async (id: number, entity: Partial<Omit<T, 'id'>>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<T>(`${baseUrl}/${id}`, entity);
      setEntities((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...response.data } : e))
      );
      return response.data;
    } catch (err) {
      setError(`Error updating entity with ID ${id}.`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntity = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      // Backend performs logical delete, so we filter it out from the local state
      await axios.delete(`${baseUrl}/${id}`);
      setEntities((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (err) {
      setError(`Error deleting entity with ID ${id}.`);
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, [baseUrl]);

  return {
    entities,
    loading,
    error,
    fetchEntities,
    getEntityById,
    addEntity,
    updateEntity,
    deleteEntity,
  };
};

export default useEntities;