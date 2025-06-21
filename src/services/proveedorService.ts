import { api, proveedoresApi } from './api';
import { Proveedor, ProveedorDTO } from '../types';

export const proveedorService = {
  getAll: async (): Promise<ProveedorDTO[]> => {
    try {
      const response = await proveedoresApi.getAll();
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw new Error('Error al obtener proveedores');
    }
  },

  getAllIncludingInactive: async (): Promise<ProveedorDTO[]> => {
    try {
      const response = await proveedoresApi.getAllIncludingInactive();
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw new Error('Error al obtener proveedores');
    }
  },

  getById: async (id: number): Promise<ProveedorDTO> => {
    try {
      const response = await proveedoresApi.getOne(id);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener proveedor ${id}:`, error);
      throw new Error(`Error al obtener proveedor ${id}`);
    }
  },

  altaProveedor: async (proveedorDTO: ProveedorDTO): Promise<ProveedorDTO> => {
    try {
      const response = await proveedoresApi.altaProveedor(proveedorDTO);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error('Error al crear proveedor:', error);
      throw new Error('Error al crear proveedor');
    }
  },

  modificarProveedor: async (id: number, proveedorDTO: ProveedorDTO): Promise<ProveedorDTO> => {
    try {
      const response = await proveedoresApi.modificarProveedor(id, proveedorDTO);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error(`Error al actualizar proveedor ${id}:`, error);
      throw new Error(`Error al actualizar proveedor ${id}`);
    }
  },

  bajaProveedor: async (id: number): Promise<void> => {
    try {
      await proveedoresApi.bajaProveedor(id);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error(`Error al eliminar proveedor ${id}:`, error);
      throw new Error(`Error al eliminar proveedor ${id}`);
    }
  }
}; 