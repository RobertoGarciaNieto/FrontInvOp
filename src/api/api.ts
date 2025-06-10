// src/api/api.ts

import axios from 'axios';
import {
  Articulo, ArticuloDTO,
  Proveedor, ProveedorDTO,
  OrdenCompraDTO,
  Venta, VentaDTO,
  ArticuloProveedor, ArticuloProveedorDTO,
  OrdenCompra
} from '../types'; // Asegúrate de que la ruta a 'types' sea correcta según dónde guardes este archivo

const API_BASE_URL = 'http://localhost:8080'; // Asegúrate de que este sea el puerto de tu backend Spring Boot

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente (opcional, pero recomendado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API call error:', error);
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      // Puedes lanzar un error más específico o manejarlo aquí
      throw new Error(`Server responded with status ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta (e.g., servidor no disponible, CORS)
      console.error('No response received:', error.request);
      throw new Error('No response from server. Check if backend is running and CORS configuration.');
    } else {
      // Algo sucedió al configurar la solicitud que disparó un Error
      console.error('Error setting up request:', error.message);
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
);

// ----------------------------------------------------
// Articulos
// ----------------------------------------------------
export const getArticulos = async (): Promise<Articulo[]> => {
  try {
    const response = await api.get<Articulo[]>('/articulos');
    return response.data;
  } catch (error) {
    console.error("Error fetching articulos:", error);
    throw new Error('Error fetching articulos.');
  }
};

export const getArticuloById = async (id: number): Promise<Articulo> => {
  try {
    const response = await api.get<Articulo>(`/articulos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching articulo with id ${id}:`, error);
    throw new Error(`Error fetching articulo with id ${id}.`);
  }
};

export const createArticulo = async (data: ArticuloDTO): Promise<Articulo> => {
  try {
    const response = await api.post<Articulo>('/articulos/crear', data);
    return response.data;
  } catch (error) {
    console.error("Error creating articulo:", error);
    throw new Error('Error creating articulo.');
  }
};

export const updateArticulo = async (id: number, data: ArticuloDTO): Promise<Articulo> => {
  try {
    const response = await api.put<Articulo>(`/articulos/modificar/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating articulo with id ${id}:`, error);
    throw new Error(`Error updating articulo with id ${id}.`);
  }
};

export const deleteArticulo = async (id: number): Promise<string> => {
  try {
    const response = await api.delete<string>(`/articulos/baja/${id}`);
    return response.data; // El backend puede devolver un mensaje de éxito
  } catch (error) {
    console.error(`Error deleting articulo with id ${id}:`, error);
    throw new Error(`Error deleting articulo with id ${id}.`);
  }
};

// ----------------------------------------------------
// Proveedores
// ----------------------------------------------------
export const getProveedores = async (): Promise<Proveedor[]> => {
  try {
    const response = await api.get<Proveedor[]>('/proveedores');
    return response.data;
  } catch (error) {
    console.error("Error fetching proveedores:", error);
    throw new Error('Error fetching proveedores.');
  }
};

export const getProveedorById = async (id: number): Promise<Proveedor> => {
  try {
    const response = await api.get<Proveedor>(`/proveedores/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching proveedor with id ${id}:`, error);
    throw new Error(`Error fetching proveedor with id ${id}.`);
  }
};

export const createProveedor = async (data: ProveedorDTO): Promise<Proveedor> => {
  try {
    const response = await api.post<Proveedor>('/proveedores/crear', data);
    return response.data;
  } catch (error) {
    console.error("Error creating proveedor:", error);
    throw new Error('Error creating proveedor.');
  }
};

export const updateProveedor = async (id: number, data: ProveedorDTO): Promise<Proveedor> => {
  try {
    const response = await api.put<Proveedor>(`/proveedores/modificar/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating proveedor with id ${id}:`, error);
    throw new Error(`Error updating proveedor with id ${id}.`);
  }
};

export const deleteProveedor = async (id: number): Promise<string> => {
  try {
    const response = await api.delete<string>(`/proveedores/baja/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting proveedor with id ${id}:`, error);
    throw new Error(`Error deleting proveedor with id ${id}.`);
  }
};

export const getProveedoresActive = async (): Promise<Proveedor[]> => {
  try {
    const response = await api.get<Proveedor[]>('/proveedores/active');
    return response.data;
  } catch (error) {
    console.error("Error fetching active proveedores:", error);
    throw new Error('Error fetching active proveedores.');
  }
};

// ----------------------------------------------------
// Ordenes de Compra
// ----------------------------------------------------
export const getOrdenesCompra = async (): Promise<OrdenCompra[]> => {
  try {
    const response = await api.get<OrdenCompra[]>('/ordenescompra');
    return response.data;
  } catch (error) {
    console.error("Error fetching ordenes de compra:", error);
    throw new Error('Error fetching ordenes de compra.');
  }
};

export const getOrdenCompraById = async (id: number): Promise<OrdenCompra> => {
  try {
    const response = await api.get<OrdenCompra>(`/ordenescompra/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orden de compra with id ${id}:`, error);
    throw new Error(`Error fetching orden de compra with id ${id}.`);
  }
};

export const createOrdenCompra = async (data: OrdenCompraDTO): Promise<OrdenCompra> => {
  try {
    const response = await api.post<OrdenCompra>('/ordenescompra/crear', data);
    return response.data;
  } catch (error) {
    console.error("Error creating orden de compra:", error);
    throw new Error('Error creating orden de compra.');
  }
};

export const updateOrdenCompra = async (id: number, data: OrdenCompraDTO): Promise<OrdenCompra> => {
  try {
    const response = await api.put<OrdenCompra>(`/ordenescompra/modificar/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating orden de compra with id ${id}:`, error);
    throw new Error(`Error updating orden de compra with id ${id}.`);
  }
};

export const deleteOrdenCompra = async (id: number): Promise<string> => {
  try {
    const response = await api.delete<string>(`/ordenescompra/baja/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting orden de compra with id ${id}:`, error);
    throw new Error(`Error deleting orden de compra with id ${id}.`);
  }
};

export const updateEstadoOrdenCompra = async (id: number, nuevoEstado: string): Promise<OrdenCompra> => {
  try {
    // Asume que el backend espera el nuevo estado como parte del cuerpo o en un query param.
    // Ajusta esto según cómo lo hayas definido en tu controlador de Spring Boot.
    // Ejemplo: Si espera un JSON { "estado": "NUEVO_ESTADO" }:
    const response = await api.put<OrdenCompra>(`/ordenescompra/estado/${id}`, { estado: nuevoEstado });
    return response.data;
  } catch (error) {
    console.error(`Error updating estado for orden de compra with id ${id}:`, error);
    throw new Error(`Error updating estado for orden de compra with id ${id}.`);
  }
};


// ----------------------------------------------------
// Ventas
// ----------------------------------------------------
export const getVentas = async (): Promise<Venta[]> => {
  try {
    const response = await api.get<Venta[]>('/ventas');
    return response.data;
  } catch (error) {
    console.error("Error fetching ventas:", error);
    throw new Error('Error fetching ventas.');
  }
};

export const getVentaById = async (id: number): Promise<Venta> => {
  try {
    const response = await api.get<Venta>(`/ventas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching venta with id ${id}:`, error);
    throw new Error(`Error fetching venta with id ${id}.`);
  }
};

export const createVenta = async (data: VentaDTO): Promise<Venta> => {
  try {
    // Nota: El PDF indica que este endpoint es solo POST '/'
    const response = await api.post<Venta>('/ventas', data);
    return response.data;
  } catch (error) {
    console.error("Error creating venta:", error);
    throw new Error('Error creating venta.');
  }
};

export const updateVenta = async (id: number, data: VentaDTO): Promise<Venta> => {
  try {
    // Nota: El PDF indica que este endpoint es solo PUT '/{id}'
    const response = await api.put<Venta>(`/ventas/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating venta with id ${id}:`, error);
    throw new Error(`Error updating venta with id ${id}.`);
  }
};

export const deleteVenta = async (id: number): Promise<string> => {
  try {
    const response = await api.delete<string>(`/ventas/baja/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting venta with id ${id}:`, error);
    throw new Error(`Error deleting venta with id ${id}.`);
  }
};

// ----------------------------------------------------
// ArticuloProveedor
// ----------------------------------------------------
export const getArticuloProveedores = async (): Promise<ArticuloProveedor[]> => {
  try {
    const response = await api.get<ArticuloProveedor[]>('/articulo-proveedor');
    return response.data;
  } catch (error) {
    console.error("Error fetching articuloProveedores:", error);
    throw new Error('Error fetching articuloProveedores.');
  }
};

export const getArticuloProveedorById = async (id: number): Promise<ArticuloProveedor> => {
  try {
    const response = await api.get<ArticuloProveedor>(`/articuloproveedor/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching articuloProveedor with id ${id}:`, error);
    throw new Error(`Error fetching articuloProveedor with id ${id}.`);
  }
};

export const createArticuloProveedor = async (data: ArticuloProveedorDTO): Promise<ArticuloProveedor> => {
  try {
    // Asumo que el endpoint de creación es simplemente '/'
    const response = await api.post<ArticuloProveedor>('/articuloproveedor', data);
    return response.data;
  } catch (error) {
    console.error("Error creating articuloProveedor:", error);
    throw new Error('Error creating articuloProveedor.');
  }
};

export const updateArticuloProveedor = async (id: number, data: ArticuloProveedorDTO): Promise<ArticuloProveedor> => {
  try {
    // Asumo que el endpoint de modificación es simplemente '/{id}'
    const response = await api.put<ArticuloProveedor>(`/articuloproveedor/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating articuloProveedor with id ${id}:`, error);
    throw new Error(`Error updating articuloProveedor with id ${id}.`);
  }
};

export const deleteArticuloProveedor = async (id: number): Promise<string> => {
  try {
    const response = await api.delete<string>(`/articuloproveedor/baja/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting articuloProveedor with id ${id}:`, error);
    throw new Error(`Error deleting articuloProveedor with id ${id}.`);
  }
};

export const getArticulosPorProveedor = async (proveedorId: number): Promise<ArticuloProveedor[]> => {
  try {
    const response = await api.get<ArticuloProveedor[]>(`/articuloproveedor/byProveedor/${proveedorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching articulos for proveedor ${proveedorId}:`, error);
    throw new Error(`Error fetching articulos for proveedor ${proveedorId}.`);
  }
};

export const getArticuloProveedorByArticuloId = async (articuloId: number): Promise<ArticuloProveedor[]> => {
  try {
    const response = await api.get<ArticuloProveedor[]>(`/articuloproveedor/byArticulo/${articuloId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ArticuloProveedor by Articulo ID ${articuloId}:`, error);
    throw new Error(`Error fetching ArticuloProveedor by Articulo ID ${articuloId}.`);
  }
};

export const getArticuloProveedorByProveedorIdAndArticuloId = async (proveedorId: number, articuloId: number): Promise<ArticuloProveedor> => {
  try {
    const response = await api.get<ArticuloProveedor>(`/articuloproveedor/byProveedorIdAndArticuloId?proveedorId=${proveedorId}&articuloId=${articuloId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ArticuloProveedor for Proveedor ${proveedorId} and Articulo ${articuloId}:`, error);
    throw new Error(`Error fetching ArticuloProveedor for Proveedor ${proveedorId} and Articulo ${articuloId}.`);
  }
};