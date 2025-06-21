export interface Base {
  id: number;
  estado: boolean;
  fechaAlta: Date;
  fechaModificacion: Date;
  fechaBaja?: Date;
}

//ENTIDADES
export interface Articulo extends Base {
  nombreArticulo: string;
  descripcionArticulo: string;
  precioVentaArt: number;
  costoAlmacenamientoUnidad: number;
  stockActual: number;
  demandaArticulo: number;
  inventarioMaximo: number;
  proveedorPredeterminado?: Proveedor;
}

export interface ArticuloProveedor extends Base {
  costoCompra: number;
  costoPorPedido: number;
  costoPedido: number;
  demoraEntrega: number;
  desviacionEstandar: number;
  cantidadPedido: number;
  precioUnitario: number;
  puntoPedido: number;
  stockSeguridad: number;
  intervaloRevision: number;
  costoAlmacenamiento: number;
  loteOptimo: number;
  valorCGI: number;
  modeloInventario: ModeloInventario;
  proveedor: Proveedor;
  articulo: Articulo;
}

export interface ArticuloVenta extends Base {
  cantArticuloVenta: number;
  precioSubTotal: number;
  precioUnitario: number;
  articulo: Articulo;
  venta: Venta;
}

export enum EstadoOrdenCompra {
  Pendiente = "Pendiente",
  Enviada = "Enviada",
  Cancelada = "Cancelada",
  Finalizada = "Finalizada"
}

export enum ModeloInventario {
  loteFijo,
  intervaloFijo
}

export interface OrdenCompra extends Base {
  totalOrdenCompra: number;
  cantidadOrdenCompra: number;
  fechaPendiente: Date;
  fechaConfirmada: Date;
  fechaRecibida: Date;
  fechaCancelada: Date;
  estadoOrdenCompra: EstadoOrdenCompra;
  proveedor: Proveedor;
  ordenCompraArticulo: OrdenCompraArticulo[];
}

export interface OrdenCompraArticulo extends Base {
  cantOCA: number;
  precioSubTotalOCA: number;
  precioUnitarioOCA: number;
  ordenCompra: OrdenCompra;
  articulo: Articulo;
}

export interface Proveedor extends Base {
  nombreProveedor: string;
  cuit: string;
  ordenesCompra?: OrdenCompra[];
}

export interface Venta extends Base {
  fechaVenta: Date;
  costoTotal: number;
  articulosVenta: ArticuloVenta[];
}

//DTOs

export interface ArticuloAReponerDTO {
  id: number;
  nombreArticulo: string;
  stockActual: number;
  puntoPedido: number;
  inventarioMaximo: number;
  nombreProveedor: string;
}

export interface ArticuloDTO {
  nombreArticulo: string;
  descripcionArticulo: string;
  precioVentaArt: number;
  costoAlmacenamiento: number;
  stockActual: number;
  demandaArticulo: number;
  inventarioMaximo: number;
  idArticulo: number;
  idProveedorPredeterminado?: number;
}

export interface ArticuloFaltanteDTO {
  id: number;
  nombreArticulo: string;
  stockActual: number;
  stockSeguridad: number;
  nombreProveedor: string;
}

export interface ArticuloProveedorDTO {
  id_articulo: number;
  id_proveedor: number;
  idArticuloProveedor: number;
  costoCompra: number;
  costoPedido: number;
  demoraEntrega: number;
  precioUnitario: number;
  modeloInventario: string | ModeloInventario;
  desviacionEstandar: number;
  intervaloRevision: number;
  stockSeguridad: number;
  loteOptimo: number;
  puntoPedido: number;
  costoPorPedido: number;
  valorCGI: number;
  costoAlmacenamiento: number;
}

export interface ListadoArtProvDTO {
  nombreArticulo: string;
  descripcionArticulo: string;
  esProveedorPredeterminado: boolean;
}

export interface ListadoDTO {
  idArticulo: number;
  nombreArticulo: string;
  esProveedorPredeterminado: boolean;
}

export interface OrdenCompraDTO {
  id_proveedor: number;
  estado: string;
  idOrdenCompra?: number;
  totalOrdenCompra?: number;
  cantidadOrdenCompra?: number;
  fechaPendiente?: Date;
  fechaConfirmada?: Date;
  fechaRecibida?: Date;
  fechaCancelada?: Date;
  articulosOrdenCompra: ArticuloOrdenCompraDetalle[];
}

export interface ArticuloOrdenCompraDetalle {
  id_articulo: number;
  cantidad: number;
  precioSubTotalOCA?: number;
  precioUnitarioOCA?: number;
}

export interface ProveedorbasicoDTO{
  id: number;
  nombreProveedor: string;
  cuit: string;
}

export interface ProveedorDTO {
  id: number;
  nombreProveedor: string;
  cuit: string;
  articulosAsociados: ArticuloProveedorDTO[];
}

export interface ProveedorPredeterminadoDTO {
  idProveedor: number;
}

export interface ReporteInventarioDTO {
  idArticulo: number;
  nombreArticulo: string;
  stockActual: number;
  puntoPedido: number;
  stockSeguridad: number;
  modeloInventario: ModeloInventario;
  proveedorPredeterminado: string;
}

export interface VentaDTO {
  articulosVenta: {
    idArticulo: number;
    cantidad: number;
  }[];
}