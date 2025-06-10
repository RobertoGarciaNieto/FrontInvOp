import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ProveedorFormData {
  nombreProveedor: string;
  direccionProveedor: string;
  telefonoProveedor: string;
  emailProveedor: string;
  estado: boolean;
}

interface ProveedorFormProps {
  onSubmit: (data: ProveedorFormData) => void;
  initialData?: ProveedorFormData;
  isSubmitting?: boolean;
}

const ProveedorForm: React.FC<ProveedorFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<ProveedorFormData>({
    nombreProveedor: '',
    direccionProveedor: '',
    telefonoProveedor: '',
    emailProveedor: '',
    estado: true,
    ...initialData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombreProveedor">Nombre del Proveedor</Label>
        <Input
          id="nombreProveedor"
          name="nombreProveedor"
          value={formData.nombreProveedor}
          onChange={handleChange}
          required
          placeholder="Ingrese el nombre del proveedor"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccionProveedor">Dirección</Label>
        <Input
          id="direccionProveedor"
          name="direccionProveedor"
          value={formData.direccionProveedor}
          onChange={handleChange}
          required
          placeholder="Ingrese la dirección"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefonoProveedor">Teléfono</Label>
        <Input
          id="telefonoProveedor"
          name="telefonoProveedor"
          value={formData.telefonoProveedor}
          onChange={handleChange}
          required
          placeholder="Ingrese el teléfono"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emailProveedor">Correo Electrónico</Label>
        <Input
          id="emailProveedor"
          name="emailProveedor"
          type="email"
          value={formData.emailProveedor}
          onChange={handleChange}
          required
          placeholder="Ingrese el correo electrónico"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Proveedor' : 'Crear Proveedor'}
      </Button>
    </form>
  );
};

export default ProveedorForm; 