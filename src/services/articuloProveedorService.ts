import { api } from './api';
import { ArticuloProveedorDTO, ListadoArtProvDTO } from '../types';

export const articuloProveedorService = {
  getAll: async (): Promise<ArticuloProveedorDTO[]> => {
    try {
      const response = await api.get<ArticuloProveedorDTO[]>('/articulo-proveedor');
      return response.data;
    } catch (error) {
      console.error('Error al obtener artículos-proveedor:', error);
      throw new Error('Error al obtener artículos-proveedor');
    }
  },

  altaAP: async (articuloProveedorDTO: ArticuloProveedorDTO): Promise<ArticuloProveedorDTO> => {
    try {
      const response = await api.post<ArticuloProveedorDTO>('/articulo-proveedor/crear', articuloProveedorDTO);
      return response.data;
    } catch (error) {
      console.error('Error al crear artículo-proveedor:', error);
      throw new Error('Error al crear artículo-proveedor');
    }
  },

  listadoArticulosPorProveedor: async (proveedorId: number): Promise<ListadoArtProvDTO[]> => {
    try {
      const response = await api.get<ListadoArtProvDTO[]>(`/articulo-proveedor/listado?proveedorId=${proveedorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener artículos del proveedor ${proveedorId}:`, error);
      throw new Error(`Error al obtener artículos del proveedor ${proveedorId}`);
    }
  },

  modificarAP: async (id: number, articuloProveedorDTO: ArticuloProveedorDTO): Promise<ArticuloProveedorDTO> => {
    try {
      const response = await api.put<ArticuloProveedorDTO>(`/articulo-proveedor/modificar/${id}`, articuloProveedorDTO);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar artículo-proveedor ${id}:`, error);
      throw new Error(`Error al actualizar artículo-proveedor ${id}`);
    }
  },

  /*
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/articulo-proveedor/eliminar/${id}`);
    } catch (error) {
      console.error(`Error al eliminar artículo-proveedor ${id}:`, error);
      throw new Error(`Error al eliminar artículo-proveedor ${id}`);
    }
  }*/
}; 