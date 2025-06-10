export const APP_CONFIG = {
  NAME: 'Sistema de Inventario',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de gestión de inventario y pedidos',
};

export const STATUS = {
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  COMPLETADO: 'COMPLETADO',
  CANCELADO: 'CANCELADO',
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO',
} as const;

export const ROUTES = {
  HOME: '/',
  ARTICULOS: '/articulos',
  PROVEEDORES: '/proveedores',
  PEDIDOS: '/pedidos',
  INVENTARIO: '/inventario',
  REPORTES: '/reportes',
  CONFIGURACION: '/configuracion',
} as const;

export const VALIDATION = {
  MIN_LENGTH: {
    NOMBRE: 3,
    DESCRIPCION: 10,
    PASSWORD: 8,
  },
  MAX_LENGTH: {
    NOMBRE: 50,
    DESCRIPCION: 500,
    PASSWORD: 32,
  },
  PATTERNS: {
    EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    PHONE: /^\+?[0-9]{9,15}$/,
  },
} as const;

export const MESSAGES = {
  ERROR: {
    REQUIRED_FIELD: 'Este campo es obligatorio',
    INVALID_EMAIL: 'El correo electrónico no es válido',
    INVALID_PHONE: 'El número de teléfono no es válido',
    MIN_LENGTH: (field: string, length: number) =>
      `${field} debe tener al menos ${length} caracteres`,
    MAX_LENGTH: (field: string, length: number) =>
      `${field} no puede tener más de ${length} caracteres`,
    LOADING_ERROR: 'Error al cargar los datos',
    SAVE_ERROR: 'Error al guardar los datos',
    DELETE_ERROR: 'Error al eliminar los datos',
    NETWORK_ERROR: 'Error de conexión',
  },
  SUCCESS: {
    SAVE: 'Datos guardados correctamente',
    DELETE: 'Datos eliminados correctamente',
    UPDATE: 'Datos actualizados correctamente',
  },
  CONFIRM: {
    DELETE: '¿Está seguro de que desea eliminar este elemento?',
    CANCEL: '¿Está seguro de que desea cancelar?',
  },
} as const; 