import { api } from './api';
import { Venta, VentaDTO } from '../types';
import axios from 'axios';

export const ventaService = {
  getAll: async (): Promise<Venta[]> => {
    try {
      const response = await api.get<Venta[]>('/ventas');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error('Error al obtener ventas:', error);
      throw new Error('Error al obtener ventas');
    }
  },

  getById: async (id: number): Promise<Venta> => {
    try {
      const response = await api.get<Venta>(`/ventas/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error(`Error al obtener venta ${id}:`, error);
      throw new Error(`Error al obtener venta ${id}`);
    }
  },

  altaVenta: async (ventaDTO: VentaDTO): Promise<Venta> => {
    try {
      console.log('Enviando DTO al backend:', ventaDTO);
      const response = await api.post<Venta>('/ventas/crear', ventaDTO);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error detallado:', error.response?.data);
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        if (error.response?.status === 400) {
          throw new Error(`Error de validación: ${JSON.stringify(error.response.data)}`);
        }
        if (error.response?.status === 404) {
          throw new Error('No se encontró el artículo o el stock es insuficiente');
        }
      }
      console.error('Error al crear venta:', error);
      throw new Error('Error al crear venta');
    }
  },

  update: async (id: number, ventaDTO: VentaDTO): Promise<Venta> => {
    try {
      const response = await api.put<Venta>(`/ventas/modificar/${id}`, ventaDTO);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error(`Error al actualizar venta ${id}:`, error);
      throw new Error(`Error al actualizar venta ${id}`);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/ventas/eliminar/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error(`Error al eliminar venta ${id}:`, error);
      throw new Error(`Error al eliminar venta ${id}`);
    }
  }
}; 