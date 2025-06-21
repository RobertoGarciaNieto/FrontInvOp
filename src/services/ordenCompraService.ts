import { api } from "./api";
import { OrdenCompra, OrdenCompraDTO, EstadoOrdenCompra } from "../types";

export const ordenCompraService = {
  getAll: async (): Promise<OrdenCompraDTO[]> => {
    try {
      const response = await api.get<OrdenCompraDTO[]>("/ordenescompra");
      return response.data;
    } catch (error) {
      console.error("Error al obtener órdenes de compra:", error);
      throw new Error("Error al obtener órdenes de compra");
    }
  },

  getById: async (id: number): Promise<OrdenCompra> => {
    try {
      const response = await api.get<OrdenCompra>(`/ordenescompra/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener orden de compra ${id}:`, error);
      throw new Error(`Error al obtener orden de compra ${id}`);
    }
  },

  altaOrdenCompra: async (
    ordenCompraDTO: OrdenCompraDTO
  ): Promise<OrdenCompra> => {
    try {
      if (
        !ordenCompraDTO.id_proveedor ||
        !ordenCompraDTO.articulosOrdenCompra?.length
      ) {
        console.error("Validación fallida: Proveedor o artículos faltantes");
        throw new Error(
          "El DTO de orden de compra debe incluir un proveedor y al menos un artículo"
        );
      }

      const response = await api.post<OrdenCompra>(
        "/ordenescompra/crear",
        ordenCompraDTO
      );
      return response.data;
    } catch (error: any) {
      console.error("Error en alta de orden de compra:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error al crear orden de compra");
    }
  },

  modificarOrdenCompra: async (
    id: number,
    ordenCompraDTO: OrdenCompraDTO
  ): Promise<OrdenCompra> => {
    try {
      if (
        !ordenCompraDTO.id_proveedor ||
        !ordenCompraDTO.articulosOrdenCompra?.length
      ) {
        console.error("Validación fallida: Proveedor o artículos faltantes");
        throw new Error(
          "El DTO de orden de compra debe incluir un proveedor y al menos un artículo"
        );
      }

      const ordenActual = await ordenCompraService.getById(id);
      if (ordenActual.estadoOrdenCompra !== EstadoOrdenCompra.Pendiente) {
        console.error( "La orden no está en estado Pendiente:", ordenActual.estadoOrdenCompra);
        throw new Error("Solo se pueden modificar órdenes en estado Pendiente");
      }

      const response = await api.put<OrdenCompra>(
        `/ordenescompra/modificar/${id}`,
        ordenCompraDTO
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error en modificación de orden de compra ${id}:`, error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Error al actualizar orden de compra ${id}`);
    }
  },

  cancelarOrdenCompra: async (id: number): Promise<void> => {
    try {
      const ordenActual = await ordenCompraService.getById(id);
      if (ordenActual.estadoOrdenCompra !== EstadoOrdenCompra.Pendiente) {
        console.error(
          "La orden no está en estado Pendiente:",
          ordenActual.estadoOrdenCompra
        );
        throw new Error("Solo se pueden cancelar órdenes en estado Pendiente");
      }

      await api.put(`/ordenescompra/cancelar/${id}`);
    } catch (error: any) {
      console.error(`Error en cancelación de orden de compra ${id}:`, error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Error al cancelar orden de compra ${id}`);
    }
  },

  confirmarOrdenCompra: async (id: number): Promise<void> => {
    try {
      const ordenActual = await ordenCompraService.getById(id);
      if (ordenActual.estadoOrdenCompra !== EstadoOrdenCompra.Pendiente) {
        console.error(
          "❌ La orden no está en estado Pendiente:",
          ordenActual.estadoOrdenCompra
        );
        throw new Error("Solo se pueden confirmar órdenes en estado Pendiente");
      }

      await api.put(`/ordenescompra/confirmar/${id}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Error al confirmar orden de compra ${id}`);
    }
  },

  finalizarOrdenCompra: async (id: number): Promise<OrdenCompra> => {
    try {
      const ordenActual = await ordenCompraService.getById(id);
      if (ordenActual.estadoOrdenCompra !== EstadoOrdenCompra.Enviada) {
        console.error(
          "❌ La orden no está en estado Enviada:",
          ordenActual.estadoOrdenCompra
        );
        throw new Error("Solo se pueden finalizar órdenes en estado Enviada");
      }

      const response = await api.put<OrdenCompra>(
        `/ordenescompra/finalizar/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error en finalización de orden de compra ${id}:`, error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Error al finalizar orden de compra ${id}`);
    }
  },

  getActiveOrdersForArticulo: async (
    articuloId: number
  ): Promise<OrdenCompra[]> => {
    try {
      const response = await api.get<OrdenCompra[]>(
        `/ordenescompra/activasPorArticulo/${articuloId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error al obtener órdenes activas para artículo ${articuloId}:`,
        error
      );
      throw new Error(
        `Error al obtener órdenes activas para artículo ${articuloId}`
      );
    }
  },
};
