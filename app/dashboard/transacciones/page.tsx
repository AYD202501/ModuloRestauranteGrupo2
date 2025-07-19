// app/dashboard/transacciones/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Plus, TrendingUp, TrendingDown, Package, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
}

interface Movement {
  id: string;
  type: "ENTRADA" | "SALIDA";
  quantity: number;
  date: string;
  product: {
    name: string;
  };
  executedBy: {
    name: string | null;
    email: string;
  };
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export default function TransaccionesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newMovement, setNewMovement] = useState({
    type: "ENTRADA" as "ENTRADA" | "SALIDA",
    quantity: 0,
    executedById: ""
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Error al cargar usuarios');
      const data: User[] = await response.json();
      setUsers(data);
      // Seleccionar el primer usuario por defecto
      if (data.length > 0 && !selectedUser) {
        setSelectedUser(data[0].id);
        setNewMovement(prev => ({ ...prev, executedById: data[0].id }));
      }
    } catch (error: unknown) {
      console.error('Error:', error);
      const message = (error instanceof Error) ? error.message : 'Error al cargar usuarios';
      setError(message);
    }
  }, [selectedUser]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setProducts(data.map((p: Product) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        price: p.price
      })));
    } catch (error: unknown) {
      console.error('Error:', error);
      const message = (error instanceof Error) ? error.message : 'Error al cargar productos';
      setError(message);
    }
  }, []);

  const fetchMovements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const url = selectedProduct 
        ? `/api/movements?productId=${selectedProduct}`
        : '/api/movements';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar movimientos');
      const data: Movement[] = await response.json();
      setMovements(data);
    } catch (error: unknown) {
      console.error('Error:', error);
      const message = (error instanceof Error) ? error.message : 'Error al cargar movimientos';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchMovements();
  }, [fetchProducts, fetchUsers, fetchMovements]);

  // Cargar movimientos cuando cambia el producto seleccionado
  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const handleAddMovement = async () => {
    if (!selectedProduct || newMovement.quantity <= 0 || !newMovement.executedById) {
      setError('Por favor completa todos los campos correctamente');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('Enviando datos:', {
        productId: selectedProduct,
        type: newMovement.type,
        quantity: newMovement.quantity,
        executedById: newMovement.executedById
      });

      const response = await fetch('/api/movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct,
          type: newMovement.type,
          quantity: newMovement.quantity,
          executedById: newMovement.executedById
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al crear movimiento');
      }

      const createdMovement = await response.json();
      console.log('Movimiento creado:', createdMovement);
      
      // Actualizar listas
      setMovements(prev => [createdMovement, ...prev]);
      await fetchProducts(); // Actualizar stock
      
      // Limpiar formulario y cerrar dialog
      setNewMovement({ 
        type: "ENTRADA", 
        quantity: 0, 
        executedById: selectedUser || users[0]?.id || ""
      });
      setShowMovementDialog(false);
      setSuccess(`Movimiento de ${newMovement.type} registrado exitosamente`);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error: unknown) {
      console.error('💥 Error completo:', error);
      const message = (error instanceof Error) ? error.message : 'Error al crear movimiento';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDialog = () => {
    setNewMovement({ 
      type: "ENTRADA", 
      quantity: 0, 
      executedById: selectedUser || users[0]?.id || ""
    });
    setError('');
    setShowMovementDialog(false);
  };

  const selectedProductData = products.find(p => p.id === selectedProduct);

  // Generar datos de gráfica basados en movimientos reales
  const generateChartData = () => {
    if (!selectedProductData) return [];
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        stock: selectedProductData.stock // Simplificado para la demo
      };
    });
    
    return last7Days;
  };

  const chartData = generateChartData();

  if (isLoading && movements.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-2">Cargando transacciones...</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Transacciones</h1>
          <p className="text-gray-600">Administra movimientos de inventario y stock</p>
        </div>
        
        <Button 
          onClick={fetchMovements}
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Selector de producto */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuración de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="product-select">Producto a visualizar</Label>
              <select
                id="product-select"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Todos los productos</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="user-select">Usuario activo</Label>
              <select
                id="user-select"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setNewMovement(prev => ({ ...prev, executedById: e.target.value }));
                }}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedProduct && (
              <div className="md:col-span-2">
                <Button 
                  onClick={() => setShowMovementDialog(true)}
                  className="bg-[#6e1e1e] hover:bg-[#5a1818]"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Movimiento
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de movimientos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Movimientos de Inventario
                {selectedProductData && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    - {selectedProductData.name}
                  </span>
                )}
              </div>
              <span className="text-sm font-normal text-gray-500">
                ({movements.length} registros)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {movements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {selectedProduct ? 'No hay movimientos para este producto' : 'No hay movimientos registrados'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 font-semibold text-sm">Fecha</th>
                      <th className="text-left p-3 font-semibold text-sm">Producto</th>
                      <th className="text-left p-3 font-semibold text-sm">Tipo</th>
                      <th className="text-left p-3 font-semibold text-sm">Cantidad</th>
                      <th className="text-left p-3 font-semibold text-sm">Ejecutado por</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((movement) => (
                      <tr key={movement.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-sm">
                          {new Date(movement.date).toLocaleDateString('es-ES')}
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(movement.date).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', minute: '2-digit' 
                            })}
                          </span>
                        </td>
                        <td className="p-3 text-sm font-medium">
                          {movement.product.name}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            movement.type === "ENTRADA" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {movement.type === "ENTRADA" ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {movement.type}
                          </span>
                        </td>
                        <td className="p-3 font-medium">
                          <span className={movement.type === "ENTRADA" ? "text-green-600" : "text-red-600"}>
                            {movement.type === "ENTRADA" ? "+" : "-"}{movement.quantity}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {movement.executedBy.name || movement.executedBy.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfica de evolución */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Evolución de Stock Semanal
              {selectedProductData && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  - {selectedProductData.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProductData ? (
              <>
                {/* Gráfica simple con CSS */}
                <div className="space-y-4">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="w-8 text-sm font-medium">{data.day}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div 
                          className="bg-[#6e1e1e] h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.min((data.stock / 150) * 100, 100)}%` }}
                        >
                          <span className="text-white text-xs font-medium">
                            {data.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Stock actual:</strong> {selectedProductData.stock} unidades
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Precio unitario:</strong> ${selectedProductData.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Valor total en stock:</strong> ${(selectedProductData.stock * selectedProductData.price).toFixed(2)}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Selecciona un producto para ver su evolución de stock
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog para agregar movimiento */}
      {showMovementDialog && selectedProductData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Agregar Movimiento</CardTitle>
              <p className="text-sm text-gray-600">
                Producto: <strong>{selectedProductData.name}</strong>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="movement-type">Tipo de Movimiento</Label>
                <select
                  id="movement-type"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newMovement.type}
                  onChange={(e) => setNewMovement({...newMovement, type: e.target.value as "ENTRADA" | "SALIDA"})}
                >
                  <option value="ENTRADA">ENTRADA - Agregar al inventario</option>
                  <option value="SALIDA">SALIDA - Retirar del inventario</option>
                </select>
              </div>

              <div>
                <Label htmlFor="executed-by">Ejecutado por</Label>
                <select
                  id="executed-by"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newMovement.executedById}
                  onChange={(e) => setNewMovement({...newMovement, executedById: e.target.value})}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email} ({user.role})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Selecciona quién ejecuta este movimiento
                </p>
              </div>

              <div>
                <Label htmlFor="quantity">Cantidad de Unidades</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={newMovement.type === "SALIDA" ? selectedProductData.stock : undefined}
                  value={newMovement.quantity}
                  onChange={(e) => setNewMovement({...newMovement, quantity: parseInt(e.target.value) || 0})}
                  placeholder="Ingrese la cantidad"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Stock actual: {selectedProductData.stock} unidades
                  {newMovement.type === "SALIDA" && (
                    <span className="text-orange-600 ml-2">
                      • Máximo a retirar: {selectedProductData.stock}
                    </span>
                  )}
                </p>
              </div>

              {/* Previsualización del resultado */}
              {newMovement.quantity > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">Previsualización:</p>
                  <p className="text-sm text-blue-700">
                    Stock actual: {selectedProductData.stock} unidades
                  </p>
                  <p className="text-sm text-blue-700">
                    Después del movimiento: {
                      newMovement.type === "ENTRADA" 
                        ? selectedProductData.stock + newMovement.quantity
                        : selectedProductData.stock - newMovement.quantity
                    } unidades
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={resetDialog}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddMovement}
                  disabled={
                    isSubmitting || 
                    newMovement.quantity <= 0 || 
                    (newMovement.type === "SALIDA" && newMovement.quantity > selectedProductData.stock)
                  }
                  className="bg-[#6e1e1e] hover:bg-[#5a1818]"
                >
                  {isSubmitting ? "Creando..." : "Crear Movimiento"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}