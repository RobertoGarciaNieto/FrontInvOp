import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';

interface Proveedor {
  id: number;
  nombreProveedor: string;
  estado: boolean;
}

interface ArticuloFormData {
  nombreArticulo: string;
  descripcionArticulo: string;
  precioVentaArt: number;
  costoAlmacenamientoUnidad: number;
  stockActual: number;
  demandaArticulo: number;
  proveedorId: number;
}

interface ArticuloFormProps {
  onSubmit: (data: ArticuloFormData) => void;
  initialData?: ArticuloFormData;
  isSubmitting?: boolean;
}

const ArticuloForm: React.FC<ArticuloFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [formData, setFormData] = useState<ArticuloFormData>({
    nombreArticulo: '',
    descripcionArticulo: '',
    precioVentaArt: 0,
    costoAlmacenamientoUnidad: 0,
    stockActual: 0,
    demandaArticulo: 0,
    proveedorId: 0,
    ...initialData,
  });

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:8080/proveedores/activos');
        setProveedores(response.data);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
      }
    };

    fetchProveedores();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('precio') || name.includes('costo') || name.includes('stock') || name.includes('demanda')
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      proveedorId: parseInt(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombreArticulo">Nombre del Artículo</Label>
        <Input
          id="nombreArticulo"
          name="nombreArticulo"
          value={formData.nombreArticulo}
          onChange={handleChange}
          required
          placeholder="Ingrese el nombre del artículo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcionArticulo">Descripción</Label>
        <Input
          id="descripcionArticulo"
          name="descripcionArticulo"
          value={formData.descripcionArticulo}
          onChange={handleChange}
          required
          placeholder="Ingrese la descripción del artículo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="precioVentaArt">Precio de Venta</Label>
        <Input
          id="precioVentaArt"
          name="precioVentaArt"
          type="number"
          min="0"
          step="0.01"
          value={formData.precioVentaArt}
          onChange={handleChange}
          required
          placeholder="Ingrese el precio de venta"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="costoAlmacenamientoUnidad">Costo de Almacenamiento</Label>
        <Input
          id="costoAlmacenamientoUnidad"
          name="costoAlmacenamientoUnidad"
          type="number"
          min="0"
          step="0.01"
          value={formData.costoAlmacenamientoUnidad}
          onChange={handleChange}
          required
          placeholder="Ingrese el costo de almacenamiento"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stockActual">Stock Actual</Label>
        <Input
          id="stockActual"
          name="stockActual"
          type="number"
          min="0"
          value={formData.stockActual}
          onChange={handleChange}
          required
          placeholder="Ingrese el stock actual"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="demandaArticulo">Demanda</Label>
        <Input
          id="demandaArticulo"
          name="demandaArticulo"
          type="number"
          min="0"
          value={formData.demandaArticulo}
          onChange={handleChange}
          required
          placeholder="Ingrese la demanda"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proveedorId">Proveedor</Label>
        <Select
          value={formData.proveedorId.toString()}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un proveedor" />
          </SelectTrigger>
          <SelectContent>
            {proveedores.map((proveedor) => (
              <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                {proveedor.nombreProveedor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Artículo' : 'Crear Artículo'}
      </Button>
    </form>
  );
};

export default ArticuloForm; 