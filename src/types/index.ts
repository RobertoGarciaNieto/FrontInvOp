// src/types/index.ts

export interface BaseEntity {
  id: number;
  estado: boolean; // true = activo, false = dado de baja lógicamente
  fechaAlta: string; // LocalDateTime en Java, se mapea a string en TS (ISO 8601)
  fechaModificacion?: string; // Opcional, para cuando se modifica
  fechaBaja?: string; // Opcional, para bajas lógicas
}

export enum ModeloInventario {
  LOTE_FIJO = "LOTE_FIJO",
  INTERVALO_FIJO = "INTERVALO_FIJO",
}

// ----------------------------------------------------
// PROVEEDOR
// ----------------------------------------------------
export interface Proveedor extends BaseEntity {
  nombreProveedor: string;
  cuit: string;
  articulosAsociados: ArticuloProveedor[]; // No incluir en fetches de proveedor para evitar ciclos/cargas pesadas
}

export interface ProveedorDTO {
  // DTO para crear o modificar un Proveedor (sin ID, estado, fechas)
  nombreProveedor: string;
  cuit: string;
  articulosAsociados?: ArticuloProveedorDTO[];
}

// ----------------------------------------------------
// ARTICULO
// ----------------------------------------------------
export interface Articulo extends BaseEntity {
  nombreArticulo: string;
  descripcionArticulo: string;
  precioVentaArt: number;
  costoAlmacenamientoUnidad: number;
  stockActual: number;
  demandaArticulo: number;
  //proveedorPredeterminado: Proveedor; // Puedes cargar el objeto completo o solo su ID si es suficiente
  // Si solo necesitas el ID del proveedor predeterminado, cambia a:
  proveedorPredeterminadoId?: number; // Para facilitar DTOs y evitar objetos anidados innecesarios
  proveedor?: Proveedor;
  estado: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface ArticuloDTO {
  // DTO para crear o modificar un Articulo
  nombreArticulo: string;
  descripcionArticulo: string;
  precioVentaArt: number;
  costoAlmacenamientoUnidad: number;
  stockActual: number;
  demandaArticulo: number;
  proveedorPredeterminadoId?: number; // El ID del proveedor predeterminado
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

// ----------------------------------------------------
// ARTICULO_PROVEEDOR (Relación Articulo-Proveedor)
// ----------------------------------------------------
export interface ArticuloProveedor extends BaseEntity {
  costoCompra: number;
  costoPorPedido: number;
  costoPedido: number; // Campo que aparece en ArticuloProveedor en el PDF
  demoraEntrega: number;
  desviacionEstandar: number;
  cantidadPedido: number; // Nuevo campo por el PDF
  precioUnitario: number; // Precio de compra del artículo a ese proveedor
  puntoPedido: number;
  stockSeguridad: number;
  CGI: number;
  intervaloRevision: number;
  costoAlmacenamiento: number; // En el PDF aparece en Articulo
  loteOptimo: number;
  valorCGI: number;
  inventarioMaximo: number;
  modeloInventario: ModeloInventario; // Enum
  proveedor: Proveedor; // Objeto Proveedor completo
  articulo: Articulo; // Objeto Articulo completo
}

export interface ArticuloProveedorDTO {
  // DTO para crear o modificar ArticuloProveedor
  id?: number; // Opcional para modificar
  costoCompra: number;
  costoPorPedido: number;
  costoPedido: number;
  demoraEntrega: number;
  desviacionEstandar: number;
  cantidadPedido: number;
  precioUnitario: number;
  puntoPedido: number;
  stockSeguridad: number;
  CGI: number;
  intervaloRevision: number;
  costoAlmacenamiento: number;
  loteOptimo: number;
  valorCGI: number;
  inventarioMaximo: number;
  modeloInventario: ModeloInventario;
  idProveedor: number; // Solo el ID del proveedor
  idArticulo: number; // Solo el ID del artículo
}

// ----------------------------------------------------
// ORDEN DE COMPRA
// ----------------------------------------------------
export enum EstadoOrdenCompra {
  PENDIENTE = "PENDIENTE",
  ENVIADA = "ENVIADA",
  FINALIZADA = "FINALIZADA",
  CANCELADA = "CANCELADA",
}

export interface OrdenCompra extends BaseEntity {
  fechaOrdenCompra: string; // LocalDateTime
  estado: EstadoOrdenCompra; // Enum
  proveedor: Proveedor; // Objeto Proveedor
  // articulosOrdenCompra: ArticuloOrdenCompra[]; // No incluir para evitar ciclos/cargas pesadas
}

export interface OrdenCompraDTO {
  // DTO para crear o modificar una Orden de Compra
  fechaOrdenCompra: string; // Se podría omitir si el backend la genera
  idProveedor: number; // Solo el ID del proveedor
  // Si la creación de OC incluye ítems, añadir:
  // articulosOrdenCompra?: ArticuloOrdenCompraDTO[];
}

export interface ArticuloOrdenCompra extends BaseEntity {
  cantArticuloOC: number;
  costoTotalArticuloOC: number;
  costoUnitarioArtOC: number;
  articulo: Articulo; // Objeto Articulo
  ordenCompra?: OrdenCompra; // Relación con la OC
}

export interface ArticuloOrdenCompraDTO {
  cantArticuloOC: number;
  costoUnitarioArtOC: number;
  idArticulo: number;
  // idOrdenCompra: number; // Si se asocia al crear
}

// ----------------------------------------------------
// VENTA
// ----------------------------------------------------
export interface Venta extends BaseEntity {
  fechaVenta: string; // LocalDateTime
  costoTotal: number;
  // articulosVenta: ArticuloVenta[]; // No incluir para evitar ciclos/cargas pesadas
}

export interface VentaDTO {
  // DTO para crear o modificar una Venta
  fechaVenta?: string; // Se podría omitir si el backend la genera
  // Si la creación de Venta incluye ítems, añadir:
  // articulosVenta?: ArticuloVentaDTO[];
}

export interface ArticuloVenta extends BaseEntity {
  cantArticuloVenta: number;
  precioSubTotal: number;
  precioUnitario: number;
  articulo: Articulo; // Objeto Articulo
  venta?: Venta; // Relación con la Venta
}

export interface ArticuloVentaDTO {
  cantArticuloVenta: number;
  precioUnitario: number;
  idArticulo: number;
  // idVenta: number; // Si se asocia al crear
}

// Tipos de Pedido
export interface Pedido {
  id: number;
  fecha: string;
  estado: string;
  total: number;
  proveedor: Proveedor;
  articulos: ArticuloPedido[];
}

export interface ArticuloPedido {
  id: number;
  cantidad: number;
  precioUnitario: number;
  articulo: Articulo;
}

export interface PedidoFormData {
  proveedorId: number;
  articulos: {
    articuloId: number;
    cantidad: number;
    precioUnitario: number;
  }[];
}

// Tipos de Inventario
export interface Inventario {
  id: number;
  articulo: Articulo;
  stockMinimo: number;
  stockMaximo: number;
  puntoReorden: number;
  ultimaActualizacion: string;
}

export interface AjusteStock {
  articuloId: number;
  cantidad: number;
  tipo: 'ENTRADA' | 'SALIDA';
  motivo: string;
}

// Tipos de Configuración
export interface Configuracion {
  nombreEmpresa: string;
  direccionEmpresa: string;
  telefonoEmpresa: string;
  emailEmpresa: string;
  moneda: string;
  zonaHoraria: string;
  diasLaborables: string[];
  horaInicio: string;
  horaFin: string;
  notificaciones: {
    stockBajo: boolean;
    pedidosPendientes: boolean;
    alertasGenerales: boolean;
  };
  configuracionStock: {
    stockMinimoDefault: number;
    stockMaximoDefault: number;
    puntoReordenDefault: number;
  };
}