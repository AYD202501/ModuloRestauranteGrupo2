// app/dashboard/productos/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Package, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  createdAt: string;
  createdBy: {
    name: string | null;
    email: string;
  };
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "ALMUERZO",
    imageUrl: ""
  });

  const [editProduct, setEditProduct] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "ALMUERZO",
    imageUrl: ""
  });

  const userRole = "ADMIN"; // Mock - después integrar con session
  const userId = "cm5gobb0003uniz0u55..."; // Mock - después integrar con session

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error: unknown) {
      console.error('Error:', error);
      const message = (error instanceof Error) ? error.message : 'Error al cargar productos';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0 || newProduct.stock < 0) {
      setError('Por favor completa todos los campos correctamente');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          createdById: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear producto');
      }

      const createdProduct = await response.json();
      
      // Actualizar la lista de productos
      setProducts(prev => [createdProduct, ...prev]);
      
      // Limpiar formulario y cerrar dialog
      setNewProduct({ 
        name: "", 
        description: "", 
        price: 0, 
        stock: 0, 
        category: "ALMUERZO",
        imageUrl: ""
      });
      setShowAddDialog(false);
      setSuccess('Producto creado exitosamente');
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error: unknown) {
      console.error('Error:', error);
      const message = (error instanceof Error) ? error.message : 'Error al crear producto';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditProduct({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl || ""
    });
    setShowEditDialog(true);
    setError('');
  };

  const handleUpdateProduct = async () => {
    if (!editProduct.name || editProduct.price <= 0 || editProduct.stock < 0) {
      setError('Por favor completa todos los campos correctamente');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${editProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editProduct.name,
          description: editProduct.description,
          price: editProduct.price,
          stock: editProduct.stock,
          category: editProduct.category,
          imageUrl: editProduct.imageUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar producto');
      }

      const updatedProduct = await response.json();
      
      // Actualizar la lista de productos
      setProducts(prev => prev.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
      
      setShowEditDialog(false);
      setSelectedProduct(null);
      setSuccess('Producto actualizado exitosamente');
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error: unknown) {
      console.error('Error:', error);
      const message = (error instanceof Error) ? error.message : 'Error al actualizar producto';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar producto');
      }

      // Remover de la lista
      setProducts(prev => prev.filter(p => p.id !== product.id));
      setSuccess(`Producto "${product.name}" eliminado exitosamente`);
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error: unknown) {
      console.error('Error:', error);
      const message = (error instanceof Error) ? error.message : 'Error al eliminar producto';
      setError(message);
    }
  };

  const resetAddForm = () => {
    setNewProduct({ 
      name: "", 
      description: "", 
      price: 0, 
      stock: 0, 
      category: "ALMUERZO",
      imageUrl: ""
    });
    setError('');
    setShowAddDialog(false);
  };

  const resetEditForm = () => {
    setEditProduct({
      id: "",
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "ALMUERZO",
      imageUrl: ""
    });
    setSelectedProduct(null);
    setError('');
    setShowEditDialog(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-2">Cargando productos...</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600">Administra el inventario de productos del restaurante</p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={fetchProducts}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          {userRole === "ADMIN" && (
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-[#6e1e1e] hover:bg-[#5a1818]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          )}
        </div>
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

      {/* Tabla de productos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Productos Registrados ({products.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay productos registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold">Nombre</th>
                    <th className="text-left p-4 font-semibold">Descripción</th>
                    <th className="text-left p-4 font-semibold">Precio</th>
                    <th className="text-left p-4 font-semibold">Stock</th>
                    <th className="text-left p-4 font-semibold">Categoría</th>
                    <th className="text-left p-4 font-semibold">Creado por</th>
                    {userRole === "ADMIN" && (
                      <th className="text-left p-4 font-semibold">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                        {product.description || 'Sin descripción'}
                      </td>
                      <td className="p-4 text-green-600 font-semibold">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.stock > 50 ? 'bg-green-100 text-green-800' :
                          product.stock > 20 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} unidades
                        </span>
                      </td>
                      <td className="p-4 text-sm">{product.category}</td>
                      <td className="p-4 text-sm text-gray-600">
                        {product.createdBy.name || product.createdBy.email}
                      </td>
                      {userRole === "ADMIN" && (
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              title="Editar producto"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => handleDeleteProduct(product)}
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para agregar producto */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Agregar Nuevo Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Ej: Pollo a la plancha"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Descripción del producto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Inicial *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option value="DESAYUNO">Desayuno</option>
                  <option value="ALMUERZO">Almuerzo</option>
                  <option value="CENA">Cena</option>
                  <option value="BEBIDA">Bebida</option>
                  <option value="POSTRE">Postre</option>
                </select>
              </div>

              <div>
                <Label htmlFor="imageUrl">URL de Imagen (opcional)</Label>
                <Input
                  id="imageUrl"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={resetAddForm}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddProduct}
                  disabled={isSubmitting}
                  className="bg-[#6e1e1e] hover:bg-[#5a1818]"
                >
                  {isSubmitting ? "Creando..." : "Crear Producto"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialog para editar producto */}
      {showEditDialog && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar Producto</CardTitle>
              <p className="text-sm text-gray-600">
                Modificando: <strong>{selectedProduct.name}</strong>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="edit-name">Nombre del Producto *</Label>
                <Input
                  id="edit-name"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                  placeholder="Ej: Pollo a la plancha"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Descripción</Label>
                <Input
                  id="edit-description"
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                  placeholder="Descripción del producto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Precio ($) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({...editProduct, price: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">Stock *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    min="0"
                    value={editProduct.stock}
                    onChange={(e) => setEditProduct({...editProduct, stock: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-category">Categoría</Label>
                <select
                  id="edit-category"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                >
                  <option value="DESAYUNO">Desayuno</option>
                  <option value="ALMUERZO">Almuerzo</option>
                  <option value="CENA">Cena</option>
                  <option value="BEBIDA">Bebida</option>
                  <option value="POSTRE">Postre</option>
                </select>
              </div>

              <div>
                <Label htmlFor="edit-imageUrl">URL de Imagen (opcional)</Label>
                <Input
                  id="edit-imageUrl"
                  value={editProduct.imageUrl}
                  onChange={(e) => setEditProduct({...editProduct, imageUrl: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={resetEditForm}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpdateProduct}
                  disabled={isSubmitting}
                  className="bg-[#6e1e1e] hover:bg-[#5a1818]"
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar Producto"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}