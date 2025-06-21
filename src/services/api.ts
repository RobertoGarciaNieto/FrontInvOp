import axios from 'axios';
import type {  
  OrdenCompraDTO, 
  VentaDTO,
  Base,
  ProveedorPredeterminadoDTO,
  ArticuloDTO,
  ArticuloAReponerDTO,
  ArticuloFaltanteDTO,
  ArticuloProveedorDTO,
  ProveedorDTO
} from '../types';

const baseURL = 'http://localhost:8080';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Artículos
export const articulosApi = {
  getAll: () => api.get<ArticuloDTO[]>('/articulos'),
  getAllIncludingInactive: () => api.get<ArticuloDTO[]>('/articulos/todos'),
  getOne: (id: number) => api.get<ArticuloDTO>(`/articulos/${id}`),
  altaArticulo: (data: Omit<ArticuloDTO, 'id'>) => api.post<ArticuloDTO>('/articulos/crear', data),
  modificarArticulo: (id: number, data: ArticuloDTO) => api.put<ArticuloDTO>(`/articulos/modificar/${id}`, data),
  bajaArticulo: (id: number) => api.delete(`/articulos/baja/${id}`),
  getArticulosAReponer: () => api.get<ArticuloAReponerDTO[]>('/articulos/articulos-reponer'),
  getArticulosFaltantes: () => api.get<ArticuloFaltanteDTO[]>('/articulos/articulos-faltantes'),
  establecerProveedor: (id: number, proveedorPredeterminadoDTO: ProveedorPredeterminadoDTO) => 
    api.put<ArticuloDTO>(`/articulos/proveedor-predeterminado/${id}`, proveedorPredeterminadoDTO),
  getProveedoresByArticulo: (id: number) => api.get<ProveedorDTO[]>(`/articulos/${id}/proveedores`),
};

// Proveedores
export const proveedoresApi = {
  getAll: () => api.get<ProveedorDTO[]>('/proveedores'),
  getAllIncludingInactive: () => api.get<ProveedorDTO[]>('/proveedores/todos'),
  getOne: (id: number) => api.get<ProveedorDTO>(`/proveedores/${id}`),
  altaProveedor: (data: Omit<ProveedorDTO, keyof Base>) => api.post<ProveedorDTO>('/proveedores/crear', data),
  modificarProveedor: (id: number, data: Partial<ProveedorDTO>) => api.put<ProveedorDTO>(`/proveedores/modificar/${id}`, data),
  bajaProveedor: (id: number) => api.delete(`/proveedores/baja/${id}`),
};

// Artículos-Proveedores
export const articuloProveedorApi = {
  getAll: () => api.get<ArticuloProveedorDTO[]>('/articulo-proveedor'),
  altaAP: (data: Omit<ArticuloProveedorDTO, keyof Base>) => 
    api.post<ArticuloProveedorDTO>('/articulo-proveedor/crear', data),
  modificarAP: (id: number, data: Partial<ArticuloProveedorDTO>) => 
    api.put<ArticuloProveedorDTO>(`/articulo-proveedor/modificar/${id}`, data),
  listadoArticulosPorProveedor: (proveedorId: number) => 
    api.get<ArticuloProveedorDTO[]>(`/articulo-proveedor/listado?proveedorId=${proveedorId}`),
};

// Órdenes de Compra
export const ordenesCompraApi = {
  getAll: () => api.get<OrdenCompraDTO[]>('/ordenescompra'),
  getById: (id: number) => api.get<OrdenCompraDTO>(`/ordenescompra/${id}`),
  altaOrdenCompra: (data: Omit<OrdenCompraDTO, keyof Base>) => 
    api.post<OrdenCompraDTO>('/ordenescompra/crear', data),
  modificarOrdenCompra: (id: number, data: Partial<OrdenCompraDTO>) => 
    api.put<OrdenCompraDTO>(`/ordenescompra/modificar/${id}`, data),
  cancelarOrdenCompra: (id: number) => api.put<OrdenCompraDTO>(`/ordenescompra/cancelar/${id}`),
  confirmarOrdenCompra: (id: number) => api.put<OrdenCompraDTO>(`/ordenescompra/confirmar/${id}`),
  finalizarOrdenCompra: (id: number) => api.put<OrdenCompraDTO>(`/ordenescompra/finalizar/${id}`),
  getActiveOrdersForArticulo: (articuloId: number) => 
    api.get<OrdenCompraDTO[]>(`/ordenescompra/activasPorArticuloo/${articuloId}`),
};

// Ventas
export const ventasApi = {
  getAll: () => api.get<VentaDTO[]>('/ventas'),
  getOne: (id: number) => api.get<VentaDTO>(`/ventas/${id}`),
  altaVenta: (data: Omit<VentaDTO, keyof Base>) => api.post<VentaDTO>('/ventas/crear', data),
  //delete: (id: number) => api.delete(`/ventas/baja/${id}`),
}; 