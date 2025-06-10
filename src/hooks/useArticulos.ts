import { useState, useCallback } from 'react';
import axios from 'axios';

export interface Proveedor {
  id: number;
  nombreProveedor: string;
  estado: boolean;
}

export interface Articulo {
  id: number;
  nombreArticulo: string;
  descripcionArticulo: string;
  precioVentaArt: number;
  costoAlmacenamientoUnidad: number;
  stockActual: number;
  demandaArticulo: number;
  proveedorPredeterminadoId?: number;
  proveedor?: Proveedor;
  estado: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface ArticuloFormData {
  nombreArticulo: string;
  descripcionArticulo: string;
  precioVentaArt: number;
  costoAlmacenamientoUnidad: number;
  stockActual: number;
  demandaArticulo: number;
  proveedorId: number;
}

const API_URL = 'http://localhost:8080';

export const useArticulos = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticulos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Articulo[]>('http://localhost:8080/articulos');
      setArticulos(response.data);
    } catch (err) {
      setError('Error al cargar los artículos');
      console.error('Error al cargar los artículos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createArticulo = async (data: ArticuloFormData): Promise<Articulo> => {
    try {
      const response = await axios.post<Articulo>('http://localhost:8080/articulos', data);
      setArticulos((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error al crear el artículo:', err);
      throw new Error('Error al crear el artículo');
    }
  };

  const updateArticulo = async (id: number, data: ArticuloFormData): Promise<Articulo> => {
    try {
      const response = await axios.put<Articulo>(`http://localhost:8080/articulos/${id}`, data);
      setArticulos((prev) =>
        prev.map((articulo) => (articulo.id === id ? response.data : articulo))
      );
      return response.data;
    } catch (err) {
      console.error('Error al actualizar el artículo:', err);
      throw new Error('Error al actualizar el artículo');
    }
  };

  const deleteArticulo = async (id: number): Promise<void> => {
    try {
      await axios.delete(`http://localhost:8080/articulos/${id}`);
      setArticulos((prev) => prev.filter((articulo) => articulo.id !== id));
    } catch (err) {
      console.error('Error al eliminar el artículo:', err);
      throw new Error('Error al eliminar el artículo');
    }
  };

  return {
    articulos,
    isLoading,
    error,
    createArticulo,
    updateArticulo,
    deleteArticulo,
    fetchArticulos,
  };
}; 