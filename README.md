# Sistema de Gestión de Inventario - Frontend

Este proyecto es el frontend de un sistema de gestión de inventario desarrollado con React, TypeScript y Tailwind CSS.

## 🚀 Características

- Gestión de artículos
- Gestión de proveedores
- Gestión de pedidos de compra
- Gestión de inventario
- Reportes
- Configuración del sistema

## 🛠️ Tecnologías Utilizadas

- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Router DOM
- Lucide Icons
- Shadcn/ui

## 📁 Estructura del Proyecto

```
src/
├── api/              # Servicios y configuración de API
├── components/       # Componentes reutilizables
├── constants/        # Constantes y configuraciones
├── hooks/           # Hooks personalizados
├── pages/           # Páginas de la aplicación
├── types/           # Definiciones de tipos TypeScript
└── utils/           # Utilidades y funciones auxiliares
```

## 🎯 Componentes Principales

### Componentes de UI
- `button`: Botón personalizado con variantes
- `Card`: Tarjeta contenedora
- `Modal`: Ventana modal
- `DataTable`: Tabla de datos con paginación y ordenamiento
- `Form`: Formulario con validación
- `Alert`: Mensajes de alerta
- `Badge`: Etiquetas de estado
- `Tooltip`: Información al pasar el mouse
- `Dropdown`: Menú desplegable

### Componentes de Formulario
- `Input`: Campo de texto
- `Textarea`: Área de texto
- `Select`: Selector desplegable
- `Checkbox`: Casilla de verificación
- `Radio`: Botón de opción
- `Switch`: Interruptor
- `DatePicker`: Selector de fecha
- `TimePicker`: Selector de hora

## 🔄 Hooks Personalizados

- `useCrud`: Hook para operaciones CRUD
- `useForm`: Hook para manejo de formularios

## 📊 Páginas

- `Home`: Dashboard principal
- `ArticulosPage`: Gestión de artículos
- `ProveedoresPage`: Gestión de proveedores
- `PedidosPage`: Gestión de pedidos
- `InventarioPage`: Gestión de inventario
- `ReportesPage`: Reportes del sistema
- `ConfiguracionPage`: Configuración

## 🚀 Instalación

1. Clonar el repositorio
```bash
git clone [url-del-repositorio]
```

2. Instalar dependencias
```bash
npm install
```

3. Iniciar el servidor de desarrollo
```bash
npm run dev
```

## 🔧 Configuración

El proyecto utiliza las siguientes variables de entorno:

- `VITE_API_URL`: URL base de la API (por defecto: http://localhost:8080)

## 📝 Notas

- El proyecto está configurado para trabajar con el backend Spring Boot
- Utiliza Tailwind CSS para los estilos
- Implementa un diseño responsive
- Incluye validación de formularios
- Manejo de errores y estados de carga
- Soporte para temas claro/oscuro

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request
