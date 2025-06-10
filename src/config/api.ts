export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    ARTICULOS: {
      BASE: '/articulos',
      BY_ID: (id: number) => `/articulos/${id}`,
      INVENTARIO: '/articulos/inventario',
      AJUSTE_STOCK: '/articulos/ajuste-stock',
    },
    PROVEEDORES: {
      BASE: '/proveedores',
      BY_ID: (id: number) => `/proveedores/${id}`,
      ACTIVOS: '/proveedores/activos',
    },
    PEDIDOS: {
      BASE: '/pedidos',
      BY_ID: (id: number) => `/pedidos/${id}`,
      CAMBIAR_ESTADO: (id: number) => `/pedidos/${id}/estado`,
    },
    INVENTARIO: {
      BASE: '/inventario',
      BY_ID: (id: number) => `/inventario/${id}`,
      AJUSTES: '/inventario/ajustes',
    },
    REPORTES: {
      ESTADISTICAS: '/reportes/estadisticas',
      STOCK: '/reportes/stock',
      PEDIDOS: '/reportes/pedidos',
    },
    CONFIGURACION: {
      BASE: '/configuracion',
      ACTUALIZAR: '/configuracion/actualizar',
    },
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
}; 