// app/dashboard/page.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  totalProducts: number;
  totalUsers: number;
  todayMovements: number;
  todaySales: number;
}

interface LowStockProduct {
  name: string;
  stock: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalUsers: 0,
    todayMovements: 0,
    todaySales: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar estadísticas reales desde las APIs
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Obtener productos
      const productsResponse = await fetch('/api/products');
      const products = productsResponse.ok ? await productsResponse.json() : [];
      
      // Obtener usuarios
      const usersResponse = await fetch('/api/users');
      const users = usersResponse.ok ? await usersResponse.json() : [];
      
      // Obtener movimientos
      const movementsResponse = await fetch('/api/movements');
      const movements = movementsResponse.ok ? await movementsResponse.json() : [];
      
      // Calcular estadísticas
      const today = new Date().toDateString();
      const todayMovements = movements.filter((m: any) => 
        new Date(m.date).toDateString() === today
      );
      
      // Productos con bajo stock (menos de 50 unidades)
      const lowStock = products
        .filter((p: any) => p.stock < 50)
        .sort((a: any, b: any) => a.stock - b.stock)
        .slice(0, 5)
        .map((p: any) => ({ name: p.name, stock: p.stock }));
      
      // Simular ventas (en una app real vendría de otra API)
      const estimatedSales = todayMovements
        .filter((m: any) => m.type === 'SALIDA')
        .reduce((total: number, m: any) => total + (m.quantity * 15), 0); // $15 promedio por item
      
      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        todayMovements: todayMovements.length,
        todaySales: estimatedSales
      });
      
      setLowStockProducts(lowStock);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: "Total Productos",
      value: isLoading ? "..." : stats.totalProducts.toString(),
      icon: Package,
      description: "Productos activos en el menú",
      color: "text-blue-600"
    },
    {
      title: "Usuarios Registrados", 
      value: isLoading ? "..." : stats.totalUsers.toString(),
      icon: Users,
      description: "Usuarios en el sistema",
      color: "text-green-600"
    },
    {
      title: "Movimientos Hoy",
      value: isLoading ? "..." : stats.todayMovements.toString(),
      icon: BarChart3,
      description: "Transacciones registradas",
      color: "text-purple-600"
    },
    {
      title: "Ventas del Día",
      value: isLoading ? "..." : `${stats.todaySales.toFixed(2)}`,
      icon: TrendingUp,
      description: "Ingresos estimados",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/dashboard/productos" 
                className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">Gestionar Productos</span>
                </div>
                <span className="text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link 
                href="/dashboard/transacciones" 
                className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Ver Transacciones</span>
                </div>
                <span className="text-green-500 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link 
                href="/dashboard/usuarios" 
                className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-700 font-medium">Administrar Usuarios</span>
                </div>
                <span className="text-purple-500 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Productos con Bajo Stock
              <span className="text-sm font-normal text-gray-500">
                (&lt; 50 unidades)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((product, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      product.stock < 20 
                        ? 'bg-red-100 text-red-800' 
                        : product.stock < 35 
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.stock} unidades
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Todos los productos tienen stock suficiente</p>
              </div>
            )}
            
            {lowStockProducts.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Link 
                  href="/dashboard/productos"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver todos los productos →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}