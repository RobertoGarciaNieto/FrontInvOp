export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-ES').format(value);
}

export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    EN_PROCESO: 'En Proceso',
    COMPLETADO: 'Completado',
    CANCELADO: 'Cancelado',
    ACTIVO: 'Activo',
    INACTIVO: 'Inactivo',
  };
  return statusMap[status] || status;
};

export const formatStatusClass = (status: string): string => {
  const statusClassMap: Record<string, string> = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    EN_PROCESO: 'bg-blue-100 text-blue-800',
    COMPLETADO: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800',
    ACTIVO: 'bg-green-100 text-green-800',
    INACTIVO: 'bg-red-100 text-red-800',
  };
  return statusClassMap[status] || 'bg-gray-100 text-gray-800';
}; 