import React from 'react';
import PageHeader from '../components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency, formatNumber } from '../utils/format';

const Home: React.FC = () => {
  // Datos de ejemplo - en una aplicación real, estos vendrían de una API
  const stats = {
    totalArticulos: 150,
    stockBajo: 12,
    pedidosPendientes: 5,
    valorInventario: 250000,
  };

  return (
    <div className="p-4">
      <PageHeader
        title="Dashboard"
        description="Vista general del sistema de inventario"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Artículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalArticulos)}</div>
            <p className="text-xs text-muted-foreground">
              Artículos en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatNumber(stats.stockBajo)}
            </div>
            <p className="text-xs text-muted-foreground">
              Artículos con stock bajo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatNumber(stats.pedidosPendientes)}
            </div>
            <p className="text-xs text-muted-foreground">
              Pedidos por procesar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor del Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.valorInventario)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total del inventario
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;