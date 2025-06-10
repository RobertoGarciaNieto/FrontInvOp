import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import axios from 'axios';

interface Configuracion {
  id: number;
  nombreEmpresa: string;
  direccionEmpresa: string;
  telefonoEmpresa: string;
  emailEmpresa: string;
  moneda: string;
  zonaHoraria: string;
  diasLaborables: string[];
  horaInicio: string;
  horaFin: string;
  notificacionesEmail: boolean;
  notificacionesStock: boolean;
  notificacionesPedidos: boolean;
  stockMinimoGlobal: number;
  stockMaximoGlobal: number;
}

const ConfiguracionPage: React.FC = () => {
  const [configuracion, setConfiguracion] = useState<Configuracion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const fetchConfiguracion = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<Configuracion>('http://localhost:8080/configuracion');
      setConfiguracion(response.data);
    } catch (err) {
      setError('Error al cargar la configuración');
      console.error('Error fetching configuracion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfiguracion();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!configuracion) return;

    try {
      setIsSubmitting(true);
      setError(null);
      setMensajeExito(null);

      await axios.put('http://localhost:8080/configuracion', configuracion);
      setMensajeExito('Configuración guardada exitosamente');
    } catch (err) {
      setError('Error al guardar la configuración');
      console.error('Error saving configuracion:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setConfiguracion(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
    });
  };

  const handleDiasLaborablesChange = (dia: string) => {
    setConfiguracion(prev => {
      if (!prev) return null;
      const dias = prev.diasLaborables.includes(dia)
        ? prev.diasLaborables.filter(d => d !== dia)
        : [...prev.diasLaborables, dia];
      return {
        ...prev,
        diasLaborables: dias
      };
    });
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar la configuración
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={fetchConfiguracion}
                >
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !configuracion) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PageHeader
        title="Configuración"
        description="Configura los parámetros del sistema"
      />

      {mensajeExito && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {mensajeExito}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Empresa</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-gray-700">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                name="nombreEmpresa"
                id="nombreEmpresa"
                value={configuracion.nombreEmpresa}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="direccionEmpresa" className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                name="direccionEmpresa"
                id="direccionEmpresa"
                value={configuracion.direccionEmpresa}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="telefonoEmpresa" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefonoEmpresa"
                id="telefonoEmpresa"
                value={configuracion.telefonoEmpresa}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="emailEmpresa" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="emailEmpresa"
                id="emailEmpresa"
                value={configuracion.emailEmpresa}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="moneda" className="block text-sm font-medium text-gray-700">
                Moneda
              </label>
              <select
                name="moneda"
                id="moneda"
                value={configuracion.moneda}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="ARS">Peso Argentino (ARS)</option>
                <option value="USD">Dólar Estadounidense (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div>
              <label htmlFor="zonaHoraria" className="block text-sm font-medium text-gray-700">
                Zona Horaria
              </label>
              <select
                name="zonaHoraria"
                id="zonaHoraria"
                value={configuracion.zonaHoraria}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                <option value="America/Argentina/Cordoba">Córdoba (GMT-3)</option>
                <option value="America/Argentina/Mendoza">Mendoza (GMT-3)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días Laborables
              </label>
              <div className="flex flex-wrap gap-2">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => (
                  <label key={dia} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={configuracion.diasLaborables.includes(dia)}
                      onChange={() => handleDiasLaborablesChange(dia)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{dia}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  id="horaInicio"
                  value={configuracion.horaInicio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="horaFin" className="block text-sm font-medium text-gray-700">
                  Hora de Fin
                </label>
                <input
                  type="time"
                  name="horaFin"
                  id="horaFin"
                  value={configuracion.horaFin}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notificaciones</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="notificacionesEmail"
                checked={configuracion.notificacionesEmail}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Activar notificaciones por email
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="notificacionesStock"
                checked={configuracion.notificacionesStock}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Notificar cuando el stock esté bajo el mínimo
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="notificacionesPedidos"
                checked={configuracion.notificacionesPedidos}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Notificar cambios en el estado de pedidos
              </span>
            </label>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stockMinimoGlobal" className="block text-sm font-medium text-gray-700">
                Stock Mínimo Global
              </label>
              <input
                type="number"
                name="stockMinimoGlobal"
                id="stockMinimoGlobal"
                value={configuracion.stockMinimoGlobal}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="stockMaximoGlobal" className="block text-sm font-medium text-gray-700">
                Stock Máximo Global
              </label>
              <input
                type="number"
                name="stockMaximoGlobal"
                id="stockMaximoGlobal"
                value={configuracion.stockMaximoGlobal}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            Guardar Configuración
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracionPage; 