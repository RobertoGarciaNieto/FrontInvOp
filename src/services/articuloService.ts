import { api, articulosApi } from './api';
import { Articulo, ArticuloDTO, ProveedorPredeterminadoDTO, ArticuloAReponerDTO, ArticuloFaltanteDTO, ArticuloProveedorDTO } from '../types';

export const articuloService = {
  getAll: async (): Promise<ArticuloDTO[]> => {
    try {
      const response = await articulosApi.getAll();
      return response.data;
    } catch (error) {
      console.error('Error al obtener artículos:', error);
      throw new Error('Error al obtener artículos');
    }
  },

  getById: async (id: number): Promise<ArticuloDTO> => {
    try {
      const response = await articulosApi.getOne(id);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener artículo ${id}:`, error);
      throw new Error(`Error al obtener artículo ${id}`);
    }
  },

  create: async (articuloDTO: ArticuloDTO): Promise<ArticuloDTO> => {
    try {
      const response = await articulosApi.altaArticulo(articuloDTO);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error('Error al crear artículo:', error);
      throw new Error('Error al crear artículo');
    }
  },

  update: async (id: number, articuloDTO: ArticuloDTO): Promise<ArticuloDTO> => {
    try {
      const response = await articulosApi.modificarArticulo(id, articuloDTO);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error(`Error al actualizar artículo ${id}:`, error);
      throw new Error(`Error al actualizar artículo ${id}`);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await articulosApi.bajaArticulo(id);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      console.error(`Error al eliminar artículo ${id}:`, error);
      throw new Error(`Error al eliminar artículo ${id}`);
    }
  },

  getArticulosFaltantes: async (): Promise<ArticuloFaltanteDTO[]> => {
    try {
      const response = await articulosApi.getArticulosFaltantes();
      return response.data;
    } catch (error) {
      console.error('Error detallado al obtener artículos faltantes:', error);
      throw new Error('Error al obtener artículos faltantes');
    }
  },

  getArticulosAReponer: async (): Promise<ArticuloAReponerDTO[]> => {
    try {
      const response = await articulosApi.getArticulosAReponer();
      return response.data;
    } catch (error) {
      console.error('Error detallado al obtener artículos a reponer:', error);
      throw new Error('Error al obtener artículos a reponer');
    }
  },

  establecerProveedor: async (id: number, proveedorPredeterminadoDTO: ProveedorPredeterminadoDTO): Promise<ArticuloDTO> => {
    try {
      const response = await articulosApi.establecerProveedor(id, proveedorPredeterminadoDTO);
      return response.data;
    } catch (error) {
      console.error(`Error al establecer proveedor predeterminado para artículo ${id}:`, error);
      throw new Error(`Error al establecer proveedor predeterminado para artículo ${id}`);
    }
  },

  getArticuloProveedorInfo: async (id: number): Promise<ArticuloProveedorDTO> => {
    try {
      const response = await api.get<ArticuloProveedorDTO>(`/articulo-proveedor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener información del artículo-proveedor ${id}:`, error);
      throw new Error(`Error al obtener información del artículo-proveedor ${id}`);
    }
  },

  getProveedoresByArticulo: async (id: number): Promise<any[]> => {
    try {
      const response = await articulosApi.getProveedoresByArticulo(id);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener proveedores del artículo ${id}:`, error);
      throw new Error(`Error al obtener proveedores del artículo ${id}`);
    }
  }
}; 